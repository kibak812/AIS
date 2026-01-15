import { useState, useCallback } from 'react';
import './App.css';
import type { GameState, Card } from './types';
import { createInitialGameState, playCard, endTurn, startNextFloor, addCardToDeck } from './gameEngine';
import { getRandomCards, generateCardId } from './cards';
import CombatScreen from './components/CombatScreen';
import RewardScreen from './components/RewardScreen';
import DeckManagementScreen from './components/DeckManagementScreen';

interface CombatEffect {
  id: string;
  type: 'damage' | 'block' | 'heal' | 'blocked' | 'actual_damage';
  amount: number;
  targetId: string;
  x: number;
  y: number;
  blockedAmount?: number; // 방어력으로 막은 피해
}

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialState = createInitialGameState();
    return {
      ...initialState,
      rewardCards: [],
    };
  });
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedEnemyId, setSelectedEnemyId] = useState<string | null>(null);
  const [combatEffects, setCombatEffects] = useState<CombatEffect[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hitEnemyId, setHitEnemyId] = useState<string | null>(null);
  const [attackingEnemyId, setAttackingEnemyId] = useState<string | null>(null);
  const [playerHit, setPlayerHit] = useState(false);

  const showCombatEffect = useCallback((type: CombatEffect['type'], amount: number, targetId: string, x?: number, y?: number) => {
    const effect: CombatEffect = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      amount,
      targetId,
      x: x ?? (50 + Math.random() * 20 - 10),
      y: y ?? (30 + Math.random() * 10),
    };
    setCombatEffects(prev => [...prev, effect]);
    setTimeout(() => {
      setCombatEffects(prev => prev.filter(e => e.id !== effect.id));
    }, 800);
  }, []);

  const handlePlayCard = useCallback((cardId: string, targetEnemyId?: string) => {
    if (isAnimating) return;

    const card = gameState.player.hand.find((c) => c.id === cardId);
    if (!card) return;

    setIsAnimating(true);

    if (targetEnemyId) {
      setHitEnemyId(targetEnemyId);
      setTimeout(() => setHitEnemyId(null), 200);
    }

    card.effects.forEach(effect => {
      if (effect.type === 'damage' && targetEnemyId) {
        showCombatEffect('damage', effect.amount, targetEnemyId, 50 + Math.random() * 10 - 5, 35);
      } else if (effect.type === 'damage' && effect.target === 'all_enemies') {
        gameState.enemies.forEach((enemy, i) => {
          setTimeout(() => {
            showCombatEffect('damage', effect.amount, enemy.id, 30 + i * 25, 35);
          }, i * 100);
        });
      } else if (effect.type === 'block') {
        showCombatEffect('block', effect.amount, 'player', 50, 72);
      }
    });

    setTimeout(() => {
      const newState = playCard(gameState, cardId, targetEnemyId);
      setGameState(newState);
      setSelectedCardId(null);
      setSelectedEnemyId(null);
      setIsAnimating(false);
    }, 250);
  }, [gameState, isAnimating, showCombatEffect]);

  const handleEndTurn = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);

    // 현재 플레이어 방어력 추적
    let currentBlock = gameState.player.statusEffects.find(e => e.type === 'block')?.amount || 0;

    const attackingEnemies = gameState.enemies.filter(e => e.intent.type === 'attack');
    attackingEnemies.forEach((enemy, i) => {
      setTimeout(() => {
        setAttackingEnemyId(enemy.id);
        setTimeout(() => {
          setAttackingEnemyId(null);
          setPlayerHit(true);

          const incomingDamage = enemy.intent.amount;
          const blockedAmount = Math.min(currentBlock, incomingDamage);
          const actualDamage = incomingDamage - blockedAmount;
          currentBlock = Math.max(0, currentBlock - blockedAmount);

          // 방어로 막은 양 표시 (있을 경우)
          if (blockedAmount > 0) {
            showCombatEffect('blocked', blockedAmount, 'player', 40, 72);
          }
          // 실제 받은 피해 표시
          if (actualDamage > 0) {
            setTimeout(() => {
              showCombatEffect('actual_damage', actualDamage, 'player', 60, 72);
            }, 150);
          } else if (blockedAmount > 0 && actualDamage === 0) {
            // 완전 방어 시
            setTimeout(() => {
              showCombatEffect('block', 0, 'player', 50, 72);
            }, 150);
          }

          setTimeout(() => setPlayerHit(false), 200);
        }, 200);
      }, i * 500);
    });

    const totalDelay = Math.max(300, attackingEnemies.length * 500 + 300);

    setTimeout(() => {
      const newState = endTurn(gameState);
      if (newState.phase === 'reward') {
        const rewardCards = getRandomCards(3);
        setGameState({ ...newState, rewardCards });
      } else {
        setGameState(newState);
      }
      setIsAnimating(false);
    }, totalDelay);
  }, [gameState, isAnimating, showCombatEffect]);

  const handleSelectCard = useCallback((cardId: string) => {
    if (isAnimating) return;

    if (selectedCardId === cardId) {
      setSelectedCardId(null);
      return;
    }

    const card = gameState.player.hand.find((c) => c.id === cardId);
    if (!card || gameState.player.energy < card.cost) return;

    const needsTarget = card.effects.some(
      (effect) => effect.target === 'enemy'
    );

    if (needsTarget && gameState.enemies.length > 1) {
      setSelectedCardId(cardId);
    } else if (needsTarget && gameState.enemies.length === 1) {
      handlePlayCard(cardId, gameState.enemies[0].id);
    } else {
      handlePlayCard(cardId, gameState.enemies[0]?.id);
    }
  }, [gameState, selectedCardId, isAnimating, handlePlayCard]);

  const handleSelectEnemy = useCallback((enemyId: string) => {
    if (isAnimating) return;

    if (selectedCardId) {
      handlePlayCard(selectedCardId, enemyId);
    } else {
      setSelectedEnemyId(enemyId === selectedEnemyId ? null : enemyId);
    }
  }, [selectedCardId, selectedEnemyId, isAnimating, handlePlayCard]);

  const handleRewardSelect = (cardId: string) => {
    if (!gameState.rewardCards) return;

    const card = gameState.rewardCards.find((c) => c.id === cardId);
    if (!card) return;

    let newState = { ...gameState };
    newState.player = {
      ...newState.player,
      deck: [...newState.player.deck, card],
    };
    newState = startNextFloor(newState);
    setGameState(newState);
  };

  const handleSkipReward = () => {
    const newState = startNextFloor(gameState);
    setGameState(newState);
  };

  const handleOpenDeckManagement = () => {
    if (gameState.deckManagementUsedThisFloor) {
      return;
    }
    setGameState(prev => ({
      ...prev,
      phase: 'deckManagement',
      deckManagementUsedThisFloor: true
    }));
  };

  const handleRemoveCard = (cardId: string, hpCost: number) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        currentHp: Math.max(1, prev.player.currentHp - hpCost),
        deck: prev.player.deck.filter(c => c.id !== cardId),
        drawPile: prev.player.drawPile.filter(c => c.id !== cardId),
        discardPile: prev.player.discardPile.filter(c => c.id !== cardId),
      },
      cardsRemovedThisFloor: prev.cardsRemovedThisFloor + 1,
    }));
  };

  const handleAddAICard = (card: Card, hpCost: number) => {
    const newCard = { ...card, id: generateCardId() };
    setGameState(prev => {
      const updated = addCardToDeck(prev, newCard);
      return {
        ...updated,
        player: {
          ...updated.player,
          currentHp: Math.max(1, updated.player.currentHp - hpCost),
        },
        aiCardsGeneratedThisFloor: prev.aiCardsGeneratedThisFloor + 1,
      };
    });
  };

  const handleCompleteDeckManagement = () => {
    setGameState(prev => ({ ...prev, phase: 'combat' }));
  };

  if (gameState.player.currentHp <= 0) {
    return (
      <div className="game-over-screen">
        <div className="game-over-bg" />
        <div className="game-over-content">
          <div className="skull-icon">💀</div>
          <h1 className="game-over-title">패배</h1>
          <div className="game-over-stats">
            <div className="stat-item">
              <span className="stat-label">도달 층</span>
              <span className="stat-value">{gameState.floor}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">덱 크기</span>
              <span className="stat-value">{gameState.player.deck.length}</span>
            </div>
          </div>
          <button
            className="restart-button"
            onClick={() => {
              const newState = createInitialGameState();
              setGameState({ ...newState, rewardCards: [] });
            }}
          >
            <span>다시 도전</span>
            <span className="restart-icon">⚔️</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {gameState.phase === 'combat' ? (
        <CombatScreen
          gameState={gameState}
          selectedCardId={selectedCardId}
          selectedEnemyId={selectedEnemyId}
          combatEffects={combatEffects}
          isAnimating={isAnimating}
          hitEnemyId={hitEnemyId}
          attackingEnemyId={attackingEnemyId}
          playerHit={playerHit}
          onSelectCard={handleSelectCard}
          onSelectEnemy={handleSelectEnemy}
          onEndTurn={handleEndTurn}
          onOpenDeckManagement={handleOpenDeckManagement}
          deckManagementUsed={gameState.deckManagementUsedThisFloor}
        />
      ) : gameState.phase === 'reward' ? (
        <RewardScreen
          cards={gameState.rewardCards || []}
          onSelectCard={handleRewardSelect}
          onSkip={handleSkipReward}
        />
      ) : gameState.phase === 'deckManagement' ? (
        <DeckManagementScreen
          deck={gameState.player.deck}
          playerHp={gameState.player.currentHp}
          cardsRemovedThisFloor={gameState.cardsRemovedThisFloor}
          aiCardsGeneratedThisFloor={gameState.aiCardsGeneratedThisFloor}
          onRemoveCard={handleRemoveCard}
          onAddAICard={handleAddAICard}
          onComplete={handleCompleteDeckManagement}
        />
      ) : null}
    </div>
  );
}

export default App;
