import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

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

  const options = new DocumentBuilder()
    .setTitle('CashBook API')
    .setDescription(
      '開発課題「出納表管理アプリ」のバックエンドAPIのドキュメントです',
    )
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  })
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
