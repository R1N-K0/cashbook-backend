import { ApiLoginResponse } from 'src/auth/decorators/swagger-dto.decorator'

export class LoginResponseDto {
  @ApiLoginResponse()
  accessToken: string
}
