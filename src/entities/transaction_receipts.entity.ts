import { Transactions } from 'src/entities/transactions.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class TransactionsReceipts {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  readonly id: number

  @ManyToOne(() => Transactions, (transaction) => transaction.receipts)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transactions

  @Column('varchar')
  s3_url: string

  @Column('varchar')
  file_name: string

  @Column('varchar')
  mime_type: string

  @CreateDateColumn()
  readonly uploaded_at?: Date
}
