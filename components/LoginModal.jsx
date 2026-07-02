// components/LoginModal.jsx
import React from 'react';
import { signIn } from 'next-auth/react';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import styles from './LoginModalStyles.module.css'; // Create new CSS module for LoginModal

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleGitHubSignIn = () => {
    signIn('github', { callbackUrl: '/' });
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className={styles.modalContent}>
          <button
            onClick={handleGitHubSignIn}
            className={styles.authButton}
            aria-label="Sign in with GitHub"
          >
            <FaGithub size={20} />
            <span>Sign in with GitHub</span>
          </button>

          <button
            onClick={handleGoogleSignIn}
            className={styles.authButton}
            aria-label="Sign in with Google"
          >
            <FaGoogle size={20} />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;