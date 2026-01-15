import { useState } from 'react';
import './App.css';
import type { GameState } from './types';
import { createInitialGameState, playCard, endTurn, startNextFloor } from './gameEngine';
import { getRandomCards } from './cards';
import CombatScreen from './components/CombatScreen';
import RewardScreen from './components/RewardScreen';

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

  const handlePlayCard = (cardId: string, targetEnemyId?: string) => {
    const newState = playCard(gameState, cardId, targetEnemyId);
    setGameState(newState);
    setSelectedCardId(null);
    setSelectedEnemyId(null);
  };

  const handleEndTurn = () => {
    const newState = endTurn(gameState);
    if (newState.phase === 'reward') {
      const rewardCards = getRandomCards(3);
      setGameState({ ...newState, rewardCards });
    } else {
      setGameState(newState);
    }
  };

  const handleSelectCard = (cardId: string) => {
    if (selectedCardId === cardId) {
      setSelectedCardId(null);
      return;
    }

    const card = gameState.player.hand.find((c) => c.id === cardId);
    if (!card) return;

    // Check if card needs a target
    const needsTarget = card.effects.some(
      (effect) => effect.target === 'enemy'
    );

    if (needsTarget && gameState.enemies.length > 0) {
      // Select card and wait for enemy selection
      setSelectedCardId(cardId);
    } else {
      // Play card immediately (AOE or self-target)
      handlePlayCard(cardId, gameState.enemies[0]?.id);
    }
  };

  const handleSelectEnemy = (enemyId: string) => {
    if (selectedCardId) {
      handlePlayCard(selectedCardId, enemyId);
    } else {
      setSelectedEnemyId(enemyId === selectedEnemyId ? null : enemyId);
    }
  };

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
