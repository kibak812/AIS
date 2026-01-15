import type { Card } from '../types';
import './RewardScreen.css';

interface RewardScreenProps {
  cards: Card[];
  onSelectCard: (cardId: string) => void;
  onSkip: () => void;
}

function RewardScreen({ cards, onSelectCard, onSkip }: RewardScreenProps) {
  const getCardColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      attack: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
      skill: 'linear-gradient(135deg, #4ecdc4 0%, #44a8a0 100%)',
      power: 'linear-gradient(135deg, #a55eea 0%, #8854d0 100%)',
    };
    return colors[type] || colors.attack;
  };

  const getRarityColor = (rarity: string): string => {
    const colors: { [key: string]: string } = {
      common: '#ffffff',
      uncommon: '#4ecdc4',
      rare: '#ffd700',
    };
    return colors[rarity] || colors.common;
  };

  return (
    <div className="reward-screen">
      <div className="reward-header">
        <h1>Victory!</h1>
        <p>Choose a card to add to your deck</p>
      </div>

      <div className="reward-cards">
        {cards.map((card) => (
          <div
            key={card.id}
            className="reward-card"
            style={{ background: getCardColor(card.type) }}
            onClick={() => onSelectCard(card.id)}
          >
            <div
              className="reward-card-rarity"
              style={{ color: getRarityColor(card.rarity) }}
            >
              {card.rarity}
            </div>
            <div className="reward-card-cost">{card.cost}</div>
            <div className="reward-card-name">{card.name}</div>
            <div className="reward-card-description">{card.description}</div>
            <div className="reward-card-type">{card.type}</div>
          </div>
        ))}
      </div>

      <button className="skip-button" onClick={onSkip}>
        Skip Reward
      </button>
    </div>
  );
}

export default RewardScreen;
