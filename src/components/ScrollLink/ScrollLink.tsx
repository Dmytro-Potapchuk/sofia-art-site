import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToSection } from '../../utils/scrollToSection';

interface ScrollLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
}

const ScrollLink: React.FC<ScrollLinkProps> = ({
  to,
  className,
  children,
  onNavigate,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate?.();

    const hashIndex = to.indexOf('#');
    const path = hashIndex >= 0 ? to.slice(0, hashIndex) || '/' : to;
    const sectionId = hashIndex >= 0 ? to.slice(hashIndex + 1) : '';

    if (location.pathname !== path) {
      navigate(sectionId ? `${path}#${sectionId}` : path);
      return;
    }

    if (sectionId) {
      window.requestAnimationFrame(() => scrollToSection(sectionId));
      window.history.replaceState(null, '', `${path}#${sectionId}`);
      return;
    }

    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <a href={to} className={className} onClick={handleClick}>
      {children}
    </a>
  );
};

export { ScrollLink };
