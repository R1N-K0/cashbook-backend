import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

@Entity()
export class categories {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { length: 255, nullable: false })
  name: string

  @Column('enum', { default: CategoryType.INCOME, enum: CategoryType })
  type: CategoryType

  @Column('varchar', { length: 7 })
  color: string
}
