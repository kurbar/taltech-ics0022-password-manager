import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MetadataColumns } from '@/utils/database.util';

@Entity('passwords')
export class PasswordEntity extends MetadataColumns {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  username: string;

  @Column('varchar', { length: 500 })
  password: string;

  @Column('varchar', { length: 500, nullable: true })
  website: string | null;
}
