import { Users } from 'src/entities/users.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class ClosingLogs {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  readonly id: number

  @ManyToOne(() => Users, (user) => user.closingLogs)
  @JoinColumn({ name: 'user_id' })
  user: Users

  @Column('date', { name: 'closing_date' })
  closingDate: string

  //   postgresではdatetimeがないのでtimestampで代用
  @Column('timestamp', { name: 'processed_at', nullable: true })
  processedAt: Date
}
