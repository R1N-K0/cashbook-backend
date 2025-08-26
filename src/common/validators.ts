import { ValidatorConstraint } from 'class-validator'

import type { ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ async: false, name: 'isColorCode' })
export class IsColorCode implements ValidatorConstraintInterface {
  validate(color: string) {
    const pattern = /^#([\da-fA-F]{6}|[\da-fA-F]{3})$/
    return typeof color === 'string' && pattern.test(color)
  }

  defaultMessage() {
    return 'カラーコードで送信してください'
  }
}
