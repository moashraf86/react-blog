import { useContext, useEffect, useState } from "react";
import { PostsContext } from "../context/PostsContext";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Loader } from "./Loader";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { updateDoc } from "firebase/firestore";

export const Post = () => {
  const { posts, dispatch } = useContext(PostsContext);
  const { currentUser, updateUser } = useContext(AuthContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const post = posts.find((post) => post.id === id) || {};
  const isGuest = currentUser?.isGuest;
  const isBookmarked = currentUser?.bookmarks.includes(post.id);
  const authorImg = post.authorImage || "https://i.pravatar.cc/150?img=1";

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
    <div className="max-w-[800px] mx-auto mt-8">
      {loading && <Loader />}
      {/* {!loading && <PostItem post={post} type="post" className="mt-8" />} */}
      {!loading && (
        <div className={`flex w-full sm:px-2 mb-6 sm:mb-4`}>
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
                  {post.authorName} | {post.createdAt?.split("T")[0]}
                </p>
              </div>
            </div>
            {/* Image */}
            <div className="h-[360px] bg-gradient-to-r from-zinc-400 to-zinc-800 rounded-md mb-6">
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
                    {post.authorName}
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
                </div>
                {/* comments */}
                <i className="ri-chat-3-line text-primary text-lg"></i>
                {/* Share */}
                <i className="ri-share-forward-line text-primary text-lg"></i>
              </div>
            </div>
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
