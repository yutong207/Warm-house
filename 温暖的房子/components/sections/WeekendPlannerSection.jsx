(function () {
  const { useState, useMemo } = React;
  const { useApp } = window.__SHAPE__.context;

  const customEmojiPalette = ['✨', '🌷', '🌿', '🌈', '☀️', '🍃', '🪐', '🍓', '🧶', '🫧', '🖋️', '🎈'];
  const customColorPalette = ['#d98b7c', '#c96442', '#e7a55a', '#a3a585', '#7a4a2b', '#b8654a', '#9eb787', '#8a5a3a'];

  const slots = [
    {
      key: 'friday',
      label: '周五晚',
      sub: 'Friday night · 卸下一周',
      icon: '🌙',
      color: '#7a4a2b',
      hint: '建议 1-2 件小事,留点呼吸',
    },
    {
      key: 'saturday',
      label: '周六',
      sub: 'Saturday · 走出门走走',
      icon: '☀️',
      color: '#c96442',
      hint: '可以安排一件主轴 + 一些零碎',
    },
    {
      key: 'sunday',
      label: '周日',
      sub: 'Sunday · 回到自己',
      icon: '🍵',
      color: '#a3a585',
      hint: '安静一些,做一个温柔收尾',
    },
  ];

  function Block({ activity, fromSlot, onDragStart, onDragEnd, onRemove, draggingId, compact }) {
    return (
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', JSON.stringify({ id: activity.id, from: fromSlot }));
          e.dataTransfer.effectAllowed = 'move';
          onDragStart(activity.id);
        }}
        onDragEnd={onDragEnd}
        className={`group relative select-none cursor-grab active:cursor-grabbing rounded-xl border transition shadow-sm ${
          draggingId === activity.id ? 'drag-ghost' : ''
        } ${compact ? 'p-2' : 'p-2.5'}`}
        style={{
          background: `linear-gradient(180deg, ${activity.color}18, ${activity.color}08)`,
          borderColor: `${activity.color}55`,
        }}
        title="拖动我到时间段"
      >
        <div className="flex items-start gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 shadow-inner"
            style={{ background: `${activity.color}30`, border: `1px solid ${activity.color}66` }}
          >{activity.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-sm text-[#2d2a24] leading-tight break-words">{activity.label}</div>
            <div className="text-[10px] text-[#5e5d59] flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="font-mono-n">{activity.duration}</span>
              <span className="w-0.5 h-0.5 rounded-full bg-[#5e5d59]/40"></span>
              <span>{activity.tag}</span>
            </div>
          </div>
          {onRemove && (
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(activity.id); }}
              className="opacity-0 group-hover:opacity-100 transition text-[#5e5d59] hover:text-[#c96442] text-xs px-1 shrink-0"
              title="送回选择池"
            >↺</button>
          )}
        </div>
        {activity.custom && (
          <div className="absolute -top-1.5 -right-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-[#d98b7c] text-white shadow-sm">
            ✨自定义
          </div>
        )}
      </div>
    );
  }

  function Slot({ slot, items, draggingId, onDragStart, onDragEnd, onDrop, onClear, onRemove }) {
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
            if (payload.id) onDrop(payload.id, payload.from);
          } catch (err) {}
        }}
        className={`paper-card flex flex-col min-h-[260px] p-4 transition-all ${hover ? 'drop-active' : ''}`}
        style={{ borderTop: `4px solid ${slot.color}` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{slot.icon}</span>
            <div>
              <div className="font-display text-xl text-[#2d2a24] leading-tight">{slot.label}</div>
              <div className="text-[10px] uppercase tracking-wider text-[#5e5d59]">{slot.sub}</div>
            </div>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => onClear(slot.key)}
              className="text-[10px] text-[#5e5d59] hover:text-[#c96442]"
              title="清空这一天"
            >清空</button>
          )}
        </div>

        <div className="mt-3 space-y-2 flex-1">
          {items.length === 0 ? (
            <div className="h-full min-h-[120px] flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-[#e8e3d2] bg-[#fbf3da]/40">
              <span className="text-2xl opacity-50">＋</span>
              <div className="text-xs text-[#5e5d59] mt-1">从下方拖一块进来</div>
            </div>
          ) : (
            items.map((a) => (
              <Block
                key={a.id}
                activity={a}
                fromSlot={slot.key}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onRemove={(id) => onRemove(id, slot.key)}
                draggingId={draggingId}
              />
            ))
          )}
        </div>

        <div className="text-[10px] text-[#5e5d59]/80 mt-3 italic">{slot.hint}</div>
      </div>
    );
  }

  function WeekendPlannerSection() {
    const { weekendActivities, plan, moveActivity, clearSlot, addCustomActivity, removeCustomActivity } = useApp();
    const [draggingId, setDraggingId] = useState(null);
    const [tagFilter, setTagFilter] = useState('全部');
    const [showCustom, setShowCustom] = useState(false);
    const [draftEmoji, setDraftEmoji] = useState(customEmojiPalette[0]);
    const [draftLabel, setDraftLabel] = useState('');
    const [draftDuration, setDraftDuration] = useState('');
    const [draftTag, setDraftTag] = useState('');
    const [draftColor, setDraftColor] = useState(customColorPalette[0]);

    const handleAddCustom = () => {
      if (!draftLabel.trim()) return;
      addCustomActivity({
        emoji: draftEmoji,
        label: draftLabel,
        duration: draftDuration,
        tag: draftTag,
        color: draftColor,
      });
      setDraftLabel('');
      setDraftDuration('');
      setDraftTag('');
      setShowCustom(false);
    };

    const used = useMemo(() => {
      return new Set([...plan.friday, ...plan.saturday, ...plan.sunday]);
    }, [plan]);

    const allTags = useMemo(() => {
      const set = new Set(['全部']);
      weekendActivities.forEach((a) => set.add(a.tag));
      return Array.from(set);
    }, [weekendActivities]);

    const poolItems = weekendActivities.filter((a) => {
      if (used.has(a.id)) return false;
      if (tagFilter === '全部') return true;
      return a.tag === tagFilter;
    });

    const fillSlot = (key) => plan[key].map((id) => weekendActivities.find((a) => a.id === id)).filter(Boolean);

    return (
      <section className="paper-card paper-card-honey p-6 h-full flex flex-col">
        <div className="tape" style={{ left: 40, background: 'linear-gradient(180deg, rgba(217,119,87,0.6), rgba(217,119,87,0.32))' }}></div>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-[#5e5d59]">weekend planner</div>
            <h2 className="font-display text-3xl text-[#2d2a24] leading-tight">
              拼一个<span className="text-[#c96442]">温柔的周末</span>
            </h2>
            <div className="font-hand text-xl text-[#d97757] mt-1">drag the little blocks into your days</div>
          </div>
          <div className="text-xs text-[#5e5d59] bg-[#fbf3da] border border-dashed border-[#e8e3d2] rounded-lg px-3 py-2 max-w-xs">
            想做的事像贴纸,从下面"选择池"拖到 <b>周五晚 / 周六 / 周日</b> 三个时间段。已使用的会自动从池里隐去。
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {slots.map((s) => (
            <Slot
              key={s.key}
              slot={s}
              items={fillSlot(s.key)}
              draggingId={draggingId}
              onDragStart={setDraggingId}
              onDragEnd={() => setDraggingId(null)}
              onDrop={(id, from) => moveActivity(id, from, s.key)}
              onClear={clearSlot}
              onRemove={(id, from) => moveActivity(id, from, 'pool')}
            />
          ))}
        </div>

        <div className="mt-5 pt-5 border-t border-dashed border-[#e8e3d2]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            try {
              const payload = JSON.parse(e.dataTransfer.getData('text/plain') || '{}');
              if (payload.id && payload.from !== 'pool') moveActivity(payload.id, payload.from, 'pool');
            } catch (err) {}
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg text-[#2d2a24]">选择池</span>
              <span className="font-hand text-base text-[#d97757]">activity pool · {poolItems.length}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex flex-wrap gap-1">
                {allTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTagFilter(t)}
                    className={`px-2 py-0.5 rounded-full text-[11px] border transition ${
                      tagFilter === t
                        ? 'bg-[#c96442] text-white border-[#c96442]'
                        : 'bg-[#fdf6dd]/60 text-[#5e5d59] border-[#e8e3d2] hover:border-[#c96442]/40'
                    }`}
                  >{t}</button>
                ))}
              </div>
              <button
                onClick={() => setShowCustom((v) => !v)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] border transition flex items-center gap-1 ${
                  showCustom
                    ? 'bg-[#d98b7c] text-white border-[#d98b7c]'
                    : 'bg-[#fdf6dd]/80 text-[#d98b7c] border-[#d98b7c]/60 hover:border-[#d98b7c]'
                }`}
              >
                <span>{showCustom ? '×' : '＋'}</span>
                <span>{showCustom ? '收起' : '加一个我自己的'}</span>
              </button>
            </div>
          </div>

          {showCustom && (
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-[#fde6c8] to-[#f6cfb6] border border-dashed border-[#d98b7c]/60 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="font-hand text-base text-[#b8533a]">写一个只属于你的小事 ✨</span>
                <span className="text-[10px] text-[#5e5d59]">不限制选择,做什么都可以</span>
              </div>
              <div className="grid grid-cols-12 gap-2 mb-2">
                <input
                  value={draftLabel}
                  onChange={(e) => setDraftLabel(e.target.value)}
                  placeholder="想做的事..."
                  className="col-span-12 md:col-span-6 px-3 py-2 rounded-lg bg-[#fdf6dd]/80 border border-[#e8d6b2] text-sm focus:outline-none focus:border-[#d98b7c]"
                />
                <input
                  value={draftDuration}
                  onChange={(e) => setDraftDuration(e.target.value)}
                  placeholder="时长 · 2h / 半天 / 随心"
                  className="col-span-7 md:col-span-3 px-3 py-2 rounded-lg bg-[#fdf6dd]/80 border border-[#e8d6b2] text-sm focus:outline-none focus:border-[#d98b7c]"
                />
                <input
                  value={draftTag}
                  onChange={(e) => setDraftTag(e.target.value)}
                  placeholder="标签"
                  className="col-span-5 md:col-span-3 px-3 py-2 rounded-lg bg-[#fdf6dd]/80 border border-[#e8d6b2] text-sm focus:outline-none focus:border-[#d98b7c]"
                />
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {customEmojiPalette.map((e) => (
                    <button
                      key={e}
                      onClick={() => setDraftEmoji(e)}
                      className={`w-7 h-7 rounded-md text-base flex items-center justify-center transition ${
                        draftEmoji === e
                          ? 'bg-[#fdf6dd] border-2 border-[#d98b7c]'
                          : 'bg-[#fdf6dd]/40 border border-[#e8d6b2] hover:border-[#d98b7c]/60'
                      }`}
                    >{e}</button>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {customColorPalette.map((c) => (
                    <button
                      key={c}
                      onClick={() => setDraftColor(c)}
                      className={`w-5 h-5 rounded-full transition ${draftColor === c ? 'ring-2 ring-offset-2 ring-[#2d2a24]/50' : ''}`}
                      style={{ background: c }}
                    ></button>
                  ))}
                </div>
                <button
                  onClick={handleAddCustom}
                  disabled={!draftLabel.trim()}
                  className="ml-auto px-3 py-1.5 rounded-lg bg-[#c96442] text-white text-sm hover:bg-[#b8533a] transition disabled:opacity-40 disabled:cursor-not-allowed"
                >贴进选择池</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {poolItems.map((a) => (
              <div key={a.id} className="relative group">
                <Block
                  activity={a}
                  fromSlot="pool"
                  onDragStart={setDraggingId}
                  onDragEnd={() => setDraggingId(null)}
                  draggingId={draggingId}
                  compact
                />
                {a.custom && (
                  <button
                    onClick={() => removeCustomActivity(a.id)}
                    title="彻底删除这个自定义活动"
                    className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-[#fdf6dd] border border-[#d98b7c] text-[#d98b7c] text-[10px] opacity-0 group-hover:opacity-100 transition flex items-center justify-center hover:bg-[#d98b7c] hover:text-white"
                  >✕</button>
                )}
              </div>
            ))}
            {poolItems.length === 0 && (
              <div className="col-span-full text-center text-xs text-[#5e5d59] py-4">
                这周的活动都安排好了 🎉 — 也可以拖回这里取消
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  window.__SHAPE__.sections.WeekendPlannerSection = WeekendPlannerSection;
})();
