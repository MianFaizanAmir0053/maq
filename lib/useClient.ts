import { useSyncExternalStore } from 'react';

const noop = () => () => {};

/** false during server render and hydration, true afterwards. For values that only exist in the browser (today's date). */
export function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false);
}
