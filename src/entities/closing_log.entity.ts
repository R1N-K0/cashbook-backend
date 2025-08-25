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

  @ManyToOne(() => Users, (user) => user.closing_logs)
  @JoinColumn({ name: 'user_id' })
  user: Users

  @Column('date')
  closing_date: string

  //   postgresではdatetimeがないのでtimestampで代用
  @Column('timestamp', { nullable: true })
  processed_at: Date
}
