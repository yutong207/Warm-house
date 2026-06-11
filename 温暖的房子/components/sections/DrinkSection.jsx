(function () {
  const { useState } = React;
  const { useApp } = window.__SHAPE__.context;

  function DrinkSection() {
    const { drinks, drinkPalette, addDrink, removeDrink } = useApp();
    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [tagIdx, setTagIdx] = useState(0);
    const [mood, setMood] = useState('');

    const handleAdd = () => {
      if (!name.trim()) return;
      const palette = drinkPalette[tagIdx];
      addDrink({
        time: time || new Date().toTimeString().slice(0, 5),
        name: name.trim(),
        mood: mood.trim() || '记一笔',
        tag: palette.name,
        emoji: palette.emoji,
        color: palette.color,
        kcal: 0,
      });
      setName('');
      setMood('');
      setTime('');
    };

    const totalKcal = drinks.reduce((s, d) => s + (d.kcal || 0), 0);

    return (
      <section className="paper-card p-6 h-full flex flex-col">
        <div className="tape" style={{ left: 40 }}></div>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-[#5e5d59]">drink log</div>
            <h2 className="font-display text-3xl text-[#2d2a24] leading-tight">今日饮品</h2>
            <div className="font-hand text-xl text-[#c96442] mt-1">a sip a day, a mood a day</div>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl text-[#c96442] leading-none">{drinks.length}</div>
            <div className="text-xs text-[#5e5d59] mt-1">杯 · {totalKcal} kcal</div>
          </div>
        </div>

        <div className="mt-5 flex-1 space-y-3 max-h-[260px] overflow-y-auto scroll-fade pr-1">
          {drinks.length === 0 && (
            <div className="text-center text-sm text-[#5e5d59] py-8">还没有记录,先来一杯吧 ☕️</div>
          )}
          {drinks.map((d, i) => (
            <div
              key={d.id}
              className="group flex items-center gap-3 p-3 rounded-xl bg-[#fbf3da] border border-[#ecdcb8]/60 hover:border-[#c96442]/40 transition wobble-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 shadow-inner"
                style={{ background: `${d.color}22`, border: `1px solid ${d.color}55` }}
              >
                {d.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-lg text-[#2d2a24] truncate">{d.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#c96442]/10 text-[#c96442]">{d.tag}</span>
                </div>
                <div className="text-xs text-[#5e5d59] mt-0.5 flex items-center gap-2">
                  <span className="font-mono-n">{d.time}</span>
                  <span className="w-1 h-1 rounded-full bg-[#5e5d59]/40"></span>
                  <span>心情 · {d.mood}</span>
                  {d.kcal > 0 && <span className="ml-auto font-mono-n text-[#5e5d59]/70">{d.kcal} kcal</span>}
                </div>
              </div>
              <button
                onClick={() => removeDrink(d.id)}
                className="opacity-0 group-hover:opacity-100 transition text-[#5e5d59] hover:text-[#c96442] text-xs"
                title="删掉这一杯"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-dashed border-[#e8e3d2]">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {drinkPalette.map((p, idx) => (
              <button
                key={p.name}
                onClick={() => setTagIdx(idx)}
                className={`px-2.5 py-1 rounded-full text-xs flex items-center gap-1 border transition ${
                  idx === tagIdx
                    ? 'bg-[#c96442] text-white border-[#c96442]'
                    : 'bg-[#fdf6dd]/60 text-[#5e5d59] border-[#e8e3d2] hover:border-[#c96442]/40'
                }`}
              >
                <span>{p.emoji}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="叫它什么名字?"
              className="col-span-5 px-3 py-2 rounded-lg bg-[#fdf6dd]/70 border border-[#e8e3d2] text-sm focus:outline-none focus:border-[#c96442]"
            />
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="08:30"
              className="col-span-2 px-3 py-2 rounded-lg bg-[#fdf6dd]/70 border border-[#e8e3d2] text-sm font-mono-n focus:outline-none focus:border-[#c96442]"
            />
            <input
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="一句话心情"
              className="col-span-3 px-3 py-2 rounded-lg bg-[#fdf6dd]/70 border border-[#e8e3d2] text-sm focus:outline-none focus:border-[#c96442]"
            />
            <button
              onClick={handleAdd}
              className="col-span-2 px-3 py-2 rounded-lg bg-[#c96442] text-white text-sm font-medium hover:bg-[#b8533a] transition"
            >
              + 记一杯
            </button>
          </div>
        </div>
      </section>
    );
  }

  window.__SHAPE__.sections.DrinkSection = DrinkSection;
})();
