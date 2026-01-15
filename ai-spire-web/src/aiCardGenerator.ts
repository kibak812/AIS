import type { Card, CardType, CardRarity, CardEffect, StatusEffectType } from './types';
import { generateCardId } from './cards';

// AI 스타일 카드 이름 생성기
const CARD_NAME_PREFIXES: { [key in CardType]: string[] } = {
  attack: ['격렬한', '맹렬한', '치명적', '파괴적', '광폭한', '잔혹한', '혈전의', '분쇄의'],
  skill: ['수호의', '신성한', '빛나는', '고요한', '치유의', '방어의', '은밀한', '민첩한'],
  power: ['영원한', '불멸의', '고대의', '심연의', '용맹한', '초월적', '마력의', '전설의'],
};

const CARD_NAME_SUFFIXES: { [key in CardType]: string[] } = {
  attack: ['일격', '폭풍', '참격', '베기', '분노', '광란', '섬멸', '학살'],
  skill: ['방패', '장막', '가호', '결계', '은신', '치유', '명상', '집중'],
  power: ['권능', '축복', '의지', '각성', '초월', '계약', '강림', '지배'],
};

// 효과 템플릿
interface EffectTemplate {
  type: CardEffect['type'];
  target: CardEffect['target'];
  minAmount: number;
  maxAmount: number;
  statusType?: StatusEffectType;
}

const EFFECT_TEMPLATES: { [key in CardType]: EffectTemplate[][] } = {
  attack: [
    // 기본 공격
    [{ type: 'damage', target: 'enemy', minAmount: 4, maxAmount: 15 }],
    // 공격 + 방어
    [
      { type: 'damage', target: 'enemy', minAmount: 4, maxAmount: 10 },
      { type: 'block', target: 'self', minAmount: 3, maxAmount: 8 },
    ],
    // 공격 + 상태이상
    [
      { type: 'damage', target: 'enemy', minAmount: 5, maxAmount: 12 },
      { type: 'status', target: 'enemy', minAmount: 1, maxAmount: 3, statusType: 'vulnerable' },
    ],
    // 전체 공격
    [{ type: 'damage', target: 'all_enemies', minAmount: 3, maxAmount: 12 }],
    // 다단 히트
    [
      { type: 'damage', target: 'enemy', minAmount: 2, maxAmount: 4 },
      { type: 'damage', target: 'enemy', minAmount: 2, maxAmount: 4 },
      { type: 'damage', target: 'enemy', minAmount: 2, maxAmount: 4 },
    ],
    // 공격 + 화상
    [
      { type: 'damage', target: 'enemy', minAmount: 4, maxAmount: 10 },
      { type: 'status', target: 'enemy', minAmount: 2, maxAmount: 5, statusType: 'burn' },
    ],
    // 공격 + 독
    [
      { type: 'damage', target: 'enemy', minAmount: 3, maxAmount: 8 },
      { type: 'status', target: 'enemy', minAmount: 3, maxAmount: 7, statusType: 'poison' },
    ],
  ],
  skill: [
    // 기본 방어
    [{ type: 'block', target: 'self', minAmount: 5, maxAmount: 20 }],
    // 방어 + 드로우
    [
      { type: 'block', target: 'self', minAmount: 5, maxAmount: 12 },
      { type: 'draw', target: 'self', minAmount: 1, maxAmount: 2 },
    ],
    // 약화 + 방어
    [
      { type: 'status', target: 'enemy', minAmount: 1, maxAmount: 3, statusType: 'weak' },
      { type: 'block', target: 'self', minAmount: 4, maxAmount: 10 },
    ],
    // 재생
    [{ type: 'status', target: 'self', minAmount: 2, maxAmount: 6, statusType: 'regen' }],
    // 대량 방어
    [{ type: 'block', target: 'self', minAmount: 12, maxAmount: 25 }],
    // 전체 약화
    [{ type: 'status', target: 'all_enemies', minAmount: 1, maxAmount: 2, statusType: 'weak' }],
  ],
  power: [
    // 힘 증가
    [{ type: 'status', target: 'self', minAmount: 1, maxAmount: 4, statusType: 'strength' }],
    // 힘 + 방어
    [
      { type: 'status', target: 'self', minAmount: 1, maxAmount: 3, statusType: 'strength' },
      { type: 'block', target: 'self', minAmount: 5, maxAmount: 12 },
    ],
    // 재생
    [{ type: 'status', target: 'self', minAmount: 3, maxAmount: 8, statusType: 'regen' }],
  ],
};

