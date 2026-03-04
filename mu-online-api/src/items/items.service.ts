// src/items/items.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item, ItemRarity } from './entities/item.entity';
import { Weapon, createBroadSword, createElvenBow, createWizardStaff } from './entities/weapon.entity';
import { Armor, createPlateArmor, createLeatherArmor, createWizardRobe } from './entities/armor.entity';
import { Ring, createRingOfFire, createRingOfHpRegen } from './entities/ring.entity';

@Injectable()
export class ItemsService {

    constructor(
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
    ) {}

    async createItem(
        type: string,
        level: number = 1,
        rarity: string = 'NORMAL',
    ): Promise<object> {

        const rarityEnum = (ItemRarity as any)[rarity.toUpperCase()] ?? ItemRarity.NORMAL;

        let item: Item;

        switch (type) {
            case 'BroadSword':    item = createBroadSword(level, rarityEnum);    break;
            case 'ElvenBow':      item = createElvenBow(level, rarityEnum);      break;
            case 'WizardStaff':   item = createWizardStaff(level, rarityEnum);   break;
            case 'PlateArmor':    item = createPlateArmor(level, rarityEnum);    break;
            case 'LeatherArmor':  item = createLeatherArmor(level, rarityEnum);  break;
            case 'WizardRobe':    item = createWizardRobe(level, rarityEnum);    break;
            case 'RingOfFire':    item = createRingOfFire(level, rarityEnum);    break;
            case 'RingOfHpRegen': item = createRingOfHpRegen(level, rarityEnum); break;
            default: throw new NotFoundException(`Item type '${type}' not found`);
        }

        // ── repo.save() → INSERT INTO items ──────────────────
        const saved = await this.itemRepo.save(item);

        return { message: 'Item created!', item: saved.toJSON() };
    }

    async findAll(): Promise<object[]> {
        const items = await this.itemRepo.find();
        return items.map(i => i.toJSON());
    }

    async findOne(id: string): Promise<object> {
        const item = await this.itemRepo.findOne({ where: { id } as any });
        if (!item) throw new NotFoundException(`Item '${id}' not found`);
        return item.toJSON();
    }

    async equipItem(id: string, characterName: string): Promise<string> {
        const item = await this.itemRepo.findOne({ where: { id } as any });
        if (!item) throw new NotFoundException(`Item '${id}' not found`);

        let result: string;
        if (item instanceof Weapon) result = item.equip(characterName);
        else if (item instanceof Armor)  result = item.equip(characterName);
        else if (item instanceof Ring)   result = item.equip(characterName);
        else result = `${item.getName()} cannot be equipped`;

        // Persiste el estado equipado en DB
        await this.itemRepo.save(item);
        return result;
    }
}