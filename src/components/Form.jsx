/* eslint-disable react/prop-types */
export const Form = ({
  onsubmit,
  heading,
  title,
  setTitle,
  content,
  setContent,
  handleImageChange,
  handleRemoveImage,
  image,
  validated,
}) => {
  const inValidTitle = validated && !title;
  const inValidContent = validated && !content;
  return (
    <div className="flex justify-center items-center max-w-[400px] mx-auto translate-y-[50%] -mt-20 ">
      <div className="flex flex-col w-full bg-zinc-900 border border-zinc-800 rounded-md p-6 gap-4">
        <h3 className="font-semibold text-xl md:text-3xl text-zinc-50 mb-2">
          {heading}
        </h3>
        <form onSubmit={onsubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <input
              name="title"
              id="title"
              className={`w-full p-2 border text-zinc-50 bg-zinc-900 rounded-md ${
                inValidTitle ? "border-red-600" : "border-zinc-800"
              }`}
              value={title}
              type="text"
              placeholder="Add title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <p className="text-sm text-red-600">
              {inValidTitle && "title is required"}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <textarea
              rows={5}
              className={`w-full p-2 text-zinc-50 border bg-zinc-900 rounded-md ${
                inValidContent ? "border-red-600" : "border-zinc-800"
              }`}
              placeholder="write something here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <p className="text-sm text-red-600">
              {inValidContent && "content is required"}
            </p>
          </div>
          {!image && (
            <label
              tabIndex="0"
              htmlFor="image"
              className="p-2 border border-dashed border-zinc-800 min-h-24 flex items-center justify-center rounded-md cursor-pointer bg-zinc-900 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-50 "
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
