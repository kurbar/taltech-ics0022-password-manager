import { AppDataSource } from '@/database/dataSource';
import { PasswordEntity } from '@/main/manager/entities/password.entity';
import { PasswordDto } from '@/shared/password.constants';

export class PasswordService {
  private getRepository() {
    if (!AppDataSource.isInitialized) {
      throw new Error(
        'Database is not initialized. Please unlock the database first.',
      );
    }
    return AppDataSource.getRepository(PasswordEntity);
  }

  async getAll(): Promise<PasswordDto[]> {
    const passwords = await this.getRepository().find({
      order: { created_at: 'DESC' },
    });

    return passwords.map((p) => this.toDto(p));
  }

  async getById(id: string): Promise<PasswordDto | null> {
    const password = await this.getRepository().findOne({ where: { id } });
    return password ? this.toDto(password) : null;
  }

  async create(
    dto: Omit<PasswordDto, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PasswordDto> {
    const repository = this.getRepository();
    const password = repository.create({
      username: dto.username,
      password: dto.password,
      website: dto.website,
    });

    const saved = await repository.save(password);
    return this.toDto(saved);
  }

  async update(
    id: string,
    dto: Partial<Omit<PasswordDto, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<PasswordDto | null> {
    const repository = this.getRepository();
    const password = await repository.findOne({ where: { id } });

    if (!password) {
      return null;
    }

    if (dto.username !== undefined) password.username = dto.username;
    if (dto.password !== undefined) password.password = dto.password;
    if (dto.website !== undefined) password.website = dto.website;

    const updated = await repository.save(password);
    return this.toDto(updated);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.getRepository().delete(id);
    return !!(result.affected && result.affected > 0);
  }

  private toDto(entity: PasswordEntity): PasswordDto {
    return {
      id: entity.id,
      username: entity.username,
      password: entity.password,
      website: entity.website,
      createdAt: entity.created_at?.toISOString(),
      updatedAt: entity.updated_at?.toISOString(),
    };
  }
}

export const passwordService = new PasswordService();
