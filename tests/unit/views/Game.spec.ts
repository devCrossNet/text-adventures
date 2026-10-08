import { mount } from '@vue/test-utils';
import { questions } from '@/games/message-from-the-future';
import Game from '@/views/Game.vue';

vi.mock('vue-router', () => ({ useRoute: () => ({ params: { id: 'message-from-the-future' } }) }));
vi.mock('@/games', () => ({ loadGame: async () => questions }));

const mountGame = async () => {
  const wrapper = mount(Game, { global: { mocks: { $router: { push: vi.fn() } } } });
  await vi.runAllTimersAsync();

  return wrapper;
};

describe('Game.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    Element.prototype.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should play the intro and ask the first question', async () => {
    const wrapper = await mountGame();

    expect(wrapper.text()).toContain('I wonder what this old thing does');
    expect(wrapper.find('.single-select').text()).toContain('Can someone read this, heeeeelllloooooooo?');
    expect(JSON.parse(localStorage.getItem('result') || '{}')).toEqual({ introDialog: true });
  });

  test('should end the game when the player does not answer', async () => {
    const wrapper = await mountGame();

    await wrapper.findAll('.single-select button')[1].trigger('click');
    await vi.runAllTimersAsync();

    expect(wrapper.text()).toContain(">> Nope, that's too creepy!");
    expect(wrapper.text()).toContain('Anyway, bye!');
    expect(wrapper.find('.ending').text()).toBe('THE END');
    expect(wrapper.find('.single-select').exists()).toBe(false);
  });

  test('should insert the player name into the dialog', async () => {
    localStorage.setItem('output', 'Hello.......');
    localStorage.setItem(
      'result',
      JSON.stringify({
        introDialog: true,
        receivedMessages: 'Yes',
        receivedMessagesDialog: true,
        howAreYou: 'Good',
        howAreYouDialog: true,
      }),
    );
    const wrapper = await mountGame();

    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);

    await wrapper.find('input').setValue('Neo');
    await wrapper.find('form').trigger('submit');
    await vi.runAllTimersAsync();

    expect(wrapper.text()).toContain('>> Neo');
    expect(wrapper.text()).toContain('Aia: Nice to meet you, Neo!');
    expect(wrapper.find('.single-select').text()).toContain('I need to ask you something?');
  });

  test('should restore a finished game without playing it again', async () => {
    localStorage.setItem('output', 'Anyway, bye!');
    localStorage.setItem('activeQuestionId', '99999');
    localStorage.setItem(
      'result',
      JSON.stringify({ introDialog: true, receivedMessages: 'No', notReceivedMessagesDialog: true }),
    );
    const wrapper = await mountGame();

    expect(wrapper.findAll('.output li').map((item) => item.text())).toEqual(['Anyway, bye!']);
    expect(wrapper.find('.ending').text()).toBe('THE END');
    expect(localStorage.getItem('activeQuestionId')).toBeNull();
  });

  test('should reset and clear the game', async () => {
    const wrapper = await mountGame();

    await wrapper.find('.clearGame:nth-child(2)').trigger('click');
    expect(wrapper.findAll('.output li')).toHaveLength(0);

    await wrapper.findAll('.single-select button')[0].trigger('click');
    await wrapper.find('.resetGame').trigger('click');
    await vi.runAllTimersAsync();

    expect(wrapper.text()).toContain('I wonder what this old thing does');
    expect(JSON.parse(localStorage.getItem('result') || '{}')).toEqual({ introDialog: true });
  });
});
