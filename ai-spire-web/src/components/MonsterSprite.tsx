import { useEffect, useState } from 'react';
import './MonsterSprite.css';

interface MonsterSpriteProps {
  name: string;
  isHit?: boolean;
  isAttacking?: boolean;
  isDead?: boolean;
}

// 고유한 몬스터 SVG 디자인
const MONSTER_DESIGNS: { [key: string]: React.ReactNode } = {
  '광신도': (
    <svg viewBox="0 0 100 100" className="monster-svg cultist">
      {/* 로브 */}
      <path d="M30 40 L50 25 L70 40 L75 95 L25 95 Z" fill="url(#cultistRobe)" />
      {/* 두건 */}
      <ellipse cx="50" cy="32" rx="18" ry="15" fill="#2c1810" />
      {/* 눈 빛 */}
      <ellipse cx="44" cy="32" rx="3" ry="4" fill="#ff3333" className="evil-eye" />
      <ellipse cx="56" cy="32" rx="3" ry="4" fill="#ff3333" className="evil-eye" />
      {/* 제단 마크 */}
      <path d="M45 55 L50 45 L55 55 L50 65 Z" fill="#8b0000" className="cult-symbol" />
      {/* 손 */}
      <ellipse cx="28" cy="70" rx="6" ry="8" fill="#4a3728" />
      <ellipse cx="72" cy="70" rx="6" ry="8" fill="#4a3728" />
      <defs>
        <linearGradient id="cultistRobe" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a3728" />
          <stop offset="100%" stopColor="#2c1810" />
        </linearGradient>
      </defs>
    </svg>
  ),
  '턱벌레': (
    <svg viewBox="0 0 100 100" className="monster-svg jawworm">
      {/* 몸통 */}
      <ellipse cx="50" cy="55" rx="35" ry="30" fill="url(#wormBody)" />
      {/* 등 돌기 */}
      {[20, 35, 50, 65].map((x, i) => (
        <polygon key={i} points={`${x},35 ${x+7},20 ${x+14},35`} fill="#5a4a3a" />
      ))}
      {/* 거대한 턱 */}
      <path d="M25 65 Q20 55 25 45 L40 50 L40 60 Z" fill="#8b7355" className="jaw-left" />
      <path d="M75 65 Q80 55 75 45 L60 50 L60 60 Z" fill="#8b7355" className="jaw-right" />
      {/* 이빨 */}
      {[28, 34, 40].map((x, i) => (
        <polygon key={`l${i}`} points={`${x},52 ${x+3},58 ${x+6},52`} fill="#fff5e0" />
      ))}
      {[54, 60, 66].map((x, i) => (
        <polygon key={`r${i}`} points={`${x},52 ${x+3},58 ${x+6},52`} fill="#fff5e0" />
      ))}
      {/* 눈 */}
      <circle cx="40" cy="45" r="6" fill="#1a1a1a" />
      <circle cx="60" cy="45" r="6" fill="#1a1a1a" />
      <circle cx="42" cy="43" r="2" fill="#ff6600" className="angry-eye" />
      <circle cx="62" cy="43" r="2" fill="#ff6600" className="angry-eye" />
      <defs>
        <radialGradient id="wormBody">
          <stop offset="0%" stopColor="#a08060" />
          <stop offset="100%" stopColor="#6d5a4a" />
        </radialGradient>
      </defs>
    </svg>
  ),
  '이': (
    <svg viewBox="0 0 100 100" className="monster-svg louse">
      {/* 몸통 */}
      <ellipse cx="50" cy="55" rx="28" ry="22" fill="url(#louseBody)" />
      {/* 껍질 패턴 */}
      <path d="M30 50 Q50 40 70 50" stroke="#3d5c3d" strokeWidth="3" fill="none" />
      <path d="M35 60 Q50 50 65 60" stroke="#3d5c3d" strokeWidth="2" fill="none" />
      {/* 다리 */}
      {[-25, -15, 15, 25].map((offset, i) => (
        <line key={i} x1={50 + offset * 0.8} y1="70" x2={50 + offset * 1.2} y2="85"
              stroke="#2d4a2d" strokeWidth="3" strokeLinecap="round" className="leg" />
      ))}
      {/* 눈 */}
      <circle cx="42" cy="48" r="5" fill="#000" />
      <circle cx="58" cy="48" r="5" fill="#000" />
      <circle cx="43" cy="47" r="2" fill="#90ee90" className="bug-eye" />
      <circle cx="59" cy="47" r="2" fill="#90ee90" className="bug-eye" />
      {/* 더듬이 */}
      <path d="M40 38 Q35 25 30 20" stroke="#4a6a4a" strokeWidth="2" fill="none" />
      <path d="M60 38 Q65 25 70 20" stroke="#4a6a4a" strokeWidth="2" fill="none" />
      <defs>
        <radialGradient id="louseBody">
          <stop offset="0%" stopColor="#6b8e6b" />
          <stop offset="100%" stopColor="#4a6a4a" />
        </radialGradient>
      </defs>
    </svg>
  ),
  '뚱보 그렘린': (
    <svg viewBox="0 0 100 100" className="monster-svg fatgremlin">
      {/* 뚱뚱한 몸 */}
      <ellipse cx="50" cy="60" rx="32" ry="28" fill="url(#gremlinBody)" />
      {/* 배 */}
      <ellipse cx="50" cy="65" rx="22" ry="18" fill="#7a9a5a" />
      {/* 머리 */}
      <circle cx="50" cy="30" r="18" fill="#5a7a3a" />
      {/* 귀 */}
      <ellipse cx="28" cy="25" rx="10" ry="6" fill="#5a7a3a" transform="rotate(-30 28 25)" />
      <ellipse cx="72" cy="25" rx="10" ry="6" fill="#5a7a3a" transform="rotate(30 72 25)" />
      {/* 눈 */}
      <circle cx="42" cy="28" r="6" fill="#ffff00" />
      <circle cx="58" cy="28" r="6" fill="#ffff00" />
      <circle cx="43" cy="29" r="3" fill="#000" className="gremlin-pupil" />
      <circle cx="59" cy="29" r="3" fill="#000" className="gremlin-pupil" />
      {/* 입 (사악한 미소) */}
      <path d="M38 40 Q50 50 62 40" stroke="#2a3a1a" strokeWidth="3" fill="none" />
      {/* 이빨 */}
      <polygon points="44,42 46,48 48,42" fill="#fff" />
      <polygon points="52,42 54,48 56,42" fill="#fff" />
      {/* 팔 */}
      <ellipse cx="22" cy="55" rx="8" ry="10" fill="#5a7a3a" />
      <ellipse cx="78" cy="55" rx="8" ry="10" fill="#5a7a3a" />
      <defs>
        <radialGradient id="gremlinBody">
          <stop offset="0%" stopColor="#6a8a4a" />
          <stop offset="100%" stopColor="#4a6a2a" />
        </radialGradient>
      </defs>
    </svg>
  ),
  '슬라임': (
    <svg viewBox="0 0 100 100" className="monster-svg slime">
      {/* 메인 바디 (젤리) */}
      <ellipse cx="50" cy="60" rx="35" ry="28" fill="url(#slimeBody)" className="slime-body" />
      {/* 광택 */}
      <ellipse cx="38" cy="50" rx="12" ry="8" fill="rgba(255,255,255,0.3)" />
      <ellipse cx="60" cy="55" rx="6" ry="4" fill="rgba(255,255,255,0.2)" />
      {/* 눈 */}
      <ellipse cx="40" cy="55" rx="7" ry="9" fill="#fff" />
      <ellipse cx="60" cy="55" rx="7" ry="9" fill="#fff" />
      <circle cx="42" cy="57" r="4" fill="#1a1a3a" className="slime-pupil" />
      <circle cx="62" cy="57" r="4" fill="#1a1a3a" className="slime-pupil" />
      <circle cx="43" cy="55" r="1.5" fill="#fff" />
      <circle cx="63" cy="55" r="1.5" fill="#fff" />
      {/* 입 */}
      <ellipse cx="50" cy="72" rx="8" ry="4" fill="rgba(0,80,0,0.5)" />
      {/* 물방울 효과 */}
      <circle cx="25" cy="75" r="4" fill="url(#slimeBody)" opacity="0.7" className="drip" />
      <circle cx="75" cy="78" r="3" fill="url(#slimeBody)" opacity="0.7" className="drip" />
      <defs>
        <radialGradient id="slimeBody">
          <stop offset="0%" stopColor="#50c878" />
          <stop offset="50%" stopColor="#3cb371" />
          <stop offset="100%" stopColor="#228b22" />
        </radialGradient>
      </defs>
    </svg>
  ),
};

