(function () {
  const { useState, useMemo } = React;
  const { useApp } = window.__SHAPE__.context;

  function KraftCover({ book, size }) {
    const dims = size === 'sm'
      ? { w: 36, h: 50, title: 'text-[8px]', author: 'text-[6px]', pad: 'p-1' }
      : size === 'md'
      ? { w: 48, h: 64, title: 'text-[9px]', author: 'text-[7px]', pad: 'p-1.5' }
      : { w: 64, h: 88, title: 'text-[11px]', author: 'text-[8px]', pad: 'p-2' };
    return (
      <div
        className={`kraft-cover rounded-[3px] shrink-0 ${dims.pad} flex flex-col text-left`}
        style={{ width: dims.w, height: dims.h }}
        title={`${book.title} · ${book.author}`}
      >
        <span className="kraft-tint" style={{ background: book.cover }} aria-hidden="true"></span>
        <span className="kraft-band" aria-hidden="true"></span>
        <div className={`font-ming ${dims.title} text-[#fff3dc] leading-[1.05] tracking-tight line-clamp-3 drop-shadow-[1px_1px_0_rgba(40,20,5,0.6)]`}>
          {book.title}
        </div>
        <div className="mt-auto flex items-end justify-between text-[#fff3dc]/85">
          <div className={`font-hand ${dims.author} leading-none drop-shadow-[1px_1px_0_rgba(40,20,5,0.5)]`}>
            {book.author}
          </div>
          <div className="text-[6px] tracking-widest opacity-80">BOOK</div>
        </div>
      </div>
    );
  }

  function BookSection() {
    const { books, bookLibrary, addBookFromLibrary, setBookProgress, removeBook } = useApp();
    const [query, setQuery] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [activeBookId, setActiveBookId] = useState(books[0] ? books[0].id : null);

    const filteredLib = useMemo(() => {
      const existed = new Set(books.map((b) => b.title));
      const list = bookLibrary.filter((b) => !existed.has(b.title));
      if (!query.trim()) return list;
      const q = query.trim().toLowerCase();
      return list.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }, [query, books, bookLibrary]);

    const activeBook = books.find((b) => b.id === activeBookId) || books[0];

    return (
      <section className="paper-card paper-card-peach p-6 h-full flex flex-col">
        <div className="tape" style={{ left: 60, background: 'linear-gradient(180deg, rgba(184,101,74,0.5), rgba(184,101,74,0.3))' }}></div>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-[#5e5d59]">reading log</div>
            <h2 className="font-display text-3xl text-[#2d2a24] leading-tight">最近在读</h2>
            <div className="font-hand text-xl text-[#b8654a] mt-1">book by book, page by page</div>
          </div>
          <button
            onClick={() => setShowPicker((v) => !v)}
            className="px-3 py-1.5 rounded-lg bg-[#b8654a] text-white text-sm hover:bg-[#9c5239] transition flex items-center gap-1"
          >
            <span>＋</span>
            <span>挑一本</span>
          </button>
        </div>

        {showPicker && (
          <div className="mt-4 p-3 rounded-xl bg-[#fbf3da] border border-dashed border-[#b8654a]/40">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-[#5e5d59]">从书架自动填充简介</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜书名或作者..."
                className="flex-1 px-3 py-1.5 rounded-md bg-[#fdf6dd]/70 border border-[#e8e3d2] text-sm focus:outline-none focus:border-[#b8654a]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto scroll-fade pr-1">
              {filteredLib.length === 0 && (
                <div className="col-span-2 text-center text-xs text-[#5e5d59] py-4">书架空空,可以手动新增</div>
              )}
              {filteredLib.map((b) => (
                <button
                  key={b.title}
                  onClick={() => {
                    addBookFromLibrary(b);
                    setShowPicker(false);
                    setQuery('');
                  }}
                  className="text-left p-2 rounded-lg bg-[#fdf6dd]/70 border border-[#e8e3d2] hover:border-[#b8654a]/50 transition group"
                >
                  <div className="flex items-start gap-2">
                    <KraftCover book={b} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-ming text-sm text-[#2d2a24] truncate">{b.title}</div>
                      <div className="text-[11px] text-[#5e5d59]">{b.author}</div>
                      <div className="text-[11px] text-[#5e5d59] line-clamp-2 mt-0.5 leading-snug">{b.summary}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-12 gap-4 flex-1">
          <div className="col-span-12 lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto scroll-fade lg:max-h-[330px] pb-2 lg:pb-0">
            {books.map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveBookId(b.id)}
                className={`relative shrink-0 w-[112px] lg:w-full flex lg:flex-row flex-col items-center lg:items-start gap-2 p-2 rounded-xl border transition text-left ${
                  activeBook && activeBook.id === b.id
                    ? 'bg-[#fbf3e2] border-[#b8654a]/60'
                    : 'bg-[#fdf6dd]/40 border-[#e8e3d2] hover:border-[#b8654a]/30'
                }`}
              >
                <KraftCover book={b} size="md" />
                <div className="lg:flex-1 min-w-0 w-full lg:text-left text-center overflow-hidden">
                  <div className="font-ming text-[13px] text-[#2d2a24] leading-snug line-clamp-2 lg:truncate lg:max-w-[140px]">{b.title}</div>
                  <div className="text-[10px] text-[#5e5d59] truncate mt-0.5">{b.author}</div>
                  <div className="mt-1.5 hidden lg:flex items-center gap-1">
                    <div className="flex-1 h-1 rounded-full bg-[#e8e3d2] overflow-hidden">
                      <div className="h-full bg-[#b8654a]" style={{ width: `${b.progress}%` }}></div>
                    </div>
                    <span className="text-[10px] font-mono-n text-[#5e5d59]">{b.progress}%</span>
                  </div>
                  <div className="mt-1.5 lg:hidden flex items-center gap-1 justify-center">
                    <div className="w-12 h-1 rounded-full bg-[#e8e3d2] overflow-hidden">
                      <div className="h-full bg-[#b8654a]" style={{ width: `${b.progress}%` }}></div>
                    </div>
                    <span className="text-[9px] font-mono-n text-[#5e5d59]">{b.progress}%</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="col-span-12 lg:col-span-8">
            {activeBook && (
              <div className="h-full flex flex-col">
                <div className="flex items-start gap-3">
                  <KraftCover book={activeBook} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <h3 className="font-ming text-xl text-[#2d2a24] leading-snug flex-1 min-w-0 break-words">{activeBook.title}</h3>
                      <button
                        onClick={() => removeBook(activeBook.id)}
                        className="text-[10px] text-[#5e5d59] hover:text-[#c96442] shrink-0 px-1.5 py-0.5 rounded border border-dashed border-[#e8e3d2]"
                        title="从书架移除"
                      >移除</button>
                    </div>
                    <div className="text-sm text-[#5e5d59] mt-1">{activeBook.author}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(activeBook.tags || []).map((t) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#b8654a]/10 text-[#b8654a]">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[#3a352e] leading-relaxed bg-[#fbf3da] border border-dashed border-[#e8e3d2] rounded-lg p-3 flex-1">
                  {activeBook.summary}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs text-[#5e5d59] shrink-0">阅读进度</span>
                  <input
                    type="range"
                    min={0} max={100} step={5}
                    value={activeBook.progress}
                    onChange={(e) => setBookProgress(activeBook.id, parseInt(e.target.value, 10))}
                    className="flex-1 accent-[#b8654a]"
                  />
                  <span className="font-mono-n text-sm text-[#b8654a] w-12 text-right">{activeBook.progress}%</span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {[1,2,3,4,5].map((n) => (
                    <span
                      key={n}
                      className={`text-lg ${n <= (activeBook.rating || 0) ? 'text-[#e7a55a]' : 'text-[#e8e3d2]'}`}
                    >★</span>
                  ))}
                  <span className="text-xs text-[#5e5d59] ml-2">心动指数</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  window.__SHAPE__.sections.BookSection = BookSection;
})();
