import { useCallback, useState } from 'react';

type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>;

/**
 * Hook that provides a state and a function to copy to clipboard.
 * @returns a tuple with the current copied value and a function to copy a value to the clipboard.
 * The function returns a promise that resolves to true if the copy operation was successful, false otherwise.
 * The state is updated with the copied value if the operation was successful.
 * The function does nothing if the navigator.clipboard is not supported.
 * @example
 * const [copiedText, copyToClipboard] = useCopyToClipboard();
 * const handleClick = () => {
 *   copyToClipboard('https://github.com/')
 *     .then(() => {
 *         console.log('Link copied.');
 *     });
 * }
 */
export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  }, []);

  return [copiedText, copy];
}
