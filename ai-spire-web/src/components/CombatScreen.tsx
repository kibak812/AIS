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
  hitEnemyId: string | null;
  attackingEnemyId: string | null;
  playerHit: boolean;
  onSelectCard: (cardId: string) => void;
  onSelectEnemy: (enemyId: string) => void;
  onEndTurn: () => void;
  onOpenDeckManagement: () => void;
}

function CombatScreen({
  gameState,
  selectedCardId,
  selectedEnemyId,
  combatEffects,
  isAnimating,
  hitEnemyId,
  attackingEnemyId,
  playerHit,
  onSelectCard,
  onSelectEnemy,
  onEndTurn,
  onOpenDeckManagement,
}: CombatScreenProps) {
  return (
    <div className="combat-screen">
      {/* 배경 레이어 */}
      <div className="combat-background">
        <div className="bg-gradient" />
        <div className="bg-pattern" />
        <div className="bg-particles">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              '--particle-size': `${2 + Math.random() * 4}px`,
            } as React.CSSProperties} />
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
            <div className="effect-burst" />
            <span className="effect-amount">
              {effect.type === 'damage' ? '-' : '+'}
              {effect.amount}
            </span>
          </div>
        ))}
      </div>

      {/* 상단 헤더 */}
      <div className="combat-header">
        <div className="floor-badge">
          <div className="floor-glow" />
          <span className="floor-label">FLOOR</span>
          <span className="floor-number">{gameState.floor}</span>
        </div>
        <PlayerInfo player={gameState.player} isHit={playerHit} />
      </div>

      {/* 적 영역 */}
      <EnemyArea
        enemies={gameState.enemies}
        selectedEnemyId={selectedEnemyId}
        onSelectEnemy={onSelectEnemy}
        hasSelectedCard={!!selectedCardId}
        hitEnemyId={hitEnemyId}
        attackingEnemyId={attackingEnemyId}
      />

      {/* 하단 컨트롤 */}
      <div className="combat-footer">
        <div className="footer-left">
          <div className="deck-pile-group">
            <div className="deck-pile draw-pile" title="드로우 더미">
              <div className="pile-stack">
                <div className="pile-card" />
                <div className="pile-card" />
                <div className="pile-card" />
              </div>
              <span className="pile-count">{gameState.player.drawPile.length}</span>
            </div>
            <div className="deck-pile discard-pile" title="버린 카드 더미">
              <div className="pile-stack discarded">
                <div className="pile-card" />
              </div>
              <span className="pile-count">{gameState.player.discardPile.length}</span>
            </div>
          </div>
          <button
            className="deck-management-btn"
            onClick={onOpenDeckManagement}
            title="덱 정비"
          >
            <span className="dm-icon">⚙️</span>
          </button>
        </div>

        <button
          className={`end-turn-button ${isAnimating ? 'disabled' : ''}`}
          onClick={onEndTurn}
          disabled={isAnimating}
        >
          <span className="btn-glow" />
          <span className="btn-text">턴 종료</span>
          <span className="btn-icon">→</span>
        </button>
      </div>

      {/* 카드 선택 안내 */}
      {selectedCardId && (
        <div className="target-hint">
          <div className="hint-pulse" />
          <span className="hint-icon">🎯</span>
          <span className="hint-text">적을 선택하세요</span>
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
