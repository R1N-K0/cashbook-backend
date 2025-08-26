import type { Users } from 'src/entities/users.entity'

export type PasswordOmitUser = Omit<Users, 'password'>
