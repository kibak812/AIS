import type { Enemy, EnemyIntent } from './types';

export const ENEMY_TEMPLATES = [
  {
    name: 'Cultist',
    maxHp: 48,
    damage: 6,
  },
  {
    name: 'Jaw Worm',
    maxHp: 42,
    damage: 11,
  },
  {
    name: 'Louse',
    maxHp: 12,
    damage: 6,
  },
  {
    name: 'Fat Gremlin',
    maxHp: 14,
    damage: 4,
  },
  {
    name: 'Slime',
    maxHp: 30,
    damage: 8,
  },
];

let enemyIdCounter = 1;

export function generateEnemyIntent(enemy: Enemy): EnemyIntent {
  const roll = Math.random();

  if (roll < 0.6) {
    return {
      type: 'attack',
      amount: enemy.damage,
    };
  } else if (roll < 0.8) {
    return {
      type: 'defend',
      amount: Math.floor(enemy.damage * 0.8),
    };
  } else if (roll < 0.9) {
    return {
      type: 'buff',
      amount: 2,
    };
  } else {
    return {
      type: 'debuff',
      amount: 1,
    };
  }
}

export function createEnemy(templateIndex?: number): Enemy {
  const template =
    templateIndex !== undefined
      ? ENEMY_TEMPLATES[templateIndex]
      : ENEMY_TEMPLATES[Math.floor(Math.random() * ENEMY_TEMPLATES.length)];

  const enemy: Enemy = {
    id: `enemy_${enemyIdCounter++}`,
    name: template.name,
    maxHp: template.maxHp,
    currentHp: template.maxHp,
    damage: template.damage,
    statusEffects: [],
    intent: {
      type: 'attack',
      amount: template.damage,
    },
  };

  enemy.intent = generateEnemyIntent(enemy);
  return enemy;
}

export function createEnemyGroup(floor: number): Enemy[] {
  if (floor === 1) {
    return [createEnemy(2)]; // Single Louse for first floor
  } else if (floor <= 3) {
    return [createEnemy()];
  } else if (floor <= 6) {
    const count = Math.random() < 0.5 ? 1 : 2;
    return Array.from({ length: count }, () => createEnemy());
  } else {
    const count = Math.floor(Math.random() * 2) + 2;
    return Array.from({ length: count }, () => createEnemy());
  }
}
