import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // en producción cambiar por la URL real del frontend
  });
    // ── SWAGGER SETUP ──────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('MU Online API')
    .setDescription(
      '⚔️ API del juego MU Online — OOP con NestJS y TypeORM\n\n' +
      'Conceptos POO que verás aquí:\n' +
      '- POST /characters → Herencia + Encapsulamiento + Abstracción\n' +
      '- POST /combat/start → Composición + Inyección DI\n' +
      '- POST /combat/:id/attack → Polimorfismo + Interfaces\n' +
      '- POST /characters/:name/items → Asociación (Many-to-Many)'
    )
    .setVersion('2.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // ── FIN SWAGGER ────────────────────────────────────────


  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 API:     http://localhost:3000');
  console.log('📖 Swagger: http://localhost:3000/api');
  
}
bootstrap();