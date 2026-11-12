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
  ["💪", "Сила", "Визначає урон
