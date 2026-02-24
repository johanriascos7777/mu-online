import { Monster, MonsterType } from './monster.entity';

export class Goblin extends Monster {

    constructor() {
        super('Goblin', 5, 'Lorencia', MonsterType.NORMAL);
    }

    // Goblin: rápido, poco daño, poca vida
    // Diferente a BudgeDragon — polimorfismo en acción
    protected initializeStats(): void {
        this.maxHealth       = 35;
        this.health          = this.maxHealth;
        this.attackMin       = 3;
        this.attackMax       = 8;
        this.defense         = 1;
        this.experienceReward = 20;
    }
}