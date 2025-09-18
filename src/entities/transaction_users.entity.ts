import { Transactions } from 'src/entities/transactions.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class TransactionUsers {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  readonly id: number

  @Column('varchar', { length: 255, name: 'last_name' })
  lastName: string

  @Column('varchar', { length: 255, name: 'first_name' })
  firstName: string

  @OneToMany(() => Transactions, (transaction) => transaction.createdUser)
  transactions: Transactions[]

  // updatedUserは片方向のリレーションなのでここでの定義は不要

  @CreateDateColumn()
  readonly created_at?: Date
}
