import { useState } from "react";

// ===== ДАНІ ГЕРОЯ (змінюй тут) =====
const HERO = {
  name: "Новачок",
  level: 0,
  clan: null, // наприклад "Legion Sankt"
  role: "", // наприклад "Лідер клану"
  gold: 0,
  silver: 0,
  crystals: 0,
  exp: 0,
  expNeed: 100,
  stats: [0, 0, 0, 0, 0], // Сила, Життя, Удача, Броня, Енергія
  sharpen: 0,
  bonus: 0,
  bonusMax: 900,
  amulet: 0,
  achievements: 0,
  collections: 0,
  skills: 0,
  bag: 0,
  clanExpBonus: 0,
};
// ====================================

const C = {
  bg: "#17120d",
  bar: "#0f0b07",
  row: "#211a12",
  line: "#4a3a22",
  gold: "#f0c050",
  text: "#e8d9b5",
  muted: "#9a8a68",
  green: "#6ddb6d",
};

const STATS = [
  ["💪", "Сила", "Визначає урон, який ти наносиш противнику. Найважливіший параметр. Урон може бути частково або повністю поглинутий Бронею противника."],
  ["❤️", "Життя", "Визначає максимальну кількість здоров'я. Дуже корисна характеристика із середньою ціною тренування."],
  ["🍀", "Удача", "Визначає ймовірність критичного удару. Допомагає зменшити урон противника."],
  ["🛡️", "Броня", "Визначає, скільки урону можна заблокувати. Зменшує ефективність Сили противника."],
  ["⚡", "Енергія", "Визначає максимальну кількість енергії. Корисна характеристика з важливою ціною тренування."],
];

const LEFT = [["⛑️", "Шолом"], ["⚔️", "Зброя"], ["🥋", "Броня"]];
const RIGHT = [["🧤", "Наплічники"], ["🛡️", "Щит"], ["🥊", "Рукавиці"]];
const BOTTOM = [["👖", "Штани"], ["📿", "Намисто"], ["💍", "Кільце"], ["👢", "Чоботи"]];

const TITLES = {
  achievements: "Досягнення",
  collections: "Колекції",
  equipment: "Спорядження",
  pet: "Улюбленець",
  skills: "Вміння",
  bag: "Сумка",
  chest: "Скриня",
  mail: "Пошта",
  training: "Тренування",
  boosts: "Підсилення",
  colosseum: "Рейтинг колізею",
  league: "Ліга обраних",
  records: "Особисті рекорди залу слави",
  clan: "Мій клан",
  home: "На головну",
};

const s = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    color: C.text,
    fontFamily: "Georgia, 'Times New Roman', serif",
    maxWidth: 480,
    margin: "0 auto",
    paddingBottom: 24,
  },
  top: {
    position: "sticky",
    top: 0,
    zIndex: 5,
    display: "flex",
    alignItems: "center",
    background: C.bar,
    borderBottom: `2px solid ${C.line}`,
    padding: "12px 14px",
  },
  topTitle: { color: C.gold, fontWeight: 700, fontSize: "1.1rem", flex: 1 },
  back: { background: "none", border: 0, color: C.gold, fontSize: "1.4rem", padding: "0 10px 0 0", cursor: "pointer" },
  head: { textAlign: "center", padding: "14px 10px 8px" },
  name: { margin: 0, fontSize: "1.3rem", color: C.text },
  paper: { display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 14, padding: "6px 8px 14px" },
  col: { display: "flex", flexDirection: "column", gap: 10 },
  slot: {
    width: 64,
    height: 64,
    border: `2px dashed ${C.line}`,
    borderRadius: 6,
    background: "#1d160e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.7rem",
    opacity: 0.55,
  },
  slotLabel: { fontSize: ".62rem", color: C.muted, textAlign: "center", marginTop: 2 },
  portrait: {
    width: 150,
    height: 230,
    border: `2px solid ${C.line}`,
    borderRadius: 4,
    background: "linear-gradient(#251c12,#120d08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "4.5rem",
    opacity: 0.8,
  },
  bottomRow: { display: "flex", justifyContent: "center", gap: 12, padding: "0 8px 14px" },
  section: { borderTop: `2px solid ${C.line}` },
  h4: { margin: 0, padding: "14px 14px 4px", color: C.gold, fontSize: "1.05rem" },
  row: {
    display: "block",
    width: "100%",
    textAlign: "left",
    background: C.row,
    color: C.gold,
    border: 0,
    borderBottom: `1px dotted ${C.line}`,
    padding: "14px 14px",
    fontSize: "1.1rem",
    fontFamily: "inherit",
    cursor: "pointer",
  },
  rowSub: { display: "block", color: C.green, fontSize: ".95rem", marginTop: 2 },
  stat: { padding: "10px 14px", borderBottom: `1px dotted ${C.line}` },
  statLine: { display: "flex", justifyContent: "space-between", fontSize: "1.05rem" },
  statText: { display: "block", color: C.muted, fontSize: ".78rem", marginTop: 4, lineHeight: 1.35 },
  info: { padding: "12px 14px", borderBottom: `1px dotted ${C.line}`, lineHeight: 1.6 },
  runes: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 },
  rune: { width: 20, height: 20, borderRadius: "50%", border: `2px dashed ${C.line}` },
  foot: { textAlign: "center", padding: 14, borderTop: `2px solid ${C.line}`, background: C.bar },
  stub: { padding: 16, color: C.muted },
};

function Slot({ icon, label }) {
  return (
    <div>
      <div style={s.slot}>{icon}</div>
      <div style={s.slotLabel}>{label}</div>
    </div>
  );
}

