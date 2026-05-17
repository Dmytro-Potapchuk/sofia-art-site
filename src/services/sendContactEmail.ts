import { CONTACT_EMAIL } from '../i18n/translations';
import type { Language } from '../i18n/translations';

export interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
  language: Language;
}

const REQUEST_TIMEOUT_MS = 25000;

const getSubject = (language: Language, name: string): string =>
  language === 'pl'
    ? `Sofia Arts — wiadomość od ${name}`
    : `Sofia Arts — message from ${name}`;

const isSuccessResponse = (response: Response, result: unknown): boolean => {
  if (!response.ok) return false;
  if (!result || typeof result !== 'object') return response.status === 200;

  const data = result as Record<string, unknown>;
  return data.success === true || data.success === 'true';
};

const sendViaWeb3Forms = async (
  payload: ContactFormPayload,
  accessKey: string
): Promise<void> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: getSubject(payload.language, payload.name),
        name: payload.name,
        email: payload.email,
        message: payload.message,
        from_name: 'Sofia Arts',
        replyto: payload.email,
      }),
      signal: controller.signal,
    });

    const result = await response.json();
    if (!isSuccessResponse(response, result)) {
      throw new Error('Web3Forms rejected the request');
    }
  } finally {
    window.clearTimeout(timeoutId);
  }
};

/** Works without CORS — posts to FormSubmit in a hidden iframe */
const sendViaFormSubmitIframe = (payload: ContactFormPayload): Promise<void> =>
  new Promise((resolve, reject) => {
    const iframeName = `formsubmit_${Date.now()}`;
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.title = 'Form submit';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText =
      'position:absolute;width:0;height:0;border:0;visibility:hidden';

    const form = document.createElement('form');
    form.action = `https://formsubmit.co/${encodeURIComponent(CONTACT_EMAIL)}`;
    form.method = 'POST';
    form.target = iframeName;
    form.style.display = 'none';

    const fields: Record<string, string> = {
      name: payload.name,
      email: payload.email,
      message: payload.message,
      _replyto: payload.email,
      _subject: getSubject(payload.language, payload.name),
      _captcha: 'false',
      _template: 'table',
    };

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    let loadCount = 0;
    let settled = false;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      iframe.removeEventListener('load', onLoad);
      form.remove();
      iframe.remove();
    };

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (ok) resolve();
      else reject(new Error('FormSubmit failed'));
    };

    const onLoad = () => {
      loadCount += 1;
      if (loadCount >= 2) {
        finish(true);
      }
    };

    const timeoutId = window.setTimeout(
      () => finish(false),
      REQUEST_TIMEOUT_MS
    );

    iframe.addEventListener('load', onLoad);
    document.body.appendChild(iframe);
    document.body.appendChild(form);
    form.submit();
  });

export const sendContactEmail = async (
  payload: ContactFormPayload
): Promise<void> => {
  if (!payload.name || !payload.email || !payload.message) {
    throw new Error('Missing required fields');
  }

  const web3FormsKey = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY?.trim();
  if (web3FormsKey) {
    await sendViaWeb3Forms(payload, web3FormsKey);
    return;
  }

  await sendViaFormSubmitIframe(payload);
};
