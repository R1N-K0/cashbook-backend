import { ClosingLogs } from 'src/entities/closing_log.entity'
import { Transactions } from 'src/entities/transactions.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

enum UserRole {
  REGULAR = 'regular',
  ADMIN = 'admin',
}

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

  //   postgresではtinyIntに未対応のため
  @Column('smallint')
  closing_day: number

  @Column('enum', { default: UserRole.REGULAR, enum: UserRole })
  role: UserRole

  @CreateDateColumn()
  readonly created_at?: Date
}
