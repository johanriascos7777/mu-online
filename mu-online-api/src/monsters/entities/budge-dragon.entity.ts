// src/monsters/entities/budge-dragon.entity.ts

import { ChildEntity } from 'typeorm';
import { Monster, MonsterType } from './monster.entity';

// @ChildEntity('BudgeDragon') → valor en columna 'type'
// Mismo patrón que @ChildEntity('DarkKnight') en characters
@ChildEntity('BudgeDragon')
export class BudgeDragon extends Monster {

    constructor() {
        super('Budge Dragon', 3, 'Lorencia', MonsterType.NORMAL);
    }

    protected initializeStats(): void {
        this.maxHealth       = 50;
        this.health          = this.maxHealth;
        this.attackMin       = 5;
        this.attackMax       = 12;
        this.defense         = 2;
        this.experienceReward = 30;
    }
}