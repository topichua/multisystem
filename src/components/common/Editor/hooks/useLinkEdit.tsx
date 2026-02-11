import {
  $createLinkNode,
  $isAutoLinkNode,
  $isLinkNode,
  LinkNode,
} from '@lexical/link';
import { $isAtNodeEnd } from '@lexical/selection';
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  BaseSelection,
  ElementNode,
  LexicalEditor,
  RangeSelection,
  TextNode,
} from 'lexical';
import { useCallback, useState } from 'react';

function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

interface UseLinkEditorReturn {
  isModalOpen: boolean;
  linkText: string;
  linkUrl: string;
  handleLink: () => void;
  saveLink: (text: string, url: string) => void;
  closeModal: () => void;
}

export function useLinkEditor(editor: LexicalEditor): UseLinkEditorReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const handleLink = useCallback(() => {
    editor.getEditorState().read(() => {
      setIsModalOpen(true);
      const selection = $getSelection();
      const getLinkParams = (
        parent: ElementNode | null,
        node: ElementNode | TextNode | LinkNode,
        selection: BaseSelection
      ) => {
        if ($isLinkNode(node)) {
          setLinkUrl(node.getURL());
          setLinkText(node.getTextContent());
        } else if ($isTextNode(node) && $isLinkNode(parent)) {
          setLinkUrl(parent.getURL());
          setLinkText(node.getTextContent());
        } else if ($isTextNode(node) && !$isLinkNode(parent)) {
          const selectionText = selection.getTextContent();
          let _text: string;
          if (selectionText?.length) {
            _text = selection.getTextContent();
          } else {
            _text = node.getTextContent();
          }
          setLinkUrl('');
          setLinkText(_text);
        } else {
          setLinkUrl('');
          setLinkText('');
        }
      };
      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection);
        const parent = node.getParent();
        getLinkParams(parent, node, selection);
      }
    });
  }, [editor]);

  const saveLink = useCallback(
    (text: string, url: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = getSelectedNode(selection);
          const parent = node.getParent();
          const getLinkParams = (
            parent: ElementNode | null,
            node: ElementNode | TextNode | LinkNode,
            selection: RangeSelection
          ) => {
            if (
              $isTextNode(node) &&
              ($isLinkNode(parent) || $isAutoLinkNode(parent))
            ) {
              if ($isAutoLinkNode(parent)) {
                const newLinkNode = $createLinkNode(url);
                const _t = $createTextNode(text);
                newLinkNode.append(_t);
                parent.replace(newLinkNode);
                _t.select();
              } else {
                node.setTextContent(text);
                (parent as LinkNode).setTitle(text);
                (parent as LinkNode).setURL(url);
                node.setTextContent(text);
                node.select();
              }
            } else if ($isTextNode(node) && !$isLinkNode(parent)) {
              const selectionText = selection.getTextContent();
              if (selectionText?.length) {
                selection.removeText();
                const linkNode = $createLinkNode(url);
                const _t = $createTextNode(text);
                linkNode.append(_t);
                selection.insertNodes([linkNode]);
                _t.select();
              } else {
                node.remove();
                const linkNode = $createLinkNode(url);
                const _t = $createTextNode(text);
                linkNode.append(_t);
                selection.insertNodes([linkNode]);
                _t.select();
              }
            } else {
              selection.removeText();
              const linkNode = $createLinkNode(url);
              const _t = $createTextNode(text);
              linkNode.append(_t);
              selection.insertNodes([linkNode]);
              _t.select();
            }
          };
          getLinkParams(parent, node, selection);
        }
      });
      setIsModalOpen(false);
    },
    [editor]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    linkText,
    linkUrl,
    handleLink,
    saveLink,
    closeModal,
  };
}
