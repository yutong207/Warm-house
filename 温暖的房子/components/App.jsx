(function () {
  const { AppProvider } = window.__SHAPE__.context;
  const { AppHeader } = window.__SHAPE__.layout;
  const { DecoLayer, GrassRow, Sticker } = window.__SHAPE__.deco;
  const {
    DrinkSection,
    PodcastSection,
    BookSection,
    InfjChecklistSection,
    WeekendPlannerSection,
    PrioritySection,
    GoalSection,
    CalendarSummarySection,
  } = window.__SHAPE__.sections;

  function SectionDivider({ label, en, kind = 'flower', color }) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-14 mb-5 flex items-center gap-4">
        <span className="sway"><Sticker kind={kind} size={32} color={color} /></span>
        <div className="font-display text-2xl text-[#2d2a24]">{label}</div>
        <div className="font-hand text-xl text-[#c96442]">{en}</div>
        <div className="flex-1 h-px bg-gradient-to-r from-[#d4a677]/40 via-[#d98b7c]/50 to-[#a3a585]/40"></div>
        <span className="twinkle"><Sticker kind="sparkle" size={18} color="#e7a55a" /></span>
        <span className="pin-dot"></span>
      </div>
    );
  }

  function Footer() {
    return (
      <footer className="max-w-7xl mx-auto px-4 lg:px-10 py-12 mt-6 text-center text-xs text-[#5e5d59]">
        <div className="font-art text-2xl sm:text-3xl text-[#c96442] mb-2 whitespace-nowrap">
          — 欢迎光临美好的一天 —
        </div>
        <p className="leading-relaxed max-w-md mx-auto font-display italic text-base text-[#3a352e]">
          welcome to a beautiful day.
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] flex-wrap">
          <span>warm house</span>
          <span className="w-1 h-1 rounded-full bg-[#c96442]"></span>
          <span>my own dashboard</span>
          <span className="w-1 h-1 rounded-full bg-[#c96442]"></span>
          <span>v 0.1</span>
        </div>
      </footer>
    );
  }

  function App() {
    return (
      <AppProvider>
        <DecoLayer />
        <div className="min-h-full pb-10">
          <AppHeader />

          <CalendarSummarySection />

          <SectionDivider label="今日记一笔" en="daily logs" kind="cloud" />
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <DrinkSection />
            <PodcastSection />
            <BookSection />
          </div>

          <SectionDivider label="周末是我的" en="weekend, for me" kind="tulip" color="#d98b7c" />
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-2">
              <InfjChecklistSection />
            </div>
            <div className="lg:col-span-3">
              <WeekendPlannerSection />
            </div>
          </div>

          <SectionDivider label="人生这件大事" en="life, on purpose" kind="sun" />
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3">
              <PrioritySection />
            </div>
            <div className="lg:col-span-2">
              <GoalSection />
            </div>
          </div>

          <GrassRow />
          <Footer />
        </div>
      </AppProvider>
    );
  }

  window.__SHAPE__.pages.App = App;
})();
