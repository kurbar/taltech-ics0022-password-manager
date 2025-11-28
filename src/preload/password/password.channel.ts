import { ipcRenderer } from 'electron';
import { PasswordChannelAction, PasswordDto, PasswordGeneratorOptions } from '@/shared/password.constants';

const { GET_ALL, GET_BY_ID, CREATE, UPDATE, DELETE, GENERATE } = PasswordChannelAction;

const passwordChannel = {
  async getAll(): Promise<PasswordDto[]> {
    return ipcRenderer.invoke(GET_ALL);
  },

  async getById(id: string): Promise<PasswordDto | null> {
    return ipcRenderer.invoke(GET_BY_ID, id);
  },

  async create(dto: Omit<PasswordDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<PasswordDto> {
    return ipcRenderer.invoke(CREATE, dto);
  },

  async update(id: string, dto: Partial<Omit<PasswordDto, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PasswordDto | null> {
    return ipcRenderer.invoke(UPDATE, id, dto);
  },

  async delete(id: string): Promise<boolean> {
    return ipcRenderer.invoke(DELETE, id);
  },

  async generate(options: PasswordGeneratorOptions): Promise<string> {
    return ipcRenderer.invoke(GENERATE, options);
  },
} as const;

export default passwordChannel;

