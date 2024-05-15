import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  // const httpsOptions = {
  //   key: readFileSync('./security/cert.key'),
  //   cert: readFileSync('./security/cert.pem'),
  // };

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
    // httpsOptions: httpsOptions
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true })
  );

  const config = new DocumentBuilder()
    .setTitle('JohnnyFlix')
    .setDescription('The JohhnyFlix API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    explorer: false,
    swaggerOptions: {
      supportedSubmitMethods: []
    }
  });

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
