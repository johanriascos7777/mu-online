import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharactersModule } from './characters/characters.module';
import { ItemsModule } from './items/items.module'; 
import { MapsModule } from './maps/maps.module'; 
import { CombatModule } from './combat/combat.module';




@Module({
  imports: [
    CharactersModule,  // como INSTALLED_APPS en Django
    ItemsModule, // ← agregar
    MapsModule,
    CombatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}