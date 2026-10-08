import { mount } from '@vue/test-utils';
import VueSingleSelect from '@/components/VueSingleSelect.vue';
import { timersEnabled } from '@/settings';

describe('VueSingleSelect.vue', () => {
  test('should submit the selected option', async () => {
    const options = [
      { label: "Yeah, what's up?", value: 'Yes' },
      { label: "Nope, that's too creepy!", value: 'No' },
    ];
    const wrapper = mount(VueSingleSelect, {
      props: {
        activeQuestion: {
          id: 2,
          type: 'SINGLE_SELECT',
          key: 'receivedMessages',
          title: '>> Can someone read this?',
          options,
          value: undefined,
          error: null,
          isValid: true,
          hasValue: false,
        },
      },
    });

    expect(wrapper.find('.question').classes()).toContain('playerMessage');

    await wrapper.findAll('button')[1].trigger('click');

    expect(wrapper.emitted('onSubmit')).toEqual([[options[1]]]);
  });

  test('should count down and submit the timeout option', async () => {
    vi.useFakeTimers();
    const timeout = { label: "You didn't answer.", value: 'noAnswer', timeout: true };
    const wrapper = mount(VueSingleSelect, {
      props: {
        activeQuestion: {
          id: 'knockChoice',
          type: 'TIMED_SELECT',
          key: 'knockChoice',
          title: 'Aia: What do I do??',
          seconds: 2,
          options: [{ label: 'Hide!', value: 'hide' }, timeout],
          value: undefined,
          error: null,
          isValid: true,
          hasValue: false,
        },
      },
    });

    expect(wrapper.findAll('button').map((button) => button.text())).toEqual(['Hide!']);
    expect(wrapper.find('[role="progressbar"]').text()).toBe('2s');

    await vi.advanceTimersByTimeAsync(1500);
    expect(wrapper.find('[role="progressbar"]').text()).toBe('1s');
    expect(wrapper.emitted('onTimeout')).toBeUndefined();

    await vi.advanceTimersByTimeAsync(500);
    expect(wrapper.emitted('onTimeout')).toEqual([[timeout]]);
    vi.useRealTimers();
  });

  test('should stop the countdown when the player answers', async () => {
    vi.useFakeTimers();
    const wrapper = mount(VueSingleSelect, {
      props: {
        activeQuestion: {
          id: 'knockChoice',
          type: 'TIMED_SELECT',
          key: 'knockChoice',
          title: 'Aia: What do I do??',
          seconds: 2,
          options: [
            { label: 'Hide!', value: 'hide' },
            { label: "You didn't answer.", value: 'noAnswer', timeout: true },
          ],
          value: undefined,
          error: null,
          isValid: true,
          hasValue: false,
        },
      },
    });

    await wrapper.find('button').trigger('click');
    await vi.advanceTimersByTimeAsync(3000);

    expect(wrapper.emitted('onSubmit')).toHaveLength(1);
    expect(wrapper.emitted('onTimeout')).toBeUndefined();
    vi.useRealTimers();
  });

  test('should wait for the player when the timers are off', async () => {
    vi.useFakeTimers();
    timersEnabled.value = false;
    const wrapper = mount(VueSingleSelect, {
      props: {
        activeQuestion: {
          id: 'knockChoice',
          type: 'TIMED_SELECT',
          key: 'knockChoice',
          title: 'Aia: What do I do??',
          seconds: 2,
          options: [
            { label: 'Hide!', value: 'hide' },
            { label: "You didn't answer.", value: 'noAnswer', timeout: true },
          ],
          value: undefined,
          error: null,
          isValid: true,
          hasValue: false,
        },
      },
    });

    await vi.advanceTimersByTimeAsync(5000);

    expect(wrapper.find('[role="progressbar"]').exists()).toBe(false);
    expect(wrapper.emitted('onTimeout')).toBeUndefined();
    expect(wrapper.findAll('button').map((button) => button.text())).toEqual(['Hide!']);
    timersEnabled.value = true;
    vi.useRealTimers();
  });
});
