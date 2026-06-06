export const RIOT_ID_REGEX = /^[a-zA-Z0-9\s_.-]{3,16}#[a-zA-Z0-9]{3,5}$/;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateRiotId = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Riot ID is required' };
  }
  if (!RIOT_ID_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Format must be Name#Tag' };
  }
  return { isValid: true };
};
