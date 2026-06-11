(function () {
  const { useState } = React;
  const { useApp } = window.__SHAPE__.context;

  const vibePalette = {
    '治愈': '#a3a585',
    '思考': '#7a4a2b',
    '远方': '#d97757',
    '陪伴': '#c98c6a',
    '故事': '#b8654a',
  };

  function PodcastSection() {
    const { podcasts, addPodcast, updatePodcastProgress, removePodcast } = useApp();
    const [show, setShow] = useState('');
    const [episode, setEpisode] = useState('');
    const [duration, setDuration] = useState('');
    const [vibe, setVibe] = useState('治愈');

    const handleAdd = () => {
      if (!show.trim() || !episode.trim()) return;
      addPodcast({
        show: show.trim(),
        episode: episode.trim(),
        host: '—',
        duration: parseInt(duration, 10) || 45,
        progress: 0,
        vibe,
        emoji: '🎧',
      });
      setShow(''); setEpisode(''); setDuration('');
    };

    return (
      <section className="paper-card paper-card-cocoa p-6 h-full flex flex-col">
        <div className="tape" style={{ left: 48, background: 'linear-gradient(180deg, rgba(122,74,43,0.55), rgba(122,74,43,0.32))' }}></div>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-[#5e5d59]">podcast log</div>
            <h2 className="font-display text-3xl text-[#2d2a24] leading-tight">今天在听</h2>
            <div className="font-hand text-xl text-[#7a4a2b] mt-1">耳朵也想被照顾</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#fbf8ef] to-[#e8e6dc] border border-[#e8e3d2] flex items-center justify-center relative">
            <span className="text-2xl">🎙️</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#c96442] animate-pulse"></span>
          </div>
        </div>

        <div className="mt-5 flex-1 space-y-3 max-h-[260px] overflow-y-auto scroll-fade pr-1">
          {podcasts.map((p, i) => {
            const c = vibePalette[p.vibe] || '#c96442';
            const listened = Math.round(p.duration * p.progress / 100);
            return (
              <div
                key={p.id}
                className="group p-3 rounded-xl bg-[#fbf3da] border border-[#ecdcb8]/60 hover:border-[#7a4a2b]/30 transition wobble-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-inner"
                    style={{ background: `${c}22`, border: `1px solid ${c}55` }}
                  >
                    {p.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white" style={{ background: c }}>{p.vibe}</span>
                      <span className="font-display text-base text-[#2d2a24] truncate">{p.show}</span>
                    </div>
                    <div className="text-sm text-[#2d2a24]/80 mt-0.5 truncate">{p.episode}</div>
                    <div className="text-xs text-[#5e5d59] mt-0.5 flex items-center gap-2">
                      <span>{p.host}</span>
                      <span className="w-1 h-1 rounded-full bg-[#5e5d59]/40"></span>
                      <span className="font-mono-n">{listened}/{p.duration} min</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removePodcast(p.id)}
                    className="opacity-0 group-hover:opacity-100 transition text-[#5e5d59] hover:text-[#c96442] text-xs"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-[#e8e3d2] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${p.progress}%`, background: `linear-gradient(90deg, ${c}, #c96442)` }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updatePodcastProgress(p.id, Math.max(0, p.progress - 10))}
                      className="w-6 h-6 rounded-md bg-[#fdf6dd]/80 border border-[#e8e3d2] text-xs hover:border-[#c96442]/40"
                    >−</button>
                    <span className="font-mono-n text-xs text-[#5e5d59] w-8 text-center">{p.progress}%</span>
                    <button
                      onClick={() => updatePodcastProgress(p.id, Math.min(100, p.progress + 10))}
                      className="w-6 h-6 rounded-md bg-[#fdf6dd]/80 border border-[#e8e3d2] text-xs hover:border-[#c96442]/40"
                    >+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-dashed border-[#e8e3d2]">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {Object.keys(vibePalette).map((v) => (
              <button
                key={v}
                onClick={() => setVibe(v)}
                className={`px-2 py-0.5 rounded-full text-[11px] border transition ${
                  vibe === v
                    ? 'text-white border-transparent'
                    : 'bg-[#fdf6dd]/60 text-[#5e5d59] border-[#e8e3d2]'
                }`}
                style={vibe === v ? { background: vibePalette[v] } : {}}
              >{v}</button>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-2">
            <input
              value={show}
              onChange={(e) => setShow(e.target.value)}
              placeholder="节目名"
              className="col-span-4 px-3 py-2 rounded-lg bg-[#fdf6dd]/70 border border-[#e8e3d2] text-sm focus:outline-none focus:border-[#7a4a2b]"
            />
            <input
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
              placeholder="EP / 标题"
              className="col-span-5 px-3 py-2 rounded-lg bg-[#fdf6dd]/70 border border-[#e8e3d2] text-sm focus:outline-none focus:border-[#7a4a2b]"
            />
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="分钟"
              className="col-span-1 px-2 py-2 rounded-lg bg-[#fdf6dd]/70 border border-[#e8e3d2] text-sm font-mono-n focus:outline-none focus:border-[#7a4a2b]"
            />
            <button
              onClick={handleAdd}
              className="col-span-2 px-3 py-2 rounded-lg bg-[#7a4a2b] text-white text-sm font-medium hover:bg-[#5e3919] transition"
            >
              + 加入耳机
            </button>
          </div>
        </div>
      </section>
    );
  }

  window.__SHAPE__.sections.PodcastSection = PodcastSection;
})();
