import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class TransactionsReceipts {
  @PrimaryGeneratedColumn()
  readonly id: number

  //   transactionとのリレーション

  @Column('varchar')
  s3_url: string

  @Column('varchar')
  file_name: string

  @Column('varchar')
  mime_type: string

  @CreateDateColumn()
  readonly uploaded_at?: Date
}
