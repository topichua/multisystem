import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  $createCodeNode,
  $isCodeNode,
  getCodeLanguages,
  getDefaultCodeLanguage,
} from '@lexical/code';
import { $isLinkNode } from '@lexical/link';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import {
  $isAtNodeEnd,
  $isParentElementRTL,
  $wrapNodes,
} from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { Input, Modal, Typography } from 'antd';
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  REDO_COMMAND,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { createPortal } from 'react-dom';

import { Button } from 'src/components/common/Button/Button';
import { Stack } from 'src/components/common/Stack/Stack';

import { LinkModal } from '../components/LinkEditorModal';
import { useLinkEditor } from '../hooks/useLinkEdit';
import { INSERT_YOUTUBE_COMMAND } from './YouTubePlugin';

export type BlockType =
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'ul'
  | 'ol'
  | 'quote'
  | 'code';

interface BlockOptionsDropdownListProps extends Record<string, any> {
  allowedBlocks?: BlockType[];
}

const LowPriority = 1;

const supportedBlockTypes = new Set([
  'paragraph',
  'quote',
  'code',
  'h1',
  'h2',
  'ul',
  'ol',
]);

const blockTypeToBlockName: any = {
  code: 'Code Block',
  h1: 'Large Heading',
  h2: 'Small Heading',
  h3: 'Heading',
  h4: 'Heading',
  h5: 'Heading',
  ol: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
  ul: 'Bulleted List',
};

function Divider() {
  return <div className="divider" />;
}

