import { useState } from "react";

const C = {
  bg: "#17120d",
  row: "#211a12",
  line: "#4a3a22",
  gold: "#f0c050",
  text: "#e8d9b5",
  muted: "#9a8a68",
  green: "#6ddb6d",
};

export const MAX_LEVEL = 80;

const PETS = [
  { id: "dragon", icon: "🐉", name: "Дракон", skill: "double" },
  { id: "hydra", icon: "🐍", name: "Гідра", skill: "double" },
  { id: "cerberus", icon: "🐕", name: "Цербер", skill: "counter" },
  { id: "phoenix", icon: "🔥", name: "Фенікс", skill: "counter" },
  { id: "tiger", icon: "🐯", name: "Тигр і Пантера", skill: "counter" },
  { id: "griffin", icon: "🦅", name: "Грифон", skill: "double" },
];

const SKILLS = {
  double: {
    name: "Подвійний удар",
    text: "Дає шанс завдати одразу 2 удари",
    base: 5.1,
  },
  counter: {
    name: "Відповідний удар",
    text: "При атаці твого героя противником є шанс вдарити у відповідь бронею",
    base: 7.6,
  },
};

// бонус до параметрів на рівні n
export const bonusAt = (n) => 25 + ((n - 1) % 5) + 14 * Math.floor((n - 1) / 5);

// ціна підвищення до рівня n (n від 2 до 80)
export function upgradeCost(n) {
  if (n % 5 === 1) return { gold: 100 + ((n - 6) / 5) * 175 };
  const k = n - 1 - Math.floor((n - 1) / 5);
  return { silver: 500 + (k - 1) * 1750 };
}

const chanceAt = (skill, n) =>
  Number((SKILLS[skill].base + (n - 1) * 0.1).toFixed(1));

const KEY = "boi-game";
const START = { gold: 0, silver: 0, pets: {}, selected: null };

export function loadGame() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d) return { ...START, ...d };
  } catch (e) {}
  return { ...START };
}

function saveGame(g) {
  try {
    localStorage.setItem(KEY, JSON.stringify(g));
  } catch (e) {}
}

// сумарний бонус від усіх улюбленців (додається до кожного параметра)
export function petStatBonus(g) {
  return Object.values(g.pets).reduce((a, lvl) => a + bonusAt(lvl), 0);
}

const fmt = (n) => n.toLocaleString("uk-UA");
const costText = (c) =>
  c.gold ? "🪙 " + fmt(c.gold) + " золота" : "⚪ " + fmt(c.silver) + " срібла";

