import { mount } from '@vue/test-utils';
import VueMenu from '@/components/VueMenu.vue';
import { soundEnabled, timersEnabled } from '@/settings';

describe('VueMenu.vue', () => {
  const push = vi.fn();
  const mountMenu = () => mount(VueMenu, { global: { mocks: { $router: { push } } } });

  test('should open the menu and emit the actions', async () => {
    const wrapper = mountMenu();

    await wrapper.find('[aria-label="Open"]').trigger('click');
    expect(wrapper.classes()).toContain('open');

    await wrapper.find('.clearGame:nth-child(2)').trigger('click');
    await wrapper.find('.resetGame').trigger('click');
    await wrapper.findAll('.resetGame')[1].trigger('click');

    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.emitted('reset')).toHaveLength(1);
    expect(push).toHaveBeenCalledWith('/');
  });

  test('should switch the sound on and off', async () => {
    soundEnabled.value = true;
    const wrapper = mountMenu();
    const button = wrapper.find('.toggleSound');

    expect(button.text()).toBe('Sound: On');

    await button.trigger('click');

    expect(button.text()).toBe('Sound: Off');
    expect(button.attributes('aria-pressed')).toBe('false');
    expect(soundEnabled.value).toBe(false);
  });

  test('should switch the timers on and off', async () => {
    timersEnabled.value = true;
    const wrapper = mountMenu();
    const button = wrapper.find('.toggleTimers');

    expect(button.text()).toBe('Timer: On');

    await button.trigger('click');

    expect(button.text()).toBe('Timer: Off');
    expect(timersEnabled.value).toBe(false);
    expect(localStorage.getItem('timers')).toBe('off');
  });
});
