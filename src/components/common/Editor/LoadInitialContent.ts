import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $getRoot } from 'lexical';
import { useEffect, useRef } from 'react';
import { $generateNodesFromDOM } from '@lexical/html';

type Props = { initialContent?: string };

export const LoadInitialContent = ({ initialContent }: Props) => {
  const [editor] = useLexicalComposerContext();
  const isMountedRef = useRef<boolean>(false);
  useEffect(() => {
    if (!initialContent || isMountedRef.current) {
      return;
    }

    editor.update(() => {
      $getRoot()
        .getChildren()
        .forEach((n) => n.remove());
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialContent, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      const paragraphNode = $createParagraphNode();
      nodes.forEach((n) => paragraphNode.append(n));
      $getRoot().append(paragraphNode);
    });
    isMountedRef.current = true;
  }, [editor, initialContent]);
  return null;
};
