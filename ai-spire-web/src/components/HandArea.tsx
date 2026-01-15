import { useRef, useEffect } from 'react';
import type { Card } from '../types';
import './HandArea.css';

interface HandAreaProps {
  hand: Card[];
  energy: number;
  maxEnergy: number;
  selectedCardId: string | null;
  onSelectCard: (cardId: string) => void;
  disabled: boolean;
}

function HandArea({ hand, energy, maxEnergy, selectedCardId, onSelectCard, disabled }: HandAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 카드가 변경되면 스크롤 위치 리셋
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
    }
  }, [hand.length]);

  const getCardColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      attack: 'linear-gradient(145deg, #ff6b6b 0%, #c0392b 100%)',
      skill: 'linear-gradient(145deg, #4ecdc4 0%, #16a085 100%)',
      power: 'linear-gradient(145deg, #a55eea 0%, #6c3483 100%)',
    };
    return colors[type] || colors.attack;
  };

  const getTypeIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      attack: '⚔️',
      skill: '✨',
      power: '💫',
    };
    return icons[type] || '❓';
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
    <div className="hand-area">
      {/* 에너지 표시 */}
      <div className="energy-display">
        <div className="energy-orb">
          <span className="energy-icon">⚡</span>
          <span className="energy-value">{energy}</span>
          <span className="energy-max">/{maxEnergy}</span>
        </div>
      </div>

      {/* 카드 컨테이너 */}
      <div className="hand-container" ref={containerRef}>
        <div className="hand-scroll">
          {hand.map((card, index) => {
            const isSelected = card.id === selectedCardId;
            const canAfford = energy >= card.cost;
            const isDisabled = disabled || !canAfford;

            return (
              <div
                key={card.id}
                className={`card ${isSelected ? 'selected' : ''} ${!canAfford ? 'unaffordable' : ''} ${disabled ? 'disabled' : ''}`}
                style={{
                  background: getCardColor(card.type),
                  animationDelay: `${index * 0.05}s`,
                }}
                onClick={() => !isDisabled && onSelectCard(card.id)}
              >
                {/* 카드 코스트 */}
                <div className={`card-cost ${!canAfford ? 'insufficient' : ''}`}>
                  <span>{card.cost}</span>
                </div>

                {/* 카드 테두리 장식 */}
                <div className="card-border-glow" />

                {/* 카드 내용 */}
                <div className="card-content">
                  <div className="card-header">
                    <span className="card-type-icon">{getTypeIcon(card.type)}</span>
                    <span className="card-name">{card.name}</span>
                  </div>

                  <div className="card-description">{card.description}</div>

                  <div className="card-footer">
                    <span className="card-type">{getTypeText(card.type)}</span>
                  </div>
                </div>

                {/* 선택 효과 */}
                {isSelected && <div className="card-selected-glow" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* 스크롤 힌트 */}
      {hand.length > 3 && (
        <div className="scroll-hint">
          <span>← 스와이프 →</span>
        </div>
      )}
    </div>
  );
}

export default HandArea;
