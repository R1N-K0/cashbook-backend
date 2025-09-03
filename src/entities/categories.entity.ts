import { Transactions } from 'src/entities/transactions.entity'
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

@Entity()
export class Categories {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  readonly id: number

  @Column('varchar', { length: 255, nullable: false })
  name: string

  @Column('enum', { default: CategoryType.INCOME, enum: CategoryType })
  type: CategoryType

  @Column('varchar', { length: 7 })
  color: string

  @DeleteDateColumn()
  deletedDate: Date

  @OneToMany(() => Transactions, (transaction) => transaction.category)
  transactions: Transactions[]
}
