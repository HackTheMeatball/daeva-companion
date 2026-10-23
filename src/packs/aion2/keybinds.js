/* Your own keys (0.9 P22, #388; docs/design/0.9-keys/README.md): char.keyBinds maps a Key setup column's suggested key (Q,
   E, T; a default-keys build's own keys) to the key the player uses for it. Shared by the Build drawer (the grid, Rotation,
   macro) and Next up's hint chips (0.9 P22b, #855), so every line that names a key follows. */
import { char } from "../../core/state.js";
import { pageState as state } from "../../cards/page.js";

/* The keys AION 2 can bind (docs/research/2026-10-bindable-keys.md, D3): any keyboard key or mouse button. Checked when a
   key is bound (a key pressed, picked or typed) and when one is read: a letter, a digit or a printable symbol HTML
   wouldn't read (the key goes into markup and attributes), F1–F12, Space, or a mouse button. A key the game can't take
   (a media key such as "AudioVolumeUp", a modifier alone) is never bound. Ctrl + mouse and the wheel are not promised
   until the board checks them in game (D3 rule 5), so they aren't here. */
export const KV_MOUSE = ["Left click", "Right click"];
export const kvBindable = k => typeof k === "string" && (/^[A-Z0-9]$/.test(k) || /^[!-~]$/.test(k) && !/[<>&"'`a-z]/.test(k)
  || /^F([1-9]|1[0-2])$/.test(k) || k === "Space" || KV_MOUSE.includes(k));
/* a key as the player gives it (a key press's e.key, or typed in the picker's "Other key") in the form the game names it:
   "r" → "R", " " / "space" → "Space", "f5" → "F5", "right click" → "Right click"; "" when the game can't bind it */
export const kvNorm = raw => { if (typeof raw !== "string") return ""; const s = raw === " " ? "Space" : raw.trim(); if (!s) return "";
  const k = s.length === 1 ? s.toUpperCase() : /^f\d{1,2}$/i.test(s) ? s.toUpperCase() : /^space$/i.test(s) ? "Space"
    : KV_MOUSE.find(m => m.toLowerCase() === s.toLowerCase()) || s;
  return kvBindable(k) ? k : ""; };
/* the key the player uses for a column: theirs when it's one the game can bind, else the suggestion */
export const boundKey = col => { const m = char(state).keyBinds, k = m && typeof m === "object" && !Array.isArray(m) ? m[col] : null;
  return kvBindable(k) ? k : col; };
