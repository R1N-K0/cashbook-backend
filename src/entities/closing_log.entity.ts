import { Users } from 'src/entities/users.entity'
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

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
