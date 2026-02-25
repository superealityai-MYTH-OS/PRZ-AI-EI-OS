import { beforeAction, shouldSuggestPivot, Action } from '../gooseguard';

describe('GOOSEGUARD', () => {
  const now = Date.now();

  const makeAction = (overrides: Partial<Action> = {}): Action => ({
    id: 'action-1',
    type: 'request',
    payload: 'Generate a report',
    timestamp: now,
    ...overrides,
  });

  describe('beforeAction', () => {
    it('allows action when history is empty', () => {
      const result = beforeAction(makeAction(), []);
      expect(result.shouldProceed).toBe(true);
    });

    it('allows action when similar actions are below threshold', () => {
      const history: Action[] = [
        makeAction({ id: 'a1', timestamp: now - 1000 }),
        makeAction({ id: 'a2', timestamp: now - 2000 }),
      ];
      const result = beforeAction(makeAction({ id: 'a3' }), history);
      expect(result.shouldProceed).toBe(true);
    });

    it('blocks action when 3+ similar actions detected (loop)', () => {
      const history: Action[] = [
        makeAction({ id: 'a1', timestamp: now - 1000 }),
        makeAction({ id: 'a2', timestamp: now - 2000 }),
        makeAction({ id: 'a3', timestamp: now - 3000 }),
      ];
      const result = beforeAction(makeAction({ id: 'a4' }), history);
      expect(result.shouldProceed).toBe(false);
      expect(result.reason).toContain('GOOSEGUARD');
      expect(result.suggestedPivot).toBeDefined();
    });

    it('allows action when similar actions are outside the time window', () => {
      const oldTimestamp = now - 10 * 60 * 1000; // 10 minutes ago (outside 5-min window)
      const history: Action[] = [
        makeAction({ id: 'a1', timestamp: oldTimestamp }),
        makeAction({ id: 'a2', timestamp: oldTimestamp - 1000 }),
        makeAction({ id: 'a3', timestamp: oldTimestamp - 2000 }),
      ];
      const result = beforeAction(makeAction({ id: 'a4' }), history);
      expect(result.shouldProceed).toBe(true);
    });

    it('allows action of different type even with many similar type actions', () => {
      const history: Action[] = [
        makeAction({ id: 'a1', type: 'other', timestamp: now - 1000 }),
        makeAction({ id: 'a2', type: 'other', timestamp: now - 2000 }),
        makeAction({ id: 'a3', type: 'other', timestamp: now - 3000 }),
      ];
      const result = beforeAction(makeAction({ id: 'a4', type: 'request' }), history);
      expect(result.shouldProceed).toBe(true);
    });
  });

  describe('shouldSuggestPivot', () => {
    it('returns false when history has fewer than 5 actions', () => {
      const history = [makeAction(), makeAction(), makeAction()];
      expect(shouldSuggestPivot(history)).toBe(false);
    });

    it('returns true when last 5 actions are all the same type', () => {
      const history: Action[] = Array.from({ length: 5 }, (_, i) =>
        makeAction({ id: `a${i}`, type: 'request' })
      );
      expect(shouldSuggestPivot(history)).toBe(true);
    });

    it('returns false when last 5 actions have mixed types', () => {
      const history: Action[] = [
        makeAction({ id: 'a1', type: 'request' }),
        makeAction({ id: 'a2', type: 'search' }),
        makeAction({ id: 'a3', type: 'request' }),
        makeAction({ id: 'a4', type: 'analyze' }),
        makeAction({ id: 'a5', type: 'request' }),
      ];
      expect(shouldSuggestPivot(history)).toBe(false);
    });
  });
});
