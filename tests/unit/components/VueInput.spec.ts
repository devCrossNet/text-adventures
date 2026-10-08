import { mount } from '@vue/test-utils';
import type { QuaireInputDefinition, QuaireQuestion } from 'quaire';
import VueInput from '@/components/VueInput.vue';

const getQuestion = (
  props: Partial<QuaireQuestion<QuaireInputDefinition>> = {},
): QuaireQuestion<QuaireInputDefinition> => ({
  id: 7,
  type: 'INPUT',
  key: 'playerName',
  title: "Aia: What's your name?",
  value: undefined,
  error: null,
  isValid: true,
  hasValue: false,
  ...props,
});

describe('VueInput.vue', () => {
  test('should submit the input', async () => {
    const wrapper = mount(VueInput, { props: { activeQuestion: getQuestion() } });

    expect(wrapper.text()).toContain("Aia: What's your name?");

    await wrapper.find('input').setValue('Neo');
    await wrapper.find('form').trigger('submit');

    expect(wrapper.emitted('onSubmit')).toEqual([['Neo']]);
  });

  test('should show the required error after the first submit', async () => {
    const wrapper = mount(VueInput, { props: { activeQuestion: getQuestion({ error: 'REQUIRED', isValid: false }) } });

    expect(wrapper.find('[role="alert"]').exists()).toBe(false);

    await wrapper.find('form').trigger('submit');

    expect(wrapper.find('[role="alert"]').text()).toBe('Please enter an answer.');
  });
});
