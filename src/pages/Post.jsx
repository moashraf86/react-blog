import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PostsContext } from "../context/PostsContext";
import { CommentsContext } from "../context/CommentsContext";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Comments } from "../components/layout/Comments";
import { BreadCrumbs } from "../components/shared/BreadCrumbs";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription } from "../components/ui/alert";

export const Post = () => {
  const { posts, dispatch } = useContext(PostsContext);
  const { currentUser, updateUser } = useContext(AuthContext);
  const { comments } = useContext(CommentsContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [error, setError] = useState(null);
  const post = posts.find((post) => post.id === id) || {};
  const isGuest = currentUser?.isGuest;
  const authorId = post.authorId;
  const isBookmarked = currentUser?.bookmarks.includes(post.id);
  const authorImg = post?.authorImage;

  // fetch single post from firebase based on the id
  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const postCollection = collection(db, "posts");
      const postDoc = doc(postCollection, id);
      const postSnap = await getDoc(postDoc);
      const postData = postSnap.data();
      if (!postData) throw new Error("Error fetching post");
      dispatch({ type: "FETCH_POST", payload: [postData] });
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  /**
   * Handle Add Bookmark
   */
  const handleAddBookmark = (post) => {
    const addBookmark = async (post) => {
      try {
        setBookmarking(true);
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
        setBookmarking(false);
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
        // setLoading(true);
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
        // setLoading(false);
      }
    };
    removeBookmark(post);
  };

  return (
    <div className="max-w-[800px] mx-auto mt-8">
      <BreadCrumbs className="px-4" />
      {loading && (
        <div className="flex flex-col gap-4 rounded-md p-4">
          <Skeleton className="w-20 h-8 rounded-full" />
          <Skeleton className="w-full h-8" />
          <div className="w-full flex items-center gap-2 mb-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-32 h-3" />
          </div>
          <Skeleton className="w-full h-96 mb-4" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-3/4 h-3" />
            <Skeleton className="w-1/2 h-3" />
          </div>
          <div className="flex items-center gap-3 border-t border-b py-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-24 h-3" />
              <Skeleton className="w-32 h-2" />
            </div>
          </div>
        </div>
      )}
      {!loading && (
        <div className={`flex w-full mb-6 sm:mb-4`}>
          <div className="relative flex flex-col  px-4 border-zinc-800 w-full rounded-md">
            {/* Tag */}
            {post.tag && (
              <div className="flex justify-between items-center mb-3">
                <span className="bg-accent py-2 px-4 rounded-full text-muted-foreground text-xs font-medium uppercase tracking-widest">
                  {post.tag}
                </span>
              </div>
            )}
            {/* Title */}
            <h3 className="text-2xl md:text-4xl text-primary font-bold capitalize mb-4">
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </h3>
            {/* Author / date */}
            <div className="flex items-center gap-2 mb-8">
              <img
                src={authorImg}
                alt={post.authorName}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-sm">
                  <Link to={`/users/${post.authorId}`}>{post.authorName}</Link>{" "}
                  | {post.createdAt?.split("T")[0]}
                </p>
              </div>
            </div>
            {/* Image */}
            <div className="h-[360px] bg-gradient-to-r from-zinc-400 to-zinc-800 rounded-none mb-6">
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover rounded-none"
                />
              )}
            </div>
            {/* Content */}
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground">{post.content}</p>
            </div>
            {/* Footer */}
            <div className="flex justify-between items-center py-3 my-4 border-t border-b border-border">
              <div className="flex items-center gap-2">
                <img
                  src={authorImg}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col ">
                  <p className="text-primary font-semibold ml-2">
                    <Link to={`/users/${authorId}`}>{post.authorName}</Link>
                  </p>
                  <p className="text-muted-foreground text-sm ml-2">
                    Published at: {post.createdAt?.split("T")[0]}
                  </p>
                </div>
              </div>
              {/* bookmarks / comments */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
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
                      {bookmarking && <i className="ri-loader-4-line"></i>}
                      {!bookmarking && (
                        <i className="ri-bookmark-fill text-lg"></i>
                      )}
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
                      {bookmarking && <i className="ri-loader-4-line"></i>}
                      {!bookmarking && (
                        <i className="ri-bookmark-line text-lg"></i>
                      )}
                    </label>
                  )}
                  {/* Bookmarks count */}
                  <p className="text-primary">
                    {post.bookmarksCount > 0 && post.bookmarksCount}
                  </p>
                </div>
                {/* comments */}
                <div className="flex items-center gap-2">
                  <i className="ri-chat-3-line text-primary text-lg"></i>
                  {comments.length > 0 && (
                    <p className="text-lg">{comments.length}</p>
                  )}
                </div>
                {/* Share */}
                <i className="ri-share-forward-line text-primary text-lg"></i>
              </div>
            </div>
            {/* Comments */}
            <Comments post={post} />
          </div>
        </div>
      )}
      {error && (
        <Alert variant="danger" className="flex items-center gap-3">
          <i className="ri-error-warning-line text-xl text-danger"></i>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
