import { validateDefinition } from 'quaire';
import { components, createQuaire, type GameQuaire } from '@/quaire';
import { questions } from '@/games/message-from-the-future';

describe('message-from-the-future', () => {
  let Q: GameQuaire;

  const startConversation = () => {
    Q.saveAnswer(true); // intro dialog
    Q.saveAnswer('Yes');
    Q.saveAnswer(true); // received messages dialog
  };

  const introduceYourself = (howAreYou: string, playerName: string) => {
    startConversation();
    Q.saveAnswer(howAreYou);
    Q.saveAnswer(true); // how are you dialog
    Q.saveAnswer(playerName);
    Q.saveAnswer(true); // nice to meet you dialog
  };

  beforeEach(() => {
    Q = createQuaire(questions);
  });

  test('should have a valid definition', () => {
    expect(validateDefinition({ questions, components })).toEqual([]);
  });

  test('should start with the intro dialog', () => {
    expect(Q.getActiveQuestion()).toMatchObject({ id: 1, type: 'DIALOG', hasValue: false });
  });

  test('should end the game when the player does not answer', () => {
    Q.saveAnswer(true);
    Q.saveAnswer('No');

    expect(Q.getActiveQuestion()).toMatchObject({ id: 3, type: 'DIALOG', end: 'THE END' });
    expect(Q.isComplete()).toBe(false);

    Q.saveAnswer(true);

    expect(Q.isComplete()).toBe(true);
    expect(Q.getResult()).toEqual({ introDialog: true, receivedMessages: 'No', notReceivedMessagesDialog: true });
  });

  test.each([
    ['Good', 'Awesome!'],
    ['Bad', "I didn't hear this in a while"],
  ])('should answer "%s" with the matching dialog', (howAreYou, firstLine) => {
    startConversation();
    Q.saveAnswer(howAreYou);

    const question = Q.getActiveQuestion();
    expect(question?.type === 'DIALOG' && question.lines[0]).toBe(firstLine);
  });

  test('should ask for the name again when it is empty', () => {
    startConversation();
    Q.saveAnswer('Good');
    Q.saveAnswer(true);
    Q.saveAnswer('');

    expect(Q.getActiveQuestion()).toMatchObject({ id: 7, error: 'REQUIRED' });
  });

  test.each([
    ['Location', 100, 'locationIntroDialog'],
    ['Brand', 200, 'brandIntroDialog'],
    ['Age', 300, 'ageIntroDialog'],
  ])('should follow the "%s" story line until it is continued', (topic, id, key) => {
    introduceYourself('Good', 'Neo');
    Q.saveAnswer(topic);

    expect(Q.getActiveQuestion()).toMatchObject({ id, end: 'TO BE CONTINUED...' });

    Q.saveAnswer(true);

    expect(Q.isComplete()).toBe(true);
    expect(Q.getResult()).toMatchObject({ playerName: 'Neo', whereDidYouFindTheMobile: topic, [key]: true });
  });

  test('should remove the answers of an abandoned story line', () => {
    introduceYourself('Good', 'Neo');
    Q.saveAnswer('Location');
    Q.saveAnswer(true);
    Q.back();
    Q.saveAnswer('Age');

    expect(Q.getResult()).not.toHaveProperty('locationIntroDialog');
    expect(Q.getActiveQuestion()?.id).toBe(300);
  });

  test('should reset the dialog when the player changes the answer it depends on', () => {
    startConversation();
    Q.saveAnswer('Good');
    Q.saveAnswer(true);
    Q.goTo(5);
    Q.saveAnswer('Bad');

    expect(Q.getResult().howAreYouDialog).toBeNull();
    expect(Q.getActiveQuestion()).toMatchObject({ id: 6, hasValue: false });
  });

  test('should continue a saved game with the first open question', () => {
    Q = createQuaire(questions, {
      introDialog: true,
      receivedMessages: 'Yes',
      receivedMessagesDialog: true,
      howAreYou: 'Bad',
    });

    expect(Q.getActiveQuestion()).toMatchObject({ id: 6, hasValue: false });
    expect(Q.canGoBack()).toBe(true);
  });
});
