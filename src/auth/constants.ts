if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

export const jwtConstants = {
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  secret: process.env.JWT_SECRET,
}
