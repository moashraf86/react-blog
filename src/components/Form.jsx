/* eslint-disable react/prop-types */
export const Form = ({
  onsubmit,
  heading,
  title,
  setTitle,
  content,
  setContent,
  handleImageChange,
  imageName,
}) => {
  return (
    <div className="flex justify-center items-center max-w-[400px] mx-auto translate-y-[50%] -mt-20 ">
      <div className="flex flex-col w-full bg-zinc-900 border border-zinc-800 rounded-md p-6 gap-4">
        <h3 className="font-semibold text-xl md:text-3xl text-zinc-50 mb-2">
          {heading}
        </h3>
        <form onSubmit={onsubmit} className="flex flex-col gap-4">
          <input
            className="p-2 border text-zinc-50 border-zinc-800 bg-zinc-900 rounded-md"
            value={title}
            type="text"
            placeholder="title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            rows={5}
            className="p-2 text-zinc-50 border border-zinc-800 bg-zinc-900 rounded-md"
            placeholder="write something here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <label
            htmlFor="image"
            className="p-2 border border-dashed border-zinc-800 min-h-24 flex items-center justify-center rounded-md cursor-pointer bg-zinc-900 text-zinc-200 "
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
          <p>
            {imageName && (
              <span className="flex gap-2 items-center text-green-800 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11.0026 16L6.75999 11.7574L8.17421 10.3431L11.0026 13.1716L16.6595 7.51472L18.0737 8.92893L11.0026 16Z"></path>
                </svg>
                image uploaded sucssesfully
              </span>
            )}
          </p>
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
