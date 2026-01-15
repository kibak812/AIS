import type { Card } from './types';

export const STARTER_DECK: Card[] = [
  {
    id: 'strike_1',
    name: '타격',
    description: '6의 피해를 줍니다.',
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
    name: '타격',
    description: '6의 피해를 줍니다.',
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
    name: '타격',
    description: '6의 피해를 줍니다.',
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
    name: '타격',
    description: '6의 피해를 줍니다.',
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
    name: '타격',
    description: '6의 피해를 줍니다.',
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
    name: '수비',
    description: '5의 방어도를 얻습니다.',
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
    name: '수비',
    description: '5의 방어도를 얻습니다.',
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
    name: '수비',
    description: '5의 방어도를 얻습니다.',
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
    name: '수비',
    description: '5의 방어도를 얻습니다.',
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
    name: '수비',
    description: '5의 방어도를 얻습니다.',
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
    name: '강타',
    description: '8의 피해를 줍니다. 취약 2를 부여합니다.',
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
    name: '쪼개기',
    description: '모든 적에게 8의 피해를 줍니다.',
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
    name: '강철 파동',
    description: '5의 피해를 줍니다. 5의 방어도를 얻습니다.',
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
    name: '어깨 으쓱',
    description: '8의 방어도를 얻습니다. 카드 1장을 뽑습니다.',
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
    name: '천둥벼락',
    description: '모든 적에게 4의 피해를 줍니다. 모든 적에게 취약 1을 부여합니다.',
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
    name: '대학살',
    description: '20의 피해를 줍니다.',
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
    name: '분노',
    description: '힘 2를 얻습니다.',
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
    name: '연타',
    description: '2의 피해를 4회 줍니다.',
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
    name: '화염 장벽',
    description: '12의 방어도를 얻습니다. 공격자에게 화상 4를 줍니다.',
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
    name: '화형',
    description: '모든 적에게 21의 피해를 줍니다.',
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
