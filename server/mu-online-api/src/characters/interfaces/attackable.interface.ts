//Tercer concepto: Interfaces y Polimorfismo

// src/characters/interfaces/attackable.interface.ts

// Una INTERFAZ define un CONTRATO — cualquier clase que la implemente
// DEBE tener estos métodos. No importa cómo los implemente, solo que los tenga.
export interface Attackable {
    attack(target: string): string;
    getAttackPower(): number;
}

export interface Combatable extends Attackable {
    defend(): string;
    getDefensePower(): number;
}