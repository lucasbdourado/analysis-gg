import React, { useState } from 'react';
import { Input } from '../../../../shared/ui/Input';
import { Select } from '../../../../shared/ui/Select';
import { Button } from '../../../../shared/ui/Button';
import { validateRiotId } from '../../../../shared/lib/validation/riotId';
import styles from './SearchForm.module.css';

export const SearchForm: React.FC = () => {
  const dummyRegions = [
    { value: 'NA1', label: 'North America' },
    { value: 'EUW1', label: 'Europe West' },
    { value: 'EUNE1', label: 'Europe Nordic & East' },
    { value: 'KR', label: 'Korea' },
    { value: 'BR1', label: 'Brazil' },
  ];

  const [riotId, setRiotId] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRiotId(e.target.value);
    if (error) {
      setError(undefined);
    }
  };

  const handleInputBlur = () => {
    if (riotId.trim() !== '') {
      const result = validateRiotId(riotId);
      if (!result.isValid) {
        setError(result.error);
      } else {
        setError(undefined);
      }
    } else {
      // Clear error if empty on blur per user decision
      setError(undefined);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateRiotId(riotId);
    if (!result.isValid) {
      setError(result.error);
      console.warn(`Validation failed: ${result.error}`);
      return;
    }
    setError(undefined);
    console.log('Validation passed. Riot ID:', riotId);
    // Redirection will be implemented in Task 004
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input 
        id="riot-id-input"
        placeholder="Riot ID (e.g., Hide on bush#KR1)"
        value={riotId}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        error={error}
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

