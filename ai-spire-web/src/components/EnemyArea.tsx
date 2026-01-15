import { useState, useEffect } from 'react';
import type { Enemy } from '../types';
import MonsterSprite from './MonsterSprite';
import './EnemyArea.css';

interface EnemyAreaProps {
  enemies: Enemy[];
  selectedEnemyId: string | null;
  onSelectEnemy: (enemyId: string) => void;
  hasSelectedCard: boolean;
  hitEnemyId?: string | null;
  attackingEnemyId?: string | null;
}

function EnemyArea({
  enemies,
  selectedEnemyId,
  onSelectEnemy,
  hasSelectedCard,
  hitEnemyId,
  attackingEnemyId
}: EnemyAreaProps) {
  const [prevEnemies, setPrevEnemies] = useState<Enemy[]>(enemies);
  const [damagedEnemies, setDamagedEnemies] = useState<Set<string>>(new Set());

  // 체력 변화 감지
  useEffect(() => {
    const newDamaged = new Set<string>();
    enemies.forEach(enemy => {
      const prev = prevEnemies.find(e => e.id === enemy.id);
      if (prev && prev.currentHp > enemy.currentHp) {
        newDamaged.add(enemy.id);
      }
    });

    if (newDamaged.size > 0) {
      setDamagedEnemies(newDamaged);
      setTimeout(() => setDamagedEnemies(new Set()), 200);
    }

    setPrevEnemies(enemies);
  }, [enemies]);

  const getIntentDisplay = (type: string): { icon: string; label: string; color: string } => {
    const displays: { [key: string]: { icon: string; label: string; color: string } } = {
      attack: { icon: '⚔️', label: '공격', color: '#ff4757' },
      defend: { icon: '🛡️', label: '방어', color: '#3498db' },
      buff: { icon: '⬆️', label: '강화', color: '#f1c40f' },
      debuff: { icon: '⬇️', label: '약화', color: '#9b59b6' },
    };
    return displays[type] || { icon: '❓', label: '??', color: '#95a5a6' };
  };

  const getStatusDisplay = (type: string): { icon: string; color: string } => {
    const displays: { [key: string]: { icon: string; color: string } } = {
      strength: { icon: '💪', color: '#e74c3c' },
      weak: { icon: '🌀', color: '#9b59b6' },
      vulnerable: { icon: '💔', color: '#e91e63' },
      block: { icon: '🛡️', color: '#3498db' },
      burn: { icon: '🔥', color: '#ff6b35' },
      poison: { icon: '☠️', color: '#2ecc71' },
      freeze: { icon: '❄️', color: '#00d4ff' },
      regen: { icon: '💚', color: '#27ae60' },
    };
    return displays[type] || { icon: '✨', color: '#fff' };
  };

  return (
    <div className="enemy-area">
      <div className="enemy-battlefield">
        {enemies.map((enemy) => {
          const hpPercentage = (enemy.currentHp / enemy.maxHp) * 100;
          const isLowHp = hpPercentage <= 30;
          const isSelected = enemy.id === selectedEnemyId;
          const isTargetable = hasSelectedCard;
          const isHit = hitEnemyId === enemy.id || damagedEnemies.has(enemy.id);
          const isAttacking = attackingEnemyId === enemy.id;
          const block = enemy.statusEffects.find(e => e.type === 'block')?.amount || 0;
          const intent = getIntentDisplay(enemy.intent.type);

          return (
            <div
              key={enemy.id}
              className={`enemy-container ${isSelected ? 'selected' : ''} ${isTargetable ? 'targetable' : ''}`}
              onClick={() => onSelectEnemy(enemy.id)}
            >
              {/* 적 의도 표시 */}
              <div className="enemy-intent-badge" style={{ '--intent-color': intent.color } as React.CSSProperties}>
                <div className="intent-glow" />
                <span className="intent-icon">{intent.icon}</span>
                <span className="intent-value">{enemy.intent.amount}</span>
              </div>

              {/* 몬스터 카드 */}
              <div className="enemy-card-premium">
                {/* 상단 장식 */}
                <div className="card-decoration top" />

                {/* 몬스터 스프라이트 영역 */}
                <div className="monster-stage">
                  <div className="stage-glow" />
                  <MonsterSprite
                    name={enemy.name}
                    isHit={isHit}
                    isAttacking={isAttacking}
                  />
                  {isTargetable && (
                    <div className="target-reticle">
                      <div className="reticle-ring" />
                      <div className="reticle-cross" />
                    </div>
                  )}
                </div>

                {/* 몬스터 이름 */}
                <div className="enemy-name-plate">
                  <span className="name-text">{enemy.name}</span>
                </div>

                {/* 체력 바 */}
                <div className="health-bar-container">
                  <div className="health-bar-bg">
                    <div
                      className={`health-bar-fill ${isLowHp ? 'critical' : ''}`}
                      style={{ width: `${hpPercentage}%` }}
                    >
                      <div className="health-bar-shine" />
                    </div>
                    {isHit && <div className="health-flash" />}
                  </div>
                  <div className="health-text">
                    {block > 0 && (
                      <span className="shield-value">
                        <span className="shield-icon">🛡️</span>
                        {block}
                      </span>
                    )}
                    <span className="hp-value">{enemy.currentHp}</span>
                    <span className="hp-separator">/</span>
                    <span className="hp-max">{enemy.maxHp}</span>
                  </div>
                </div>

                {/* 상태 효과 */}
                {enemy.statusEffects.filter(e => e.type !== 'block').length > 0 && (
                  <div className="status-effects-row">
                    {enemy.statusEffects
                      .filter(e => e.type !== 'block')
                      .map((effect, index) => {
                        const display = getStatusDisplay(effect.type);
                        return (
                          <div
                            key={index}
                            className="status-chip"
                            style={{ '--status-color': display.color } as React.CSSProperties}
                          >
                            <span className="status-icon">{display.icon}</span>
                            <span className="status-value">{effect.amount}</span>
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* 하단 장식 */}
                <div className="card-decoration bottom" />
              </div>

              {/* 타겟 가능 글로우 */}
              {isTargetable && <div className="targetable-aura" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EnemyArea;
