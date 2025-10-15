import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  )

  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
  })

  const options = new DocumentBuilder()
    .addGlobalResponse({
      description: 'サーバー側のエラー',
      status: 500,
    })
    .addGlobalResponse({
      description: '認証に失敗',
      status: 401,
    })
    .setTitle('CashBook API')
    .setDescription(
      '開発課題「出納表管理アプリ」のバックエンドAPIのドキュメントです',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        bearerFormat: 'JWT',
        description: 'JWTトークンを設定していください',
        in: 'header',
        name: 'Authorize',
        scheme: 'bearer',
        type: 'http',
      },
      'accessToken',
    )
    .addSecurityRequirements('ApiBearerAuth')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  })
  app.use(cookieParser())
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
