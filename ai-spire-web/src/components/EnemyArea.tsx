import type { Enemy } from '../types';
import './EnemyArea.css';

interface EnemyAreaProps {
  enemies: Enemy[];
  selectedEnemyId: string | null;
  onSelectEnemy: (enemyId: string) => void;
}

function EnemyArea({ enemies, selectedEnemyId, onSelectEnemy }: EnemyAreaProps) {
  const getIntentIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      attack: '⚔️',
      defend: '🛡️',
      buff: '💪',
      debuff: '😰',
    };
    return icons[type] || '❓';
  };

  const getStatusIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      strength: '💪',
      weak: '😰',
      vulnerable: '🛡️',
      block: '🛡️',
      burn: '🔥',
      poison: '☠️',
      freeze: '❄️',
      regen: '💚',
    };
    return icons[type] || '✨';
  };

  return (
    <div className="enemy-area">
      {enemies.map((enemy) => {
        const hpPercentage = (enemy.currentHp / enemy.maxHp) * 100;
        const isSelected = enemy.id === selectedEnemyId;

        return (
          <div
            key={enemy.id}
            className={`enemy-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectEnemy(enemy.id)}
          >
            <div className="enemy-intent">
              <span className="intent-icon">{getIntentIcon(enemy.intent.type)}</span>
              <span className="intent-amount">{enemy.intent.amount}</span>
            </div>

            <div className="enemy-sprite">👾</div>

            <div className="enemy-name">{enemy.name}</div>

            <div className="enemy-health-bar">
              <div
                className="enemy-health-fill"
                style={{ width: `${hpPercentage}%` }}
              />
              <div className="enemy-health-text">
                {enemy.currentHp} / {enemy.maxHp}
              </div>
            </div>

            {enemy.statusEffects.length > 0 && (
              <div className="enemy-status-effects">
                {enemy.statusEffects.map((effect, index) => (
                  <div key={index} className="enemy-status-effect">
                    <span>{getStatusIcon(effect.type)}</span>
                    <span className="status-amount">{effect.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default EnemyArea;
