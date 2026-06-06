import React from 'react';
import { SearchForm } from '../components/SearchForm';

export const SearchLandingPage: React.FC = () => {
  return (
    <main>
      <h1>Analysis.GG</h1>
      <section>
        <SearchForm />
      </section>
    </main>
  );
};
