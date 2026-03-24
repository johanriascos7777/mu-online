import { ChildEntity } from 'typeorm';
import { Monster, MonsterType } from './monster.entity';

@ChildEntity('AncientDragon')
export class AncientDragon extends Monster {

    constructor() {
        super('Ancient Dragon', 15, 'Lorencia', MonsterType.BOSS);
    }

    protected initializeStats(): void {
        this.maxHealth        = 500;
        this.health           = this.maxHealth;
        this.attackMin        = 8;
        this.attackMax        = 18;
        this.defense          = 5;
        this.experienceReward = 300;
    }
}