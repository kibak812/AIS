import type { Player } from '../types';
import './PlayerInfo.css';

interface PlayerInfoProps {
  player: Player;
}

function PlayerInfo({ player }: PlayerInfoProps) {
  const hpPercentage = (player.currentHp / player.maxHp) * 100;

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
    <div className="player-info">
      <div className="health-bar-container">
        <div className="health-bar">
          <div
            className="health-fill"
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
        <div className="health-text">
          {player.currentHp} / {player.maxHp}
        </div>
      </div>

      <div className="energy-display">
        <span className="energy-icon">⚡</span>
        <span className="energy-text">
          {player.energy} / {player.maxEnergy}
        </span>
      </div>

      {player.statusEffects.length > 0 && (
        <div className="status-effects">
          {player.statusEffects.map((effect, index) => (
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
