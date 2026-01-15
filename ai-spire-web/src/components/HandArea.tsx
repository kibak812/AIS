import { useRef, useEffect, useState } from 'react';
import type { Card } from '../types';
import './HandArea.css';

interface HandAreaProps {
  hand: Card[];
  energy: number;
  maxEnergy?: number; // 더 이상 HandArea에서 직접 표시하지 않음
  selectedCardId: string | null;
  onSelectCard: (cardId: string) => void;
  disabled: boolean;
}

function HandArea({ hand, energy, selectedCardId, onSelectCard, disabled }: HandAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
    }
  }, [hand.length]);

  const getCardGradient = (type: string, rarity: string): string => {
    const baseGradients: { [key: string]: string } = {
      attack: `linear-gradient(160deg,
        #ff6b6b 0%,
        #ee5a5a 20%,
        #dc4444 50%,
        #c43535 80%,
        #a02020 100%)`,
      skill: `linear-gradient(160deg,
        #5dade2 0%,
        #48c9b0 20%,
        #1abc9c 50%,
        #16a085 80%,
        #0e6655 100%)`,
      power: `linear-gradient(160deg,
        #bb8fce 0%,
        #a569bd 20%,
        #9b59b6 50%,
        #7d3c98 80%,
        #5b2c6f 100%)`,
    };

    if (rarity === 'rare') {
      return `linear-gradient(160deg,
        #ffd700 0%,
        #ffb347 20%,
        #ff8c00 50%,
        #e65c00 80%,
        #cc4400 100%)`;
    }

    return baseGradients[type] || baseGradients.attack;
  };

  const getCardIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      attack: '⚔️',
      skill: '✨',
      power: '🔮',
    };
    return icons[type] || '❓';
  };

  const getTypeLabel = (type: string): string => {
    const labels: { [key: string]: string } = {
      attack: '공격',
      skill: '기술',
      power: '파워',
    };
    return labels[type] || type;
  };

  const getRarityBorder = (rarity: string): string => {
    const borders: { [key: string]: string } = {
      common: 'rgba(255, 255, 255, 0.3)',
      uncommon: 'rgba(100, 200, 255, 0.6)',
      rare: 'rgba(255, 215, 0, 0.8)',
    };
    return borders[rarity] || borders.common;
  };

  return (
    <div className="hand-area-premium">
      {/* 카드 컨테이너 */}
      <div className="hand-container-premium" ref={containerRef}>
        <div className="hand-scroll-premium">
          {hand.map((card, index) => {
            const isSelected = card.id === selectedCardId;
            const isHovered = card.id === hoveredCardId;
            const canAfford = energy >= card.cost;
            const isDisabled = disabled || !canAfford;

            return (
              <div
                key={card.id}
                className={`
                  card-premium
                  ${isSelected ? 'selected' : ''}
                  ${isHovered ? 'hovered' : ''}
                  ${!canAfford ? 'unaffordable' : ''}
                  ${disabled ? 'disabled' : ''}
                  rarity-${card.rarity}
                `}
                style={{
                  '--card-bg': getCardGradient(card.type, card.rarity),
                  '--card-border': getRarityBorder(card.rarity),
                  '--card-index': index,
                } as React.CSSProperties}
                onClick={() => !isDisabled && onSelectCard(card.id)}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onTouchStart={() => setHoveredCardId(card.id)}
                onTouchEnd={() => setHoveredCardId(null)}
              >
                {/* 카드 광택 효과 */}
                <div className="card-shine" />

                {/* 코스트 보석 */}
                <div className={`cost-gem ${!canAfford ? 'depleted' : ''}`}>
                  <div className="gem-glow" />
                  <span className="gem-value">{card.cost}</span>
                </div>

                {/* 희귀도 장식 */}
                {card.rarity !== 'common' && (
                  <div className={`rarity-badge ${card.rarity}`}>
                    {card.rarity === 'rare' ? '★' : '◆'}
                  </div>
                )}

                {/* 카드 프레임 */}
                <div className="card-frame">
                  {/* 상단 장식 */}
                  <div className="frame-ornament top" />

                  {/* 카드 헤더 */}
                  <div className="card-header-premium">
                    <span className="card-icon">{getCardIcon(card.type)}</span>
                    <span className="card-title">{card.name}</span>
                  </div>

                  {/* 설명 영역 */}
                  <div className="card-description-premium">
                    {card.description}
                  </div>

                  {/* 타입 태그 */}
                  <div className="card-type-tag">
                    <span>{getTypeLabel(card.type)}</span>
                  </div>

                  {/* 하단 장식 */}
                  <div className="frame-ornament bottom" />
                </div>

                {/* 선택 효과 */}
                {isSelected && (
                  <div className="selection-aura">
                    <div className="aura-ring" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      {hand.length > 4 && (
        <div className="scroll-indicator">
          <div className="scroll-arrow left">‹</div>
          <span>스와이프</span>
          <div className="scroll-arrow right">›</div>
        </div>
      )}
    </div>
  );
}

export default HandArea;
