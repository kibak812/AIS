import { useState } from 'react';
import type { Card } from '../types';
import { generateAICard, generateAICardWithPrompt } from '../aiCardGenerator';
import './DeckManagementScreen.css';

// 비용 상수
const CARD_REMOVE_HP_COST = 5;
const AI_CARD_HP_COST = 10;
const MAX_REMOVES_PER_FLOOR = 1;
const MAX_AI_CARDS_PER_FLOOR = 1;

interface DeckManagementScreenProps {
  deck: Card[];
  playerHp: number;
  cardsRemovedThisFloor: number;
  aiCardsGeneratedThisFloor: number;
  onRemoveCard: (cardId: string, hpCost: number) => void;
  onAddAICard: (card: Card, hpCost: number) => void;
  onComplete: () => void;
}

function DeckManagementScreen({
  deck,
  playerHp,
  cardsRemovedThisFloor,
  aiCardsGeneratedThisFloor,
  onRemoveCard,
  onAddAICard,
  onComplete,
}: DeckManagementScreenProps) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedCard, setGeneratedCard] = useState<Card | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'deck' | 'ai'>('deck');

  const canRemoveCard = cardsRemovedThisFloor < MAX_REMOVES_PER_FLOOR && playerHp > CARD_REMOVE_HP_COST;
  const canGenerateAI = aiCardsGeneratedThisFloor < MAX_AI_CARDS_PER_FLOOR && playerHp > AI_CARD_HP_COST;

  const handleGenerateCard = () => {
    if (!canGenerateAI) return;

    setIsGenerating(true);
    setTimeout(() => {
      const card = aiPrompt.trim()
        ? generateAICardWithPrompt(aiPrompt)
        : generateAICard();
      setGeneratedCard(card);
      setIsGenerating(false);
    }, 800);
  };

  const handleAcceptCard = () => {
    if (generatedCard && canGenerateAI) {
      onAddAICard(generatedCard, AI_CARD_HP_COST);
      setGeneratedCard(null);
      setAiPrompt('');
    }
  };

  const handleRejectCard = () => {
    setGeneratedCard(null);
  };

  const handleRemoveCard = () => {
    if (selectedCardId && canRemoveCard) {
      onRemoveCard(selectedCardId, CARD_REMOVE_HP_COST);
      setSelectedCardId(null);
    }
  };

  const getCardGradient = (type: string, rarity: string): string => {
    if (rarity === 'rare') {
      return '#4a3520';
    }
    const gradients: { [key: string]: string } = {
      attack: '#8b2020',
      skill: '#206050',
      power: '#402060',
    };
    return gradients[type] || gradients.attack;
  };

  const getTypeIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      attack: '⚔️',
      skill: '✨',
      power: '🔮',
    };
    return icons[type] || '❓';
  };

  const getRarityLabel = (rarity: string): string => {
    const labels: { [key: string]: string } = {
      common: '일반',
      uncommon: '고급',
      rare: '희귀',
    };
    return labels[rarity] || rarity;
  };

  return (
    <div className="deck-management-screen">
      {/* 배경 */}
      <div className="dm-background">
        <div className="dm-bg-gradient" />
        <div className="dm-bg-pattern" />
      </div>

      {/* 헤더 */}
      <div className="dm-header">
        <h1 className="dm-title">덱 정비소</h1>
        <p className="dm-subtitle">HP를 소모하여 덱을 수정할 수 있습니다 (층당 제한 있음)</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="dm-tabs">
        <button
          className={`dm-tab ${activeTab === 'deck' ? 'active' : ''}`}
          onClick={() => setActiveTab('deck')}
        >
          <span className="tab-icon">📚</span>
          <span>내 덱 ({deck.length})</span>
        </button>
        <button
          className={`dm-tab ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <span className="tab-icon">🤖</span>
          <span>AI 생성</span>
        </button>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="dm-content">
        {activeTab === 'deck' ? (
          <div className="dm-deck-view">
            {/* 덱 카드 그리드 */}
            <div className="dm-card-grid">
              {deck.map((card) => (
                <div
                  key={card.id}
                  className={`dm-card ${selectedCardId === card.id ? 'selected' : ''}`}
                  style={{ background: getCardGradient(card.type, card.rarity) }}
                  onClick={() => setSelectedCardId(
                    selectedCardId === card.id ? null : card.id
                  )}
                >
                  <div className="dm-card-cost">{card.cost}</div>
                  {card.rarity !== 'common' && (
                    <div className={`dm-card-rarity ${card.rarity}`}>
                      {card.rarity === 'rare' ? '★' : '◆'}
                    </div>
                  )}
                  <div className="dm-card-header">
                    <span>{getTypeIcon(card.type)}</span>
                    <span className="dm-card-name">{card.name}</span>
                  </div>
                  <div className="dm-card-desc">{card.description}</div>
                  <div className="dm-card-footer">
                    <span className="dm-card-type">{getRarityLabel(card.rarity)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 카드 제거 버튼 */}
            {selectedCardId && (
              <div className="dm-action-panel">
                {canRemoveCard ? (
                  <>
                    <button className="dm-remove-btn" onClick={handleRemoveCard}>
                      <span>🗑️</span>
                      <span>카드 제거 (HP -{CARD_REMOVE_HP_COST})</span>
                    </button>
                    <p className="dm-cost-info">현재 HP: {playerHp} | 남은 제거 횟수: {MAX_REMOVES_PER_FLOOR - cardsRemovedThisFloor}</p>
                  </>
                ) : (
                  <>
                    <button className="dm-remove-btn" style={{ opacity: 0.5, cursor: 'not-allowed' }} disabled>
                      <span>🗑️</span>
                      <span>제거 불가</span>
                    </button>
                    <p className="dm-warning">
                      {cardsRemovedThisFloor >= MAX_REMOVES_PER_FLOOR
                        ? '이번 층에서 이미 카드를 제거했습니다'
                        : 'HP가 부족합니다'}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="dm-ai-view">
            {/* AI 프롬프트 입력 */}
            <div className="dm-ai-input-section">
              <label className="dm-ai-label">
                카드 컨셉 (HP -{AI_CARD_HP_COST}) | 남은 횟수: {MAX_AI_CARDS_PER_FLOOR - aiCardsGeneratedThisFloor}
              </label>
              <div className="dm-ai-input-wrapper">
                <input
                  type="text"
                  className="dm-ai-input"
                  placeholder="예: 강력한 공격, 방어와 회복..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  disabled={isGenerating || !canGenerateAI}
                />
              </div>
              <button
                className={`dm-generate-btn ${isGenerating ? 'generating' : ''}`}
                onClick={handleGenerateCard}
                disabled={isGenerating || !canGenerateAI}
              >
                {isGenerating ? (
                  <>
                    <span className="spinner" />
                    <span>생성 중...</span>
                  </>
                ) : canGenerateAI ? (
                  <>
                    <span>🎲</span>
                    <span>AI 생성 (HP -{AI_CARD_HP_COST})</span>
                  </>
                ) : (
                  <>
                    <span>🚫</span>
                    <span>{aiCardsGeneratedThisFloor >= MAX_AI_CARDS_PER_FLOOR ? '사용 완료' : 'HP 부족'}</span>
                  </>
                )}
              </button>
            </div>

            {/* 생성된 카드 미리보기 */}
            {generatedCard && (
              <div className="dm-generated-card-section">
                <h3 className="dm-section-title">생성된 카드</h3>
                <div className="dm-generated-card-wrapper">
                  <div
                    className="dm-generated-card"
                    style={{ background: getCardGradient(generatedCard.type, generatedCard.rarity) }}
                  >
                    <div className="dm-card-cost">{generatedCard.cost}</div>
                    {generatedCard.rarity !== 'common' && (
                      <div className={`dm-card-rarity ${generatedCard.rarity}`}>
                        {generatedCard.rarity === 'rare' ? '★' : '◆'}
                      </div>
                    )}
                    <div className="dm-card-header">
                      <span>{getTypeIcon(generatedCard.type)}</span>
                      <span className="dm-card-name">{generatedCard.name}</span>
                    </div>
                    <div className="dm-card-desc">{generatedCard.description}</div>
                    <div className="dm-card-footer">
                      <span className="dm-card-type">{getRarityLabel(generatedCard.rarity)}</span>
                    </div>
                  </div>
                </div>
                <div className="dm-card-actions">
                  <button className="dm-accept-btn" onClick={handleAcceptCard}>
                    <span>✓</span>
                    <span>추가 (HP -{AI_CARD_HP_COST})</span>
                  </button>
                  <button className="dm-reject-btn" onClick={handleRejectCard}>
                    <span>✗</span>
                    <span>취소</span>
                  </button>
                </div>
              </div>
            )}

            {/* AI 설명 */}
            <div className="dm-ai-info">
              <div className="dm-info-icon">💡</div>
              <div className="dm-info-text">
                <p>AI 카드 생성은 층당 {MAX_AI_CARDS_PER_FLOOR}회 가능합니다.</p>
                <p>HP {AI_CARD_HP_COST}를 소모합니다. 신중히 사용하세요!</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 완료 버튼 */}
      <div className="dm-footer">
        <button className="dm-complete-btn" onClick={onComplete}>
          <span>전투 계속</span>
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
}

export default DeckManagementScreen;
