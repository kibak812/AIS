import type {
  GameState,
  Player,
  Card,
  CardEffect,
  Entity,
} from './types';
import { STARTER_DECK, generateCardId } from './cards';
import { createEnemyGroup, generateEnemyIntent } from './enemies';

export function createInitialGameState(): GameState {
  const deck = STARTER_DECK.map((card) => ({
    ...card,
    id: generateCardId(),
  }));

  const player: Player = {
    id: 'player',
    name: 'Player',
    maxHp: 80,
    currentHp: 80,
    energy: 3,
    maxEnergy: 3,
    statusEffects: [],
    deck: [...deck],
    hand: [],
    discardPile: [],
    drawPile: shuffleDeck([...deck]),
    relics: [],
  };

  const enemies = createEnemyGroup(1);

  let initialState: GameState = {
    player,
    enemies,
    phase: 'combat',
    floor: 1,
    turnCount: 0,
  };

  // Draw initial hand
  initialState = drawCards(initialState, 5);

  return initialState;
}

export function shuffleDeck(cards: Card[]): Card[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function drawCards(state: GameState, count: number): GameState {
  const newState = { ...state };
  let player = { ...newState.player };
  let drawPile = [...player.drawPile];
  let discardPile = [...player.discardPile];
  let hand = [...player.hand];

  for (let i = 0; i < count; i++) {
    if (drawPile.length === 0) {
      if (discardPile.length === 0) {
        break;
      }
      drawPile = shuffleDeck(discardPile);
      discardPile = [];
    }

    if (drawPile.length > 0) {
      const card = drawPile[0];
      drawPile = drawPile.slice(1);
      hand = [...hand, card];
    }
  }

  player = {
    ...player,
    hand,
    drawPile,
    discardPile,
  };

  newState.player = player;
  return newState;
}

export function startTurn(state: GameState): GameState {
  let newState = { ...state };
  newState.turnCount += 1;

  const player = { ...newState.player };
  player.energy = player.maxEnergy;

  const blockEffect = player.statusEffects.find((e) => e.type === 'block');
  if (blockEffect) {
    player.statusEffects = player.statusEffects.filter((e) => e.type !== 'block');
  }

  newState.player = player;
  newState = drawCards(newState, 5);

  return newState;
}

function getStatusEffectValue(entity: Entity, type: string): number {
  const effect = entity.statusEffects.find((e) => e.type === type);
  return effect ? effect.amount : 0;
}

function applyStatusEffect<T extends Entity>(entity: T, type: string, amount: number): T {
  const newEntity = { ...entity };
  const existingEffect = newEntity.statusEffects.find((e) => e.type === type);

  if (existingEffect) {
    existingEffect.amount += amount;
    if (existingEffect.amount <= 0) {
      newEntity.statusEffects = newEntity.statusEffects.filter((e) => e.type !== type);
    }
  } else if (amount > 0) {
    newEntity.statusEffects = [
      ...newEntity.statusEffects,
      { type: type as any, amount },
    ];
  }

  return newEntity;
}

function dealDamage<T extends Entity>(attacker: Entity, target: T, baseDamage: number): T {
  let damage = baseDamage;

  const strength = getStatusEffectValue(attacker, 'strength');
  damage += strength;

  const weak = getStatusEffectValue(attacker, 'weak');
  if (weak > 0) {
    damage = Math.floor(damage * 0.75);
  }

  const vulnerable = getStatusEffectValue(target, 'vulnerable');
  if (vulnerable > 0) {
    damage = Math.floor(damage * 1.5);
  }

  const block = getStatusEffectValue(target, 'block');
  if (block > 0) {
    const blockUsed = Math.min(block, damage);
    damage -= blockUsed;
    const newTarget = applyStatusEffect(target, 'block', -blockUsed);
    target = newTarget;
  }

  const newTarget = { ...target };
  newTarget.currentHp = Math.max(0, newTarget.currentHp - damage);
  newTarget.statusEffects = target.statusEffects;

  return newTarget;
}

export function playCard(
  state: GameState,
  cardId: string,
  targetEnemyId?: string
): GameState {
  const card = state.player.hand.find((c) => c.id === cardId);
  if (!card || state.player.energy < card.cost) {
    return state;
  }

  let newState = { ...state };
  let player = { ...newState.player };

  player.energy -= card.cost;
  player.hand = player.hand.filter((c) => c.id !== cardId);
  player.discardPile = [...player.discardPile, card];

  for (const effect of card.effects) {
    newState = applyCardEffect(newState, effect, targetEnemyId);
  }

  player = newState.player;
  newState.player = player;

  newState.enemies = newState.enemies.filter((e) => e.currentHp > 0);

  return newState;
}

function applyCardEffect(
  state: GameState,
  effect: CardEffect,
  targetEnemyId?: string
): GameState {
  const newState = { ...state };
  let player = { ...newState.player };

  switch (effect.type) {
    case 'damage':
      if (effect.target === 'enemy' && targetEnemyId) {
        const enemyIndex = newState.enemies.findIndex(
          (e) => e.id === targetEnemyId
        );
        if (enemyIndex !== -1) {
          newState.enemies[enemyIndex] = dealDamage(
            player,
            newState.enemies[enemyIndex],
            effect.amount
          );
        }
      } else if (effect.target === 'all_enemies') {
        newState.enemies = newState.enemies.map((enemy) =>
          dealDamage(player, enemy, effect.amount)
        );
      }
      break;

    case 'block':
      if (effect.target === 'self') {
        player = applyStatusEffect(player, 'block', effect.amount);
      }
      break;

    case 'draw':
      if (effect.target === 'self') {
        const drawnState = drawCards(newState, effect.amount);
        player = drawnState.player;
      }
      break;

    case 'status':
      if (effect.statusType) {
        if (effect.target === 'self') {
          player = applyStatusEffect(player, effect.statusType, effect.amount);
        } else if (effect.target === 'enemy' && targetEnemyId) {
          const enemyIndex = newState.enemies.findIndex(
            (e) => e.id === targetEnemyId
          );
          if (enemyIndex !== -1) {
            newState.enemies[enemyIndex] = applyStatusEffect(
              newState.enemies[enemyIndex],
              effect.statusType,
              effect.amount
            );
          }
        } else if (effect.target === 'all_enemies') {
          newState.enemies = newState.enemies.map((enemy) =>
            applyStatusEffect(enemy, effect.statusType!, effect.amount)
          );
        }
      }
      break;
  }

  newState.player = player;
  return newState;
}

export function endTurn(state: GameState): GameState {
  let newState = { ...state };

  let player = { ...newState.player };
  player.discardPile = [...player.discardPile, ...player.hand];
  player.hand = [];
  newState.player = player;

  newState = executeEnemyTurns(newState);

  newState = applyEndOfTurnEffects(newState);

  if (newState.enemies.length > 0 && newState.player.currentHp > 0) {
    newState = startTurn(newState);
  } else if (newState.enemies.length === 0) {
    newState.phase = 'reward';
  }

  return newState;
}

function executeEnemyTurns(state: GameState): GameState {
  let newState = { ...state };

  for (let i = 0; i < newState.enemies.length; i++) {
    const enemy = newState.enemies[i];
    const intent = enemy.intent;

    switch (intent.type) {
      case 'attack':
        newState.player = dealDamage(enemy, newState.player, intent.amount);
        break;

      case 'defend':
        newState.enemies[i] = applyStatusEffect(
          newState.enemies[i],
          'block',
          intent.amount
        );
        break;

      case 'buff':
        newState.enemies[i] = applyStatusEffect(
          newState.enemies[i],
          'strength',
          intent.amount
        );
        break;

      case 'debuff':
        newState.player = applyStatusEffect(
          newState.player,
          'weak',
          intent.amount
        );
        break;
    }

    newState.enemies[i].intent = generateEnemyIntent(newState.enemies[i]);
  }

  return newState;
}

function applyEndOfTurnEffects(state: GameState): GameState {
  let newState = { ...state };

  const poison = getStatusEffectValue(newState.player, 'poison');
  if (poison > 0) {
    newState.player.currentHp = Math.max(0, newState.player.currentHp - poison);
  }

  const regen = getStatusEffectValue(newState.player, 'regen');
  if (regen > 0) {
    newState.player.currentHp = Math.min(
      newState.player.maxHp,
      newState.player.currentHp + regen
    );
  }

  newState.enemies = newState.enemies.map((enemy) => {
    let newEnemy = { ...enemy };
    const enemyPoison = getStatusEffectValue(newEnemy, 'poison');
    if (enemyPoison > 0) {
      newEnemy.currentHp = Math.max(0, newEnemy.currentHp - enemyPoison);
    }
    return newEnemy;
  });

  return newState;
}

export function addCardToDeck(state: GameState, card: Card): GameState {
  const newState = { ...state };
  const player = { ...newState.player };

  player.deck = [...player.deck, card];
  player.drawPile = [...player.drawPile, card];

  newState.player = player;
  return newState;
}

export function startNextFloor(state: GameState): GameState {
  let newState = { ...state };
  newState.floor += 1;
  newState.enemies = createEnemyGroup(newState.floor);
  newState.phase = 'combat';
  newState.turnCount = 0;

  let player = { ...newState.player };
  player.hand = [];
  player.discardPile = [];
  player.drawPile = shuffleDeck([...player.deck]);
  player.energy = player.maxEnergy;
  player.statusEffects = [];

  newState.player = player;
  newState = drawCards(newState, 5);

  return newState;
}
