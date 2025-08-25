import { Categories } from 'src/entities/categories.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  readonly id: number

  //   ユーザーカラムの追加

  //   dateはstringにマッピングされるのでstring型で定義した.
  @Column('date')
  date: string

  @Column('varchar')
  description: string

  @ManyToOne(() => Categories, (category) => category.transactions)
  @JoinColumn({ name: 'category_id' })
  category: Categories

  @Column('text', { nullable: true })
  memo?: string

  @Column('int')
  amount: number

  @Column('varchar')
  created_user: string

  @Column('varchar')
  updated_user: string

  @Column('boolean', { default: true })
  editable: boolean

  @CreateDateColumn()
  readonly created_at?: Date

  @UpdateDateColumn()
  readonly updated_at: Date
}
