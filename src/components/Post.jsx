/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const Post = ({ post, handleShowModal }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  /**
   * Hide the popover when clicked outside
   */
  useEffect(() => {
    if (isPopoverOpen) {
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".modal")) {
          setIsPopoverOpen(false);
          console.log("document clicked");
        }
      });
      return () =>
        document.removeEventListener("click", setIsPopoverOpen(false));
    }
  }, [isPopoverOpen]);

  return (
    <li
      key={post.id}
      className="flex w-full sm:w-1/2 xl:w-1/3 sm:px-2 mb-6 sm:mb-4 "
    >
      <div className="flex flex-col gap-2 p-4 border-zinc-800 w-full rounded-md">
        <div className="h-[120px] bg-gradient-to-r from-zinc-400 to-zinc-800 rounded-md">
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover rounded-md"
            />
          )}
        </div>
        <div>
          <h2 className="text-xl md:text-2xl text-zinc-50 font-medium capitalize">
            {post.title}
          </h2>
        </div>
        <p className="text-zinc-300">{post.content}</p>
        <div className="modal relative flex justify-end gap-3">
          <button
            className="text-zinc-50 cursor-pointer p-1"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              className="fill-zinc-50"
            >
              <path d="M12 3C10.9 3 10 3.9 10 5C10 6.1 10.9 7 12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3ZM12 17C10.9 17 10 17.9 10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 17.9 13.1 17 12 17ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
            </svg>
          </button>
          {isPopoverOpen && (
            <ul
              className="min-w-[120px] flex flex-col items-start absolute top-7  right-0 p-4 bg-zinc-900 border border-zinc-800 rounded-md"
              onClick={() => setIsPopoverOpen(false)}
            >
              <li>
                <Link to={`/edit/${post.id}`} className="w-full">
                  <span className="inline-block py-1 text-zinc-50 font-medium text-start">
                    Edit
                  </span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleShowModal(post)}
                  className="py-1 font-medium w-full text-start text-red-500"
                >
                  Delete
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </li>
  );
};
