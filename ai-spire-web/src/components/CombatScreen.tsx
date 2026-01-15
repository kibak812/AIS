import type { GameState } from '../types';
import './CombatScreen.css';
import PlayerInfo from './PlayerInfo';
import EnemyArea from './EnemyArea';
import HandArea from './HandArea';

interface CombatScreenProps {
  gameState: GameState;
  selectedCardId: string | null;
  selectedEnemyId: string | null;
  onSelectCard: (cardId: string) => void;
  onSelectEnemy: (enemyId: string) => void;
  onEndTurn: () => void;
}

function CombatScreen({
  gameState,
  selectedCardId,
  selectedEnemyId,
  onSelectCard,
  onSelectEnemy,
  onEndTurn,
}: CombatScreenProps) {
  return (
    <div className="combat-screen">
      <div className="combat-header">
        <div className="floor-info">{gameState.floor}층</div>
        <PlayerInfo player={gameState.player} />
      </div>

      <EnemyArea
        enemies={gameState.enemies}
        selectedEnemyId={selectedEnemyId}
        onSelectEnemy={onSelectEnemy}
      />

      <div className="combat-footer">
        <button className="end-turn-button" onClick={onEndTurn}>
          턴 종료
        </button>
      </div>

      <HandArea
        hand={gameState.player.hand}
        energy={gameState.player.energy}
        selectedCardId={selectedCardId}
        onSelectCard={onSelectCard}
      />
    </div>
  );
}

export default CombatScreen;
