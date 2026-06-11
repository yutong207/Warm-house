(function () {
  const { useMemo } = React;
  const { useApp } = window.__SHAPE__.context;

  function hashSeed(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }

  function MiniCalendar({ activityByDay }) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const monthName = ['一','二','三','四','五','六','七','八','九','十','十一','十二'][month] + '月';
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="font-display text-base text-[#2d2a24]">{year} · {monthName}</div>
          <div className="font-hand text-[#c96442]">my month</div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-[10px] text-[#5e5d59] mb-1">
          {['一','二','三','四','五','六','日'].map((d, i) => (
            <div key={i} className="text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (d === null) return <div key={i} className="h-7"></div>;
            const intensity = activityByDay[d] || 0;
            const isToday = d === today;
            const bg = intensity >= 3
              ? '#c96442'
              : intensity === 2
              ? '#d97757aa'
              : intensity === 1
              ? '#e7a55a66'
              : 'transparent';
            const txt = intensity >= 2 ? '#fff' : '#2d2a24';
            return (
              <div
                key={i}
                className={`h-7 rounded-md flex items-center justify-center text-[11px] font-mono-n border transition ${
                  isToday ? 'border-[#c96442] ring-2 ring-[#c96442]/30' : 'border-[#e8d6b2]/60'
                }`}
                style={{ background: bg, color: txt }}
                title={intensity > 0 ? `${d} 号 · ${intensity} 件记录` : `${d} 号`}
              >{d}</div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-[#5e5d59]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#e7a55a66]"></span>
            <span>少</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#d97757aa]"></span>
            <span>中</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#c96442]"></span>
            <span>多</span>
          </div>
          <span className="font-hand text-sm text-[#c96442]">today · {today}</span>
        </div>
      </div>
    );
  }

  function WeeklyBars({ weekStats }) {
    const max = Math.max(1, ...weekStats.map((s) => s.value));
    const labels = ['一','二','三','四','五','六','日'];
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="font-display text-base text-[#2d2a24]">最近 7 天</div>
          <div className="font-hand text-[#7a4a2b]">tiny rhythm</div>
        </div>
        <div className="flex items-end justify-between gap-1.5 h-[88px]">
          {weekStats.map((s, i) => {
            const h = Math.max(8, Math.round((s.value / max) * 78));
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${h}px`,
                    background: s.today
                      ? 'linear-gradient(180deg, #c96442, #7a4a2b)'
                      : 'linear-gradient(180deg, #e7a55a, #c98c6a)',
                    boxShadow: s.today ? '0 1px 0 rgba(255,255,255,0.4) inset' : '',
                  }}
                ></div>
                <span className={`text-[10px] ${s.today ? 'text-[#c96442] font-semibold' : 'text-[#5e5d59]'}`}>
                  {labels[i]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="text-[10px] text-[#5e5d59] mt-1 leading-snug">
          柱高 = 当天总记录数（饮品 + 播客 + 阅读 + 完成的小事），今天是<span className="text-[#c96442]"> 第 {weekStats.findIndex((s) => s.today) + 1} 根</span>。
        </div>
      </div>
    );
  }

  function CalendarSummarySection() {
    const { drinks, podcasts, books, infjList, goals, todayLabel } = useApp();

    const now = new Date();
    const seed = `${now.getFullYear()}-${now.getMonth()}`;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const today = now.getDate();
    const activityByDay = useMemo(() => {
      const map = {};
      const h = hashSeed(seed);
      for (let d = 1; d <= today; d++) {
        const r = ((h * 9301 + d * 49297) % 233280) / 233280;
        map[d] = r > 0.78 ? 3 : r > 0.55 ? 2 : r > 0.30 ? 1 : 0;
      }
      map[today] = Math.max(map[today] || 0, Math.min(3, Math.ceil((drinks.length + podcasts.length) / 2)));
      return map;
    }, [seed, today, drinks.length, podcasts.length]);

    const todayCount = drinks.length + podcasts.length + books.filter((b) => b.progress > 0).length
      + infjList.filter((x) => x.done).length;
    const weekStats = useMemo(() => {
      const arr = [];
      const offset = (now.getDay() + 6) % 7;
      const h = hashSeed(seed + '-week');
      for (let i = 0; i < 7; i++) {
        const isToday = i === offset;
        const r = ((h * 12345 + i * 6789) % 233280) / 233280;
        const baseline = 1 + Math.round(r * 4);
        arr.push({
          value: isToday ? Math.max(baseline, todayCount) : baseline,
          today: isToday,
        });
      }
      return arr;
    }, [seed, todayCount]);

    const totals = [
      { label: '本月饮品',  value: drinks.length * 7,            unit: '杯',  color: '#c96442' },
      { label: '本月播客',  value: podcasts.reduce((s, p) => s + Math.round(p.duration * p.progress / 100), 0),
        unit: '分钟', color: '#7a4a2b' },
      { label: '在读 / 已读', value: `${books.filter((b) => b.progress < 100).length}/${books.filter((b) => b.progress === 100).length}`,
        unit: '本',  color: '#b8654a' },
      { label: 'INFJ 小事完成', value: infjList.filter((x) => x.done).length, unit: `/${infjList.length}`, color: '#a3a585' },
      { label: '目标平均进度', value: Math.round((goals.reduce((s, g) => s + g.done / g.total, 0) / Math.max(1, goals.length)) * 100),
        unit: '%', color: '#d97757' },
    ];

    return (
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-2">
        <div className="paper-card paper-card-sage p-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-4 lg:border-r lg:pr-5 border-[#c2cf9d]/50">
              <MiniCalendar activityByDay={activityByDay} />
            </div>
            <div className="lg:col-span-4 lg:border-r lg:pr-5 border-[#c2cf9d]/50">
              <WeeklyBars weekStats={weekStats} />
            </div>
            <div className="lg:col-span-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-display text-base text-[#2d2a24]">本月小结</div>
                <div className="font-hand text-[#a3a585]">a tiny summary</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {totals.map((t) => (
                  <div key={t.label} className="px-2.5 py-2 rounded-lg bg-[#fdf6dd]/70 border border-[#c2cf9d]/40">
                    <div className="text-[10px] text-[#5e5d59] truncate">{t.label}</div>
                    <div className="font-display text-xl leading-none mt-1" style={{ color: t.color }}>
                      {t.value}<span className="text-[10px] text-[#5e5d59] ml-1">{t.unit}</span>
                    </div>
                  </div>
                ))}
                <div className="px-2.5 py-2 rounded-lg bg-gradient-to-br from-[#e7a55a]/20 to-[#c96442]/20 border border-dashed border-[#c96442]/40 flex flex-col items-center justify-center text-center">
                  <div className="font-hand text-base text-[#c96442]">today</div>
                  <div className="font-mono-n text-xs text-[#2d2a24]">{todayLabel.iso}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  window.__SHAPE__.sections.CalendarSummarySection = CalendarSummarySection;
})();
