(function () {
  const { useState } = React;
  const { useApp } = window.__SHAPE__.context;

  const moodOptions = [
    { emoji: '☀️', label: '元气', weather: 'sunny' },
    { emoji: '🌤️', label: '温温', weather: 'mild' },
    { emoji: '☁️', label: '低落', weather: 'cloudy' },
    { emoji: '🌧️', label: '想哭', weather: 'rain' },
    { emoji: '🌙', label: '安静', weather: 'night' },
    { emoji: '✨', label: '心动', weather: 'spark' },
  ];

  function AppHeader() {
    const { todayLabel, mood, updateMood, resetAll } = useApp();
    const [editing, setEditing] = useState(false);
    const [draftNote, setDraftNote] = useState(mood.note);

    return (
      <header className="relative">
        <div className="absolute -top-10 right-10 w-40 h-40 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f3b079,#c96442_70%)] opacity-20 blur-2xl pointer-events-none"></div>
        <div className="absolute top-32 -left-16 w-56 h-56 rounded-full bg-[radial-gradient(circle_at_30%_30%,#e7a55a,#d97757_70%)] opacity-15 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-2">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#5e5d59]">
            <div className="flex items-center gap-3">
              <span className="pin-dot"></span>
              <span className="text-[#c96442]">warm house · no. 028</span>
              <span className="hidden md:inline text-[#5e5d59]/60">·</span>
              <span className="hidden md:inline font-mono-n normal-case tracking-normal text-[#5e5d59]">{todayLabel.iso} · {todayLabel.weekLabel}</span>
            </div>
            <button
              onClick={resetAll}
              title="恢复到示例数据"
              className="text-[10px] tracking-wider text-[#5e5d59] hover:text-[#c96442] px-2 py-1 rounded-md border border-dashed border-[#e8d6b2]"
            >reset</button>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="relative inline-block">
                <span className="absolute -left-6 -top-2 text-[#d98b7c] opacity-70 sway"><Sticker /></span>
                <h1 className="font-art text-[88px] lg:text-[124px] leading-[0.95] text-[#c96442] tracking-wide drop-shadow-[3px_3px_0_rgba(122,74,43,0.16)]">
                  温<span className="text-[#7a4a2b]">暖</span>的<span className="text-[#d97757]">房</span>子
                </h1>
                <span className="absolute -right-10 top-2 font-hand text-2xl text-[#5e5d59] rotate-[-6deg]">warm house</span>
              </div>
              <div className="mt-8 flex items-stretch gap-4 max-w-2xl">
                <div className="w-[2px] rounded-full bg-gradient-to-b from-transparent via-[#c9a06b] to-transparent opacity-60 shrink-0"></div>
                <div>
                  <h2 className="font-wenkai text-[22px] lg:text-[26px] leading-[2] text-[#6b5c45] tracking-[0.12em]">
                    只要睡在我的<span className="text-[#a4754e] font-semibold mx-[2px]">温暖房子</span>,
                    <br className="hidden sm:block"/>
                    <span className="text-[#a4754e] font-semibold">我就还拥有所有</span>
                    <span className="text-[#c9a06b] mx-[2px]">。</span>
                  </h2>
                  <div className="mt-4 flex items-start gap-2 text-[#a89177] max-w-xl">
                    <span className="font-wenkai text-2xl text-[#c9a06b] leading-none mt-0.5 select-none">「</span>
                    <p className="font-wenkai text-[15px] leading-[2] tracking-[0.12em]">
                      我看向城市,层层叠叠的高楼,远远望去也像高山。
                    </p>
                    <span className="font-wenkai text-2xl text-[#c9a06b] leading-none mt-0.5 select-none">」</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="paper-card paper-card-honey px-5 py-4 drift">
                <div className="tape" style={{ left: 40 }}></div>
                <div className="flex items-baseline justify-between">
                  <div className="font-hand text-[#c96442] text-2xl leading-none">Today</div>
                  <div className="font-mono-n text-[10px] text-[#5e5d59]">{todayLabel.iso}</div>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="font-display text-3xl text-[#2d2a24] leading-none">
                    {todayLabel.monthLabel}<span className="text-[#c96442]"> · </span>{todayLabel.day}
                  </div>
                  <div className="text-xs text-[#5e5d59]">{todayLabel.weekLabel}</div>
                </div>

                <div className="mt-3 pt-3 border-t border-dashed border-[#e1b86c]/60">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] uppercase tracking-[0.25em] text-[#5e5d59]">today's mood</div>
                    <button
                      onClick={() => { setDraftNote(mood.note); setEditing((v) => !v); }}
                      className="text-[10px] text-[#c96442] hover:underline"
                    >{editing ? '收起' : '放大'}</button>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-11 h-11 rounded-2xl bg-[#fdf6dd] border border-[#e1b86c]/60 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                      {mood.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-hand text-lg text-[#c96442] leading-tight truncate">{mood.note}</div>
                      <div className="text-[10px] text-[#5e5d59]">自动保存 · localStorage</div>
                    </div>
                  </div>
                  {editing && (
                    <div className="mt-3 space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {moodOptions.map((m) => (
                          <button
                            key={m.label}
                            onClick={() => updateMood({ emoji: m.emoji, weather: m.weather })}
                            className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 border transition ${
                              mood.weather === m.weather
                                ? 'bg-[#c96442] text-white border-[#c96442]'
                                : 'bg-[#fdf6dd]/70 text-[#5e5d59] border-[#e1b86c]/40 hover:border-[#c96442]/50'
                            }`}
                          >
                            <span>{m.emoji}</span>
                            <span>{m.label}</span>
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          value={draftNote}
                          onChange={(e) => setDraftNote(e.target.value)}
                          placeholder="写给今天的自己…"
                          className="flex-1 px-3 py-1.5 rounded-md bg-[#fdf6dd]/80 border border-[#e1b86c]/50 text-xs focus:outline-none focus:border-[#c96442]"
                        />
                        <button
                          onClick={() => { updateMood({ note: draftNote.trim() || mood.note }); setEditing(false); }}
                          className="px-3 py-1.5 rounded-md bg-[#c96442] text-white text-xs hover:bg-[#b8533a]"
                        >记下</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function Sticker() {
    const Cmp = window.__SHAPE__.deco && window.__SHAPE__.deco.Tulip;
    return Cmp ? <Cmp size={28} color="#d98b7c" /> : null;
  }

  window.__SHAPE__.layout = window.__SHAPE__.layout || {};
  window.__SHAPE__.layout.AppHeader = AppHeader;
})();
