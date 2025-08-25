import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

export class Users {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  readonly id: number

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