// 기본 몬스터 (알 수 없는 타입용)
const DEFAULT_MONSTER = (
  <svg viewBox="0 0 100 100" className="monster-svg unknown">
    <circle cx="50" cy="50" r="35" fill="url(#unknownBody)" />
    <circle cx="40" cy="45" r="6" fill="#fff" />
    <circle cx="60" cy="45" r="6" fill="#fff" />
    <circle cx="41" cy="46" r="3" fill="#333" />
    <circle cx="61" cy="46" r="3" fill="#333" />
    <path d="M35 65 Q50 75 65 65" stroke="#333" strokeWidth="3" fill="none" />
    <defs>
      <radialGradient id="unknownBody">
        <stop offset="0%" stopColor="#8888aa" />
        <stop offset="100%" stopColor="#555577" />
      </radialGradient>
    </defs>
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
    hitFlash ? 'hit' : '',
    isAttacking ? 'attacking' : '',
    isDead ? 'dead' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <div className="monster-shadow" />
      <div className="monster-sprite-inner">
        {MONSTER_DESIGNS[name] || DEFAULT_MONSTER}
      </div>
      {hitFlash && (
        <div className="hit-effect">
          <div className="hit-slash hit-slash-1" />
          <div className="hit-slash hit-slash-2" />
          <div className="hit-particles">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="hit-particle" style={{
                '--angle': `${i * 60}deg`,
                '--delay': `${i * 0.02}s`,
              } as React.CSSProperties} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MonsterSprite;