function Row({ id, title, sub, plus, onOpen }) {
  return (
    <button style={s.row} onClick={() => onOpen(id)}>
      {title}
      {plus && <span style={{ color: C.green }}> (+)</span>}
      {sub && <span style={s.rowSub}>{sub}</span>}
    </button>
  );
}

function HeroPage({ h, onOpen }) {
  const power = h.stats.reduce((a, b) => a + b, 0);
  const pct = h.expNeed ? Math.round((h.exp / h.expNeed) * 100) : 0;

  return (
    <>
      <div style={s.head}>
        <h2 style={s.name}>
          🛡️ {h.name} <span style={{ color: C.green }}>⬆️</span> {h.level} рів.
        </h2>
        <div style={{ marginTop: 4 }}>
          {h.clan ? (
            <>
              🏰 <u>{h.clan}</u>, <span style={{ color: C.green }}>{h.role}</span>
            </>
          ) : (
            <span style={{ color: C.muted }}>Не в клані</span>
          )}
        </div>
        <div style={{ marginTop: 4 }}>
          <u>Міць: ⚔️ {power}</u>
        </div>
      </div>

      <div style={s.paper}>
        <div style={s.col}>
          {LEFT.map(([i, l]) => (
            <Slot key={l} icon={i} label={l} />
          ))}
        </div>
        <div style={s.portrait}>🧍</div>
        <div style={s.col}>
          {RIGHT.map(([i, l]) => (
            <Slot key={l} icon={i} label={l} />
          ))}
        </div>
      </div>
      <div style={s.bottomRow}>
        {BOTTOM.map(([i, l]) => (
          <Slot key={l} icon={i} label={l} />
        ))}
      </div>

      <div style={{ ...s.section, ...s.info }}>
        <div style={s.runes}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ ...s.slot, width: 40, height: 40, fontSize: "1rem" }}>
              ✨
            </div>
          ))}
        </div>
      </div>

      <Row id="achievements" title={`Досягнення: ${h.achievements} з 30`} sub="+0 до параметрів" onOpen={onOpen} />
      <Row id="collections" title={`Колекції: ${h.collections} з 14`} sub="+0 до параметрів" onOpen={onOpen} />

      <div style={s.info}>
        <b style={{ color: C.gold }}>Спорядження (0/10)</b>
        <div>Руни:</div>
        <div style={s.runes}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={s.rune} />
          ))}
        </div>
        <div>Заточка: <span style={{ color: C.green }}>+{h.sharpen}</span></div>
        <div>Бонус: <span style={{ color: C.green }}>{h.bonus}</span> з {h.bonusMax}</div>
        <div>Амулет: <span style={{ color: C.green }}>+{h.amulet}%</span></div>
      </div>

      <Row id="pet" title="🐉 Улюбленець" sub="Ще немає" onOpen={onOpen} />
      <Row id="skills" title={`Вміння (${h.skills}/6)`} onOpen={onOpen} />
      <Row id="bag" title={`Сумка (${h.bag}/40)`} onOpen={onOpen} />
      <Row id="chest" title="Скриня" onOpen={onOpen} />
      <Row id="mail" title="Пошта" onOpen={onOpen} />
      <Row id="training" title="Тренування" plus onOpen={onOpen} />
      <Row id="boosts" title="Підсилення" plus onOpen={onOpen} />

      <div style={{ ...s.info, color: C.green }}>Бонус клану до досвіду: {h.clanExpBonus}%</div>
      <div style={s.info}>
        <span style={{ color: C.green }}>⬆️</span> {h.level} рів. · Досвід: {h.exp}/{h.expNeed}{" "}
        <span style={{ color: C.muted }}>({pct}%)</span>
        <div style={{ color: C.green }}>+0 до параметрів</div>
      </div>

      <div style={s.info}>
        <b>Рейтинг колізею</b>
        <div>Без рангу</div>
        <div style={{ color: C.muted, letterSpacing: 4 }}>☆☆☆☆☆☆</div>
      </div>
      <Row id="league" title="Ліга обраних" sub="Місце: —" onOpen={onOpen} />
      <Row id="records" title="Особисті рекорди залу слави" onOpen={onOpen} />

      <div style={s.section}>
        <Row id="hero" title="Мій герой" onOpen={onOpen} />
        <Row id="clan" title="Мій клан" plus onOpen={onOpen} />
        <Row id="home" title="На головну" onOpen={onOpen} />
      </div>

      <div style={s.foot}>
        <div>🛡️ {h.name}</div>
        <div style={{ marginTop: 4 }}>
          <span style={{ color: C.green }}>⬆️</span> {h.level} | 🪙 {h.gold} | ⚪ {h.silver}
        </div>
      </div>

      <h4 style={s.h4}>Характеристики</h4>
      {STATS.map(([icon, name, text], i) => (
        <div key={name} style={s.stat}>
          <div style={s.statLine}>
            <span>{icon} {name}</span>
            <b>{h.stats[i]}</b>
          </div>
          <small style={s.statText}>{text}</small>
        </div>
      ))}
    </>
  );
}

export default function Hero({ hero = HERO }) {
  const [page, setPage] = useState("hero");
  const isHero = page === "hero";

  return (
    <div style={s.page}>
      <div style={s.top}>
        {!isHero && (
          <button style={s.back} onClick={() => setPage("hero")} aria-label="Назад">
            ←
          </button>
        )}
        <span style={s.topTitle}>{isHero ? "Мій герой" : TITLES[page]}</span>
        <span style={{ fontSize: ".95rem" }}>🪙 {hero.gold} | 💎 {hero.crystals}</span>
      </div>

      {isHero ? (
        <HeroPage h={hero} onOpen={setPage} />
      ) : (
        <div style={s.stub}>Розділ у розробці.</div>
      )}
    </div>
  );
  }
