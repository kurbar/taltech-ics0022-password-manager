import crypto from 'crypto';

interface PasswordGeneratorOptions {
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

/**
 * Generate a cryptographically secure random password
 */
export function generate(
  length: number,
  options: PasswordGeneratorOptions,
): string {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  let allChars = '';
  if (options.includeUppercase) {
    allChars += uppercaseChars;
  }
  if (options.includeLowercase) {
    allChars += lowercaseChars;
  }
  if (options.includeNumbers) {
    allChars += numberChars;
  }
  if (options.includeSymbols) {
    allChars += symbolChars;
  }

  if (allChars.length === 0) {
    throw new Error('At least one character type must be selected');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, allChars.length);
    password += allChars[randomIndex];
  }

  return password;
}
