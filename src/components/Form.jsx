/* eslint-disable react/prop-types */
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
  errors,
}) => {
  return (
    <div className="flex justify-center items-center max-w-[400px] mx-auto">
      <div className="flex flex-col w-full bg-zinc-900 border border-zinc-800 rounded-md p-6 gap-4 mt-6">
        <h3 className="font-semibold text-xl md:text-3xl text-zinc-50 mb-2">
          {heading}
        </h3>
        <form onSubmit={onsubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <input
              name="title"
              id="title"
              className={`w-full p-2 border text-zinc-50 border-zinc-800 bg-zinc-900 rounded-md ${
                errors.title && "border-red-600"
              }`}
              value={title}
              type="text"
              placeholder="Add title"
              onChange={(e) => handleChange(e)}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <textarea
              rows={4}
              className={`w-full p-2 text-zinc-50 border border-zinc-800 bg-zinc-900 rounded-md ${
                errors.content && "border-red-600"
              }`}
              placeholder="write something here..."
              value={content}
              name="content"
              onChange={(e) => handleChange(e)}
            ></textarea>
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content}</p>
            )}
          </div>
          {!image && (
            <>
              <label
                tabIndex="0"
                htmlFor="image"
                className="p-2 border border-dashed border-zinc-800 min-h-20 flex items-center justify-center rounded-md cursor-pointer bg-zinc-900 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-50 "
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
                <p className="text-sm text-red-600">{errors.image}</p>
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
          <div className="flex flex-wrap gap-3 items-center">
            <label
              htmlFor="tech"
              className={`text-zinc-50 py-1 px-4 border border-zinc-800 rounded-full cursor-pointer has-[:checked]:bg-zinc-600`}
            >
              <input
                type="radio"
                id="tech"
                value="tech"
                name="tag"
                className="text-zinc-50"
                hidden
                checked={tag === "tech"}
                onChange={(e) => handleChange(e)}
              />
              Tech
            </label>
            <label
              htmlFor="culture"
              className={`text-zinc-50 py-1 px-4 border border-zinc-800 rounded-full cursor-pointer has-[:checked]:bg-zinc-600 `}
            >
              <input
                type="radio"
                id="culture"
                value="culture"
                name="tag"
                className="text-zinc-50"
                hidden
                checked={tag === "culture"}
                onChange={(e) => handleChange(e)}
              />
              Culture
            </label>
            <label
              htmlFor="science"
              className={`text-zinc-50 py-1 px-4 border border-zinc-800 rounded-full cursor-pointer has-[:checked]:bg-zinc-600`}
            >
              <input
                type="radio"
                id="science"
                value="science"
                name="tag"
                className="text-zinc-50"
                hidden
                checked={tag === "science"}
                onChange={(e) => handleChange(e)}
              />
              Science
            </label>
            {errors.tag && <p className="text-sm text-red-600">{errors.tag}</p>}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-zinc-50 text-zink-900 font-semibold rounded-md text-sm md:text-base"
          >
            {heading === "Add Post" ? "Create Post" : "Edit Post"}
          </button>
        </form>
      </div>
    </div>
  );
};
