import { useEffect, useState } from 'react';
import './MonsterSprite.css';

interface MonsterSpriteProps {
  name: string;
  isHit?: boolean;
  isAttacking?: boolean;
  isDead?: boolean;
}

// 픽셀 아트 몬스터 디자인 (8x8 또는 16x16 그리드 기반)
const MONSTER_DESIGNS: { [key: string]: React.ReactNode } = {
  '광신도': (
    <svg viewBox="0 0 16 16" className="monster-svg pixel-art cultist">
      {/* 로브 몸통 */}
      <rect x="5" y="7" width="6" height="8" fill="#3d2817" />
      <rect x="4" y="9" width="1" height="5" fill="#3d2817" />
      <rect x="11" y="9" width="1" height="5" fill="#3d2817" />
      {/* 로브 하이라이트 */}
      <rect x="6" y="8" width="1" height="6" fill="#4a3525" />
      {/* 두건 */}
      <rect x="5" y="3" width="6" height="5" fill="#2a1a0f" />
      <rect x="6" y="2" width="4" height="1" fill="#2a1a0f" />
      {/* 눈 (빛나는 빨간 눈) */}
      <rect x="6" y="4" width="1" height="2" fill="#ff0000" className="evil-eye" />
      <rect x="9" y="4" width="1" height="2" fill="#ff0000" className="evil-eye" />
      {/* 제단 심볼 */}
      <rect x="7" y="10" width="2" height="2" fill="#8b0000" className="cult-symbol" />
      {/* 손 */}
      <rect x="3" y="11" width="1" height="2" fill="#5a4a3a" />
      <rect x="12" y="11" width="1" height="2" fill="#5a4a3a" />
    </svg>
  ),
  '턱벌레': (
    <svg viewBox="0 0 16 16" className="monster-svg pixel-art jawworm">
      {/* 몸통 */}
      <rect x="4" y="6" width="8" height="6" fill="#8b7355" />
      <rect x="3" y="7" width="1" height="4" fill="#8b7355" />
      <rect x="12" y="7" width="1" height="4" fill="#8b7355" />
      {/* 몸통 하이라이트 */}
      <rect x="5" y="7" width="2" height="3" fill="#a08060" />
      {/* 등 돌기 */}
      <rect x="5" y="4" width="2" height="2" fill="#5a4a3a" />
      <rect x="7" y="3" width="2" height="3" fill="#5a4a3a" />
      <rect x="9" y="4" width="2" height="2" fill="#5a4a3a" />
      {/* 턱 */}
      <rect x="2" y="9" width="2" height="3" fill="#6d5a4a" className="jaw-left" />
      <rect x="12" y="9" width="2" height="3" fill="#6d5a4a" className="jaw-right" />
      {/* 이빨 */}
      <rect x="3" y="12" width="1" height="1" fill="#fff5e0" />
      <rect x="12" y="12" width="1" height="1" fill="#fff5e0" />
      {/* 눈 */}
      <rect x="5" y="7" width="2" height="2" fill="#1a1a1a" />
      <rect x="9" y="7" width="2" height="2" fill="#1a1a1a" />
      <rect x="6" y="7" width="1" height="1" fill="#ff6600" className="angry-eye" />
      <rect x="9" y="7" width="1" height="1" fill="#ff6600" className="angry-eye" />
    </svg>
  ),
  '이': (
    <svg viewBox="0 0 16 16" className="monster-svg pixel-art louse">
      {/* 몸통 */}
      <rect x="4" y="6" width="8" height="5" fill="#4a6a4a" />
      <rect x="5" y="5" width="6" height="1" fill="#4a6a4a" />
      <rect x="5" y="11" width="6" height="1" fill="#4a6a4a" />
      {/* 껍질 패턴 */}
      <rect x="5" y="7" width="6" height="1" fill="#3d5c3d" />
      <rect x="6" y="9" width="4" height="1" fill="#3d5c3d" />
      {/* 다리 */}
      <rect x="3" y="10" width="1" height="3" fill="#2d4a2d" className="leg" />
      <rect x="5" y="11" width="1" height="3" fill="#2d4a2d" className="leg" />
      <rect x="10" y="11" width="1" height="3" fill="#2d4a2d" className="leg" />
      <rect x="12" y="10" width="1" height="3" fill="#2d4a2d" className="leg" />
      {/* 눈 */}
      <rect x="5" y="6" width="2" height="2" fill="#000" />
      <rect x="9" y="6" width="2" height="2" fill="#000" />
      <rect x="6" y="6" width="1" height="1" fill="#90ee90" className="bug-eye" />
      <rect x="9" y="6" width="1" height="1" fill="#90ee90" className="bug-eye" />
      {/* 더듬이 */}
      <rect x="4" y="3" width="1" height="3" fill="#4a6a4a" />
      <rect x="3" y="2" width="1" height="2" fill="#4a6a4a" />
      <rect x="11" y="3" width="1" height="3" fill="#4a6a4a" />
      <rect x="12" y="2" width="1" height="2" fill="#4a6a4a" />
    </svg>
  ),
  '뚱보 그렘린': (
    <svg viewBox="0 0 16 16" className="monster-svg pixel-art fatgremlin">
      {/* 머리 */}
      <rect x="5" y="2" width="6" height="5" fill="#5a7a3a" />
      <rect x="4" y="3" width="1" height="3" fill="#5a7a3a" />
      <rect x="11" y="3" width="1" height="3" fill="#5a7a3a" />
      {/* 귀 */}
      <rect x="2" y="2" width="2" height="3" fill="#5a7a3a" />
      <rect x="12" y="2" width="2" height="3" fill="#5a7a3a" />
      {/* 눈 */}
      <rect x="5" y="3" width="2" height="2" fill="#ffff00" />
      <rect x="9" y="3" width="2" height="2" fill="#ffff00" />
      <rect x="6" y="4" width="1" height="1" fill="#000" className="gremlin-pupil" />
      <rect x="9" y="4" width="1" height="1" fill="#000" className="gremlin-pupil" />
      {/* 입 (사악한 미소) */}
      <rect x="6" y="6" width="4" height="1" fill="#2a3a1a" />
      <rect x="6" y="6" width="1" height="1" fill="#fff" />
      <rect x="9" y="6" width="1" height="1" fill="#fff" />
      {/* 뚱뚱한 몸 */}
      <rect x="4" y="7" width="8" height="6" fill="#6a8a4a" />
      <rect x="3" y="8" width="1" height="4" fill="#6a8a4a" />
      <rect x="12" y="8" width="1" height="4" fill="#6a8a4a" />
      {/* 배 */}
      <rect x="5" y="9" width="6" height="3" fill="#7a9a5a" />
      {/* 팔 */}
      <rect x="2" y="9" width="1" height="3" fill="#5a7a3a" />
      <rect x="13" y="9" width="1" height="3" fill="#5a7a3a" />
    </svg>
  ),
  '슬라임': (
    <svg viewBox="0 0 16 16" className="monster-svg pixel-art slime">
      {/* 메인 바디 */}
      <rect x="4" y="6" width="8" height="6" fill="#3cb371" />
      <rect x="3" y="7" width="1" height="4" fill="#3cb371" />
      <rect x="12" y="7" width="1" height="4" fill="#3cb371" />
      <rect x="5" y="5" width="6" height="1" fill="#3cb371" />
      <rect x="5" y="12" width="6" height="1" fill="#228b22" />
      {/* 하이라이트 */}
      <rect x="5" y="6" width="2" height="2" fill="#50c878" />
      <rect x="10" y="8" width="1" height="1" fill="#50c878" />
      {/* 그림자 */}
      <rect x="4" y="10" width="1" height="2" fill="#228b22" />
      <rect x="11" y="10" width="1" height="2" fill="#228b22" />
      {/* 눈 */}
      <rect x="5" y="7" width="2" height="3" fill="#fff" />
      <rect x="9" y="7" width="2" height="3" fill="#fff" />
      <rect x="6" y="8" width="1" height="2" fill="#1a1a3a" className="slime-pupil" />
      <rect x="9" y="8" width="1" height="2" fill="#1a1a3a" className="slime-pupil" />
      {/* 눈 하이라이트 */}
      <rect x="6" y="7" width="1" height="1" fill="#fff" />
      <rect x="9" y="7" width="1" height="1" fill="#fff" />
      {/* 입 */}
      <rect x="7" y="11" width="2" height="1" fill="#228b22" />
      {/* 물방울 */}
      <rect x="2" y="11" width="1" height="2" fill="#3cb371" className="drip" />
      <rect x="13" y="12" width="1" height="2" fill="#3cb371" className="drip" />
    </svg>
  ),
};

