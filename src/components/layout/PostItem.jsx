/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { AuthContext } from "../../context/AuthContext";
import { PostsContext } from "../../context/PostsContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { debounce } from "../../utils/debounce";
import {
  RiBookmarkFill,
  RiBookmarkLine,
  RiChat3Line,
  RiLoader4Line,
  RiMore2Fill,
} from "@remixicon/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { GoogleIcon } from "../shared/GoogleIcon";

export const PostItem = ({ post, handleShowModal }) => {
  const { dispatch } = useContext(PostsContext);
  const { currentUser, updateUser, signIn } = useContext(AuthContext);
  const isGuest = currentUser?.isGuest;
  const isOwner = currentUser?.id === post.authorId;
  const isBookmarked = currentUser?.bookmarks.includes(post.id);
  const [bookmarkAlert, setBookmarkAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Handle Add Bookmark
   */

  const handleAddBookmark = debounce((post) => {
    // if the user is not signed in, return
    if (!currentUser || isGuest) {
      setBookmarkAlert(true);
      return;
    }
    // check if the user is offline
    if (!navigator.onLine) {
      alert("You are offline. Please check your internet connection.");
      return;
    }
    // // update the bookmark state in UI immediately to give feedback to the user
    // setBookmarks({
    //   isBookmarked: true,
    //   bookmarksCount: bookmarks.bookmarksCount + 1,
    // });
    // add the bookmark to the database
    const addBookmark = async (post) => {
      try {
        setLoading(true);
        const userRef = doc(db, "users", currentUser?.id);
        const postRef = doc(db, "posts", post?.id);
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
  }, 300);

  /**
   * Handle Remove Bookmark
   */
  const handleRemoveBookmark = debounce((post) => {
    const removeBookmark = async (post) => {
      try {
        setLoading(true);
        const postRef = doc(db, "posts", post?.id);
        const userRef = doc(db, "users", currentUser?.id);
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
  }, 300);

  /**
   * Handle Sign In With Google
   */
  const handleGoogleSignIn = () => {
    signIn();
    setBookmarkAlert(false);
  };

  return (
    <div className="flex w-full sm:px-3 mb-6 sm:w-1/2 xl:w-1/3 2xl:w-1/4">
      <div className="relative flex flex-col w-full rounded-md">
        {/* Image */}
        <div className="aspect-video max-h-[270px] bg-gradient-to-r from-zinc-400 to-zinc-800 rounded-md">
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
              {post.title.length > 30
                ? `${post.title.substring(0, 30)}...`
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
                {isBookmarked ? (
                  <button
                    className="cursor-pointer text-primary p-1"
                    onClick={() => handleRemoveBookmark(post)}
                    aria-label="Remove Bookmark"
                  >
                    {loading ? (
                      <RiLoader4Line
                        size={18}
                        className="animate-spin duration-600 fill-primary"
                      />
                    ) : (
                      <RiBookmarkFill size={18} className="fill-primary" />
                    )}
                  </button>
                ) : (
                  <button
                    className="cursor-pointer text-primary p-1"
                    onClick={() => handleAddBookmark(post)}
                    aria-label="Add Bookmark"
                  >
                    {loading ? (
                      <RiLoader4Line
                        size={18}
                        className="animate-spin duration-600 fill-primary"
                      />
                    ) : (
                      <RiBookmarkLine size={18} className="fill-primary" />
                    )}
                  </button>
                )}

                <p className="text-primary">
                  {post.bookmarksCount > 0 && post.bookmarksCount}
                </p>
              </div>

              {/* comments */}
              {post.commentsCount > 0 && (
                <Link to={`/post/${post.id}`} aria-label="View Comments">
                  <div className="flex items-center">
                    <RiChat3Line size={18} className="fill-primary m-1" />
                    <p className="text-lg">{post.commentsCount}</p>
                  </div>
                </Link>
              )}
              {/* Edit/Delete Dropdown */}
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="text-primary cursor-pointer p-1"
                    aria-label="Trigger popover to edit or delete post"
                  >
                    <RiMore2Fill size={20} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        to={`/edit/${post.id}`}
                        className="w-full"
                        aria-label="Edit Post"
                      >
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium text-danger focus:text-danger"
                      onSelect={() => handleShowModal(post)}
                      aria-label="Delete Post"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {/* Sign in to bookmark alert */}
              <AlertDialog open={bookmarkAlert}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Want to bookmark this post?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Sign in with Google to save it to your account and access
                      it anytime!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setBookmarkAlert(false)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="md:text-base flex gap-[10px]"
                      onClick={() => handleGoogleSignIn()}
                    >
                      <GoogleIcon />
                      Sign in with Google
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
