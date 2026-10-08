import { nextTick } from 'vue';

// records which audio nodes the sounds create
const createFakeAudioContext = () => {
  const created: Array<string> = [];
  const param = () => ({ value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() });
  const node = (name: string, extra: object = {}) => {
    created.push(name);
    const audioNode = { connect: () => audioNode, start: vi.fn(), stop: vi.fn(), ...extra };

    return audioNode;
  };

  class FakeAudioContext {
    static instances: Array<FakeAudioContext> = [];
    state = 'suspended';
    currentTime = 0;
    sampleRate = 100;
    destination = {};
    resume = vi.fn(() => {
      this.state = 'running';
      return Promise.resolve();
    });

    constructor() {
      FakeAudioContext.instances.push(this);
    }

    createOscillator() {
      return node('oscillator', { frequency: param() });
    }

    createGain() {
      return node('gain', { gain: param() });
    }

    createBiquadFilter() {
      return node('filter', { type: '', frequency: param() });
    }

    createBuffer(_channels: number, length: number) {
      const data = new Float32Array(length);

      return { getChannelData: () => data };
    }

    createBufferSource() {
      return node('noise', { buffer: null });
    }
  }

  return { FakeAudioContext, created };
};

describe('sounds', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('should play a knock and static', async () => {
    const { FakeAudioContext, created } = createFakeAudioContext();
    vi.stubGlobal('AudioContext', FakeAudioContext);
    const { playKnock, playStatic } = await import('@/sounds');

    playKnock();
    playStatic();

    expect(created.filter((name) => name === 'oscillator')).toHaveLength(3);
    expect(created).toContain('noise');
    expect(FakeAudioContext.instances).toHaveLength(1);
    expect(FakeAudioContext.instances[0].resume).toHaveBeenCalledTimes(1);
  });

  test('should be silent when the sound is off', async () => {
    const { FakeAudioContext, created } = createFakeAudioContext();
    vi.stubGlobal('AudioContext', FakeAudioContext);
    const { playKnock, playStatic } = await import('@/sounds');
    const { soundEnabled } = await import('@/settings');

    soundEnabled.value = false;
    await nextTick();
    playKnock();
    playStatic();

    expect(created).toEqual([]);
    expect(localStorage.getItem('sound')).toBe('off');
  });

  test('should remember that the sound is off', async () => {
    localStorage.setItem('sound', 'off');
    const { soundEnabled } = await import('@/settings');

    expect(soundEnabled.value).toBe(false);
  });

  test('should be silent without audio support', async () => {
    vi.stubGlobal('AudioContext', undefined);
    const { playKnock, playStatic } = await import('@/sounds');

    expect(() => {
      playKnock();
      playStatic();
    }).not.toThrow();
  });
});
