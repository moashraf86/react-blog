import { $getRoot, $getSelection } from "lexical";
import { useEffect, useRef, useState } from "react";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ToolbarPlugin from "./ToolbarPlugin";
import ExampleTheme from "../../lib/ExampleTheme";
import "../../editor.css";

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
// function onError(error) {
//   console.error(error);
// }

const placeholder = "Start typing...";

export const Editor = ({ editorState, setEditorState }) => {
  const editorRef = useRef(null);
  console.log(editorRef);

  /**
   * MyOnChange function
   */
  const MyOnChangePlugin = ({ onChange }) => {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          onChange(editorState);
        });
      });
    }, [editor, onChange]);
    return null;
  };

  const onChange = (newEditorState) => {
    const editorStateJson = newEditorState.toJSON();
    setEditorState(editorStateJson);
  };

  const editorConfig = {
    namespace: "React.js Demo",
    nodes: [],
    // Handling of errors during update
    onError(error) {
      throw error;
    },
    // The editor theme
    theme: ExampleTheme,
  };

  return (
    <LexicalComposer initialConfig={editorConfig} editorRef={editorRef}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
      </div>
      <MyOnChangePlugin
        onChange={onChange}
        editorState={editorState}
        setEditorState={setEditorState}
      />
    </LexicalComposer>
  );
};