// 희귀도별 수치 보정
const RARITY_MULTIPLIERS: { [key in CardRarity]: number } = {
  common: 1.0,
  uncommon: 1.3,
  rare: 1.6,
};

// 희귀도별 코스트 범위
const COST_RANGES: { [key in CardRarity]: [number, number] } = {
  common: [0, 2],
  uncommon: [1, 2],
  rare: [2, 3],
};

// 랜덤 범위 숫자 생성
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 랜덤 배열 요소 선택
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 효과 설명 생성
function generateEffectDescription(effect: CardEffect): string {
  switch (effect.type) {
    case 'damage':
      if (effect.target === 'all_enemies') {
        return `모든 적에게 ${effect.amount}의 피해`;
      }
      return `${effect.amount}의 피해`;
    case 'block':
      return `${effect.amount}의 방어도`;
    case 'draw':
      return `카드 ${effect.amount}장 드로우`;
    case 'status':
      const statusNames: { [key: string]: string } = {
        strength: '힘',
        weak: '약화',
        vulnerable: '취약',
        burn: '화상',
        poison: '독',
        freeze: '빙결',
        regen: '재생',
      };
      const statusName = statusNames[effect.statusType || 'strength'];
      if (effect.target === 'self') {
        return `${statusName} ${effect.amount} 획득`;
      } else if (effect.target === 'all_enemies') {
        return `모든 적에게 ${statusName} ${effect.amount} 부여`;
      }
      return `${statusName} ${effect.amount} 부여`;
    default:
      return '';
  }
}

// AI 카드 생성 함수
export function generateAICard(
  preferredType?: CardType,
  preferredRarity?: CardRarity
): Card {
  // 타입 결정
  const type: CardType = preferredType ||
    randomChoice<CardType>(['attack', 'attack', 'skill', 'skill', 'power']);

  // 희귀도 결정 (확률 기반)
  let rarity: CardRarity;
  if (preferredRarity) {
    rarity = preferredRarity;
  } else {
    const roll = Math.random();
    if (roll < 0.55) rarity = 'common';
    else if (roll < 0.85) rarity = 'uncommon';
    else rarity = 'rare';
  }

  // 이름 생성
  const prefix = randomChoice(CARD_NAME_PREFIXES[type]);
  const suffix = randomChoice(CARD_NAME_SUFFIXES[type]);
  const name = `${prefix} ${suffix}`;

  // 효과 템플릿 선택 및 생성
  const template = randomChoice(EFFECT_TEMPLATES[type]);
  const multiplier = RARITY_MULTIPLIERS[rarity];

  const effects: CardEffect[] = template.map(t => ({
    type: t.type,
    target: t.target,
    amount: Math.round(randomInRange(t.minAmount, t.maxAmount) * multiplier),
    statusType: t.statusType,
  }));

  // 코스트 결정
  const [minCost, maxCost] = COST_RANGES[rarity];
  const cost = randomInRange(minCost, maxCost);

  // 설명 생성
  const descriptions = effects.map(generateEffectDescription);
  const description = descriptions.join('. ') + '.';

  return {
    id: generateCardId(),
    name,
    description,
    type,
    rarity,
    cost,
    effects,
  };
}

// 프롬프트 기반 카드 생성 (고급)
export function generateAICardWithPrompt(prompt: string): Card {
  // 프롬프트에서 키워드 추출
  const attackKeywords = ['공격', '피해', '타격', '베기', '파괴'];
  const skillKeywords = ['방어', '수비', '회복', '치유', '은신'];
  const powerKeywords = ['강화', '버프', '힘', '능력', '영구'];

  let preferredType: CardType | undefined;
  let preferredRarity: CardRarity | undefined;

  // 타입 추론
  if (attackKeywords.some(k => prompt.includes(k))) {
    preferredType = 'attack';
  } else if (skillKeywords.some(k => prompt.includes(k))) {
    preferredType = 'skill';
  } else if (powerKeywords.some(k => prompt.includes(k))) {
    preferredType = 'power';
  }

  // 희귀도 추론
  if (prompt.includes('강력') || prompt.includes('전설') || prompt.includes('최강')) {
    preferredRarity = 'rare';
  } else if (prompt.includes('고급') || prompt.includes('특별')) {
    preferredRarity = 'uncommon';
  }

  return generateAICard(preferredType, preferredRarity);
}

// 여러 AI 카드 생성
export function generateMultipleAICards(count: number): Card[] {
  return Array.from({ length: count }, () => generateAICard());
}
