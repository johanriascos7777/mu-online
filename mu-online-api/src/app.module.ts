import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharactersModule } from './characters/characters.module';
import { ItemsModule } from './items/items.module';
import { MapsModule } from './maps/maps.module';
import { CombatModule } from './combat/combat.module';
import { MonstersModule } from './monsters/monsters.module';

@Module({
  imports: [
    // ── TypeORM — conexión a PostgreSQL ──────────────────
    // synchronize: true → TypeORM crea/actualiza las tablas
    // automáticamente basándose en las entidades.
    // ⚠️ Solo para desarrollo — en producción usar migraciones
    TypeOrmModule.forRoot({
      type:        'postgres',
      host:        'localhost',
      port:        5432,
      username:    'postgres',
      password:    '1234567890*',
      database:    'mu_online',
      entities:    [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CharactersModule,
    ItemsModule,
    MapsModule,
    CombatModule,
    MonstersModule,
  ],
  controllers: [AppController],
  providers:   [AppService],
})
export class AppModule {}
