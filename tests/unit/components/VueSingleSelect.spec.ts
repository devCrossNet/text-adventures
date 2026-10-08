import { mount } from '@vue/test-utils';
import VueSingleSelect from '@/components/VueSingleSelect.vue';

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
});
