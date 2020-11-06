import React from 'react';

import styles from './Modal.module.scss';

export default function Modal({toggle, title, children}) {
  return (
    <section className={styles.Modal}>
      <div className={styles.container}>
        <header>
          <span>{title}</span>
          <button className={styles.close} onClick={toggle}>
            close
          </button>
        </header>
        {children}
      </div>
    </section>
  );
}
