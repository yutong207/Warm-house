(function () {
  function Sun({ size = 60, glow = '#f3b079', core = '#f6c875' }) {
    const rays = Array.from({ length: 12 }, (_, i) => i * 30);
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <defs>
          <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={core} />
            <stop offset="100%" stopColor={glow} />
          </radialGradient>
        </defs>
        <g className="spin-slow" style={{ transformOrigin: '50px 50px' }}>
          {rays.map((angle) => (
            <line
              key={angle}
              x1="50" y1="14" x2="50" y2="4"
              stroke={glow} strokeWidth="3" strokeLinecap="round"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </g>
        <circle cx="50" cy="50" r="20" fill="url(#sun-grad)" stroke={glow} strokeWidth="1.5" />
        <circle cx="44" cy="46" r="1.6" fill="#7a4a2b" />
        <circle cx="56" cy="46" r="1.6" fill="#7a4a2b" />
        <path d="M44 56 Q50 60 56 56" stroke="#7a4a2b" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  function Flower({ size = 36, petal = '#f3a8a1', center = '#f6c47b' }) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse
            key={a}
            cx="50" cy="28" rx="13" ry="22" fill={petal}
            transform={`rotate(${a} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="10" fill={center} stroke="#b8783a" strokeWidth="1.2" />
        <circle cx="46" cy="48" r="1.5" fill="#fff" opacity="0.7" />
      </svg>
    );
  }

  function Tulip({ size = 36, color = '#d98b7c' }) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <path d="M50 22 C40 28, 36 44, 40 56 C44 50, 50 50, 50 50 C50 50, 56 50, 60 56 C64 44, 60 28, 50 22 Z" fill={color} />
        <path d="M50 50 L50 86" stroke="#7a8a4a" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 70 C42 66, 36 70, 34 78 C44 80, 48 76, 50 70 Z" fill="#9eb787" />
      </svg>
    );
  }

  function Grass({ size = 60, color = '#9eb787' }) {
    return (
      <svg viewBox="0 0 100 60" width={size} height={size * 0.6} aria-hidden="true">
        <path d="M10 60 Q15 30 22 60 Z" fill={color} />
        <path d="M28 60 Q34 24 42 60 Z" fill="#a3a585" />
        <path d="M46 60 Q52 36 60 60 Z" fill={color} />
        <path d="M64 60 Q70 22 80 60 Z" fill="#a3a585" />
        <path d="M84 60 Q88 36 94 60 Z" fill={color} />
      </svg>
    );
  }

  function Rainbow({ size = 80 }) {
    const arcs = [
      { r: 36, color: '#c96442' },
      { r: 30, color: '#e7a55a' },
      { r: 24, color: '#f0d878' },
      { r: 18, color: '#a3a585' },
      { r: 12, color: '#d98b7c' },
    ];
    return (
      <svg viewBox="0 0 100 60" width={size} height={size * 0.6} aria-hidden="true">
        {arcs.map((a) => (
          <path
            key={a.r}
            d={`M ${50 - a.r} 50 A ${a.r} ${a.r} 0 0 1 ${50 + a.r} 50`}
            stroke={a.color} strokeWidth="5" fill="none" strokeLinecap="round"
          />
        ))}
        <ellipse cx="14" cy="52" rx="8" ry="4" fill="#fff" opacity="0.8" />
        <ellipse cx="86" cy="52" rx="8" ry="4" fill="#fff" opacity="0.8" />
      </svg>
    );
  }

  function Cloud({ size = 70, color = '#fff7e6' }) {
    return (
      <svg viewBox="0 0 100 60" width={size} height={size * 0.6} aria-hidden="true">
        <ellipse cx="32" cy="38" rx="18" ry="14" fill={color} />
        <ellipse cx="55" cy="32" rx="22" ry="18" fill={color} />
        <ellipse cx="74" cy="40" rx="16" ry="12" fill={color} />
        <ellipse cx="50" cy="48" rx="30" ry="10" fill={color} />
      </svg>
    );
  }

  function Leaf({ size = 28, color = '#a3a585' }) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <path d="M20 80 Q50 10 90 30 Q70 70 20 80 Z" fill={color} />
        <path d="M20 80 Q50 50 88 32" stroke="#5e6d3a" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  function Heart({ size = 22, color = '#d98b7c' }) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <path d="M50 84 C20 60 8 40 25 24 C35 14 48 22 50 32 C52 22 65 14 75 24 C92 40 80 60 50 84 Z" fill={color} />
      </svg>
    );
  }

  function Sparkle({ size = 18, color = '#e7a55a' }) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <path d="M50 8 L56 44 L92 50 L56 56 L50 92 L44 56 L8 50 L44 44 Z" fill={color} />
      </svg>
    );
  }

  function GrassRow() {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-end gap-1 -mb-3 mt-8 select-none pointer-events-none">
        <div className="sway"><Grass size={50} /></div>
        <div className="sway" style={{ animationDelay: '-1.4s' }}><Tulip size={32} color="#d98b7c" /></div>
        <div className="sway" style={{ animationDelay: '-2.1s' }}><Grass size={44} color="#a3a585" /></div>
        <div className="sway" style={{ animationDelay: '-0.7s' }}><Flower size={30} petal="#f6c47b" center="#c96442" /></div>
        <div className="sway" style={{ animationDelay: '-2.7s' }}><Grass size={56} /></div>
        <div className="ml-auto flex items-end gap-2">
          <div className="sway" style={{ animationDelay: '-1.1s' }}><Tulip size={34} color="#c96442" /></div>
          <div className="sway" style={{ animationDelay: '-1.9s' }}><Grass size={48} color="#9eb787" /></div>
          <div className="sway" style={{ animationDelay: '-2.4s' }}><Flower size={34} petal="#a3a585" center="#e7a55a" /></div>
          <div className="sway" style={{ animationDelay: '-0.5s' }}><Grass size={42} /></div>
        </div>
      </div>
    );
  }

  function DecoLayer() {
    return (
      <div className="deco-layer" aria-hidden="true">
        <div className="float-y" style={{ top: '4%',  right: '4%' }}><Sun size={86} /></div>
        <div className="float-y" style={{ top: '14%', left: '2%',  animationDelay: '-2s' }}><Cloud size={120} /></div>
        <div className="float-y" style={{ top: '42%', right: '1%', animationDelay: '-4s' }}><Cloud size={90} color="#fde9c8" /></div>
        <div className="float-y" style={{ top: '8%',  left: '52%', animationDelay: '-1.6s' }}>
          <Sparkle size={22} color="#e7a55a" />
        </div>
        <div className="sway"    style={{ top: '24%', left: '3%' }}><Flower size={44} /></div>
        <div className="sway"    style={{ top: '36%', right: '4%', animationDelay: '-1s' }}><Tulip size={42} color="#c96442" /></div>
        <div className="sway"    style={{ top: '58%', left: '1.5%', animationDelay: '-2s' }}><Tulip size={38} color="#d98b7c" /></div>
        <div className="sway"    style={{ top: '64%', right: '2%', animationDelay: '-1.6s' }}><Leaf size={48} /></div>
        <div className="float-y" style={{ top: '78%', left: '46%', animationDelay: '-3s' }}><Rainbow size={110} /></div>
        <div className="twinkle" style={{ top: '20%', right: '40%', animationDelay: '-1s' }}><Sparkle size={16} color="#d98b7c" /></div>
        <div className="twinkle" style={{ top: '70%', left: '40%', animationDelay: '-2.4s' }}><Sparkle size={14} color="#a3a585" /></div>
        <div className="twinkle" style={{ top: '50%', left: '70%', animationDelay: '-0.6s' }}><Sparkle size={12} color="#c96442" /></div>
      </div>
    );
  }

  function Sticker({ kind, size, color, className }) {
    const map = { sun: Sun, flower: Flower, tulip: Tulip, grass: Grass, rainbow: Rainbow, cloud: Cloud, leaf: Leaf, heart: Heart, sparkle: Sparkle };
    const Cmp = map[kind] || Flower;
    return (
      <span className={className} aria-hidden="true">
        <Cmp size={size} color={color} />
      </span>
    );
  }

  window.__SHAPE__.deco = {
    Sun, Flower, Tulip, Grass, Rainbow, Cloud, Leaf, Heart, Sparkle,
    DecoLayer, GrassRow, Sticker,
  };
})();
