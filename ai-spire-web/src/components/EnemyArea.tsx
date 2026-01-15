import type { Enemy } from '../types';
import './EnemyArea.css';

interface EnemyAreaProps {
  enemies: Enemy[];
  selectedEnemyId: string | null;
  onSelectEnemy: (enemyId: string) => void;
  hasSelectedCard: boolean;
}

function EnemyArea({ enemies, selectedEnemyId, onSelectEnemy, hasSelectedCard }: EnemyAreaProps) {
  const getIntentIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      attack: '⚔️',
      defend: '🛡️',
      buff: '💪',
      debuff: '😈',
    };
    return icons[type] || '❓';
  };

  const getIntentColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      attack: '#ff6b6b',
      defend: '#4ecdc4',
      buff: '#ffd700',
      debuff: '#a55eea',
    };
    return colors[type] || '#fff';
  };

  const getStatusIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      strength: '💪',
      weak: '😰',
      vulnerable: '💔',
      block: '🛡️',
      burn: '🔥',
      poison: '☠️',
      freeze: '❄️',
      regen: '💚',
    };
    return icons[type] || '✨';
  };

  const getEnemyEmoji = (name: string): string => {
    const emojis: { [key: string]: string } = {
      '슬라임': '🟢',
      '고블린': '👺',
      '해골전사': '💀',
      '오크': '👹',
      '다크엘프': '🧝',
      '리치': '🧙',
      '드래곤': '🐲',
    };
    return emojis[name] || '👾';
  };

  return (
    <div className="enemy-area">
      {enemies.map((enemy) => {
        const hpPercentage = (enemy.currentHp / enemy.maxHp) * 100;
        const isSelected = enemy.id === selectedEnemyId;
        const isTargetable = hasSelectedCard;
        const block = enemy.statusEffects.find(e => e.type === 'block')?.amount || 0;

        return (
          <div
            key={enemy.id}
            className={`enemy-card ${isSelected ? 'selected' : ''} ${isTargetable ? 'targetable' : ''}`}
            onClick={() => onSelectEnemy(enemy.id)}
          >
            {/* 적 의도 표시 */}
            <div
              className="enemy-intent"
              style={{ borderColor: getIntentColor(enemy.intent.type) }}
            >
              <span className="intent-icon">{getIntentIcon(enemy.intent.type)}</span>
              <span
                className="intent-amount"
                style={{ color: getIntentColor(enemy.intent.type) }}
              >
                {enemy.intent.amount}
              </span>
            </div>

            {/* 적 스프라이트 */}
            <div className="enemy-sprite-container">
              <div className="enemy-sprite">{getEnemyEmoji(enemy.name)}</div>
              {isTargetable && <div className="target-indicator">🎯</div>}
            </div>

            {/* 적 이름 */}
            <div className="enemy-name">{enemy.name}</div>

            {/* 체력 바 */}
            <div className="enemy-health-bar">
              <div
                className="enemy-health-fill"
                style={{ width: `${hpPercentage}%` }}
              />
              <div className="enemy-health-text">
                {block > 0 && (
                  <span className="block-indicator">🛡️{block} </span>
                )}
                <span>{enemy.currentHp}/{enemy.maxHp}</span>
              </div>
            </div>

            {/* 상태 효과 */}
            {enemy.statusEffects.filter(e => e.type !== 'block').length > 0 && (
              <div className="enemy-status-effects">
                {enemy.statusEffects
                  .filter(e => e.type !== 'block')
                  .map((effect, index) => (
                    <div key={index} className="enemy-status-effect">
                      <span>{getStatusIcon(effect.type)}</span>
                      <span className="status-amount">{effect.amount}</span>
                    </div>
                  ))}
              </div>
            )}

            {/* 타겟 가능 글로우 */}
            {isTargetable && <div className="targetable-glow" />}
          </div>
        );
      })}
    </div>
  );
}

export default EnemyArea;
