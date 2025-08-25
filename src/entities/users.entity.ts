import { ClosingLogs } from 'src/entities/closing_log.entity'
import { Transactions } from 'src/entities/transactions.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Users {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  readonly id: number

  @OneToMany(() => Transactions, (transaction) => transaction.user)
  transactions: Transactions[]

  @OneToMany(() => ClosingLogs, (closingLog) => closingLog.user)
  closing_logs: ClosingLogs[]

  @Column('varchar', { length: 255 })
  name: string

  @Column('varchar')
  email: string

  @Column('varchar')
  password: string

  @Column('tinyint')
  closing_day: number

  @CreateDateColumn()
  readonly created_at?: Date
}
