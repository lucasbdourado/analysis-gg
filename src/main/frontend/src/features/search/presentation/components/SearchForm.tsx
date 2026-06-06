import React from 'react';
import { Input } from '../../../../shared/ui/Input';
import { Select } from '../../../../shared/ui/Select';
import { Button } from '../../../../shared/ui/Button';
import styles from './SearchForm.module.css';

export const SearchForm: React.FC = () => {
  const dummyRegions = [
    { value: 'NA1', label: 'North America' },
    { value: 'EUW1', label: 'Europe West' },
    { value: 'EUNE1', label: 'Europe Nordic & East' },
    { value: 'KR', label: 'Korea' },
    { value: 'BR1', label: 'Brazil' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input 
        id="riot-id-input"
        placeholder="Riot ID (e.g., Hide on bush#KR1)"
        value=""
        onChange={() => {}}
      />
      <Select 
        id="region-select"
        options={dummyRegions}
        value="NA1"
        onChange={() => {}}
      />
      <Button type="submit" id="search-submit-button">
        Analyze
      </Button>
    </form>
  );
};
