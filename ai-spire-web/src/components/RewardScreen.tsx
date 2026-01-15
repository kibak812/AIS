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

  const getRarityText = (rarity: string): string => {
    const rarityText: { [key: string]: string } = {
      common: '일반',
      uncommon: '고급',
      rare: '희귀',
    };
    return rarityText[rarity] || rarity;
  };

  const getTypeText = (type: string): string => {
    const typeText: { [key: string]: string } = {
      attack: '공격',
      skill: '스킬',
      power: '파워',
    };
    return typeText[type] || type;
  };

  return (
    <div className="reward-screen">
      <div className="reward-header">
        <h1>승리!</h1>
        <p>덱에 추가할 카드를 선택하세요</p>
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
              {getRarityText(card.rarity)}
            </div>
            <div className="reward-card-cost">{card.cost}</div>
            <div className="reward-card-name">{card.name}</div>
            <div className="reward-card-description">{card.description}</div>
            <div className="reward-card-type">{getTypeText(card.type)}</div>
          </div>
        ))}
      </div>

      <button className="skip-button" onClick={onSkip}>
        보상 건너뛰기
      </button>
    </div>
  );
}

export default RewardScreen;
