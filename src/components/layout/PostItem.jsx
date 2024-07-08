/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { AuthContext } from "../../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

export const PostItem = ({ post, handleShowModal }) => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const isGuest = currentUser?.isGuest;
  const isOwner = currentUser?.id === post.authorId;
  const [bookmarks, setBookmarks] = useState({
    isBookmarked: false,
    bookmarksCount: post.bookmarksCount,
  });
  const userRef = doc(db, "users", currentUser?.id);
  const postRef = doc(db, "posts", post.id);

  // update the currentUser reducer to match firestore data
  const updateBookmarks = async () => {
    const userSnap = await getDoc(userRef);
    const postSnap = await getDoc(postRef);
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

  const handleAddBookmark = (post) => {
    // if the user is not signed in, return
    if (!currentUser || isGuest) {
      alert("Please login to bookmark this post.");
      return;
    }
    // check if the user is offline
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
  };

  /**
   * Handle Remove Bookmark
   */
  const handleRemoveBookmark = (post) => {
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
  };

  return (
    <div className="flex w-full sm:px-3 mb-6 sm:w-1/2 xl:w-1/3 2xl:w-1/4">
      <div className="relative flex flex-col w-full rounded-md">
        {/* Image */}
        <div className="h-[180px] bg-gradient-to-r from-zinc-400 to-zinc-800 rounded-md">
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover rounded-md rounded-bl-none rounded-br-none"
            />
          )}
        </div>
        {/* Content */}
        <div className="flex flex-col gap-2 py-4 px-4 bg-muted/30 border border-t-0 border-border rounded-br-md rounded-bl-md">
          {/* Tag */}
          {post.tag && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
                {post.tag}
              </span>
            </div>
          )}
          {/* Title */}
          <h3 className="text-xl md:text-2xl text-primary font-bold capitalize">
            <Link to={`/post/${post.id}`}>
              {post.title.length > 50
                ? `${post.title.substring(0, 50)}...`
                : post.title}
            </Link>
          </h3>
          {/* Paragraph */}
          <p className="text-muted-foreground break-words">
            {post.content.length > 150
              ? `${post.content.substring(0, 150)}...`
              : post.content}
          </p>
          {/* Footer */}
          <div className="modal relative flex justify-end items-center gap-1 mt-2">
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

            <div className="flex items-center gap-4">
              {/* Bookmarks */}
              <div className="flex items-center">
                {bookmarks.isBookmarked && (
                  <label
                    tabIndex="0"
                    htmlFor={post.id}
                    className="cursor-pointer text-primary p-1"
                  >
                    <input
                      type="checkbox"
                      name="bookmark"
                      id={post.id}
                      hidden
                      onChange={() => handleRemoveBookmark(post)}
                    />
                    <i className="ri-bookmark-fill text-lg"></i>
                  </label>
                )}
                {!bookmarks.isBookmarked && (
                  <label
                    tabIndex="0"
                    htmlFor={post.id}
                    className="cursor-pointer text-primary p-1"
                  >
                    <input
                      type="checkbox"
                      name="bookmark"
                      id={post.id}
                      hidden
                      onChange={() => handleAddBookmark(post)}
                    />
                    <i className="ri-bookmark-line text-lg"></i>
                  </label>
                )}

                <p className="text-primary">
                  {bookmarks.bookmarksCount > 0 && bookmarks.bookmarksCount}
                </p>
              </div>

              {/* comments */}
              {post.commentsCount > 0 && (
                <Link to={`/post/${post.id}`}>
                  <div className="flex items-center">
                    <i className="ri-chat-3-line text-primary text-l p-1"></i>
                    <p className="text-lg">{post.commentsCount}</p>
                  </div>
                </Link>
              )}
              {/* Edit/Delete Dropdown */}
              {isOwner && (
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-primary cursor-pointer p-1">
                      <i className="ri-more-2-fill text-lg"></i>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link to={`/edit/${post.id}`} className="font-medium">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        className="font-medium text-red-500 focus:text-red-500"
                        onSelect={() => handleShowModal(post)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
