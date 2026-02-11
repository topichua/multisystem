import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { replaceMultipleSpaces } from 'src/utils/html';

export function useSafeHtml(rawHtml: string) {
  return useMemo(() => {
    DOMPurify.addHook('beforeSanitizeElements', (currentNode) => {
      if (currentNode.nodeName === 'A') {
        processLinks(currentNode);
      }

      return currentNode;
    });

    const sanitized = DOMPurify.sanitize(rawHtml, { ADD_ATTR: ['target'] });

    // otherwise it's applied everywhere else >:(
    DOMPurify.removeHook('beforeSanitizeElements');

    return sanitized;
  }, [rawHtml]);
}

export function usePlainTextFromHtml(rawHtml: string) {
  return useMemo(() => {
    DOMPurify.addHook('beforeSanitizeElements', (currentNode) => {
      if (currentNode.nodeName === 'BR') {
        const textNodeWithSpace = document.createTextNode(' ');

        currentNode.replaceWith(textNodeWithSpace);
      }
      return currentNode;
    });

    const sanitized = DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: {
        html: false,
      },
    });

    // otherwise it's applied everywhere else >:(
    DOMPurify.removeHook('beforeSanitizeElements');

    return sanitized;
  }, [rawHtml]);
}

/**
 * This function will replace all <br /> tags with ''.
 * @param rawHtml
 */
export function usePreviewHtml(rawHtml: string, maxLength?: number) {
  return useMemo(() => {
    DOMPurify.addHook('beforeSanitizeElements', (currentNode) => {
      if (currentNode.nodeName === 'BR') {
        currentNode.replaceWith(' ');
      }

      if (currentNode.nodeName === 'A') {
        processLinks(currentNode);
      }

      return currentNode;
    });

    const sanitized = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['a', 'b', 'i', 'u'],
      ADD_ATTR: ['target'],
    });

    // otherwise it's applied everywhere else >:(
    DOMPurify.removeHook('beforeSanitizeElements');

    const slicedHtml =
      maxLength && rawHtml.length > maxLength
        ? `${sanitized.slice(0, maxLength)}...`
        : sanitized;

    return replaceMultipleSpaces(slicedHtml.trim());
  }, [rawHtml]);
}

function processLinks(node: Element) {
  node.setAttribute('rel', 'noopener noreferrer');
  node.setAttribute('target', '_blank');
}
