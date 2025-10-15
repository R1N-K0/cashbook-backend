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

  @Column('varchar', { name: 's3_url' })
  s3Url: string

  @Column('varchar', { name: 'file_name' })
  fileName: string

  @Column('varchar', { name: 'mime_type' })
  mimeType: string

  @CreateDateColumn()
  readonly uploaded_at?: Date
}
