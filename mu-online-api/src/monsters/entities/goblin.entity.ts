// src/monsters/entities/goblin.entity.ts

import { ChildEntity } from 'typeorm';
import { Monster, MonsterType } from './monster.entity';

@ChildEntity('Goblin')
export class Goblin extends Monster {

    constructor() {
        super('Goblin', 5, 'Lorencia', MonsterType.NORMAL);
    }

    protected initializeStats(): void {
        this.maxHealth        = 35;
        this.health           = this.maxHealth;
        this.attackMin        = 3;
        this.attackMax        = 8;
        this.defense          = 1;
        this.experienceReward = 20;
    }
}