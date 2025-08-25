import type { Users } from 'src/entities/users.entity'

export class LoginInputDto {
  name: Users['name']
  pass: Users['password']
}
