/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { AuthContext } from "../../context/AuthContext";
import { PostsContext } from "../../context/PostsContext";
import { debounce } from "../../utils/debounce";
import {
  RiBookmarkFill,
  RiBookmarkLine,
  RiChat3Line,
  RiLoader4Line,
  RiShareForwardLine,
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

export const PostFooter = ({ post, comments }) => {
  const { dispatch } = useContext(PostsContext);
  const { currentUser, updateUser, signIn } = useContext(AuthContext);
  const isBookmarked = currentUser?.bookmarks?.includes(post.id);
  const { authorImage, authorName, authorId, createdAt } = post;
  const { isGuest } = currentUser || {};
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
    // if the user is offline
    if (!navigator.onLine) {
      alert("You are offline. Please check your internet connection.");
      return;
    }
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
        const userRef = doc(db, "users", currentUser?.id);
        const postRef = doc(db, "posts", post?.id);
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
      <div className="flex items-center gap-4">
        {/* Bookmarks */}
        <div className="flex items-center gap-1">
          {isBookmarked ? (
            <button
              className="cursor-pointer text-primary"
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
              className="cursor-pointer text-zinc-50"
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
          {/* Bookmarks count */}
          <p className="text-primary">
            {post.bookmarksCount > 0 && post.bookmarksCount}
          </p>
        </div>
        {/* comments */}
        <div className="flex items-center gap-1">
          <RiChat3Line size={18} className="fill-primary" />
          {comments?.length > 0 && (
            <p className="text-lg">{comments?.length}</p>
          )}
        </div>
        {/* Share */}
        <button
          className="cursor-pointer text-primary"
          aria-label="Share this post"
          onClick={() =>
            navigator.share({ title: post.title, url: window.location.href })
          }
        >
          <RiShareForwardLine size={18} className="fill-primary" />
        </button>
      </div>
      {/* Sign In to Bookmark alert */}
      <AlertDialog open={bookmarkAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Want to bookmark this post?</AlertDialogTitle>
            <AlertDialogDescription>
              Sign in with Google to save it to your account and access it
              anytime!
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
  );
};
