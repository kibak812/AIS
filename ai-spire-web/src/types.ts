// Game Types for AI Spire

export type StatusEffectType =
  | 'strength'
  | 'weak'
  | 'vulnerable'
  | 'block'
  | 'burn'
  | 'poison'
  | 'freeze'
  | 'regen';

export interface StatusEffect {
  type: StatusEffectType;
  amount: number;
}

export interface Entity {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  statusEffects: StatusEffect[];
}

export interface Player extends Entity {
  energy: number;
  maxEnergy: number;
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  drawPile: Card[];
  relics: Relic[];
}

export interface Enemy extends Entity {
  intent: EnemyIntent;
  damage: number;
}

export interface EnemyIntent {
  type: 'attack' | 'defend' | 'buff' | 'debuff';
  amount: number;
}

export type CardType = 'attack' | 'skill' | 'power';
export type CardRarity = 'common' | 'uncommon' | 'rare';

export interface CardEffect {
  type: 'damage' | 'block' | 'draw' | 'energy' | 'status';
  target: 'enemy' | 'self' | 'all_enemies';
  amount: number;
  statusType?: StatusEffectType;
}

export interface Card {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: CardRarity;
  cost: number;
  effects: CardEffect[];
}

export interface Relic {
  id: string;
  name: string;
  description: string;
}

export type GamePhase = 'combat' | 'reward' | 'event' | 'rest' | 'shop' | 'deckManagement';

export interface GameState {
  player: Player;
  enemies: Enemy[];
  phase: GamePhase;
  floor: number;
  turnCount: number;
  rewardCards?: Card[];
  aiGeneratedCard?: Card;
}

// AI 카드 생성 관련 타입
export interface AICardGenerationRequest {
  prompt: string;
  preferredType?: CardType;
  preferredRarity?: CardRarity;
}

export interface AICardGenerationResult {
  card: Card;
  description: string;
}
