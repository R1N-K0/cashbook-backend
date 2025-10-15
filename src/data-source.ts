import dotenv from 'dotenv'
import { DataSource } from 'typeorm'
dotenv.config()
const AppDataSource = new DataSource({
  database: process.env.DB_NAME,
  entities: [__dirname + '/entities/*{.ts,.js}'],
  host: process.env.DB_HOST,
  logging: true,
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  password: process.env.DB_PASS,
  type: 'postgres',
  username: process.env.DB_USER,
})

export default AppDataSource
