import { ref, watch } from 'vue';

// a switch in the menu that is remembered in the browser, it is only a convenience
const createSetting = (key: string) => {
  let enabled = true;

  try {
    enabled = localStorage.getItem(key) !== 'off';
  } catch {
    // e.g. storage is blocked in a private window
  }

  const setting = ref(enabled);

  watch(setting, (value) => {
    try {
      localStorage.setItem(key, value ? 'on' : 'off');
    } catch {
      // the setting still works until the page is reloaded
    }
  });

  return setting;
};

export const soundEnabled = createSetting('sound');

// without timers, timed choices wait for the player, e.g. for screen reader users
export const timersEnabled = createSetting('timers');
