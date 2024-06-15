/* eslint-disable react/prop-types */
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Alert } from "./Alert";
export const Form = ({
  heading,
  title,
  content,
  tag,
  image,
  onsubmit,
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
        <div className="flex justify-center items-center max-w-[400px] mx-auto">
          <div className="flex flex-col w-full bg-background border border-border rounded-md p-6 gap-4 mt-6">
            <h3 className="font-semibold text-xl md:text-3xl text-primary mb-2">
              {heading}
            </h3>
            <form onSubmit={onsubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <input
                  name="title"
                  id="title"
                  className={`w-full p-2 border text-primary border-input bg-transparent rounded-md ${
                    errors.title && "border-destructive"
                  }`}
                  value={title}
                  type="text"
                  placeholder="Add title"
                  onChange={(e) => handleChange(e)}
                />
                {errors.title && (
                  <p className="text-destructive">{errors.title}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <textarea
                  rows={4}
                  className={`w-full p-2 text-primary border border-input bg-transparent rounded-md ${
                    errors.content && "border-destructive"
                  }`}
                  placeholder="write something here..."
                  value={content}
                  name="content"
                  onChange={(e) => handleChange(e)}
                ></textarea>
                {errors.content && (
                  <p className="text-destructive">{errors.content}</p>
                )}
              </div>
              {!image && isImageRequired && (
                <>
                  <label
                    tabIndex="0"
                    htmlFor="image"
                    className="p-2 border border-dashed border-input min-h-20 flex items-center justify-center rounded-md cursor-pointer bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-zinc-50 "
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
                    <p className="text-destructive">{errors.image}</p>
                  )}
                </>
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
                      <i className="ri-edit-box-line text-white text-3xl"></i>
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
                      <i className="ri-delete-bin-line text-zinc-50 text-3xl"></i>
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
                  <input
                    type="checkbox"
                    id="checkbox"
                    className="cursor-pointer appearance-none w-5 h-5 bg-transparent border border-input rounded-md checked:bg-[url('src/assets/check.svg')] checked:bg-indigo-500"
                    onChange={handleSelectRandomImage}
                  />
                  <label
                    htmlFor="checkbox"
                    className="text-sm text-primary cursor-pointer"
                  >
                    Select random image instead
                  </label>
                </div>
              )}
              <div className="flex flex-wrap gap-3 items-center">
                <label
                  htmlFor="tech"
                  className={`text-primary py-1 px-4 border border-input rounded-full cursor-pointer has-[:checked]:bg-muted`}
                >
                  <input
                    type="radio"
                    id="tech"
                    value="tech"
                    name="tag"
                    className="text-primary"
                    hidden
                    checked={tag === "tech"}
                    onChange={(e) => handleChange(e)}
                  />
                  Tech
                </label>
                <label
                  htmlFor="culture"
                  className={`text-primary py-1 px-4 border border-input rounded-full cursor-pointer has-[:checked]:bg-muted `}
                >
                  <input
                    type="radio"
                    id="culture"
                    value="culture"
                    name="tag"
                    className="text-primary"
                    hidden
                    checked={tag === "culture"}
                    onChange={(e) => handleChange(e)}
                  />
                  Culture
                </label>
                <label
                  htmlFor="science"
                  className={`text-primary py-1 px-4 border border-input rounded-full cursor-pointer has-[:checked]:bg-muted`}
                >
                  <input
                    type="radio"
                    id="science"
                    value="science"
                    name="tag"
                    className="text-primary"
                    hidden
                    checked={tag === "science"}
                    onChange={(e) => handleChange(e)}
                  />
                  Science
                </label>
                {errors.tag && (
                  <p className="text-sm text-destructive">{errors.tag}</p>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md text-sm md:text-base"
              >
                {heading === "Add Post" ? "Create Post" : "Edit Post"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Alert msg="You need to sign in to create a post" />
      )}
    </>
  );
};
