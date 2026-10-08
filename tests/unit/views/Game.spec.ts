import { mount } from '@vue/test-utils';
import { questions } from '@/games/message-from-the-future';
import { playNew, untilKnock, warmPath } from '../games/story';
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

    expect(wrapper.text()).toContain("I've been trying to reach you for so long.");
    expect(wrapper.find('.single-select').text()).toContain('Mila?? Please say something.');
    expect(JSON.parse(localStorage.getItem('result') || '{}')).toEqual({ intro: true });
  });

  test('should end the game when the player blocks the number', async () => {
    const wrapper = await mountGame();

    await wrapper.findAll('.single-select button')[2].trigger('click');
    await vi.runAllTimersAsync();
    await wrapper.findAll('.single-select button')[1].trigger('click');
    await vi.runAllTimersAsync();

    expect(wrapper.text()).toContain(">> Don't answer.");
    expect(wrapper.text()).toContain('>> Block the number.');
    expect(wrapper.find('.glitch').text()).toBe('Mila: she was so lonely.');
    expect(wrapper.find('.ending').text()).toBe('THE END');
    expect(wrapper.find('.single-select').exists()).toBe(false);
  });

  test('should insert the player name into the dialog', async () => {
    localStorage.setItem('output', 'Hello.......');
    localStorage.setItem(
      'result',
      JSON.stringify({
        intro: true,
        whoIsThis: 'who',
        apology: true,
        askAnyway: 'yes',
        weatherIntro: true,
        weather: 'rain',
        weatherReply: true,
      }),
    );
    const wrapper = await mountGame();

    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);

    await wrapper.find('input').setValue(' Neo ');
    await wrapper.find('form').trigger('submit');
    await vi.runAllTimersAsync();

    expect(wrapper.text()).toContain('>> Neo');
    expect(wrapper.text()).toContain('Aia: Neo.');
    expect(wrapper.find('.single-select').text()).toContain('Aia: You can ask me something too, if you want.');
  });

  test('should restore a finished game without playing it again', async () => {
    localStorage.setItem('output', '[You put the phone away.]');
    localStorage.setItem('activeQuestionId', '99999');
    localStorage.setItem(
      'result',
      JSON.stringify({ intro: true, whoIsThis: 'ignore', stillThere: true, secondChance: 'block', blocked: true }),
    );
    const wrapper = await mountGame();

    expect(wrapper.findAll('.output li').map((item) => item.text())).toEqual(['[You put the phone away.]']);
    expect(wrapper.find('.ending').text()).toBe('THE END');
    expect(localStorage.getItem('activeQuestionId')).toBeNull();
  });

  test('should start again when the saved game does not match the story', async () => {
    localStorage.setItem('output', 'Hello.......');
    localStorage.setItem('result', JSON.stringify({ introDialog: true, receivedMessages: 'Yes' }));
    const wrapper = await mountGame();

    expect(wrapper.text()).not.toContain('Hello.......');
    expect(wrapper.find('.single-select').text()).toContain('Mila?? Please say something.');
  });

  test('should reset and clear the game', async () => {
    const wrapper = await mountGame();

    await wrapper.find('.clearGame:nth-child(2)').trigger('click');
    expect(wrapper.findAll('.output li')).toHaveLength(0);

    await wrapper.findAll('.single-select button')[0].trigger('click');
    await wrapper.find('.resetGame').trigger('click');
    await vi.runAllTimersAsync();

    expect(wrapper.text()).toContain("I've been trying to reach you for so long.");
    expect(JSON.parse(localStorage.getItem('result') || '{}')).toEqual({ intro: true });
  });

  test('should use the real time of the player', async () => {
    vi.setSystemTime(new Date(2026, 9, 8, 23, 47));
    localStorage.setItem('output', 'Hi');
    localStorage.setItem('result', JSON.stringify(playNew(warmPath.actOne.concat(warmPath.actTwo)).getResult()));
    // restart the act two dialog with the clocks
    const result = JSON.parse(localStorage.getItem('result') || '{}');
    delete result.clocks;
    delete result.deviceClue;
    localStorage.setItem('result', JSON.stringify(result));
    const wrapper = await mountGame();

    expect(wrapper.text()).toContain('Aia: Is that right? Is it 23:47 for you?');
  });

  test('should knock and decide for the player when the time is up', async () => {
    localStorage.setItem('output', 'Hi');
    localStorage.setItem('result', JSON.stringify(playNew(untilKnock(warmPath)).getResult()));
    const wrapper = mount(Game, { global: { mocks: { $router: { push: vi.fn() } } } });
    // the loading screen takes 2 seconds
    await vi.advanceTimersByTimeAsync(2500);

    expect(wrapper.find('[role="progressbar"]').exists()).toBe(true);

    await vi.advanceTimersByTimeAsync(10000);
    await vi.runAllTimersAsync();

    expect(wrapper.text()).toContain("[You didn't answer.]");
    expect(wrapper.text()).toContain("Mila: it's me. it's mila.");
    expect(wrapper.findAll('.glitch').map((line) => line.text())).toContain('*knock* *knock* *knock*');
    expect(wrapper.find('.single-select').text()).toContain('Ask her to say your name.');
  });
});
