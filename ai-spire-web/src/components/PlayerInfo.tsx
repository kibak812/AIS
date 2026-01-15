import type { Player } from '../types';
import './PlayerInfo.css';

interface PlayerInfoProps {
  player: Player;
}

function PlayerInfo({ player }: PlayerInfoProps) {
  const hpPercentage = (player.currentHp / player.maxHp) * 100;
  const block = player.statusEffects.find(e => e.type === 'block')?.amount || 0;

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

  return (
    <div className="player-info">
      {/* HP 바 */}
      <div className="health-bar-container">
        <div className="health-icon">❤️</div>
        <div className="health-bar">
          <div
            className="health-fill"
            style={{ width: `${hpPercentage}%` }}
          />
          <div className="health-text">
            {block > 0 && (
              <span className="player-block">🛡️{block} </span>
            )}
            <span>{player.currentHp}/{player.maxHp}</span>
          </div>
        </div>
      </div>

      {/* 상태 효과 */}
      {player.statusEffects.filter(e => e.type !== 'block').length > 0 && (
        <div className="status-effects">
          {player.statusEffects
            .filter(e => e.type !== 'block')
            .map((effect, index) => (
              <div key={index} className="status-effect">
                <span>{getStatusIcon(effect.type)}</span>
                <span className="status-amount">{effect.amount}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default PlayerInfo;
