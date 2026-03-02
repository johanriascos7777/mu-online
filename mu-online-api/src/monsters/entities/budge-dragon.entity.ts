// Tercer concepto: Interfaces y Polimorfismo
// src/monsters/entities/budge-dragon.entity.ts
// El Budge Dragon — monstruo icónico de Lorencia (zona inicial)

import { Monster, MonsterType } from './monster.entity';

export class BudgeDragon extends Monster {

    constructor() {
        super('Budge Dragon', 3, 'Lorencia', MonsterType.NORMAL);
    }

    // POLIMORFISMO: cada monstruo inicializa sus stats diferente
    // pero todos tienen el mismo método initializeStats()
    protected initializeStats(): void {
        this.maxHealth = 50;
        this.health = this.maxHealth;
        this.attackMin = 5;
        this.attackMax = 12;
        this.defense = 2;
        this.experienceReward = 30;
    }
}