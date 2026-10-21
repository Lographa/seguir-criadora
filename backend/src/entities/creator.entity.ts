import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('creators')
export class Creator {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;
}
