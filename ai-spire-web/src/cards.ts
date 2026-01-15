import type { Card } from './types';

export const STARTER_DECK: Card[] = [
  {
    id: 'strike_1',
    name: 'Strike',
    description: 'Deal 6 damage.',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    effects: [
      {
        type: 'damage',
        target: 'enemy',
        amount: 6,
      },
    ],
  },
  {
    id: 'strike_2',
    name: 'Strike',
    description: 'Deal 6 damage.',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    effects: [
      {
        type: 'damage',
        target: 'enemy',
        amount: 6,
      },
    ],
  },
  {
    id: 'strike_3',
    name: 'Strike',
    description: 'Deal 6 damage.',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    effects: [
      {
        type: 'damage',
        target: 'enemy',
        amount: 6,
      },
    ],
  },
  {
    id: 'strike_4',
    name: 'Strike',
    description: 'Deal 6 damage.',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    effects: [
      {
        type: 'damage',
        target: 'enemy',
        amount: 6,
      },
    ],
  },
  {
    id: 'strike_5',
    name: 'Strike',
    description: 'Deal 6 damage.',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    effects: [
      {
        type: 'damage',
        target: 'enemy',
        amount: 6,
      },
    ],
  },
  {
    id: 'defend_1',
    name: 'Defend',
    description: 'Gain 5 Block.',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    effects: [
      {
        type: 'block',
        target: 'self',
        amount: 5,
      },
    ],
  },
  {
    id: 'defend_2',
    name: 'Defend',
    description: 'Gain 5 Block.',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    effects: [
      {
        type: 'block',
        target: 'self',
        amount: 5,
      },
    ],
  },
  {
    id: 'defend_3',
    name: 'Defend',
    description: 'Gain 5 Block.',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    effects: [
      {
        type: 'block',
        target: 'self',
        amount: 5,
      },
    ],
  },
  {
    id: 'defend_4',
    name: 'Defend',
    description: 'Gain 5 Block.',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    effects: [
      {
        type: 'block',
        target: 'self',
        amount: 5,
      },
    ],
  },
  {
    id: 'defend_5',
    name: 'Defend',
    description: 'Gain 5 Block.',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    effects: [
      {
        type: 'block',
        target: 'self',
        amount: 5,
      },
    ],
  },
];

export const CARD_POOL: Card[] = [
  {
    id: 'bash',
    name: 'Bash',
    description: 'Deal 8 damage. Apply 2 Vulnerable.',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    effects: [
      {
        type: 'damage',
        target: 'enemy',
        amount: 8,
      },
      {
        type: 'status',
        target: 'enemy',
        amount: 2,
        statusType: 'vulnerable',
      },
    ],
  },
  {
    id: 'cleave',
    name: 'Cleave',
    description: 'Deal 8 damage to ALL enemies.',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    effects: [
      {
        type: 'damage',
        target: 'all_enemies',
        amount: 8,
      },
    ],
  },
  {
    id: 'iron_wave',
    name: 'Iron Wave',
    description: 'Deal 5 damage. Gain 5 Block.',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    effects: [
      {
        type: 'damage',
        target: 'enemy',
        amount: 5,
      },
      {
        type: 'block',
        target: 'self',
        amount: 5,
      },
    ],
  },
  {
    id: 'shrug_it_off',
    name: 'Shrug It Off',
    description: 'Gain 8 Block. Draw 1 card.',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    effects: [
      {
        type: 'block',
        target: 'self',
        amount: 8,
      },
      {
        type: 'draw',
        target: 'self',
        amount: 1,
      },
    ],
  },
  {
    id: 'thunderclap',
    name: 'Thunderclap',
    description: 'Deal 4 damage to ALL enemies. Apply 1 Vulnerable to ALL enemies.',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    effects: [
      {
        type: 'damage',
        target: 'all_enemies',
        amount: 4,
      },
      {
        type: 'status',
        target: 'all_enemies',
        amount: 1,
        statusType: 'vulnerable',
      },
    ],
  },
  {
    id: 'carnage',
    name: 'Carnage',
    description: 'Deal 20 damage.',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    effects: [
      {
        type: 'damage',
        target: 'enemy',
        amount: 20,
      },
    ],
  },
  {
    id: 'inflame',
    name: 'Inflame',
    description: 'Gain 2 Strength.',
    type: 'power',
    rarity: 'uncommon',
    cost: 1,
    effects: [
      {
        type: 'status',
        target: 'self',
        amount: 2,
        statusType: 'strength',
      },
    ],
  },
  {
    id: 'pummel',
    name: 'Pummel',
    description: 'Deal 2 damage 4 times.',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    effects: [
      {
        type: 'damage',
        target: 'enemy',
        amount: 2,
      },
      {
        type: 'damage',
        target: 'enemy',
        amount: 2,
      },
      {
        type: 'damage',
        target: 'enemy',
        amount: 2,
      },
      {
        type: 'damage',
        target: 'enemy',
        amount: 2,
      },
    ],
  },
  {
    id: 'flame_barrier',
    name: 'Flame Barrier',
    description: 'Gain 12 Block. Deal 4 Burn to attacker.',
    type: 'skill',
    rarity: 'uncommon',
    cost: 2,
    effects: [
      {
        type: 'block',
        target: 'self',
        amount: 12,
      },
      {
        type: 'status',
        target: 'self',
        amount: 4,
        statusType: 'burn',
      },
    ],
  },
  {
    id: 'immolate',
    name: 'Immolate',
    description: 'Deal 21 damage to ALL enemies.',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    effects: [
      {
        type: 'damage',
        target: 'all_enemies',
        amount: 21,
      },
    ],
  },
];

let cardIdCounter = 1000;

export function generateCardId(): string {
  return `card_${cardIdCounter++}`;
}

export function getRandomCards(count: number): Card[] {
  const cards: Card[] = [];
  for (let i = 0; i < count; i++) {
    const randomCard = CARD_POOL[Math.floor(Math.random() * CARD_POOL.length)];
    cards.push({
      ...randomCard,
      id: generateCardId(),
    });
  }
  return cards;
}
