/* eslint-disable react/prop-types */
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Alert, AlertDescription } from "../ui/alert";
import { Switch } from "../ui/switch";
import {
  RiDeleteBinLine,
  RiEditBoxLine,
  RiImageFill,
  RiInformationLine,
} from "@remixicon/react";
import { Editor } from "./Editor";
import { ComboboxDemo } from "../ui/combo-box";
import { tags } from "../../utils/tags";
export const Form = ({
  title,
  content,
  image,
  tag,
  onsubmit,
  onSelect,
  handleImageChange,
  handleRemoveImage,
  handleChange,
  handleSelectRandomImage,
  isImageRequired,
  errors,
}) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <>
      {currentUser ? (
        <div className="flex justify-center items-center max-w-5xl mx-auto">
          <div className="flex flex-col w-full bg-background rounded-md p-6 gap-4 mt-6">
            <form
              onSubmit={onsubmit}
              className="flex flex-col gap-4 items-start"
            >
              <div className="flex flex-col gap-1 self-stretch">
                <input
                  name="title"
                  id="title"
                  className={`w-full p-2 text-primary bg-transparent rounded-md text-2xl md:text-4xl font-bold focus-visible:outline-none ${
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
              <div className="flex flex-col items-start sm:flex-row sm:items-center gap-3">
                <div className="flex flex-col gap-1">
                  <ComboboxDemo
                    onSelect={onSelect}
                    tags={tags}
                    selectedValue={tag}
                  />
                  {errors.tag && (
                    <p className="text-sm text-danger">{errors.tag}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row items-center gap-2 flex-wrap">
                    {!image && isImageRequired && (
                      <label
                        tabIndex="0"
                        htmlFor="image"
                        className="py-2 px-4 h-9 border border-border flex items-center justify-center gap-2 rounded-md cursor-pointer bg-transparent text-primary text-sm font-medium"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            document.getElementById("image").click();
                          }
                        }}
                      >
                        <RiImageFill
                          size={24}
                          className="fill-muted-foreground"
                        />
                        Add Cover
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          hidden
                        />
                      </label>
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
                          Random image
                        </label>
                      </div>
                    )}
                    {image && (
                      <div className="relative rounded-md overflow-clip self-stretch">
                        <div className="group absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center gap-4 hover:bg-zinc-800/60">
                          <label
                            tabIndex="0"
                            htmlFor="image"
                            className="hidden group-hover:flex w-12 h-12 cursor-pointer items-center justify-center focus:outline-none focus:ring-2 focus:ring-zinc-50 rounded-md"
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
                            className="hidden group-hover:inline w-12 h-12 focus:outline-none focus:ring-2 focus:ring-zinc-50 rounded-md"
                            title="Delete Image"
                          >
                            <RiDeleteBinLine size={30} className="fill-white" />
                          </button>
                        </div>
                        <img
                          className="w-full aspect-video object-cover"
                          src={image}
                          alt=""
                        />
                      </div>
                    )}
                  </div>
                  {errors.image && isImageRequired ? (
                    <p className="text-sm text-danger">{errors.image}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-1 self-stretch">
                <Editor
                  name="title"
                  value={content}
                  onChange={(e) => {
                    handleChange({ target: { name: "content", value: e } });
                  }}
                />
                {errors.content && (
                  <p className="text-sm text-danger">{errors.content}</p>
                )}
              </div>
              <button
                type="submit"
                className="px-8 py-2 bg-primary text-primary-foreground font-semibold rounded-md text-base mt-2 self-end"
              >
                Publish
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
