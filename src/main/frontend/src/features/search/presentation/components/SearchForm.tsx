import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../../../shared/ui/Input';
import { Select } from '../../../../shared/ui/Select';
import { Button } from '../../../../shared/ui/Button';
import { validateRiotId } from '../../../../shared/lib/validation/riotId';
import { REGIONS } from '../../../../shared/lib/validation/regions';
import styles from './SearchForm.module.css';

export const SearchForm: React.FC = () => {
  const navigate = useNavigate();
  const [riotId, setRiotId] = useState('');
  const [region, setRegion] = useState('BR1');
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
    
    const [gameName, tagLine] = riotId.split('#');
    const name = encodeURIComponent(gameName.trim());
    const tag = encodeURIComponent(tagLine.trim());
    const lowerRegion = region.toLowerCase();
    
    navigate(`/dashboard?name=${name}&tag=${tag}&region=${lowerRegion}`);
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
        options={REGIONS}
        value={region}
        onChange={(e) => setRegion(e.target.value)}
      />
      <Button type="submit" id="search-submit-button">
        Analyze
      </Button>
    </form>
  );
};


