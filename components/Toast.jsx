// components/Toast.jsx
import React, { useEffect, useState } from 'react';
import styles from './Toast.module.css';

/**
 * Simple toast notification used by ShareButtons to confirm copy‑link actions.
 * It appears centered at the bottom of the viewport, fades in, stays for 2 seconds,
 * then fades out automatically.
 */
export default function Toast({ message }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return <div className={styles.toast}>{message}</div>;
}
