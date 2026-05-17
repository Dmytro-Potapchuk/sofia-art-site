import React, { FormEvent, useRef, useState } from 'react';
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
} from '../../i18n/translations';
import { useLanguage } from '../../context/LanguageContext';
import { sendContactEmail } from '../../services/sendContactEmail';
import styles from './ContactSection.module.css';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const ContactSection = () => {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<FormStatus>('idle');
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const showFeedback = () => {
    window.requestAnimationFrame(() => {
      feedbackRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = formRef.current;
    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    setStatus('sending');

    try {
      await sendContactEmail({ name, email, message, language });
      setStatus('success');
      form.reset();
      showFeedback();
    } catch {
      setStatus('error');
      showFeedback();
    }
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.intro}>
          <span className="section-label">{t('navContact')}</span>
          <h2 className={styles.title}>{t('contactTitle')}</h2>
          <p className={styles.subtitle}>{t('contactSubtitle')}</p>

          <div className={styles.details}>
            <div>
              <p className={styles.detailLabel}>{t('contactPhoneLabel')}</p>
              <a href={CONTACT_PHONE_HREF} className={styles.detailLink}>
                {CONTACT_PHONE}
              </a>
            </div>
            <div>
              <p className={styles.detailLabel}>{t('contactEmailLabel')}</p>
              <a href={CONTACT_EMAIL_HREF} className={styles.detailLink}>
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <form
          ref={formRef}
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-name">
              {t('contactFormName')}
            </label>
            <input
              id="contact-name"
              name="name"
              className={styles.input}
              type="text"
              required
              autoComplete="name"
              disabled={status === 'sending'}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-email">
              {t('contactFormEmail')}
            </label>
            <input
              id="contact-email"
              name="email"
              className={styles.input}
              type="email"
              required
              autoComplete="email"
              disabled={status === 'sending'}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-message">
              {t('contactFormMessage')}
            </label>
            <textarea
              id="contact-message"
              name="message"
              className={styles.textarea}
              required
              disabled={status === 'sending'}
            />
          </div>

          <button
            type="submit"
            className={`btn btn--primary ${styles.submitBtn}`}
            disabled={status === 'sending'}
          >
            {status === 'sending'
              ? t('contactFormSending')
              : t('contactFormSubmit')}
          </button>

          {status === 'success' && (
            <p
              ref={feedbackRef}
              className={`${styles.hint} ${styles.hintSuccess}`}
              role="status"
            >
              {t('contactFormSuccess')}
            </p>
          )}
          {status === 'error' && (
            <p
              ref={feedbackRef}
              className={`${styles.hint} ${styles.hintError}`}
              role="alert"
            >
              {t('contactFormError')}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export { ContactSection };
