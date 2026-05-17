import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LoginModal } from '../LoginModal/LoginModal';
import styles from './AuthButton.module.css';

const AuthButton: React.FC = () => {
  const { t } = useLanguage();
  const { isConfigured, loading, user, isAdmin, signOut } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (!isConfigured) {
    return null;
  }

  if (loading) {
    return (
      <button type="button" className={styles.authBtn} disabled>
        …
      </button>
    );
  }

  if (user) {
    return (
      <div className={styles.userMenu}>
        {isAdmin && (
          <span className={styles.roleBadge}>{t('authRoleAdmin')}</span>
        )}
        <button
          type="button"
          className={styles.logoutBtn}
          onClick={() => void signOut()}
        >
          {t('authLogout')}
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className={styles.authBtn}
        onClick={() => setModalOpen(true)}
      >
        {t('authLogin')}
      </button>
      <LoginModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export { AuthButton };
