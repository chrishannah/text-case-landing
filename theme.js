(() => {
  const preferences = [
    { name: 'theme', values: ['signature', 'plum', 'ember', 'woodland'] },
    { name: 'appearance', values: ['system', 'light', 'dark'] }
  ];
  const root = document.documentElement;
  for (const { name, values } of preferences) {
    const key = `text-case-${name}`;
    let saved;
    try {
      saved = localStorage.getItem(key);
    } catch {
      // Use the default when storage is unavailable.
    }
    root.dataset[name] = values.includes(saved) ? saved : values[0];
  }
  document.addEventListener('DOMContentLoaded', () => {
    const systemDark = matchMedia('(prefers-color-scheme: dark)');
    const screenshots = document.querySelectorAll('[data-themed-scratchpad]');
    function updateScreenshots() {
      const { theme, appearance } = root.dataset;
      const dark = appearance === 'dark' || (appearance === 'system' && systemDark.matches);
      const filename = `${theme}-${dark ? 'dark' : 'light'}-scratchpad.webp`;
      for (const screenshot of screenshots) {
        screenshot.src = screenshot.dataset.themedScratchpad + filename;
      }
    }
    updateScreenshots();
    systemDark.addEventListener('change', updateScreenshots);
    for (const { name } of preferences) {
      const picker = document.querySelector(`[data-${name}-picker]`);
      if (!picker) continue;
      picker.value = root.dataset[name];
      picker.addEventListener('change', () => {
        root.dataset[name] = picker.value;
        updateScreenshots();
        try {
          localStorage.setItem(`text-case-${name}`, picker.value);
        } catch {
          // The current page still reflects the choice.
        }
      });
    }
    document.querySelector('.appearance-controls')?.removeAttribute('hidden');
  });
})();
