import { validateDefinition } from 'quaire';
import { components, createQuaire, type GameQuaire, isTimeoutOption } from '@/quaire';
import { questions } from '@/games/message-from-the-future';
import { hasSolvedPuzzle, isPuzzleSolution } from '@/games/message-from-the-future/puzzle';
import { getWarmth } from '@/games/message-from-the-future/warmth';
import { parseEffect } from '@/utils';
import { coldPath, play, playDialogs, playNew, untilKnock, warmPath } from './story';

const EFFECTS = ['knock', 'static', 'flicker', 'pause', 'silence'];

const allLines = questions.flatMap((question) =>
  question.type === 'DIALOG' ? [question.lines, ...(question.variants || []).map((v) => v.lines || [])].flat() : [],
);

const getLines = (Q: GameQuaire) => {
  const question = Q.getActiveQuestion();

  return question?.type === 'DIALOG' ? question.lines : [];
};

const getOptionValues = (Q: GameQuaire) => {
  const question = Q.getActiveQuestion();

  return question?.type === 'SINGLE_SELECT' || question?.type === 'TIMED_SELECT'
    ? question.options.map((option) => option.value)
    : [];
};

describe('message-from-the-future', () => {
  describe('definition', () => {
    test('should have a valid definition', () => {
      expect(validateDefinition({ questions, components })).toEqual([]);
    });

    test('should only use known effects', () => {
      const effects = allLines.map(parseEffect).filter((effect) => effect !== null);

      expect(effects.length).toBeGreaterThan(0);
      effects.forEach((effect) => expect(EFFECTS).toContain(effect.name));
    });

    test('should have exactly one timeout option for every countdown', () => {
      questions.forEach((question) => {
        if (question.type === 'TIMED_SELECT') {
          expect(question.options.filter(isTimeoutOption)).toHaveLength(1);
          (question.variants || []).forEach((variant) =>
            expect((variant.options || []).filter(isTimeoutOption)).toHaveLength(1),
          );
        }
      });
    });

    test('should never let the visitors say a name', () => {
      const visitorLines = allLines.filter((line) => /^!!(Mila|Mrs\. Okafor):/.test(line));

      expect(visitorLines.length).toBeGreaterThan(0);
      visitorLines.forEach((line) => expect(line.split(':').slice(1).join(':')).not.toMatch(/aia|<%=/i));
    });
  });

  describe('act one', () => {
    test('should start like a wrong number', () => {
      const Q = createQuaire(questions);

      expect(Q.getActiveQuestion()).toMatchObject({ id: 'intro', type: 'DIALOG' });
      expect(getLines(Q)).toContain('Mila? Is that you?');
    });

    test('should end the game when the player blocks the number', () => {
      const Q = playNew(['ignore', 'block']);

      expect(Q.isComplete()).toBe(true);
      expect(Q.getActiveQuestion()).toMatchObject({ id: 'blocked', end: 'THE END' });
    });

    test('should continue when the player answers after all', () => {
      expect(playNew(['ignore', 'hi']).getActiveQuestion()?.id).toBe('askAnyway');
    });
  });

  describe('act three', () => {
    const beforeYear = [...warmPath.actOne, ...warmPath.actTwo];

    test('should ask for a valid year', () => {
      const Q = playNew(beforeYear);
      Q.saveAnswer('next year');

      expect(Q.getActiveQuestion()).toMatchObject({ id: 'playerYear', error: 'PATTERN' });
    });

    test.each([
      ['2026', 'Aia: <%= playerYear %>.'],
      ['2150', 'Aia: <%= playerYear %>? Very funny.'],
    ])('should react to the year %s', (year, firstLine) => {
      const Q = playNew(beforeYear);
      Q.saveAnswer(year);

      expect(getLines(Q)[0]).toBe(firstLine);
    });

    test('should end the game when the player does not believe Aia', () => {
      const Q = playNew([...beforeYear, '2026', 'no']);

      expect(Q.isComplete()).toBe(true);
      expect(Q.getActiveQuestion()?.id).toBe('disbelief');
    });

    test.each([
      ['name', true],
      [' Name! ', true],
      ['your name', true],
      ['game', false],
      [undefined, false],
    ])('should check the puzzle answer "%s"', (answer, solved) => {
      expect(isPuzzleSolution(answer)).toBe(solved);
    });

    test('should give hints after wrong answers', () => {
      const Q = playNew([...beforeYear, '2026', 'yes', 'now', 'game']);

      expect(Q.getActiveQuestion()?.id).toBe('puzzle2');
      expect(Q.getResult().puzzleHint1).toBe(true);

      play(Q, ['NAME']);

      expect(Q.getResult().puzzleSolved).toBe(true);
      expect(hasSolvedPuzzle(Q.getResult())).toBe(true);
    });

    test('should burn the note after three wrong answers', () => {
      const Q = playNew(untilKnock(coldPath));

      expect(Q.getResult().puzzleFailed).toBe(true);
      expect(Q.getResult()).not.toHaveProperty('puzzleSolved');
      expect(Q.getActiveQuestion()?.id).toBe('knockChoice');
    });
  });

  describe('act four', () => {
    test('should only offer the name test when the player solved the puzzle', () => {
      expect(getOptionValues(playNew([...untilKnock(warmPath), 'ask']))).toContain('sayName');
      expect(getOptionValues(playNew([...untilKnock(coldPath), 'ask']))).not.toContain('sayName');
    });

    test.each([
      ['hide', 'hiding'],
      ['ask', 'askWho'],
      ['silent', 'staySilent'],
      ['noAnswer', 'noAnswer'],
    ])('should react to "%s" when someone knocks', (answer, id) => {
      const Q = playNew(untilKnock(warmPath));
      Q.saveAnswer(answer);

      expect(Q.getActiveQuestion()?.id).toBe(id);
    });

    test('should let the visitor in when the player does not stop Aia', () => {
      const Q = playNew([...untilKnock(coldPath), 'ask', 'secret', 'tooLate']);

      expect(Q.isComplete()).toBe(true);
      expect(Q.getActiveQuestion()?.id).toBe('doorOpens');
      expect(getLines(Q)[0]).toBe("Aia: You're not answering.");
    });

    test('should let the visitor in when the player opens the door', () => {
      const Q = playNew([...untilKnock(warmPath), 'hide', 'open']);

      expect(Q.isComplete()).toBe(true);
      expect(getLines(Q)[0]).toBe('Aia: Mila!');
    });
  });

  describe('act five', () => {
    const escapeWarm = [...untilKnock(warmPath), 'ask', 'sayName'];
    const escapeCold = [...untilKnock(coldPath), 'silent', 'dontOpen'];

    test('should count the kind answers', () => {
      expect(getWarmth(playNew(escapeWarm).getResult())).toBe(6);
      expect(getWarmth(playNew(escapeCold).getResult())).toBe(0);
    });

    test.each([
      ['should let Aia run when she trusts the player', [...escapeWarm, 'run'], 'outside'],
      ['should keep Aia inside when she does not trust the player', [...escapeCold, 'run'], 'tooAfraid'],
      ['should catch Aia when the player does not answer', [...escapeWarm, 'freeze'], 'frozen'],
      ['should let Aia survive in the attic', [...escapeCold, 'attic', 'Stay strong.', ' AIA '], 'survived'],
      ['should not trust a wrong name', [...escapeWarm, 'attic', 'Stay strong.', 'Mila'], 'notHer'],
      ['should let Aia go into the Quiet', [...escapeWarm, 'stay', 'try'], 'goodbyeEnd'],
    ])('%s', (_name, answers, id) => {
      const Q = playNew(answers);

      expect(Q.isComplete()).toBe(true);
      expect(Q.getActiveQuestion()?.id).toBe(id);
    });

    test('should keep the last message of the player', () => {
      const Q = playNew([...escapeWarm, 'attic', 'See you in a hundred years.']);

      expect(Q.getResult().lastMessage).toBe('See you in a hundred years.');
      expect(Q.getActiveQuestion()?.id).toBe('sayHerName');
    });
  });

  test('should remove the answers of an abandoned ending', () => {
    const Q = playNew([...untilKnock(warmPath), 'ask', 'sayName', 'stay']);
    Q.goTo('escapeChoice');
    Q.saveAnswer('attic');
    playDialogs(Q);

    expect(Q.getResult()).not.toHaveProperty('stayWithMe');
    expect(Q.getActiveQuestion()?.id).toBe('lastMessage');
  });

  test('should continue a saved game with the first open question', () => {
    const Q = createQuaire(questions, { intro: true, whoIsThis: 'who', apology: true, askAnyway: 'yes' });

    expect(Q.getActiveQuestion()).toMatchObject({ id: 'weatherIntro', hasValue: false });
    expect(Q.canGoBack()).toBe(true);
  });
});
