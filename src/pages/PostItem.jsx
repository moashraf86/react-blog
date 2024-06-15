/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { PostsContext } from "../context/PostsContext";
export const PostItem = ({ post, handleShowModal, className, type }) => {
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
      <div className="relative flex flex-col gap-4 px-4 border-zinc-800 w-full rounded-md">
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
        {/* Tag */}
        <div className="flex flex-col gap-2">
          {post.tag && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
                {post.tag}
              </span>
            </div>
          )}
          {/* Title */}
          <h3 className="text-xl md:text-2xl text-primary font-bold capitalize">
            {type === "item" ? (
              <Link to={`/post/${post.id}`}>
                {post.title.length > 50
                  ? `${post.title.substring(0, 50)}...`
                  : post.title}
              </Link>
            ) : (
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            )}
          </h3>
          {/* Content */}
          <p className="text-muted-foreground">
            {type === "item"
              ? post.content.length > 150
                ? `${post.content.substring(0, 150)}...`
                : post.content
              : post.content}
          </p>
        </div>
        {/* Footer */}
        <div className="modal relative flex justify-end items-center gap-1">
          {post.authorName && (
            <p className="text-muted-foreground me-auto">
              By{" "}
              <Link
                to={`/users/${post.authorId}`}
                className="hover:text-primary hover:underline"
              >
                {post.authorName}
              </Link>
            </p>
          )}

          {isBookmarked && (
            <label
              tabIndex="0"
              htmlFor={post.id}
              className="cursor-pointer p-1 text-primary"
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
          <p className="text-primary">
            {post.bookmarksCount > 0 && post.bookmarksCount}
          </p>
          {/* PopOver Button */}
          {isOwner && (
            <button
              className="text-zinc-50 cursor-pointer p-1"
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            >
              <i className="ri-more-2-fill text-lg"></i>
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
