import { ipcMain } from 'electron';
import {
  PasswordChannelAction,
  PasswordDto,
  PasswordGeneratorOptions,
} from '@/shared/password.constants';
import { passwordService } from '@/main/manager/services/password.service';
import { generate } from '@/main/password-generator/generator';

console.log('Password controller file executing...');

/**
 * Validate password entry data
 */
function validatePasswordDto(dto: Partial<PasswordDto>): {
  valid: boolean;
  error?: string;
} {
  // Username validation
  if (dto.username !== undefined) {
    if (typeof dto.username !== 'string') {
      return { valid: false, error: 'Username must be a string' };
    }
    if (dto.username.length === 0) {
      return { valid: false, error: 'Username cannot be empty' };
    }
    if (dto.username.length > 255) {
      return {
        valid: false,
        error: 'Username must be less than 255 characters',
      };
    }
  }

  // Password validation
  if (dto.password !== undefined) {
    if (typeof dto.password !== 'string') {
      return { valid: false, error: 'Password must be a string' };
    }
    if (dto.password.length === 0) {
      return { valid: false, error: 'Password cannot be empty' };
    }
    if (dto.password.length > 500) {
      return {
        valid: false,
        error: 'Password must be less than 500 characters',
      };
    }
  }

  // Website validation (optional field)
  if (dto.website !== undefined && dto.website !== null) {
    if (typeof dto.website !== 'string') {
      return { valid: false, error: 'Website must be a string' };
    }
    if (dto.website.length > 500) {
      return {
        valid: false,
        error: 'Website must be less than 500 characters',
      };
    }
  }

  return { valid: true };
}

/**
 * Validate UUID format
 */
function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return typeof id === 'string' && uuidRegex.test(id);
}

try {
  const { GET_ALL, GET_BY_ID, CREATE, UPDATE, DELETE, GENERATE } =
    PasswordChannelAction;

  console.log('Password controller loaded - registering IPC handlers');
  console.log('Handler channels:', {
    GET_ALL,
    GET_BY_ID,
    CREATE,
    UPDATE,
    DELETE,
    GENERATE,
  });

  /**
   * Get all passwords
   */
  console.log('Registering handler:', GET_ALL);
  ipcMain.handle(GET_ALL, async (): Promise<PasswordDto[]> => {
    try {
      console.log('Fetching all passwords...');
      const passwords = await passwordService.getAll();
      console.log(`Found ${passwords.length} passwords`);
      return passwords;
    } catch (error) {
      console.error('Failed to get all passwords:', error);
      throw error;
    }
  });

  /**
   * Get password by ID
   */
  console.log('Registering handler:', GET_BY_ID);
  ipcMain.handle(
    GET_BY_ID,
    async (_event, id: string): Promise<PasswordDto | null> => {
      try {
        // Validate ID format
        if (!isValidUUID(id)) {
          throw new Error('Invalid password ID format');
        }

        console.log('Fetching password by ID');
        return await passwordService.getById(id);
      } catch (error) {
        console.error('Failed to get password by ID:', error);
        throw error;
      }
    },
  );

  /**
   * Create new password
   */
  console.log('Registering handler:', CREATE);
  ipcMain.handle(
    CREATE,
    async (
      _event,
      dto: Omit<PasswordDto, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<PasswordDto> => {
      try {
        const validation = validatePasswordDto(dto);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        console.log('Creating new password entry');
        const password = await passwordService.create(dto);
        console.log('Password created successfully');
        return password;
      } catch (error) {
        console.error('Failed to create password:', error);
        throw error;
      }
    },
  );

  /**
   * Update existing password
   */
  console.log('Registering handler:', UPDATE);
  ipcMain.handle(
    UPDATE,
    async (
      _event,
      id: string,
      dto: Partial<Omit<PasswordDto, 'id' | 'createdAt' | 'updatedAt'>>,
    ): Promise<PasswordDto | null> => {
      try {
        // Validate ID format
        if (!isValidUUID(id)) {
          throw new Error('Invalid password ID format');
        }

        const validation = validatePasswordDto(dto);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        console.log('Updating password');
        const updated = await passwordService.update(id, dto);
        if (updated) {
          console.log('Password updated successfully');
        } else {
          console.log('Password not found');
        }
        return updated;
      } catch (error) {
        console.error('Failed to update password:', error);
        throw error;
      }
    },
  );

  /**
   * Delete password
   */
  console.log('Registering handler:', DELETE);
  ipcMain.handle(DELETE, async (_event, id: string): Promise<boolean> => {
    try {
      // Validate ID format
      if (!isValidUUID(id)) {
        throw new Error('Invalid password ID format');
      }

      console.log('Deleting password');
      const deleted = await passwordService.delete(id);
      console.log('Password deleted:', deleted);
      return deleted;
    } catch (error) {
      console.error('Failed to delete password:', error);
      throw error;
    }
  });

  /**
   * Generate password
   */
  console.log('Registering handler:', GENERATE);
  ipcMain.handle(
    GENERATE,
    async (_event, options: PasswordGeneratorOptions): Promise<string> => {
      try {
        console.log('Generating password with options:', options);
        const password = generate(options.length, options);
        console.log('Password generated successfully');
        return password;
      } catch (error) {
        console.error('Failed to generate password:', error);
        throw error;
      }
    },
  );

  console.log('All password handlers registered successfully');
} catch (error) {
  console.error(
    'FATAL: Failed to register password controller handlers:',
    error,
  );
  throw error;
}