const s = {
  info: { padding: "12px 14px", borderBottom: "1px dotted " + C.line },
  center: { textAlign: "center", padding: "12px 14px", borderBottom: "1px dotted " + C.line },
  head: { textAlign: "center", color: C.muted, padding: "12px 14px", borderBottom: "2px solid " + C.line },
  h4: { margin: 0, padding: "12px 14px", textAlign: "center", color: C.muted, borderBottom: "1px dotted " + C.line },
  pet: { display: "flex", gap: 12, padding: "12px 14px", borderBottom: "1px dotted " + C.line },
  thumb: {
    width: 64, height: 64, flexShrink: 0, border: "2px solid " + C.line,
    background: "#120d08", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "2rem",
  },
  big: {
    height: 150, border: "2px solid " + C.line, background: "linear-gradient(#251c12,#120d08)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "5rem", margin: 12,
  },
  btns: { display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" },
  btn: {
    background: "#2a2016", color: C.text, border: "1px solid #6b5230",
    borderRadius: 4, padding: "9px 16px", fontSize: ".95rem",
    fontFamily: "inherit", cursor: "pointer",
  },
  row: {
    display: "block", width: "100%", textAlign: "left", background: C.row,
    color: C.gold, border: 0, borderBottom: "1px dotted " + C.line,
    padding: "14px", fontSize: "1.1rem", fontFamily: "inherit", cursor: "pointer",
  },
};

export default function Pets({ onChange }) {
  const [g, setG] = useState(loadGame);
  const [view, setView] = useState(null);

  const update = (fn) => {
    const next = fn(g);
    setG(next);
    saveGame(next);
    if (onChange) onChange();
  };

  const owned = PETS.filter((p) => g.pets[p.id]).sort(
    (a, b) => g.pets[b.id] - g.pets[a.id]
  );
  const rest = PETS.filter((p) => !g.pets[p.id]);
  const buyPrice = { gold: 250 * Math.pow(2, owned.length) };

  const canPay = (c) => (c.gold ? g.gold >= c.gold : g.silver >= c.silver);
  const pay = (c) =>
    c.gold ? { gold: g.gold - c.gold } : { silver: g.silver - c.silver };

  const buy = (p) => {
    if (!canPay(buyPrice)) return;
    update((x) => ({
      ...x,
      ...pay(buyPrice),
      pets: { ...x.pets, [p.id]: 1 },
      selected: x.selected || p.id,
    }));
  };
  const train = (p) => {
    const lvl = g.pets[p.id];
    if (lvl >= MAX_LEVEL) return;
    const c = upgradeCost(lvl + 1);
    if (!canPay(c)) return;
    update((x) => ({ ...x, ...pay(c), pets: { ...x.pets, [p.id]: lvl + 1 } }));
  };
  const choose = (p) => update((x) => ({ ...x, selected: p.id }));
  const testMoney = () =>
    update((x) => ({ ...x, gold: x.gold + 5000, silver: x.silver + 100000 }));

  const balance = (
    <div style={s.center}>
      🪙 {fmt(g.gold)} золота | ⚪ {fmt(g.silver)} срібла
    </div>
  );

  // ===== Сторінка одного улюбленця =====
  if (view) {
    const p = PETS.find((x) => x.id === view);
    const lvl = g.pets[p.id] || 0;
    const shown = lvl || 1;
    const sk = SKILLS[p.skill];
    const next = lvl && lvl < MAX_LEVEL ? upgradeCost(lvl + 1) : null;

    return (
      <div>
        {balance}
        <div style={s.big}>{p.icon}</div>
        <div style={s.center}>
          <b style={{ color: C.gold, fontSize: "1.2rem" }}>{p.name}</b>
          {g.selected === p.id && <span style={{ color: C.green }}> ✓ Обраний</span>}
          <div>⬆️ Рівень: {shown}</div>
          <div style={{ color: C.green }}>+{bonusAt(shown)} до параметрів</div>

          <div style={{ ...s.btns, justifyContent: "center" }}>
            {!lvl && (
              <>
                <button
                  style={{ ...s.btn, opacity: canPay(buyPrice) ? 1 : 0.4 }}
                  onClick={() => buy(p)}
                >
                  Купити
                </button>
                <div style={{ width: "100%", color: C.muted }}>
                  Ціна: {costText(buyPrice)}
                </div>
              </>
            )}
            {lvl > 0 && next && (
              <>
                <button
                  style={{ ...s.btn, opacity: canPay(next) ? 1 : 0.4 }}
                  onClick={() => train(p)}
                >
                  Тренувати
                </button>
                <div style={{ width: "100%", color: C.muted }}>{costText(next)}</div>
              </>
            )}
            {lvl >= MAX_LEVEL && (
              <div style={{ color: C.muted }}>Максимальний рівень</div>
            )}
            {lvl > 0 && g.selected !== p.id && (
              <button style={s.btn} onClick={() => choose(p)}>
                Обрати
              </button>
            )}
          </div>
        </div>

        <div style={s.center}>
          <span style={{ color: C.muted }}>Вміння: </span>
          <b>{sk.name}</b>
          <div>{sk.text}</div>
          <div style={{ color: C.muted }}>
            Шанс: <span style={{ color: C.text }}>{chanceAt(p.skill, shown)}%</span>
          </div>
          <small style={{ color: C.muted }}>
            У бою діє вміння лише обраного улюбленця.
          </small>
        </div>

        <button style={s.row} onClick={() => setView(null)}>
          🐾 Улюбленці
        </button>
      </div>
    );
  }

  // ===== Список улюбленців =====
  const Card = ({ p }) => {
    const lvl = g.pets[p.id] || 1;
    const has = !!g.pets[p.id];
    return (
      <div style={s.pet}>
        <div style={s.thumb}>{p.icon}</div>
        <div style={{ flex: 1 }}>
          <b style={{ color: C.gold }}>{p.name}</b>
          {g.selected === p.id && <span style={{ color: C.green }}> ✓ Обраний</span>}
          <div>Рівень: {lvl}</div>
          <div style={{ color: C.green }}>+{bonusAt(lvl)} до параметрів</div>
          <div style={s.btns}>
            <button style={s.btn} onClick={() => setView(p.id)}>
              Переглянути
            </button>
            {has && g.selected !== p.id && (
              <button style={s.btn} onClick={() => choose(p)}>
                Обрати
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={s.head}>Усі улюбленці дають параметри твоєму герою</div>
      {balance}
      <div style={s.info}>
        Бонус від улюбленців:{" "}
        <b style={{ color: C.green }}>+{petStatBonus(g)} до параметрів</b>
        <div style={{ color: C.muted, fontSize: ".8rem" }}>
          Наступний улюбленець коштує вдвічі дорожче за попереднього.
        </div>
      </div>

      <h4 style={s.h4}>Твої улюбленці</h4>
      {owned.length === 0 && (
        <div style={{ ...s.info, color: C.muted }}>
          Ще немає. Обери улюбленця нижче й купи за золото.
        </div>
      )}
      {owned.map((p) => (
        <Card key={p.id} p={p} />
      ))}

      {rest.length > 0 && <h4 style={s.h4}>Можна купити</h4>}
      {rest.map((p) => (
        <Card key={p.id} p={p} />
      ))}

      <div style={s.info}>
        <button style={s.btn} onClick={testMoney}>
          🧪 Тестові гроші (+5000 🪙, +100000 ⚪)
        </button>
        <div style={{ color: C.muted, fontSize: ".75rem", marginTop: 4 }}>
          Кнопку для перевірки потім приберемо.
        </div>
      </div>
    </div>
  );
  }
