import type { Player } from '../types';
import './PlayerInfo.css';

interface PlayerInfoProps {
  player: Player;
  isHit?: boolean;
}

function PlayerInfo({ player, isHit }: PlayerInfoProps) {
  const hpPercentage = (player.currentHp / player.maxHp) * 100;
  const isLowHp = hpPercentage <= 30;
  const block = player.statusEffects.find(e => e.type === 'block')?.amount || 0;

  const getStatusDisplay = (type: string): { icon: string; color: string } => {
    const displays: { [key: string]: { icon: string; color: string } } = {
      strength: { icon: '💪', color: '#e74c3c' },
      weak: { icon: '🌀', color: '#9b59b6' },
      vulnerable: { icon: '💔', color: '#e91e63' },
      burn: { icon: '🔥', color: '#ff6b35' },
      poison: { icon: '☠️', color: '#2ecc71' },
      freeze: { icon: '❄️', color: '#00d4ff' },
      regen: { icon: '💚', color: '#27ae60' },
    };
    return displays[type] || { icon: '✨', color: '#fff' };
  };

  return (
    <div className={`player-info-premium ${isHit ? 'hit' : ''}`}>
      {/* 플레이어 아바타 */}
      <div className="player-avatar">
        <div className="avatar-glow" />
        <div className="avatar-icon">⚔️</div>
        {block > 0 && (
          <div className="shield-overlay">
            <span className="shield-icon">🛡️</span>
            <span className="shield-value">{block}</span>
          </div>
        )}
      </div>

      {/* HP 바 */}
      <div className="player-health-section">
        <div className="health-bar-premium">
          <div className="health-bg">
            <div
              className={`health-fill-premium ${isLowHp ? 'critical' : ''}`}
              style={{ width: `${hpPercentage}%` }}
            >
              <div className="health-shine" />
            </div>
            {isHit && <div className="health-hit-flash" />}
          </div>
          <div className="health-text-premium">
            <span className="current-hp">{player.currentHp}</span>
            <span className="hp-divider">/</span>
            <span className="max-hp">{player.maxHp}</span>
          </div>
        </div>

        {/* 상태 효과 */}
        {player.statusEffects.filter(e => e.type !== 'block').length > 0 && (
          <div className="player-status-effects">
            {player.statusEffects
              .filter(e => e.type !== 'block')
              .map((effect, index) => {
                const display = getStatusDisplay(effect.type);
                return (
                  <div
                    key={index}
                    className="player-status-chip"
                    style={{ '--status-color': display.color } as React.CSSProperties}
                  >
                    <span className="status-icon">{display.icon}</span>
                    <span className="status-value">{effect.amount}</span>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerInfo;