// 기본 몬스터 (알 수 없는 타입용)
const DEFAULT_MONSTER = (
  <svg viewBox="0 0 16 16" className="monster-svg pixel-art unknown">
    {/* 원형 몸통 */}
    <rect x="4" y="4" width="8" height="8" fill="#8888aa" />
    <rect x="5" y="3" width="6" height="1" fill="#8888aa" />
    <rect x="5" y="12" width="6" height="1" fill="#555577" />
    <rect x="3" y="5" width="1" height="6" fill="#8888aa" />
    <rect x="12" y="5" width="1" height="6" fill="#555577" />
    {/* 눈 */}
    <rect x="5" y="6" width="2" height="2" fill="#fff" />
    <rect x="9" y="6" width="2" height="2" fill="#fff" />
    <rect x="6" y="7" width="1" height="1" fill="#333" />
    <rect x="9" y="7" width="1" height="1" fill="#333" />
    {/* 입 */}
    <rect x="6" y="10" width="4" height="1" fill="#333" />
  </svg>
);

function MonsterSprite({ name, isHit, isAttacking, isDead }: MonsterSpriteProps) {
  const [hitFlash, setHitFlash] = useState(false);

  useEffect(() => {
    if (isHit) {
      setHitFlash(true);
      const timer = setTimeout(() => setHitFlash(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isHit]);

  const classNames = [
    'monster-sprite-wrapper',
    'pixel-style',
    hitFlash ? 'hit' : '',
    isAttacking ? 'attacking' : '',
    isDead ? 'dead' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <div className="monster-shadow pixel-shadow" />
      <div className="monster-sprite-inner">
        {MONSTER_DESIGNS[name] || DEFAULT_MONSTER}
      </div>
      {hitFlash && (
        <div className="hit-effect pixel-hit">
          <div className="pixel-flash" />
          <div className="hit-particles">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="hit-particle pixel-particle" style={{
                '--angle': `${i * 90}deg`,
                '--delay': `${i * 0.03}s`,
              } as React.CSSProperties} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MonsterSprite;
