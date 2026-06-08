import React from 'react';
import { SearchForm } from '../components/SearchForm';
import styles from './SearchLandingPage.module.css';

export const SearchLandingPage: React.FC = () => {
  return (
    <div className="ds-hero">
      <main className="ds-hero-content">
        <div className={styles.logoSection}>
          <span className="ds-kicker">Riot Games Analytics</span>
          <h1 className="ds-display">Analysis.GG</h1>
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
