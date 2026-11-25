/** Business case calculator: IT desk time priced at the hourly cost, same formula as BusinessCase.astro renders without JS. */
export function initCalc() {
  document.querySelectorAll<HTMLFormElement>('[data-calc]').forEach((form) => {
    const fmt = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
    const get = (k: string) => Number((form.elements.namedItem(k) as HTMLInputElement).value);
    const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shown = new Map<string, number>();
    const frames = new Map<string, number>();
    // Results glide to their new value (220 ms) so a slider drag reads as a smooth change.
    const set = (k: string, target: number) => {
      const el = form.querySelector<HTMLElement>(`[data-res="${k}"]`);
      if (!el) return;
      const from = shown.get(k) ?? target;
      shown.set(k, target);
      cancelAnimationFrame(frames.get(k) ?? 0);
      if (!motion || from === target) { el.textContent = fmt.format(target); return; }
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 220);
        el.textContent = fmt.format(from + (target - from) * (1 - Math.pow(1 - t, 3)));
        if (t < 1) frames.set(k, requestAnimationFrame(step));
      };
      frames.set(k, requestAnimationFrame(step));
    };
    const update = () => {
      form.querySelectorAll<HTMLInputElement>('input[type=range]').forEach((r) => {
        const p = ((Number(r.value) - Number(r.min)) / (Number(r.max) - Number(r.min))) * 100;
        r.style.setProperty('--p', `${p}%`);
        const out = form.querySelector<HTMLOutputElement>(`[data-out="${r.name}"]`);
        if (out) out.textContent = r.value;
      });
      const handovers = get('lockers') * get('handovers');
      const hoursToday = (handovers * get('minutesToday')) / 60;
      const hoursSpind = (handovers * get('minutesSpind')) / 60;
      const hoursSaved = Math.max(0, hoursToday - hoursSpind);
      const rate = get('hourlyCost');
      set('today', hoursToday * rate);
      set('with', hoursSpind * rate);
      set('handovers', handovers);
      set('saved', hoursSaved * rate);
      set('hours', hoursSaved);
    };
    form.addEventListener('input', update);
    update();
  });
}
