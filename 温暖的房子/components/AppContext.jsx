(function () {
  const { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext } = React;

  const STORAGE_KEY = 'warm-journal-v1';

  function loadStored() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function saveStored(snapshot) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (err) {}
  }

  function usePersisted(key, defaultValue) {
    const stored = loadStored();
    const [state, setState] = useState(
      stored && stored[key] !== undefined ? stored[key] : defaultValue
    );
    return [state, setState];
  }

  const todayLabel = (() => {
    const d = new Date();
    const months = ['一','二','三','四','五','六','七','八','九','十','十一','十二'];
    const weekdays = ['日','一','二','三','四','五','六'];
    return {
      iso: d.toISOString().slice(0,10),
      year: d.getFullYear(),
      monthLabel: `${months[d.getMonth()]}月`,
      day: d.getDate(),
      weekLabel: `星期${weekdays[d.getDay()]}`,
    };
  })();

  const initialDrinks = [
    { id: 'dk1', time: '08:20', name: '冷萃 · 耶加雪菲', mood: '清醒', tag: '黑咖', kcal: 5, emoji: '☕️', color: '#7a4a2b' },
    { id: 'dk2', time: '11:00', name: '蜂蜜柚子茶', mood: '微甜', tag: '果茶', kcal: 95, emoji: '🍵', color: '#e7a55a' },
    { id: 'dk3', time: '15:30', name: '燕麦拿铁', mood: '充电', tag: '奶咖', kcal: 180, emoji: '🥛', color: '#c98c6a' },
  ];

  const drinkPalette = [
    { name: '黑咖', emoji: '☕️', color: '#7a4a2b' },
    { name: '奶咖', emoji: '🥛', color: '#c98c6a' },
    { name: '果茶', emoji: '🍵', color: '#e7a55a' },
    { name: '气泡', emoji: '🥤', color: '#9eb787' },
    { name: '热可可', emoji: '🍫', color: '#8a5a3a' },
    { name: '白水', emoji: '💧', color: '#9bbcd1' },
  ];

  const initialPodcasts = [
    { id: 'pd1', show: '凹凸电波', episode: 'EP142 · 安静的人如何被听见', host: '王掌柜 & 吴瑞琪', duration: 72, progress: 88, vibe: '治愈', emoji: '🎧' },
    { id: 'pd2', show: 'Hardfork', episode: 'When AI Becomes Coworker', host: 'Casey & Kevin', duration: 58, progress: 45, vibe: '思考', emoji: '🧠' },
    { id: 'pd3', show: '声东击西', episode: '一个人住进山里的第三年', host: '徐涛', duration: 65, progress: 100, vibe: '远方', emoji: '🌿' },
  ];

  const initialBooks = [
    {
      id: 'bk1',
      title: '夜晚的潜水艇',
      author: '陈春成',
      cover: '#c96442',
      progress: 62,
      tags: ['短篇', '想象力'],
      summary: '九则短篇像九艘潜艇，把博尔赫斯式的奇想与江南记忆藏进褶皱里。文字凉而沉，适合在台灯下慢慢翻读，每篇结束都像深海上浮，舍不得回到现实。',
      rating: 5,
    },
    {
      id: 'bk2',
      title: '安静：内向性格的竞争力',
      author: '苏珊·凯恩',
      cover: '#7a4a2b',
      progress: 40,
      tags: ['INFJ', '自我'],
      summary: '为内向者写的一本温和而有力的辩护。书里告诉你独处不是缺陷，而是另一种与世界相处的方式，特别适合反复合上书页发呆的午后。',
      rating: 4,
    },
    {
      id: 'bk3',
      title: '一只特立独行的猪',
      author: '王小波',
      cover: '#a3a585',
      progress: 100,
      tags: ['杂文', '幽默'],
      summary: '小波的杂文集，机敏、温柔、不肯被驯服。读完会想做一个清醒的人，并且笑着说出心里的不同意见。',
      rating: 5,
    },
  ];

  const bookLibrary = [
    {
      title: '正午时踏进光焰',
      author: '柏琳',
      summary: '行走巴尔干八年留下的非虚构笔记，写战争、宗教与日常微光，文字克制有节奏，能让人安静下来。',
      tags: ['非虚构','旅行'],
      cover: '#b8654a',
    },
    {
      title: '云游',
      author: '奥尔加·托卡尔丘克',
      summary: '碎片化的旅程与身体的随笔，像把世界拆成一颗颗琥珀。适合慢读，跳读也不会迷路。',
      tags: ['小说','流动'],
      cover: '#5e5d59',
    },
    {
      title: '人生海海',
      author: '麦家',
      summary: '一个上校的一生在小镇被反复讲述，命运的反复就像潮汐。读完会愿意对自己温柔一点。',
      tags: ['长篇','治愈'],
      cover: '#c96442',
    },
    {
      title: '过敏地带',
      author: '李银河',
      summary: '关于亲密关系与自由的散文集，平静地反思婚姻、独居、衰老与爱，适合一个人吃饭时翻几页。',
      tags: ['散文','女性'],
      cover: '#e7a55a',
    },
  ];

  const initialInfjList = [
    { id: 'fj1', text: '在窗边安静读 30 分钟纸质书', done: true,  vibe: '充电', icon: '📖' },
    { id: 'fj2', text: '写一页只给自己看的日记',         done: true,  vibe: '内观', icon: '✍️' },
    { id: 'fj3', text: '关掉所有通知散步 45 分钟',       done: false, vibe: '复位', icon: '🌳' },
    { id: 'fj4', text: '一个人去看一场冷门电影',         done: false, vibe: '独处', icon: '🎬' },
    { id: 'fj5', text: '给一位老朋友写一封长消息',       done: false, vibe: '连接', icon: '💌' },
    { id: 'fj6', text: '整理书架并丢掉 5 样东西',        done: false, vibe: '清理', icon: '🧹' },
    { id: 'fj7', text: '为自己做一顿慢一点的晚饭',       done: false, vibe: '滋养', icon: '🍳' },
    { id: 'fj8', text: '冥想 15 分钟,不要刷手机',        done: false, vibe: '安住', icon: '🪷' },
  ];

  const weekendActivities = [
    { id: 'wa1',  emoji: '🥾', label: '近郊爬山',          duration: '半天',   tag: '自然', color: '#a3a585' },
    { id: 'wa2',  emoji: '🚴', label: '骑行环线',          duration: '2h',     tag: '运动', color: '#c98c6a' },
    { id: 'wa3',  emoji: '🌆', label: 'City Walk',         duration: '3h',     tag: '城市', color: '#c96442' },
    { id: 'wa4',  emoji: '🚆', label: '探索周边小城',      duration: '一整天', tag: '旅行', color: '#7a4a2b' },
    { id: 'wa5',  emoji: '🖼️', label: '看一场美术展',      duration: '2h',     tag: '艺术', color: '#b8654a' },
    { id: 'wa6',  emoji: '☕️', label: '独立咖啡馆躺平',    duration: '90m',    tag: '独处', color: '#8a5a3a' },
    { id: 'wa7',  emoji: '📚', label: '独立书店淘书',      duration: '2h',     tag: '阅读', color: '#5e5d59' },
    { id: 'wa8',  emoji: '🎬', label: '艺术影院看老片',    duration: '2.5h',   tag: '光影', color: '#2d2a24' },
    { id: 'wa9',  emoji: '🪴', label: '逛花鸟市场',        duration: '90m',    tag: '生活', color: '#9eb787' },
    { id: 'wa10', emoji: '🍳', label: '复刻一道新菜',      duration: '2h',     tag: '厨房', color: '#e7a55a' },
    { id: 'wa11', emoji: '💌', label: '手写一封长信',      duration: '60m',    tag: '内观', color: '#d98b7c' },
    { id: 'wa12', emoji: '🧘', label: '瑜伽/冥想课',       duration: '75m',    tag: '正念', color: '#a3a585' },
    { id: 'wa13', emoji: '🥯', label: '早市 + 慢早餐',     duration: '90m',    tag: '清晨', color: '#e7a55a' },
    { id: 'wa14', emoji: '📷', label: '胶片漫拍小巷',      duration: '半天',   tag: '记录', color: '#7a4a2b' },
    { id: 'wa15', emoji: '🎶', label: '小酒馆听 Livehouse',duration: '3h',     tag: '音乐', color: '#c96442' },
    { id: 'wa16', emoji: '♨️', label: '泡温泉/桑拿',       duration: '2h',     tag: '放松', color: '#d97757' },
    { id: 'wa17', emoji: '🐕', label: '逗一只陌生小狗',    duration: '随缘',   tag: '可爱', color: '#e7a55a' },
    { id: 'wa18', emoji: '✒️', label: '写本周复盘',        duration: '45m',    tag: '复盘', color: '#5e5d59' },
    { id: 'wa19', emoji: '🏕️', label: '近郊露营一夜',      duration: '一整天', tag: '自然', color: '#7a8a4a' },
    { id: 'wa20', emoji: '🌸', label: '公园看花发呆',      duration: '90m',    tag: '自然', color: '#d98b7c' },
    { id: 'wa21', emoji: '🏃', label: '河边慢跑',           duration: '40m',    tag: '运动', color: '#a3a585' },
    { id: 'wa22', emoji: '🧗', label: '攀岩馆挑战',         duration: '2h',     tag: '运动', color: '#b8654a' },
    { id: 'wa23', emoji: '🛍️', label: '逛设计师市集',      duration: '半天',   tag: '城市', color: '#d97757' },
    { id: 'wa24', emoji: '🏙️', label: '老街扫街拍照',      duration: '2h',     tag: '城市', color: '#7a4a2b' },
    { id: 'wa25', emoji: '🚄', label: '高铁周边一日往返',   duration: '一整天', tag: '旅行', color: '#5e5d59' },
    { id: 'wa26', emoji: '🏨', label: '订一家民宿住一晚',   duration: '过夜',   tag: '旅行', color: '#c96442' },
    { id: 'wa27', emoji: '🎨', label: '画一张水彩',         duration: '90m',    tag: '艺术', color: '#e7a55a' },
    { id: 'wa28', emoji: '📸', label: '拍立得记录一天',     duration: '随心',   tag: '记录', color: '#b8654a' },
    { id: 'wa29', emoji: '🍝', label: '复刻意大利面',       duration: '90m',    tag: '厨房', color: '#c98c6a' },
    { id: 'wa30', emoji: '🧁', label: '做一个磅蛋糕',       duration: '2h',     tag: '厨房', color: '#e7a55a' },
    { id: 'wa31', emoji: '📔', label: '写感恩日记',         duration: '20m',    tag: '内观', color: '#a3a585' },
    { id: 'wa32', emoji: '🧘‍♀️', label: '呼吸练习 10 分钟',  duration: '10m',    tag: '正念', color: '#9eb787' },
    { id: 'wa33', emoji: '🌅', label: '看一次日出',         duration: '60m',    tag: '清晨', color: '#e7a55a' },
    { id: 'wa34', emoji: '🎹', label: '弹一首老钢琴曲',     duration: '45m',    tag: '音乐', color: '#7a4a2b' },
    { id: 'wa35', emoji: '🛁', label: '泡一次香薰澡',       duration: '40m',    tag: '放松', color: '#d98b7c' },
    { id: 'wa36', emoji: '🦆', label: '去公园喂鸭子',       duration: '40m',    tag: '可爱', color: '#9eb787' },
    { id: 'wa37', emoji: '🐈', label: '逛猫咖一下午',       duration: '2h',     tag: '可爱', color: '#c98c6a' },
    { id: 'wa38', emoji: '📜', label: '写本月复盘',         duration: '60m',    tag: '复盘', color: '#7a4a2b' },
    { id: 'wa39', emoji: '🗂️', label: '整理书架按主题',     duration: '90m',    tag: '复盘', color: '#a3a585' },
    { id: 'wa40', emoji: '📖', label: '图书馆呆一下午',     duration: '半天',   tag: '阅读', color: '#5e5d59' },
    { id: 'wa41', emoji: '🎞️', label: '看一部黑白老片',     duration: '2h',     tag: '光影', color: '#2d2a24' },
    { id: 'wa42', emoji: '🍵', label: '一个人去喝下午茶',   duration: '90m',    tag: '独处', color: '#c98c6a' },
    { id: 'wa43', emoji: '📅', label: '提前规划下一周',     duration: '30m',    tag: '复盘', color: '#c96442' },
  ];

  const initialPlan = {
    friday:   ['wa6', 'wa11'],
    saturday: ['wa1', 'wa9', 'wa10'],
    sunday:   ['wa7', 'wa18'],
  };

  const initialMatrix = {
    q1: [
      { id: 'm1', text: '今晚回母亲电话',     emoji: '📞' },
      { id: 'm2', text: '提交项目阶段汇报',   emoji: '📨' },
    ],
    q2: [
      { id: 'm3', text: '每周锻炼 3 次',       emoji: '🏃' },
      { id: 'm4', text: '读《安静》20 页',     emoji: '📖' },
      { id: 'm5', text: '把书架按主题重新分', emoji: '🗂️' },
    ],
    q3: [
      { id: 'm6', text: '回复非紧急工作群消息', emoji: '💬' },
      { id: 'm7', text: '帮同事看一下方案',     emoji: '👀' },
    ],
    q4: [
      { id: 'm8', text: '随便刷一会短视频',     emoji: '📱' },
      { id: 'm9', text: '反复纠结某条社交动态', emoji: '🌀' },
    ],
  };

  const initialGoals = [
    {
      id: 'g1',
      title: '今年读完 24 本书',
      scope: '年',
      done: 14, total: 24,
      color: '#c96442',
      milestones: [
        { text: '上半年 12 本', done: true },
        { text: '完成 4 本非虚构', done: true },
        { text: '写下 6 篇读后感', done: false },
      ],
    },
    {
      id: 'g2',
      title: '每周一次徒步或骑行',
      scope: '周',
      done: 6, total: 12,
      color: '#a3a585',
      milestones: [
        { text: '本月装备到位', done: true },
        { text: '解锁 3 条新路线', done: false },
      ],
    },
    {
      id: 'g3',
      title: '搬到带阳台的小公寓',
      scope: '季',
      done: 2, total: 5,
      color: '#d97757',
      milestones: [
        { text: '攒够保证金', done: true },
        { text: '看 6 间房',   done: false },
        { text: '处理旧家具', done: false },
      ],
    },
  ];

  const AppContext = createContext(null);

  function AppProvider({ children }) {
    const [drinks, setDrinks] = usePersisted('drinks', initialDrinks);
    const [podcasts, setPodcasts] = usePersisted('podcasts', initialPodcasts);
    const [books, setBooks] = usePersisted('books', initialBooks);
    const [infjList, setInfjList] = usePersisted('infjList', initialInfjList);
    const [plan, setPlan] = usePersisted('plan', initialPlan);
    const [matrix, setMatrix] = usePersisted('matrix', initialMatrix);
    const [goals, setGoals] = usePersisted('goals', initialGoals);
    const [mood, setMood] = usePersisted('mood', { emoji: '🌤️', note: '今天是温温的一天', weather: 'sunny' });
    const [customActivities, setCustomActivities] = usePersisted('customActivities', []);
    const firstRun = useRef(true);

    useEffect(() => {
      if (firstRun.current) { firstRun.current = false; return; }
      saveStored({ drinks, podcasts, books, infjList, plan, matrix, goals, mood, customActivities });
    }, [drinks, podcasts, books, infjList, plan, matrix, goals, mood, customActivities]);

    const updateMood = useCallback((patch) => {
      setMood((prev) => ({ ...prev, ...patch }));
    }, []);

    const resetAll = useCallback(() => {
      if (!window.confirm('确定要把所有记录恢复到示例数据吗?')) return;
      setDrinks(initialDrinks);
      setPodcasts(initialPodcasts);
      setBooks(initialBooks);
      setInfjList(initialInfjList);
      setPlan(initialPlan);
      setMatrix(initialMatrix);
      setGoals(initialGoals);
      setMood({ emoji: '🌤️', note: '今天是温温的一天', weather: 'sunny' });
      setCustomActivities([]);
    }, []);

    const addCustomActivity = useCallback((a) => {
      if (!a || !a.label || !a.label.trim()) return;
      setCustomActivities((prev) => [
        ...prev,
        {
          id: `wa-c${Date.now()}`,
          emoji: a.emoji || '✨',
          label: a.label.trim(),
          duration: (a.duration || '随心').trim(),
          tag: (a.tag || '自定义').trim(),
          color: a.color || '#d98b7c',
          custom: true,
        },
      ]);
    }, []);

    const removeCustomActivity = useCallback((id) => {
      setCustomActivities((prev) => prev.filter((a) => a.id !== id));
      setPlan((prev) => ({
        friday: prev.friday.filter((x) => x !== id),
        saturday: prev.saturday.filter((x) => x !== id),
        sunday: prev.sunday.filter((x) => x !== id),
      }));
    }, []);

    const addDrink = useCallback((d) => {
      setDrinks((prev) => [...prev, { ...d, id: `dk${Date.now()}` }]);
    }, []);
    const removeDrink = useCallback((id) => {
      setDrinks((prev) => prev.filter((x) => x.id !== id));
    }, []);

    const addPodcast = useCallback((p) => {
      setPodcasts((prev) => [...prev, { ...p, id: `pd${Date.now()}` }]);
    }, []);
    const updatePodcastProgress = useCallback((id, progress) => {
      setPodcasts((prev) => prev.map((x) => x.id === id ? { ...x, progress } : x));
    }, []);
    const removePodcast = useCallback((id) => {
      setPodcasts((prev) => prev.filter((x) => x.id !== id));
    }, []);

    const addBookFromLibrary = useCallback((libBook) => {
      setBooks((prev) => [
        ...prev,
        { ...libBook, id: `bk${Date.now()}`, progress: 0, rating: 0 },
      ]);
    }, []);
    const setBookProgress = useCallback((id, progress) => {
      setBooks((prev) => prev.map((b) => b.id === id ? { ...b, progress } : b));
    }, []);
    const removeBook = useCallback((id) => {
      setBooks((prev) => prev.filter((b) => b.id !== id));
    }, []);

    const toggleInfj = useCallback((id) => {
      setInfjList((prev) => prev.map((x) => x.id === id ? { ...x, done: !x.done } : x));
    }, []);

    const addInfj = useCallback((entry) => {
      if (!entry || !entry.text || !entry.text.trim()) return;
      setInfjList((prev) => [
        ...prev,
        {
          id: `fj${Date.now()}`,
          text: entry.text.trim(),
          done: false,
          vibe: (entry.vibe || '自定义').trim() || '自定义',
          icon: entry.icon || '🌷',
        },
      ]);
    }, []);

    const removeInfj = useCallback((id) => {
      setInfjList((prev) => prev.filter((x) => x.id !== id));
    }, []);

    const moveActivity = useCallback((activityId, fromSlot, toSlot) => {
      setPlan((prev) => {
        const next = { friday: [...prev.friday], saturday: [...prev.saturday], sunday: [...prev.sunday] };
        if (fromSlot === 'pool') {
          if (toSlot === 'pool') return prev;
          if (next[toSlot].includes(activityId)) return prev;
          next[toSlot] = [...next[toSlot], activityId];
        } else if (toSlot === 'pool') {
          next[fromSlot] = next[fromSlot].filter((x) => x !== activityId);
        } else {
          next[fromSlot] = next[fromSlot].filter((x) => x !== activityId);
          if (!next[toSlot].includes(activityId)) {
            next[toSlot] = [...next[toSlot], activityId];
          }
        }
        return next;
      });
    }, []);

    const clearSlot = useCallback((slot) => {
      setPlan((prev) => ({ ...prev, [slot]: [] }));
    }, []);

    const moveMatrixItem = useCallback((itemId, fromQ, toQ) => {
      if (fromQ === toQ) return;
      setMatrix((prev) => {
        const item = prev[fromQ].find((x) => x.id === itemId);
        if (!item) return prev;
        return {
          ...prev,
          [fromQ]: prev[fromQ].filter((x) => x.id !== itemId),
          [toQ]: [...prev[toQ], item],
        };
      });
    }, []);
    const addMatrixItem = useCallback((q, text) => {
      if (!text.trim()) return;
      setMatrix((prev) => ({
        ...prev,
        [q]: [...prev[q], { id: `m${Date.now()}`, text: text.trim(), emoji: '✦' }],
      }));
    }, []);
    const removeMatrixItem = useCallback((q, id) => {
      setMatrix((prev) => ({ ...prev, [q]: prev[q].filter((x) => x.id !== id) }));
    }, []);

    const updateGoalProgress = useCallback((id, delta) => {
      setGoals((prev) => prev.map((g) =>
        g.id === id ? { ...g, done: Math.max(0, Math.min(g.total, g.done + delta)) } : g
      ));
    }, []);
    const toggleMilestone = useCallback((goalId, idx) => {
      setGoals((prev) => prev.map((g) => {
        if (g.id !== goalId) return g;
        const ms = g.milestones.map((m, i) => i === idx ? { ...m, done: !m.done } : m);
        return { ...g, milestones: ms };
      }));
    }, []);

    const addGoal = useCallback((g) => {
      if (!g || !g.title || !g.title.trim()) return;
      const total = Math.max(1, parseInt(g.total, 10) || 12);
      setGoals((prev) => [
        ...prev,
        {
          id: `g${Date.now()}`,
          title: g.title.trim(),
          scope: g.scope || '年',
          done: 0,
          total,
          color: g.color || '#c96442',
          milestones: (g.milestones || [])
            .map((t) => (t || '').trim())
            .filter(Boolean)
            .map((text) => ({ text, done: false })),
        },
      ]);
    }, []);

    const removeGoal = useCallback((id) => {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    }, []);

    const allActivities = useMemo(
      () => [...weekendActivities, ...customActivities],
      [customActivities]
    );

    const value = useMemo(() => ({
      todayLabel,
      drinks, drinkPalette, addDrink, removeDrink,
      podcasts, addPodcast, updatePodcastProgress, removePodcast,
      books, bookLibrary, addBookFromLibrary, setBookProgress, removeBook,
      infjList, toggleInfj, addInfj, removeInfj,
      weekendActivities: allActivities,
      customActivities, addCustomActivity, removeCustomActivity,
      plan, moveActivity, clearSlot,
      matrix, moveMatrixItem, addMatrixItem, removeMatrixItem,
      goals, updateGoalProgress, toggleMilestone, addGoal, removeGoal,
      mood, updateMood,
      resetAll,
    }), [
      drinks, podcasts, books, infjList, plan, matrix, goals, mood,
      customActivities, allActivities,
      addDrink, removeDrink, addPodcast, updatePodcastProgress, removePodcast,
      addBookFromLibrary, setBookProgress, removeBook,
      toggleInfj, addInfj, removeInfj,
      moveActivity, clearSlot, moveMatrixItem, addMatrixItem, removeMatrixItem,
      updateGoalProgress, toggleMilestone, addGoal, removeGoal,
      updateMood, resetAll,
      addCustomActivity, removeCustomActivity,
    ]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
  }

  function useApp() {
    return useContext(AppContext);
  }

  window.__SHAPE__.context = { AppProvider, useApp };
})();
