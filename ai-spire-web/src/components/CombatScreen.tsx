import type { GameState } from '../types';
import './CombatScreen.css';
import PlayerInfo from './PlayerInfo';
import EnemyArea from './EnemyArea';
import HandArea from './HandArea';

interface CombatEffect {
  id: string;
  type: 'damage' | 'block' | 'heal';
  amount: number;
  targetId: string;
  x: number;
  y: number;
}

interface CombatScreenProps {
  gameState: GameState;
  selectedCardId: string | null;
  selectedEnemyId: string | null;
  combatEffects: CombatEffect[];
  isAnimating: boolean;
  onSelectCard: (cardId: string) => void;
  onSelectEnemy: (enemyId: string) => void;
  onEndTurn: () => void;
}

function CombatScreen({
  gameState,
  selectedCardId,
  selectedEnemyId,
  combatEffects,
  isAnimating,
  onSelectCard,
  onSelectEnemy,
  onEndTurn,
}: CombatScreenProps) {
  return (
    <div className="combat-screen">
      {/* 배경 레이어 */}
      <div className="combat-background">
        <div className="bg-gradient" />
        <div className="bg-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }} />
          ))}
        </div>
        <div className="bg-vignette" />
      </div>

      {/* 전투 이펙트 */}
      <div className="combat-effects-layer">
        {combatEffects.map(effect => (
          <div
            key={effect.id}
            className={`combat-effect effect-${effect.type}`}
            style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
          >
            {effect.type === 'damage' && <span className="effect-icon">💥</span>}
            {effect.type === 'block' && <span className="effect-icon">🛡️</span>}
            {effect.type === 'heal' && <span className="effect-icon">💚</span>}
            <span className="effect-amount">
              {effect.type === 'damage' ? '-' : '+'}
              {effect.amount}
            </span>
          </div>
        ))}
      </div>

      {/* 상단 헤더 */}
      <div className="combat-header">
        <div className="floor-info">
          <span className="floor-icon">🏰</span>
          <span className="floor-number">{gameState.floor}층</span>
        </div>
        <PlayerInfo player={gameState.player} />
      </div>

      {/* 적 영역 */}
      <EnemyArea
        enemies={gameState.enemies}
        selectedEnemyId={selectedEnemyId}
        onSelectEnemy={onSelectEnemy}
        hasSelectedCard={!!selectedCardId}
      />

      {/* 하단 컨트롤 */}
      <div className="combat-footer">
        <div className="deck-info">
          <div className="deck-pile draw-pile">
            <span className="pile-icon">📚</span>
            <span className="pile-count">{gameState.player.drawPile.length}</span>
          </div>
          <div className="deck-pile discard-pile">
            <span className="pile-icon">🗑️</span>
            <span className="pile-count">{gameState.player.discardPile.length}</span>
          </div>
        </div>
        <button
          className={`end-turn-button ${isAnimating ? 'disabled' : ''}`}
          onClick={onEndTurn}
          disabled={isAnimating}
        >
          <span className="btn-text">턴 종료</span>
          <span className="btn-icon">⏭️</span>
        </button>
      </div>

      {/* 카드 선택 안내 */}
      {selectedCardId && (
        <div className="target-hint">
          <span>🎯 적을 선택하세요</span>
        </div>
      )}

      {/* 핸드 영역 */}
      <HandArea
        hand={gameState.player.hand}
        energy={gameState.player.energy}
        maxEnergy={gameState.player.maxEnergy}
        selectedCardId={selectedCardId}
        onSelectCard={onSelectCard}
        disabled={isAnimating}
      />
    </div>
  );
}

export default CombatScreen;
