// Hovering a saved note makes its letters drift out of order ("what was that again?").
// Leaving it lets them settle back, left to right. Add as a separate file after index.js:
// <script src="scramble.js"></script>
//
// It listens on #saved-notes, so it keeps working when your code re-renders the list.

(function () {
  const container = document.getElementById("saved-notes");
  if (!container) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const DRIFT_MS = 110; // time between swaps while hovering
  const SWAPS = 2; // more swaps = more chaos
  const SETTLE_MS = 40; // time per letter when settling back

  const state = new WeakMap();

  // the first two lines (title + excerpt) scramble; the date stays readable
  const targets = (note) => note.querySelectorAll("p:nth-child(-n+2)");

  function startDrift(el) {
    let s = state.get(el);
    if (!s) {
      s = {};
      state.set(el, s);
    }
    clearInterval(s.settle);
    clearInterval(s.drift);

    if (!s.original) {
      s.original = el.textContent;
      s.chars = [...s.original];
      s.slots = s.chars
        .map((c, i) => (c === " " ? null : i))
        .filter((i) => i !== null);
    }
    if (s.slots.length < 2) return;

    s.drift = setInterval(() => {
      for (let n = 0; n < SWAPS; n++) {
        const a = s.slots[Math.floor(Math.random() * s.slots.length)];
        const b = s.slots[Math.floor(Math.random() * s.slots.length)];
        [s.chars[a], s.chars[b]] = [s.chars[b], s.chars[a]];
      }
      el.textContent = s.chars.join("");
    }, DRIFT_MS);
  }

  function settle(el) {
    const s = state.get(el);
    if (!s || !s.original) return;
    clearInterval(s.drift);
    clearInterval(s.settle);

    let i = 0;
    s.settle = setInterval(() => {
      const idx = s.slots[i];
      const want = s.original[idx];
      if (s.chars[idx] !== want) {
        const j = s.slots.find((k) => k > idx && s.chars[k] === want);
        if (j !== undefined)
          [s.chars[idx], s.chars[j]] = [s.chars[j], s.chars[idx]];
      }
      el.textContent = s.chars.join("");
      if (++i >= s.slots.length) {
        clearInterval(s.settle);
        el.textContent = s.original;
        state.delete(el); // clean slate, so edited notes re-read their text next hover
      }
    }, SETTLE_MS);
  }

  container.addEventListener("mouseover", (e) => {
    const note = e.target.closest(".saved-note");
    if (!note || note.contains(e.relatedTarget)) return;
    targets(note).forEach(startDrift);
  });

  container.addEventListener("mouseout", (e) => {
    const note = e.target.closest(".saved-note");
    if (!note || note.contains(e.relatedTarget)) return;
    targets(note).forEach(settle);
  });
})();
