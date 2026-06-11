(function () {
  const { useState } = React;
  const { useApp } = window.__SHAPE__.context;

  const scopeChoices = ['日', '周', '月', '季', '年', '长'];
  const goalColorChoices = ['#c96442', '#d97757', '#e7a55a', '#a3a585', '#b8654a', '#7a4a2b', '#d98b7c', '#9eb787'];

  function GoalSection() {
    const { goals, updateGoalProgress, toggleMilestone, addGoal, removeGoal } = useApp();
    const [showAdd, setShowAdd] = useState(false);
    const [title, setTitle] = useState('');
    const [scope, setScope] = useState('年');
    const [total, setTotal] = useState('12');
    const [color, setColor] = useState(goalColorChoices[0]);
    const [milestonesText, setMilestonesText] = useState('');

    const handleAdd = () => {
      if (!title.trim()) return;
      addGoal({
        title,
        scope,
        total,
        color,
        milestones: milestonesText.split('\n'),
      });
      setTitle('');
      setMilestonesText('');
      setTotal('12');
      setShowAdd(false);
    };

    return (
      <section className="paper-card paper-card-rose p-6 h-full flex flex-col">
        <div className="tape" style={{ left: 60, background: 'linear-gradient(180deg, rgba(231,165,90,0.6), rgba(231,165,90,0.35))' }}></div>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-[#5e5d59]">goals · 长期主义</div>
            <h2 className="font-display text-3xl text-[#2d2a24] leading-tight">
              我的<span className="text-[#d97757]">小目标抽屉</span>
            </h2>
            <div className="font-hand text-xl text-[#e7a55a] mt-1">slow goals · soft progress</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-display text-3xl text-[#d97757] leading-none">{goals.length}</div>
              <div className="text-xs text-[#5e5d59]">个在路上</div>
            </div>
            <button
              onClick={() => setShowAdd((v) => !v)}
              className={`px-2.5 py-1.5 rounded-lg text-xs transition ${
                showAdd
                  ? 'bg-[#d97757] text-white'
                  : 'bg-[#fdf6dd]/70 border border-[#d97757]/60 text-[#d97757] hover:bg-[#d97757]/10'
              }`}
            >{showAdd ? '收起' : '＋ 新目标'}</button>
          </div>
        </div>

        {showAdd && (
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-[#fde6c8] to-[#f6cfb6] border border-dashed border-[#d97757]/50 space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="想达成的目标…"
              className="w-full px-3 py-2 rounded-lg bg-[#fdf6dd]/80 border border-[#e8d6b2] text-sm focus:outline-none focus:border-[#d97757]"
            />
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5 flex flex-wrap gap-1">
                {scopeChoices.map((s) => (
                  <button
                    key={s}
                    onClick={() => setScope(s)}
                    className={`w-7 h-7 rounded-md text-xs transition ${
                      scope === s ? 'bg-[#d97757] text-white' : 'bg-[#fdf6dd]/70 border border-[#e8d6b2] text-[#5e5d59] hover:border-[#d97757]/60'
                    }`}
                  >{s}</button>
                ))}
              </div>
              <input
                type="number"
                value={total}
                min={1}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="总进度"
                className="col-span-3 px-3 py-2 rounded-lg bg-[#fdf6dd]/80 border border-[#e8d6b2] text-sm font-mono-n focus:outline-none focus:border-[#d97757]"
              />
              <div className="col-span-4 flex items-center gap-1 flex-wrap">
                {goalColorChoices.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-5 h-5 rounded-full transition ${color === c ? 'ring-2 ring-offset-2 ring-[#2d2a24]/50' : ''}`}
                    style={{ background: c }}
                  ></button>
                ))}
              </div>
            </div>
            <textarea
              value={milestonesText}
              onChange={(e) => setMilestonesText(e.target.value)}
              placeholder="小里程碑(每行一个,选填)"
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-[#fdf6dd]/80 border border-[#e8d6b2] text-xs focus:outline-none focus:border-[#d97757] resize-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-3 py-1.5 rounded-md text-xs text-[#5e5d59] hover:text-[#c96442]"
              >取消</button>
              <button
                onClick={handleAdd}
                disabled={!title.trim()}
                className="px-3 py-1.5 rounded-md bg-[#c96442] text-white text-xs hover:bg-[#b8533a] transition disabled:opacity-40"
              >放进抽屉</button>
            </div>
          </div>
        )}

        <div className="mt-5 space-y-4 flex-1">
          {goals.map((g, i) => {
            const pct = Math.round((g.done / g.total) * 100);
            return (
              <div
                key={g.id}
                className="p-4 rounded-2xl bg-[#fbf3da] border border-[#e8e3d2] hover:border-[#d97757]/40 transition wobble-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-3 group/g">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-display text-lg shrink-0 shadow-inner"
                    style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color}cc)` }}
                  >
                    {g.scope}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg text-[#2d2a24] truncate">{g.title}</h3>
                      <span className="font-mono-n text-sm" style={{ color: g.color }}>
                        {g.done}<span className="text-[#5e5d59]">/{g.total}</span>
                      </span>
                      <button
                        onClick={() => removeGoal(g.id)}
                        title="移除目标"
                        className="opacity-0 group-hover/g:opacity-100 transition text-[#5e5d59] hover:text-[#c96442] text-xs shrink-0"
                      >✕</button>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-2.5 rounded-full bg-[#e8e3d2] overflow-hidden relative">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${g.color}, ${g.color}cc)` }}
                        ></div>
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%)] bg-[length:10px_10px] opacity-40"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateGoalProgress(g.id, -1)}
                          className="w-7 h-7 rounded-md bg-[#fdf6dd] border border-[#e8e3d2] hover:border-[#c96442]/40 text-[#5e5d59] hover:text-[#c96442]"
                        >−</button>
                        <button
                          onClick={() => updateGoalProgress(g.id, 1)}
                          className="w-7 h-7 rounded-md text-white"
                          style={{ background: g.color }}
                        >+</button>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      {g.milestones.map((m, idx) => (
                        <button
                          key={idx}
                          onClick={() => toggleMilestone(g.id, idx)}
                          className={`text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs transition ${
                            m.done
                              ? 'bg-[#fdf6dd]/60 border-[#e8e3d2] text-[#5e5d59] line-through'
                              : 'bg-[#fdf6dd] border-[#e8e3d2] text-[#2d2a24] hover:border-[#d97757]/40'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                              m.done ? 'bg-[#d97757] border-[#d97757] text-white' : 'border-[#b8b5a4]'
                            }`}
                          >{m.done ? '✓' : ''}</span>
                          <span className="truncate">{m.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-[#fbf3e2] to-[#fffaf0] border border-dashed border-[#e7a55a]/50 text-xs text-[#5e5d59] leading-relaxed">
          <span className="font-hand text-base text-[#d97757] mr-2">tiny step:</span>
          每一个 + 都是真实生活里的一小步。不必很大,但要持续。
        </div>
      </section>
    );
  }

  window.__SHAPE__.sections.GoalSection = GoalSection;
})();
