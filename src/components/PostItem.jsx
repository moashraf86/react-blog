/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { PostsContext } from "../context/PostsContext";
export const PostItem = ({ post, handleShowModal, className }) => {
  const { dispatch } = useContext(PostsContext);
  const { currentUser, updateUser } = useContext(AuthContext);
  const isGuest = currentUser?.isGuest;
  const isOwner = currentUser?.id === post.authorId;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isBookmarked = currentUser?.bookmarks.includes(post.id);

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

  /**
   * Handle Add Bookmark
   */
  const handleAddBookmark = (post) => {
    const addBookmark = async (post) => {
      try {
        setLoading(true);
        // if the user is not signed in, return
        if (!currentUser || isGuest) {
          alert("Please login to bookmark this post.");
          return;
        }
        const userRef = doc(db, "users", currentUser.id);
        const userSnap = await getDoc(userRef);
        const postRef = doc(db, "posts", post.id);
        // update post count + 1
        await updateDoc(postRef, {
          ...post,
          bookmarksCount: post.bookmarksCount + 1,
        });
        // update user doc bookmarks
        await updateDoc(userRef, {
          // check if the post is already bookmarked
          bookmarks: userSnap.data().bookmarks.includes(post.id)
            ? userSnap.data().bookmarks
            : [...userSnap.data().bookmarks, post.id],
        });
        // update the post reducer
        dispatch({
          type: "EDIT_POST",
          payload: { ...post, bookmarksCount: post.bookmarksCount + 1 },
        });
        // update the currentUser reducer
        updateUser({
          bookmarks: userSnap.data().bookmarks.includes(post.id)
            ? userSnap.data().bookmarks
            : [...userSnap.data().bookmarks, post.id],
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    addBookmark(post);
  };

  /**
   * Handle Remove Bookmark
   */
  const handleRemoveBookmark = (post) => {
    const removeBookmark = async (post) => {
      try {
        setLoading(true);
        const userRef = doc(db, "users", currentUser.id);
        const userSnap = await getDoc(userRef);
        const postRef = doc(db, "posts", post.id);
        // update post count - 1
        await updateDoc(postRef, {
          ...post,
          bookmarksCount: Math.max(post.bookmarksCount - 1, 0),
        });
        // update user doc bookmarks
        await updateDoc(userRef, {
          bookmarks: userSnap.data().bookmarks.filter((id) => id !== post.id),
        });
        // update post reducer
        dispatch({
          type: "EDIT_POST",
          payload: { ...post, bookmarksCount: post.bookmarksCount - 1 },
        });
        // update currentUser reducer
        updateUser({
          bookmarks: userSnap.data().bookmarks.filter((id) => id !== post.id),
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    removeBookmark(post);
  };

  return (
    <li className={`flex w-full sm:px-2 mb-6 sm:mb-4 ${className}`}>
      <div className="relative flex flex-col gap-4 p-4 border-zinc-800 w-full rounded-md">
        {/* Image */}
        <div className="h-[180px] bg-gradient-to-r from-zinc-400 to-zinc-800 rounded-md">
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover rounded-md"
            />
          )}
        </div>
        {/* Content */}
        <div className="flex flex-col gap-2">
          {post.tag && (
            <div className="flex justify-between items-center">
              <span className="text-zinc-200 text-xs uppercase tracking-widest">
                {post.tag}
              </span>
            </div>
          )}
          <h2 className="text-xl md:text-2xl text-zinc-50 font-medium capitalize">
            <Link to={`/post/${post.id}`}>
              {post.title.length > 50
                ? `${post.title.substring(0, 50)}...`
                : post.title}
            </Link>
          </h2>
          <p className="text-zinc-300">
            {post.content.length > 150
              ? `${post.content.substring(0, 150)}...`
              : post.content}
          </p>
        </div>
        {/* Footer */}
        <div className="modal relative flex justify-end items-center gap-1">
          <Link to={`/users/${post.authorId}`} className="me-auto">
            <p className="text-zinc-500">
              {post.authorName && `By ${post.authorName}`}
            </p>
          </Link>
          {isBookmarked && (
            <label
              tabIndex="0"
              htmlFor={post.id}
              className="cursor-pointer p-1 text-zinc-50"
            >
              <input
                type="checkbox"
                name="bookmark"
                id={post.id}
                hidden
                onChange={() => handleRemoveBookmark(post)}
              />
              {loading && <i className="ri-loader-4-line"></i>}
              {!loading && <i className="ri-bookmark-fill text-lg"></i>}
            </label>
          )}
          {!isBookmarked && (
            <label
              tabIndex="0"
              htmlFor={post.id}
              className="cursor-pointer p-1 text-zinc-50"
            >
              <input
                type="checkbox"
                name="bookmark"
                id={post.id}
                hidden
                onChange={() => handleAddBookmark(post)}
              />
              {loading && <i className="ri-loader-4-line"></i>}
              {!loading && <i className="ri-bookmark-line text-lg"></i>}
            </label>
          )}
          {/* Bookmarks count */}
          <p className="text-zinc-100">
            {post.bookmarksCount > 0 && post.bookmarksCount}
          </p>
          {/* PopOver Button */}
          {isOwner && (
            <button
              className="text-zinc-50 cursor-pointer p-1"
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                className="fill-zinc-50"
              >
                <path d="M12 3C10.9 3 10 3.9 10 5C10 6.1 10.9 7 12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3ZM12 17C10.9 17 10 17.9 10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 17.9 13.1 17 12 17ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
              </svg>
            </button>
          )}
          {isPopoverOpen && (
            <ul
              className="min-w-[120px] flex flex-col items-start absolute top-7 right-0 z-50 p-4 bg-zinc-900 border border-zinc-800 rounded-md"
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
