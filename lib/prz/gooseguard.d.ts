/**
 * Pillar 3: GOOSEGUARD
 * Meta-awareness logic to detect and break redundant conversational loops
 */
export interface Action {
    id: string;
    type: string;
    payload: any;
    timestamp: number;
}
export interface GuardResult {
    shouldProceed: boolean;
    reason?: string;
    suggestedPivot?: string;
}
/**
 * Detects if an action is part of a redundant loop
 * @param action Current action
 * @param history Previous actions
 * @returns Guard result indicating whether to proceed
 */
export declare function beforeAction(action: Action, history: Action[]): GuardResult;
/**
 * Checks if we should suggest a pivot to the user
 */
export declare function shouldSuggestPivot(history: Action[]): boolean;
//# sourceMappingURL=gooseguard.d.ts.map