import {
  CSSProperties,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { $getRoot, EditorState, LexicalEditor } from 'lexical';

import { LoadInitialContent } from './LoadInitialContent';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import { theme } from './plugins/Theme';
import ToolbarPlugin, { BlockType } from './plugins/ToolbarPlugin';
import { YouTubeNode } from './plugins/YouTubeNode';
import YouTubePlugin from './plugins/YouTubePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export enum EditorOrderEnum {
  Default = 1,
  Reverse = 2,
}

type EditorProps = {
  order?: EditorOrderEnum;
  handleClearEditor?: any;
  initialContent?: string;
  textControlsOnly?: boolean;
  allowedBlocks?: BlockType[];
  placeholder?: string;
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
  styles?: CSSProperties | undefined;
};

function Placeholder({ placeholder }: { placeholder: string }) {
  return <div className="editor-placeholder">{placeholder}</div>;
}

const editorConfig: InitialConfigType = {
  namespace: 'React.js',
  theme: theme,
  onError(error: any) {
    throw error;
  },
  editorState: null,
};

type EditorRef = { focus: () => void; clear: () => void };

const DEFAULT_NODES = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  TableNode,
  TableCellNode,
  TableRowNode,
];

const REST_NODES = [YouTubeNode, AutoLinkNode, LinkNode];

export const Editor = forwardRef<EditorRef | null, EditorProps>(
  (props, ref) => {
    const {
      onChange,
      initialContent,
      textControlsOnly = false,
      placeholder = 'Enter text...',
      order = EditorOrderEnum.Default,
      allowedBlocks,
      styles,
    } = props;

    const editorRef = useRef<EditorRef | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => editorRef.current?.focus(),
        clear: () => editorRef.current?.clear(),
      }),
      []
    );

    const config = useMemo(
      () => ({
        ...editorConfig,
        nodes: textControlsOnly
          ? DEFAULT_NODES
          : [...DEFAULT_NODES, ...REST_NODES],
      }),
      [textControlsOnly]
    );

    return (
      <LexicalComposer initialConfig={config}>
        <EditorContent
          ref={editorRef}
          textControlsOnly={textControlsOnly}
          placeholder={placeholder}
          order={order}
          allowedBlocks={allowedBlocks}
          styles={styles}
        />
        <OnChangePlugin onChange={onChange} />
        <LoadInitialContent initialContent={initialContent} />
      </LexicalComposer>
    );
  }
);

export const EditorContent = forwardRef<
  EditorRef | null,
  Omit<EditorProps, 'onChange' | 'initialContent'>
>((props, ref) => {
  const [editor] = useLexicalComposerContext();
  const {
    textControlsOnly,
    placeholder = 'Enter text...',
    order = EditorOrderEnum.Default,
    allowedBlocks,
    styles,
  } = props;

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        editor.update(() => {
          const root = $getRoot();
          root?.selectEnd();
        });
      },
      clear: () => {
        editor.update(() => {
          const root = $getRoot();
          root.clear();
        });
      },
    }),
    [editor]
  );

  return (
    <div className="editor-container">
      {order === EditorOrderEnum.Default && (
        <ToolbarPlugin
          textControlsOnly={textControlsOnly}
          allowBlocks={allowedBlocks}
        />
      )}
      <div className="editor-inner">
        {/* <LoadInitialContent initialContent={initialContent} /> */}
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="editor-input" style={styles} />
          }
          placeholder={<Placeholder placeholder={placeholder} />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        {order === EditorOrderEnum.Reverse && (
          <ToolbarPlugin
            textControlsOnly={textControlsOnly}
            allowBlocks={allowedBlocks}
          />
        )}
        {/* <OnChangePlugin onChange={onChange} /> */}
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        <ListPlugin />
        {!textControlsOnly && <LinkPlugin />}
        {!textControlsOnly && <AutoLinkPlugin />}
        {!textControlsOnly && <YouTubePlugin />}
      </div>
    </div>
  );
});
