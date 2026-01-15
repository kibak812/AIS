import { useState, useCallback } from 'react';
import './App.css';
import type { GameState } from './types';
import { createInitialGameState, playCard, endTurn, startNextFloor } from './gameEngine';
import { getRandomCards } from './cards';
import CombatScreen from './components/CombatScreen';
import RewardScreen from './components/RewardScreen';

interface CombatEffect {
  id: string;
  type: 'damage' | 'block' | 'heal';
  amount: number;
  targetId: string;
  x: number;
  y: number;
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

  const showCombatEffect = useCallback((type: CombatEffect['type'], amount: number, targetId: string) => {
    const effect: CombatEffect = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      amount,
      targetId,
      x: 50 + Math.random() * 20 - 10,
      y: 30 + Math.random() * 10,
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

    // 이펙트 표시
    card.effects.forEach(effect => {
      if (effect.type === 'damage' && targetEnemyId) {
        showCombatEffect('damage', effect.amount, targetEnemyId);
      } else if (effect.type === 'block') {
        showCombatEffect('block', effect.amount, 'player');
      }
    });

    // 약간의 딜레이 후 상태 업데이트
    setTimeout(() => {
      const newState = playCard(gameState, cardId, targetEnemyId);
      setGameState(newState);
      setSelectedCardId(null);
      setSelectedEnemyId(null);
      setIsAnimating(false);
    }, 150);
  }, [gameState, isAnimating, showCombatEffect]);

  const handleEndTurn = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    setTimeout(() => {
      const newState = endTurn(gameState);
      if (newState.phase === 'reward') {
        const rewardCards = getRandomCards(3);
        setGameState({ ...newState, rewardCards });
      } else {
        setGameState(newState);
      }
      setIsAnimating(false);
    }, 200);
  }, [gameState, isAnimating]);

  const handleSelectCard = useCallback((cardId: string) => {
    if (isAnimating) return;

    if (selectedCardId === cardId) {
      setSelectedCardId(null);
      return;
    }

    const card = gameState.player.hand.find((c) => c.id === cardId);
    if (!card || gameState.player.energy < card.cost) return;

    // 타겟이 필요한 카드인지 확인
    const needsTarget = card.effects.some(
      (effect) => effect.target === 'enemy'
    );

    if (needsTarget && gameState.enemies.length > 1) {
      // 적이 여러 마리면 선택 대기
      setSelectedCardId(cardId);
    } else if (needsTarget && gameState.enemies.length === 1) {
      // 적이 한 마리면 즉시 사용
      handlePlayCard(cardId, gameState.enemies[0].id);
    } else {
      // 자신 대상 또는 전체 대상 카드는 즉시 사용
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

  if (gameState.player.currentHp <= 0) {
    return (
      <div className="game-over">
        <h1>게임 오버</h1>
        <p>{gameState.floor}층까지 도달했습니다</p>
        <button
          onClick={() => {
            const newState = createInitialGameState();
            setGameState({ ...newState, rewardCards: [] });
          }}
        >
          다시 시작
        </button>
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
          onSelectCard={handleSelectCard}
          onSelectEnemy={handleSelectEnemy}
          onEndTurn={handleEndTurn}
        />
      ) : gameState.phase === 'reward' ? (
        <RewardScreen
          cards={gameState.rewardCards || []}
          onSelectCard={handleRewardSelect}
          onSkip={handleSkipReward}
        />
      ) : null}
    </div>
  );
}

export default App;
