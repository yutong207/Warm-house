(function () {
  const { useState } = React;
  const { useApp } = window.__SHAPE__.context;

  const iconChoices = ['🌷', '🪷', '📖', '✍️', '🌳', '🎬', '💌', '🧹', '🍳', '🎨', '🚶', '🍵', '☕️', '🛁', '🎵'];

  function InfjChecklistSection() {
    const { infjList, toggleInfj, addInfj, removeInfj } = useApp();
    const done = infjList.filter((x) => x.done).length;
    const pct = Math.round((done / infjList.length) * 100);
    const [showAdd, setShowAdd] = useState(false);
    const [draftText, setDraftText] = useState('');
    const [draftVibe, setDraftVibe] = useState('独处');
    const [draftIcon, setDraftIcon] = useState('🌷');

    const handleAdd = () => {
      if (!draftText.trim()) return;
      addInfj({ text: draftText, vibe: draftVibe, icon: draftIcon });
      setDraftText('');
      setDraftVibe('独处');
      setShowAdd(false);
    };

    return (
      <section className="paper-card paper-card-sage p-6 h-full flex flex-col">
        <div className="tape" style={{ left: 32, background: 'linear-gradient(180deg, rgba(163,165,133,0.55), rgba(163,165,133,0.32))' }}></div>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-[#5e5d59]">weekend ritual</div>
            <h2 className="font-display text-3xl text-[#2d2a24] leading-tight">
              学会照顾自己的<br/>
              <span className="text-[#a3a585]">周末小事 LIST</span>
            </h2>
            <div className="font-hand text-xl text-[#a3a585] mt-1">recharge slowly · stay you</div>
          </div>
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e8e6dc" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.5" fill="none"
                stroke="#a3a585" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${pct * 0.974} 100`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-xl text-[#2d2a24] leading-none">{done}<span className="text-sm text-[#5e5d59]">/{infjList.length}</span></div>
              <div className="text-[10px] text-[#5e5d59] mt-0.5">完成</div>
            </div>
          </div>
        </div>

        <ul className="mt-5 space-y-2 flex-1">
          {infjList.map((item, i) => (
            <li
              key={item.id}
              onClick={() => toggleInfj(item.id)}
              className={`group flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition wobble-in ${
                item.done
                  ? 'bg-[#a3a585]/10 border-[#a3a585]/30'
                  : 'bg-[#fbf3da] border-[#e8e3d2] hover:border-[#a3a585]/40'
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition ${
                  item.done
                    ? 'bg-[#a3a585] border-[#a3a585] text-white'
                    : 'border-[#b8b59a] bg-[#fdf6dd]/60'
                }`}
              >
                {item.done && <span className="text-xs leading-none">✓</span>}
              </div>
              <span className="text-xl shrink-0">{item.icon}</span>
              <span className={`flex-1 text-sm ${item.done ? 'line-through text-[#5e5d59]' : 'text-[#2d2a24]'}`}>
                {item.text}
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                style={{ background: '#a3a58522', color: '#5e5d59' }}
              >{item.vibe}</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeInfj(item.id); }}
                className="opacity-0 group-hover:opacity-100 transition text-[#5e5d59] hover:text-[#c96442] text-xs shrink-0"
                title="删掉"
              >✕</button>
            </li>
          ))}
        </ul>

        {showAdd ? (
          <div className="mt-4 p-3 rounded-xl bg-[#fbf3da] border border-dashed border-[#a3a585]/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-hand text-base text-[#a3a585]">写一件想做的小事</span>
              <button onClick={() => setShowAdd(false)} className="text-xs text-[#5e5d59] hover:text-[#c96442]">收起</button>
            </div>
            <input
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
              placeholder="想做什么…"
              className="w-full px-3 py-2 rounded-lg bg-[#fdf6dd]/70 border border-[#e8e3d2] text-sm focus:outline-none focus:border-[#a3a585]"
            />
            <div className="flex items-center gap-2">
              <input
                value={draftVibe}
                onChange={(e) => setDraftVibe(e.target.value)}
                placeholder="标签 · 独处/充电/创作…"
                className="flex-1 px-3 py-1.5 rounded-md bg-[#fdf6dd]/70 border border-[#e8e3d2] text-xs focus:outline-none focus:border-[#a3a585]"
              />
              <button
                onClick={handleAdd}
                disabled={!draftText.trim()}
                className="px-3 py-1.5 rounded-md bg-[#a3a585] text-white text-xs hover:bg-[#8c8e70] transition disabled:opacity-40"
              >加进 list</button>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {iconChoices.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setDraftIcon(ic)}
                  className={`w-7 h-7 rounded-md text-base flex items-center justify-center transition ${
                    draftIcon === ic ? 'bg-[#fdf6dd] border-2 border-[#a3a585]' : 'bg-[#fdf6dd]/40 border border-[#e8e3d2] hover:border-[#a3a585]/60'
                  }`}
                >{ic}</button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 w-full p-3 rounded-xl border border-dashed border-[#a3a585]/50 text-sm text-[#a3a585] hover:bg-[#a3a585]/10 transition flex items-center justify-center gap-1"
          >
            <span>＋</span><span>加一件自己想做的</span>
          </button>
        )}

        <div className="mt-3 p-2.5 rounded-xl bg-[#fbf3da]/60 border border-dashed border-[#a3a585]/30">
          <div className="text-[11px] text-[#5e5d59] italic leading-relaxed">
            <span className="font-hand text-base text-[#a3a585] mr-1">note ·</span>
            挑一件慢慢做完就够了,周末是用来回到自己的。
          </div>
        </div>
      </section>
    );
  }

  window.__SHAPE__.sections.InfjChecklistSection = InfjChecklistSection;
})();