function Select({ onChange, className, options, value }: any) {
  return (
    <select className={className} onChange={onChange} value={value}>
      <option hidden={true} value="" />
      {options.map((option: any) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

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

function BlockOptionsDropdownList({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown,
  allowBlocks,
}: BlockOptionsDropdownListProps) {
  const dropDownRef = useRef(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown: any = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event: any) => {
        const target = event.target;

        //@ts-ignore
        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener('click', handle);

      return () => {
        document.removeEventListener('click', handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatLargeHeading = () => {
    if (blockType !== 'h1') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode('h1'));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatSmallHeading = () => {
    if (blockType !== 'h2') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode('h2'));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatBulletList = () => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatNumberedList = () => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const shouldDisplayBlock = (type: BlockType) => {
    return !allowBlocks || allowBlocks.includes(type);
  };

  return (
    <div className="dropdown" ref={dropDownRef}>
      {shouldDisplayBlock('paragraph') && (
        <button className="item" onClick={formatParagraph} type="button">
          <span className="icon paragraph" />
          <span className="text">Normal</span>
          {blockType === 'paragraph' && <span className="active" />}
        </button>
      )}
      {shouldDisplayBlock('h1') && (
        <button className="item" onClick={formatLargeHeading} type="button">
          <span className="icon large-heading" />
          <span className="text">Large Heading</span>
          {blockType === 'h1' && <span className="active" />}
        </button>
      )}
      {shouldDisplayBlock('h2') && (
        <button className="item" onClick={formatSmallHeading} type="button">
          <span className="icon small-heading" />
          <span className="text">Small Heading</span>
          {blockType === 'h2' && <span className="active" />}
        </button>
      )}
      {shouldDisplayBlock('ul') && (
        <button className="item" onClick={formatBulletList} type="button">
          <span className="icon bullet-list" />
          <span className="text">Bullet List</span>
          {blockType === 'ul' && <span className="active" />}
        </button>
      )}
      {shouldDisplayBlock('ol') && (
        <button className="item" onClick={formatNumberedList} type="button">
          <span className="icon numbered-list" />
          <span className="text">Numbered List</span>
          {blockType === 'ol' && <span className="active" />}
        </button>
      )}
      {shouldDisplayBlock('quote') && (
        <button className="item" onClick={formatQuote} type="button">
          <span className="icon quote" />
          <span className="text">Quote</span>
          {blockType === 'quote' && <span className="active" />}
        </button>
      )}
      {shouldDisplayBlock('code') && (
        <button className="item" onClick={formatCode} type="button">
          <span className="icon code" />
          <span className="text">Code Block</span>
          {blockType === 'code' && <span className="active" />}
        </button>
      )}
    </div>
  );
}

const YOUTUBE_ID_PARSER =
  /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

const parseYouTubeVideoID = (url: string) => {
  const urlMatches = url.match(YOUTUBE_ID_PARSER);

  return urlMatches?.[2].length === 11 ? urlMatches[2] : null;
};

function InsertYouTubeDialog({
  activeEditor,
  setYoutubeModalOpen,
}: {
  activeEditor: LexicalEditor;
  setYoutubeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [text, setText] = useState('');

  const onClick = () => {
    const videoID = parseYouTubeVideoID(text);
    if (videoID) {
      activeEditor.dispatchCommand(INSERT_YOUTUBE_COMMAND, videoID);
    }
    setYoutubeModalOpen(false);
  };

  const isDisabled = text === '' || !parseYouTubeVideoID(text);

  return (
    <Stack vertical>
      <Typography.Text>YouTube URL</Typography.Text>
      <Input
        placeholder="i.e. https://www.youtube.com/watch?v=jNQXAC9IVRw"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <Stack distribution="trailing">
        <Button disabled={isDisabled} onClick={onClick} htmlType="button">
          Confirm
        </Button>
      </Stack>
    </Stack>
  );
}

export default function ToolbarPlugin({
  textControlsOnly = false,
  allowBlocks,
}: {
  textControlsOnly?: boolean;
  allowBlocks?: BlockType[];
}) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [selectedElementKey, setSelectedElementKey] = useState<any>(null);
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] =
    useState(false);
  const [codeLanguage, setCodeLanguage] = useState('');
  const [_, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [youtubeModalOpen, setYoutubeModalOpen] = React.useState(false);
  const { linkUrl, closeModal, handleLink, isModalOpen, linkText, saveLink } =
    useLinkEditor(editor);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      // setIsCode(selection.hasFormat('code'));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload) => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const codeLanguges = useMemo(() => getCodeLanguages(), []);
  const onCodeLanguageSelect = useCallback(
    (e: any) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey]
  );

  return (
    <>
      <Modal
        open={youtubeModalOpen}
        onCancel={() => setYoutubeModalOpen(false)}
        footer={null}
      >
        <InsertYouTubeDialog
          activeEditor={editor}
          setYoutubeModalOpen={setYoutubeModalOpen}
        />
      </Modal>
      <LinkModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={saveLink}
        initialText={linkText}
        initialUrl={linkUrl}
      />
      <div className="toolbar" ref={toolbarRef}>
        <button
          type="button"
          disabled={!canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          className="toolbar-item spaced"
          aria-label="Undo"
        >
          <i className="format undo" />
        </button>
        <button
          type="button"
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          className="toolbar-item"
          aria-label="Redo"
        >
          <i className="format redo" />
        </button>
        <Divider />
        {supportedBlockTypes.has(blockType) && (
          <>
            <button
              className="toolbar-item block-controls"
              onClick={() =>
                setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
              }
              aria-label="Formatting Options"
              type="button"
            >
              <span className={'icon block-type ' + blockType} />
              <span className="text">{blockTypeToBlockName[blockType]}</span>
              <i className="chevron-down" />
            </button>
            {showBlockOptionsDropDown &&
              createPortal(
                <BlockOptionsDropdownList
                  editor={editor}
                  blockType={blockType}
                  toolbarRef={toolbarRef}
                  setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
                  allowBlocks={allowBlocks}
                />,
                document.body
              )}
            <Divider />
          </>
        )}
        {blockType === 'code' ? (
          <>
            <Select
              className="toolbar-item code-language"
              onChange={onCodeLanguageSelect}
              options={codeLanguges}
              value={codeLanguage}
            />
            <i className="chevron-down inside" />
          </>
        ) : (
          <>
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
              }}
              className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
              aria-label="Format Bold"
              type="button"
            >
              <i className="format bold" />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
              }}
              className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
              aria-label="Format Italics"
            >
              <i className="format italic" />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
              }}
              className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
              aria-label="Format Underline"
            >
              <i className="format underline" />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
              }}
              className={
                'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')
              }
              aria-label="Format Strikethrough"
            >
              <i className="format strikethrough" />
            </button>
            {/* <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
              }}
              className={'toolbar-item spaced ' + (isCode ? 'active' : '')}
              aria-label="Insert Code"
            >
              <i className="format code" />
            </button> */}
            {!textControlsOnly && (
              <button
                onClick={handleLink}
                className={'toolbar-item spaced ' + (isLink ? 'active' : '')}
                aria-label="Insert Link"
                type="button"
              >
                <i className="format link" />
              </button>
            )}
            {!textControlsOnly && (
              <button
                onClick={() => setYoutubeModalOpen(true)}
                className="toolbar-item"
                aria-label="Insert YouTube Video"
                type="button"
              >
                <i className="format youtube" />
              </button>
            )}
            <Divider />
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
              }}
              className="toolbar-item spaced"
              aria-label="Left Align"
              type="button"
            >
              <i className="format left-align" />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
              }}
              className="toolbar-item spaced"
              aria-label="Center Align"
            >
              <i className="format center-align" />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
              }}
              className="toolbar-item spaced"
              aria-label="Right Align"
            >
              <i className="format right-align" />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
              }}
              className="toolbar-item"
              aria-label="Justify Align"
            >
              <i className="format justify-align" />
            </button>{' '}
          </>
        )}
      </div>
    </>
  );
}
