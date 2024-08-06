/* eslint-disable react/prop-types */
import MDEditor from "@uiw/react-md-editor";

export const Editor = ({ value, onChange }) => {
  return (
    <div className="container">
      <MDEditor value={value} onChange={onChange} />
    </div>
  );
};
