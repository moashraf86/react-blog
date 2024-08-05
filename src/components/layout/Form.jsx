/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Alert, AlertDescription } from "../ui/alert";
import { Switch } from "../ui/switch";
import {
  RiDeleteBinLine,
  RiEditBoxLine,
  RiInformationLine,
} from "@remixicon/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Editor } from "../ui/Editor";
export const Form = ({
  heading,
  title,
  content,
  tag,
  image,
  onsubmit,
  editorState,
  setEditorState,
  handleImageChange,
  handleRemoveImage,
  handleChange,
  handleSelectRandomImage,
  isImageRequired,
  errors,
}) => {
  const { currentUser } = useContext(AuthContext);
  const editorRef = useRef(null);
  console.log(editorRef);
  return (
    <>
      {currentUser ? (
        <div className="flex justify-center items-center max-w-[600px] mx-auto">
          <div className="flex flex-col w-full bg-background sm:border border-border rounded-md p-6 gap-4 mt-6">
            <h3 className="font-semibold text-xl md:text-3xl text-primary mb-2">
              {heading}
            </h3>
            <form onSubmit={onsubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 relative">
                <input
                  name="title"
                  id="title"
                  className={`w-full p-2 border text-primary bg-transparent rounded-md ${
                    errors.title === true && "border-input"
                  } ${
                    errors.title !== true &&
                    errors.title !== "" &&
                    "border-danger"
                  }`}
                  value={title}
                  type="text"
                  placeholder="Add title"
                  onChange={(e) => handleChange(e)}
                />
                {errors.title && (
                  <p className="text-sm text-danger">{errors.title}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                {/* <textarea
                  rows="6"
                  className={`w-full p-2 text-primary border bg-transparent rounded-md ${
                    errors.content === true && "border-input"
                  } ${
                    errors.content !== true &&
                    errors.content !== "" &&
                    "border-danger"
                  }`}
                  placeholder="write something here..."
                  value={content}
                  name="content"
                  onChange={(e) => handleChange(e)}
                ></textarea> */}
                <Editor
                  editorRef={editorRef}
                  editorState={editorState}
                  setEditorState={setEditorState}
                />
                {errors.content && (
                  <p className="text-sm text-danger">{errors.content}</p>
                )}
              </div>
              {!image && isImageRequired && (
                <div className="flex flex-col gap-1">
                  <label
                    tabIndex="0"
                    htmlFor="image"
                    className={`p-2 border border-dashed min-h-20 flex items-center justify-center rounded-md cursor-pointer bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-zinc-50 ${
                      errors.image === true && "border-green-500"
                    } ${
                      errors.image !== true &&
                      errors.image !== "" &&
                      "border-danger"
                    }`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        document.getElementById("image").click();
                      }
                    }}
                  >
                    click to upload image
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                  </label>
                  {errors.image && (
                    <p className="text-sm text-danger">{errors.image}</p>
                  )}
                </div>
              )}
              {image && (
                <div className="relative rounded-md overflow-clip">
                  <div className="absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center gap-4 bg-zinc-800/60">
                    <label
                      tabIndex="0"
                      htmlFor="image"
                      className="w-12 h-12 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-zinc-50 rounded-md"
                      title="Edit image"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          document.getElementById("image").click();
                        }
                      }}
                    >
                      <RiEditBoxLine size={30} className="fill-white" />
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                      />
                    </label>
                    <button
                      onClick={handleRemoveImage}
                      className="w-12 h-12 focus:outline-none focus:ring-2 focus:ring-zinc-50 rounded-md"
                      title="Delete Image"
                    >
                      <RiDeleteBinLine size={30} className="fill-white" />
                    </button>
                  </div>
                  <img
                    className="w-full max-h-[120px] object-cover"
                    src={image}
                    alt=""
                  />
                </div>
              )}
              {!image && isImageRequired && (
                <p className="text-sm uppercase text-center text-zinc-400">
                  or
                </p>
              )}
              {/* Select Random image */}
              {!image && (
                <div className="flex gap-2 items-center ">
                  <Switch
                    aria-label="Select random image instead"
                    id="switch"
                    onCheckedChange={handleSelectRandomImage}
                  />
                  <label
                    htmlFor="switch"
                    className={`text-sm cursor-pointer ${
                      isImageRequired && "text-muted-foreground"
                    }`}
                  >
                    Select random image instead
                  </label>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap gap-3 items-center">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={tag === "tech"}
                    tabIndex="0"
                    className="text-primary py-1 px-4 border border-input rounded-full cursor-pointer aria-checked:bg-muted"
                    onClick={() =>
                      handleChange({ target: { name: "tag", value: "tech" } })
                    }
                  >
                    Tech
                  </button>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={tag === "culture"}
                    tabIndex="0"
                    className="text-primary aria-checked:bg-muted py-1 px-4 border border-input rounded-full cursor-pointer"
                    onClick={() =>
                      handleChange({
                        target: { name: "tag", value: "culture" },
                      })
                    }
                  >
                    Culture
                  </button>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={tag === "science"}
                    tabIndex="0"
                    className="text-primary aria-checked:bg-muted py-1 px-4 border border-input rounded-full cursor-pointer"
                    onClick={() =>
                      handleChange({
                        target: { name: "tag", value: "science" },
                      })
                    }
                  >
                    Science
                  </button>
                </div>
                {errors.tag && (
                  <p className="text-sm text-danger">{errors.tag}</p>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md text-base mt-2"
              >
                {heading === "Add Post" ? "Create Post" : "Edit Post"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Alert variant="default" className="flex items-center gap-3">
          <RiInformationLine size={24} />
          <AlertDescription>
            You need to sign in to create a post
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
