/**
 * Shared password manager channel action constants
 * Used by both main and preload processes
 */
export enum PasswordChannelAction {
  GET_ALL = 'password:get-all',
  GET_BY_ID = 'password:get-by-id',
  CREATE = 'password:create',
  UPDATE = 'password:update',
  DELETE = 'password:delete',
  GENERATE = 'password:generate',
}

export interface PasswordDto {
  id?: string;
  username: string;
  password: string;
  website: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

