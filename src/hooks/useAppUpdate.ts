import { useEffect } from 'react';
import * as Updates from 'expo-updates';

export function useAppUpdate() {
  useEffect(() => {
    // Only check for updates in production (not during local dev)
    if (__DEV__) return;

    async function checkAndApplyUpdate() {
      try {
        const result = await Updates.checkForUpdateAsync();
        if (result.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        // Silently ignore — network issues, etc.
        console.warn('Update check failed:', e);
      }
    }

    checkAndApplyUpdate();
  }, []);
}
