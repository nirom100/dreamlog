// Every few seconds the header's letters drift out of order, then settle back
// left to right, as if nothing happened. Add after scramble.js:
// <script src="header-scramble.js"></script>

(function () {
  const header = document.querySelector(".note-label");
  if (!header) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const MIN_WAIT = 3000; // shortest pause between scrambles (ms)
  const MAX_WAIT = 7000; // longest pause between scrambles (ms)
  const DRIFT_MS = 90; // time between swaps while scrambled
  const DRIFT_STEPS = 6; // how many drift ticks before settling
  const SWAPS = 2; // swaps per tick
  const SETTLE_MS = 45; // time per letter when settling back

  const rand = (min, max) => min + Math.random() * (max - min);

  function scrambleOnce(done) {
    const original = header.textContent;
    const chars = [...original];
    const slots = chars
      .map((c, i) => (c === " " ? null : i))
      .filter((i) => i !== null);
    if (slots.length < 2) return done();

    let tick = 0;
    const drift = setInterval(() => {
      for (let n = 0; n < SWAPS; n++) {
        const a = slots[Math.floor(Math.random() * slots.length)];
        const b = slots[Math.floor(Math.random() * slots.length)];
        [chars[a], chars[b]] = [chars[b], chars[a]];
      }
      header.textContent = chars.join("");

      if (++tick >= DRIFT_STEPS) {
        clearInterval(drift);
        settle();
      }
    }, DRIFT_MS);

    function settle() {
      let i = 0;
      const timer = setInterval(() => {
        const idx = slots[i];
        const want = original[idx];
        if (chars[idx] !== want) {
          const j = slots.find((k) => k > idx && chars[k] === want);
          if (j !== undefined) [chars[idx], chars[j]] = [chars[j], chars[idx]];
        }
        header.textContent = chars.join("");

        if (++i >= slots.length) {
          clearInterval(timer);
          header.textContent = original; // guarantee a clean finish
          done();
        }
      }, SETTLE_MS);
    }
  }

  function schedule() {
    setTimeout(
      () => {
        // skip while the tab is hidden so timers don't pile up oddly
        if (document.hidden) return schedule();
        scrambleOnce(schedule);
      },
      rand(MIN_WAIT, MAX_WAIT),
    );
  }

  schedule();
})();
