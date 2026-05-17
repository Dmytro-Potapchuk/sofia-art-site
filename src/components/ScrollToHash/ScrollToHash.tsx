import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToSection } from '../../utils/scrollToSection';

const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const sectionId = location.hash.replace('#', '');
    const delay = location.pathname === '/' ? 80 : 200;
    const timer = window.setTimeout(() => scrollToSection(sectionId), delay);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return null;
};

export { ScrollToHash };
