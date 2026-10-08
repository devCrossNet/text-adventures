import { ref, watch } from 'vue';

const STORAGE_KEY = 'sound';

const loadSoundEnabled = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
};

export const soundEnabled = ref(loadSoundEnabled());

watch(soundEnabled, (enabled) => {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
  } catch {
    // the sound setting is only a convenience
  }
});

let context: AudioContext | null = null;

// sounds are generated, browsers only allow them after the player clicked something
const getContext = () => {
  if (!soundEnabled.value || typeof AudioContext === 'undefined') {
    return null;
  }

  context ??= new AudioContext();

  if (context.state === 'suspended') {
    void context.resume();
  }

  return context;
};

const createNoise = (audio: AudioContext, seconds: number) => {
  const buffer = audio.createBuffer(1, audio.sampleRate * seconds, audio.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = audio.createBufferSource();
  source.buffer = buffer;

  return source;
};

// three heavy knocks on a wooden door
export const playKnock = () => {
  const audio = getContext();

  if (!audio) {
    return;
  }

  [0, 0.45, 0.9].forEach((offset) => {
    const start = audio.currentTime + offset;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.frequency.setValueAtTime(110, start);
    oscillator.frequency.exponentialRampToValueAtTime(45, start + 0.15);
    gain.gain.setValueAtTime(0.9, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.3);
  });
};

// a short burst of radio static
export const playStatic = () => {
  const audio = getContext();

  if (!audio) {
    return;
  }

  const noise = createNoise(audio, 1.2);
  const filter = audio.createBiquadFilter();
  const gain = audio.createGain();

  filter.type = 'bandpass';
  filter.frequency.value = 1800;
  gain.gain.setValueAtTime(0.25, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 1.2);
  noise.connect(filter).connect(gain).connect(audio.destination);
  noise.start();
};
