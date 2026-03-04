// src/items/items.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { Weapon } from './entities/weapon.entity';
import { Armor } from './entities/armor.entity';
import { Ring } from './entities/ring.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Item, Weapon, Armor, Ring]),
    ],
    controllers: [ItemsController],
    providers:   [ItemsService],
    exports:     [ItemsService],
})
export class ItemsModule {}