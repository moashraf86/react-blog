/* eslint-disable react/prop-types */
import MDEditor from "@uiw/react-md-editor";
import { markdownToPlainText } from "../../utils/markdownToPlainText";
import { useState } from "react";
import { debounce } from "../../utils/debounce";
import { handleToolbarIcons } from "../../utils/handleToolbarIcons";

export const Editor = ({ value, onChange }) => {
  /**
   * Handle character count
   */
  const [count, setCount] = useState(markdownToPlainText(value).length);
  const handleCount = debounce((content) => {
    const plainText = markdownToPlainText(content);
    const count = plainText.length;
    setCount(count);
  }, 300);

  return (
    <>
      <MDEditor
        height="auto"
        preview="edit"
        value={value}
        onChange={onChange}
        onInput={(e) => {
          handleCount(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
        className="markdown-editor"
        commandsFilter={handleToolbarIcons}
        textareaProps={{
          placeholder: "Write your post content here...",
        }}
        visibleDragbar={false}
      />
      <p className="flex justify-end text-muted-foreground">{count}/10000</p>
    </>
  );
};
