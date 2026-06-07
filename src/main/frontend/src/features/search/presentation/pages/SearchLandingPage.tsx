import React from 'react';
import { SearchForm } from '../components/SearchForm';
import styles from './SearchLandingPage.module.css';

export const SearchLandingPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainCard}>
        <div className={styles.logoSection}>
          <h1 className={styles.title}>Analysis.GG</h1>
          <p className={styles.subtitle}>
            League of Legends Performance Dashboard
          </p>
        </div>
        <section className={styles.formSection}>
          <SearchForm />
        </section>
      </main>
    </div>
  );
};
