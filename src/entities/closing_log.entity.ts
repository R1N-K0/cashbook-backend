import { Column, PrimaryGeneratedColumn } from 'typeorm'

export class ClosingLog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  readonly id: number

  //   ユーザーとのリレーション

  @Column('date')
  closing_date: string

  //   postgresではdatetimeがないのでtimestampで代用
  @Column('timestamp', { nullable: true })
  processed_at: Date
}
