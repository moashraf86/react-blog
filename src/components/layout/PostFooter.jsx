/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { AuthContext } from "../../context/AuthContext";
import { debounce } from "../../utils/debounce";

export const PostFooter = ({ post, comments }) => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState({
    isBookmarked: false,
    bookmarksCount: post.bookmarksCount,
  });
  const { authorImage, authorName, authorId, createdAt } = post;
  const { isGuest } = currentUser || {};

  // update the currentUser reducer to match firestore data
  const updateBookmarks = async () => {
    const userRef = doc(db, "users", currentUser?.id);
    const postRef = doc(db, "posts", post?.id);
    const userSnap = await getDoc(userRef);
    const postSnap = await getDoc(postRef);
    // dispatch action to update the currentUser reducer
    updateUser({
      bookmarks: userSnap.data().bookmarks.includes(post.id)
        ? userSnap.data().bookmarks
        : [...userSnap.data().bookmarks, post.id],
    });
    // set the initial state of the bookmark button
    setBookmarks({
      isBookmarked: userSnap.data().bookmarks.includes(post.id) ? true : false,
      bookmarksCount: postSnap.data().bookmarksCount,
    });
  };
  useEffect(() => {
    updateBookmarks();
  }, []);
  /**
   * Handle Add Bookmark
   */

  const handleAddBookmark = debounce((post) => {
    const userRef = doc(db, "users", currentUser?.id);
    const postRef = doc(db, "posts", post?.id);
    // if the user is not signed in, return
    if (!currentUser || isGuest) {
      alert("Please login to bookmark this post.");
      return;
    }
    if (!navigator.onLine) {
      alert("You are offline. Please check your internet connection.");
      return;
    }
    // update the bookmark state in UI immediately to give feedback to the user
    setBookmarks({
      isBookmarked: true,
      bookmarksCount: bookmarks.bookmarksCount + 1,
    });
    // add the bookmark to the database
    const addBookmark = async (post) => {
      try {
        const userSnap = await getDoc(userRef);
        const postSnap = await getDoc(postRef);
        // update post count + 1
        await updateDoc(postRef, {
          ...post,
          bookmarksCount: postSnap.data().bookmarksCount + 1,
        });
        // update user doc bookmarks array
        await updateDoc(userRef, {
          // check if the post is already bookmarked
          bookmarks: userSnap.data().bookmarks.includes(post.id)
            ? userSnap.data().bookmarks
            : [...userSnap.data().bookmarks, post.id],
        });
      } catch (error) {
        console.log(error);
      }
    };
    addBookmark(post);
  }, 300);

  /**
   * Handle Remove Bookmark
   */
  const handleRemoveBookmark = debounce((post) => {
    const userRef = doc(db, "users", currentUser?.id);
    const postRef = doc(db, "posts", post?.id);
    setBookmarks({
      isBookmarked: false,
      bookmarksCount: bookmarks.bookmarksCount - 1,
    });
    const removeBookmark = async (post) => {
      try {
        const userSnap = await getDoc(userRef);
        const postSnap = await getDoc(postRef);
        // update post count - 1
        await updateDoc(postRef, {
          ...post,
          bookmarksCount: Math.max(postSnap.data().bookmarksCount - 1, 0),
        });
        // update user doc bookmarks array
        await updateDoc(userRef, {
          bookmarks: userSnap.data().bookmarks.filter((id) => id !== post.id),
        });
      } catch (error) {
        console.log(error);
      }
    };
    removeBookmark(post);
  }, 300);

  return (
    <div className="flex justify-between items-center py-3 my-4 border-t border-b border-border">
      <div className="flex items-center gap-2">
        <img
          src={authorImage}
          alt={authorName}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col ">
          <p className="text-primary font-semibold ml-2">
            <Link to={`/users/${authorId}`}>{authorName}</Link>
          </p>
          <p className="text-muted-foreground text-sm ml-2">
            Published at: {createdAt?.split("T")[0]}
          </p>
        </div>
      </div>
      {/* bookmarks / comments */}
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {bookmarks.isBookmarked && (
            <button
              className="cursor-pointer p-1 text-primary"
              onClick={() => handleRemoveBookmark(post)}
              aria-label="Remove Bookmark"
            >
              <i className="ri-bookmark-fill text-lg"></i>
            </button>
          )}
          {!bookmarks.isBookmarked && (
            <button
              className="cursor-pointer p-1 text-zinc-50"
              onClick={() => handleAddBookmark(post)}
              aria-label="Add Bookmark"
            >
              <i className="ri-bookmark-line text-lg"></i>
            </button>
          )}
          {/* Bookmarks count */}
          <p className="text-primary">
            {bookmarks.bookmarksCount > 0 && bookmarks.bookmarksCount}
          </p>
        </div>
        {/* comments */}
        <div className="flex items-center gap-2">
          <i className="ri-chat-3-line text-primary text-lg"></i>
          {comments?.length > 0 && (
            <p className="text-lg">{comments?.length}</p>
          )}
        </div>
        {/* Share */}
        <i className="ri-share-forward-line text-primary text-lg"></i>
      </div>
    </div>
  );
};
