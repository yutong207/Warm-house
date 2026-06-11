(function () {
  const { useState } = React;
  const { useApp } = window.__SHAPE__.context;

  const quadrants = [
    { key: 'q1', title: '重要且紧急', sub: 'Do · 立刻做',     color: '#c96442', tone: 'bg-[#c96442]/8 border-[#c96442]/30', dotBg: 'bg-[#c96442]', hint: '硬伤,先处理掉,情绪才能落地' },
    { key: 'q2', title: '重要但不紧急', sub: 'Plan · 规划做', color: '#a3a585', tone: 'bg-[#a3a585]/10 border-[#a3a585]/30', dotBg: 'bg-[#a3a585]', hint: 'INFJ 真正成长所在,留时间给它' },
    { key: 'q3', title: '紧急但不重要', sub: 'Delegate · 委派', color: '#e7a55a', tone: 'bg-[#e7a55a]/12 border-[#e7a55a]/40', dotBg: 'bg-[#e7a55a]', hint: '能合作就合作,别一个人扛' },
    { key: 'q4', title: '既不重要也不紧急', sub: 'Drop · 放下', color: '#5e5d59', tone: 'bg-[#5e5d59]/8 border-[#5e5d59]/25', dotBg: 'bg-[#5e5d59]', hint: '允许自己删除,而不是收集' },
  ];

  function QuadrantCard({ q, items, onMove, onAdd, onRemove }) {
    const [input, setInput] = useState('');
    const [hover, setHover] = useState(false);

    return (
      <div
        onDragOver={(e) => { e.preventDefault(); setHover(true); }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHover(false);
          try {
            const payload = JSON.parse(e.dataTransfer.getData('text/plain') || '{}');
            if (payload.id && payload.from && payload.from !== q.key) onMove(payload.id, payload.from, q.key);
          } catch (err) {}
        }}
        className={`relative rounded-2xl border p-4 flex flex-col min-h-[200px] transition ${q.tone} ${hover ? 'drop-active' : ''}`}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${q.dotBg}`}></span>
              <span className="font-display text-lg text-[#2d2a24]">{q.title}</span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#5e5d59] mt-0.5">{q.sub}</div>
          </div>
          <span className="font-mono-n text-xs text-[#5e5d59] bg-[#fdf6dd]/60 px-2 py-0.5 rounded-md">{items.length}</span>
        </div>

        <div className="mt-3 flex-1 space-y-1.5">
          {items.map((it) => (
            <div
              key={it.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify({ id: it.id, from: q.key }))}
              className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#fdf6dd]/70 border border-[#e8e3d2] cursor-grab active:cursor-grabbing hover:border-[#c96442]/40 transition"
            >
              <span className="text-base">{it.emoji}</span>
              <span className="text-sm text-[#2d2a24] flex-1 truncate">{it.text}</span>
              <button
                onClick={() => onRemove(q.key, it.id)}
                className="opacity-0 group-hover:opacity-100 transition text-[#5e5d59] hover:text-[#c96442] text-xs"
              >✕</button>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-[11px] text-[#5e5d59]/70 italic">空着也很好,可以从其他象限拖一条过来</div>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { onAdd(q.key, input); setInput(''); }
            }}
            placeholder="加一条…回车确认"
            className="flex-1 px-2.5 py-1.5 rounded-md bg-[#fdf6dd]/80 border border-[#e8e3d2] text-xs focus:outline-none focus:border-[#c96442]"
          />
        </div>

        <div className="text-[10px] text-[#5e5d59] italic mt-2">{q.hint}</div>
      </div>
    );
  }

  function PrioritySection() {
    const { matrix, moveMatrixItem, addMatrixItem, removeMatrixItem } = useApp();

    return (
      <section className="paper-card p-6 h-full flex flex-col">
        <div className="tape" style={{ left: 36 }}></div>
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-[#5e5d59]">eisenhower matrix</div>
            <h2 className="font-display text-3xl text-[#2d2a24] leading-tight">
              事项<span className="text-[#c96442]">四象限</span>
            </h2>
            <div className="font-hand text-xl text-[#c96442] mt-1">important × urgent</div>
          </div>
          <div className="text-xs text-[#5e5d59] bg-[#fbf3da] border border-dashed border-[#e8e3d2] rounded-lg px-3 py-2 max-w-sm">
            条目可在象限之间拖动。回车新增；hover 可删除。
          </div>
        </div>

        <div className="mt-5 flex items-stretch gap-3">
          <div className="hidden md:flex flex-col items-center justify-between py-2 w-6 shrink-0 text-[10px] uppercase tracking-wider text-[#5e5d59]">
            <span className="rotate-180" style={{ writingMode: 'vertical-rl' }}>↓ 不重要</span>
            <span style={{ writingMode: 'vertical-rl' }}>重要 ↑</span>
          </div>

          <div className="flex-1">
            <div className="hidden md:flex items-center justify-between text-[10px] uppercase tracking-wider text-[#5e5d59] mb-2 px-1">
              <span>← 不紧急</span>
              <span className="font-hand text-sm text-[#c96442] normal-case tracking-normal">important × urgent</span>
              <span>紧急 →</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quadrants.map((q) => (
                <QuadrantCard
                  key={q.key}
                  q={q}
                  items={matrix[q.key]}
                  onMove={moveMatrixItem}
                  onAdd={addMatrixItem}
                  onRemove={removeMatrixItem}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  window.__SHAPE__.sections.PrioritySection = PrioritySection;
})();
