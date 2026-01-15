import { useState } from 'react';
import type { Card } from '../types';
import { generateAICard, generateAICardWithPrompt } from '../aiCardGenerator';
import './DeckManagementScreen.css';

interface DeckManagementScreenProps {
  deck: Card[];
  onRemoveCard: (cardId: string) => void;
  onAddAICard: (card: Card) => void;
  onComplete: () => void;
}

function DeckManagementScreen({
  deck,
  onRemoveCard,
  onAddAICard,
  onComplete,
}: DeckManagementScreenProps) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedCard, setGeneratedCard] = useState<Card | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'deck' | 'ai'>('deck');

  const handleGenerateCard = () => {
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
    if (generatedCard) {
      onAddAICard(generatedCard);
      setGeneratedCard(null);
      setAiPrompt('');
    }
  };

  const handleRejectCard = () => {
    setGeneratedCard(null);
  };

  const handleRemoveCard = () => {
    if (selectedCardId) {
      onRemoveCard(selectedCardId);
      setSelectedCardId(null);
    }
  };

  const getCardGradient = (type: string, rarity: string): string => {
    if (rarity === 'rare') {
      return 'linear-gradient(160deg, #ffd700 0%, #ff8c00 50%, #cc4400 100%)';
    }
    const gradients: { [key: string]: string } = {
      attack: 'linear-gradient(160deg, #ff6b6b 0%, #dc4444 50%, #a02020 100%)',
      skill: 'linear-gradient(160deg, #5dade2 0%, #1abc9c 50%, #0e6655 100%)',
      power: 'linear-gradient(160deg, #bb8fce 0%, #9b59b6 50%, #5b2c6f 100%)',
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
        <p className="dm-subtitle">카드를 정리하거나 AI로 새 카드를 생성하세요</p>
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
          <span>AI 카드 생성</span>
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
                <button className="dm-remove-btn" onClick={handleRemoveCard}>
                  <span>🗑️</span>
                  <span>선택한 카드 제거</span>
                </button>
                <p className="dm-warning">제거된 카드는 복구할 수 없습니다</p>
              </div>
            )}
          </div>
        ) : (
          <div className="dm-ai-view">
            {/* AI 프롬프트 입력 */}
            <div className="dm-ai-input-section">
              <label className="dm-ai-label">카드 컨셉 입력 (선택사항)</label>
              <div className="dm-ai-input-wrapper">
                <input
                  type="text"
                  className="dm-ai-input"
                  placeholder="예: 강력한 공격 카드, 방어와 회복을 동시에..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              <button
                className={`dm-generate-btn ${isGenerating ? 'generating' : ''}`}
                onClick={handleGenerateCard}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className="spinner" />
                    <span>생성 중...</span>
                  </>
                ) : (
                  <>
                    <span>🎲</span>
                    <span>AI 카드 생성</span>
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
                    <span>덱에 추가</span>
                  </button>
                  <button className="dm-reject-btn" onClick={handleRejectCard}>
                    <span>✗</span>
                    <span>다시 생성</span>
                  </button>
                </div>
              </div>
            )}

            {/* AI 설명 */}
            <div className="dm-ai-info">
              <div className="dm-info-icon">💡</div>
              <div className="dm-info-text">
                <p>AI가 다양한 효과와 수치를 조합하여 독특한 카드를 생성합니다.</p>
                <p>원하는 스타일을 입력하면 맞춤형 카드를 받을 수 있습니다.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 완료 버튼 */}
      <div className="dm-footer">
        <button className="dm-complete-btn" onClick={onComplete}>
          <span>전투 계속하기</span>
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
}

export default DeckManagementScreen;
