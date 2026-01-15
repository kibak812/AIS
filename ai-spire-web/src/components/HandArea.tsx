import type { Card } from '../types';
import './HandArea.css';

interface HandAreaProps {
  hand: Card[];
  energy: number;
  selectedCardId: string | null;
  onSelectCard: (cardId: string) => void;
}

function HandArea({ hand, energy, selectedCardId, onSelectCard }: HandAreaProps) {
  const getCardColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      attack: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
      skill: 'linear-gradient(135deg, #4ecdc4 0%, #44a8a0 100%)',
      power: 'linear-gradient(135deg, #a55eea 0%, #8854d0 100%)',
    };
    return colors[type] || colors.attack;
  };

  return (
    <div className="hand-area">
      <div className="hand-container">
        {hand.map((card) => {
          const isSelected = card.id === selectedCardId;
          const canAfford = energy >= card.cost;

          return (
            <div
              key={card.id}
              className={`card ${isSelected ? 'selected' : ''} ${
                !canAfford ? 'unaffordable' : ''
              }`}
              style={{ background: getCardColor(card.type) }}
              onClick={() => canAfford && onSelectCard(card.id)}
            >
              <div className="card-cost">{card.cost}</div>
              <div className="card-name">{card.name}</div>
              <div className="card-description">{card.description}</div>
              <div className="card-type">{card.type}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HandArea;
