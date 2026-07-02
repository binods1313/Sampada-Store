import { useEffect, useState } from 'react';
import styles from './JourneyStats.module.css';

function CountUp({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 50);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 50);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count}</span>;
}

export default function JourneyStats() {
  return (
    <section className={styles.statsSection}>
      <div className={styles.statItem}>
        <CountUp target={11} /> Looks
      </div>
      <div className={styles.statItem}>
        <CountUp target={4} /> Collections
      </div>
      <div className={styles.statItem}>
        <CountUp target={100} />% Heritage Style
      </div>
    </section>
  );
}
