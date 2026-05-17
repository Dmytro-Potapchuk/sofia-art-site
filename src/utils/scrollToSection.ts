export const scrollToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const headerOffset =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--header-height'
      ),
      10
    ) || 72;

  const top =
    element.getBoundingClientRect().top + window.scrollY - headerOffset - 8;

  window.scrollTo({ top, behavior: 'smooth' });
};
