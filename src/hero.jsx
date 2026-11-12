import { useState } from "react";

// ===== ДАНІ ГЕРОЯ (змінюй тут) =====
const DEFAULT_HERO = {
  name: "Непроромній",
  level: 75,
  clan: "Legion Sankt", // став null, якщо без клану
  role: "Лідер клану",
  // Сила, Життя, Удача, Броня, Енергія
  stats: [3200, 2400, 900, 1500, 600],
};
// ====================================

const STATS = [
  {
    icon: "💪",
    name: "Сила",
    text: "Визначає урон, який ти наносиш противнику. Найважливіший параметр. Урон може бути частково або повністю поглинутий Бронею противника.",
  },
  {
    icon: "❤️",
    name: "Життя",
    text: "Визначає максимальну кількість здоров'я. Дуже корисна характеристика із середньою ціною тренування.",
  },
  {
    icon: "🍀",
    name: "Удача",
    text: "Визначає ймовірність критичного удару. Допомагає зменшити урон противника.",
  },
  {
    icon: "🛡️",
    name: "Броня",
    text: "Визначає, скільки урону можна заблокувати. Зменшує ефективність Сили противника.",
  },
  {
    icon: "⚡",
    name: "Енергія",
    text: "Визначає максимальну кількість енергії. Корисна характеристика з важливою ціною тренування.",
  },
];

const SECTIONS = [
  { id: "equip", title: "Спорядження" },
  { id: "bag", title: "Сумка" },
  { id: "skills", title: "Вміння" },
  { id: "training", title: "Тренування" },
  { id: "boosts", title: "Підсилення" },
];

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

const styles = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    color: C.text,
    fontFamily: "Georgia, 'Times New Roman', serif",
    maxWidth: 480,
    margin: "0 auto",
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
  topTitle: { color: C.gold, fontSize: "1.1rem", fontWeight: 700, flex: 1 },
  back: {
    background: "none",
    border: 0,
    color: C.gold,
    fontSize: "1.4rem",
    padding: "0 10px 0 0",
    cursor: "pointer",
  },
  head: {
    textAlign: "center",
    padding: 16,
    borderBottom: `2px solid ${C.line}`,
  },
  name: { margin: "0 0 4px", color: C.gold, fontSize: "1.6rem" },
  power: { fontSize: "1.25rem", marginTop: 8 },
  h4: { margin: 0, padding: "14px 14px 4px", color: C.gold, fontSize: "1.05rem" },
  stat: { padding: "10px 14px", borderBottom: `1px dotted ${C.line}` },
  statLine: { display: "flex", justifyContent: "space-between", fontSize: "1.05rem" },
  statText: { display: "block", color: C.muted, fontSize: ".78rem", marginTop: 4, lineHeight: 1.35 },
  item: {
    display: "block",
    width: "100%",
    textAlign: "left",
    background: C.row,
    color: C.gold,
    border: 0,
    borderBottom: `1px dotted ${C.line}`,
    padding: "16px 14px",
    fontSize: "1.1rem",
    fontFamily: "inherit",
    cursor: "pointer",
  },
  stub: { padding: 16, color: C.muted },
};

function ClanLine({ clan, role }) {
  if (!clan) return <span style={{ color: C.muted }}>Не в клані</span>;
  return (
    <span>
      🏰 {clan}, <span style={{ color: C.green }}>{role}</span>
    </span>
  );
}

function HeroPage({ hero, onOpen }) {
  const power = hero.stats.reduce((a, b) => a + b, 0);

  return (
    <>
      <div style={styles.head}>
        <h2 style={styles.name}>{hero.name}</h2>
        <div>⬆️ {hero.level} рівень</div>
        <div style={{ marginTop: 4 }}>
          <ClanLine clan={hero.clan} role={hero.role} />
        </div>
        <div style={styles.power}>
          Міць: ⚔️ <b>{power}</b>
        </div>
      </div>

      <h4 style={styles.h4}>Характеристики</h4>
      {STATS.map((t, i) => (
        <div key={t.name} style={styles.stat}>
          <div style={styles.statLine}>
            <span>
              {t.icon} {t.name}
            </span>
            <b>{hero.stats[i]}</b>
          </div>
          <small style={styles.statText}>{t.text}</small>
        </div>
      ))}

      <h4 style={styles.h4}>Розділи</h4>
      {SECTIONS.map((s) => (
        <button key={s.id} style={styles.item} onClick={() => onOpen(s.id)}>
          {s.title}
        </button>
      ))}
    </>
  );
}

function SubPage() {
  return <div style={styles.stub}>Розділ у розробці.</div>;
}

export default function Hero({ hero = DEFAULT_HERO }) {
  const [page, setPage] = useState("hero");
  const section = SECTIONS.find((s) => s.id === page);

  return (
    <div style={styles.page}>
      <div style={styles.top}>
        {section && (
          <button style={styles.back} onClick={() => setPage("hero")} aria-label="Назад">
            ←
          </button>
        )}
        <span style={styles.topTitle}>{section ? section.title : "Мій герой"}</span>
      </div>

      {section ? <SubPage /> : <HeroPage hero={hero} onOpen={setPage} />}
    </div>
  );
}
