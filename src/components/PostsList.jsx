/* eslint-disable react/prop-types */
import { useContext, useEffect } from "react";
import { PostsContext } from "../context/PostsContext";
import { PostsDispatchContext } from "../context/PostsDispatchContext";
import { useState } from "react";
import { Pagination } from "./Pagination";
import { createPortal } from "react-dom";
import { ConfirmModal } from "./ConfirmModal";
import { Loader } from "./Loader";
import { Error } from "./Error";
import { Post } from "./Post";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function PostsList() {
  const posts = useContext(PostsContext);
  const dispatch = useContext(PostsDispatchContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  /**
   * Fetch posts from the Firebase store After the component mounts
   */

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const postsCollection = collection(db, "posts");
      const postsSnapshot = await getDocs(postsCollection);
      const postsData = postsSnapshot.docs.map((doc) => doc.data());
      if (!postsData) throw new Error("Error fetching posts");
      dispatch({ type: "FETCH_POSTS", payload: postsData });
      setLoading(false);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  /**
   * Handle pagination
   */
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);
  const indexOfLastPost = currentPage * postsPerPage; // 1 * 9 = 9
  const indexOfFirstPost = indexOfLastPost - postsPerPage; // 9 - 9 = 0
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); // [0, 9] => [0, 1, 2, 3, 4, 5, 6, 7, 8]
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  /**
   * Handle Show Modal
   */
  const handleShowModal = (post) => {
    setShowModal(true);
    setPostToDelete(post);
  };

  /**
   * Handle Delete Post
   */

  const handleDeletePost = () => {
    const deletePost = async () => {
      // delete document from firestore
      const postRef = doc(db, "posts", postToDelete.id);
      await deleteDoc(postRef);
      dispatch({
        type: "DELETE_POST",
        payload: { id: postToDelete.id },
      });
      setShowModal(false);
    };
    deletePost();
  };

  // If there are no posts, display a message after fetching
  if (posts.length === 0) {
    return (
      <p className="text-xl text-zinc-300 text-center mt-[120px] p-6 border border-zinc-800 rounded-lg">
        You haven&apos;t created any posts!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-12">
      <h2 className="px-4 text-2xl md:text-4xl font-bold mb-4 text-zinc-50">
        All Posts
      </h2>
      <ul className="flex justify-start flex-wrap">
        {loading && currentPosts.map((post) => <Loader key={post.id} />)}
        {!loading &&
          !error &&
          currentPosts.map((post) => (
            <Post
              key={post.id}
              post={post}
              handleShowModal={() => handleShowModal(post)}
            />
          ))}
        {error && <Error errMsg={error} />}
      </ul>
      <Pagination
        posts={posts}
        postsPerPage={postsPerPage}
        paginate={paginate}
        currentPage={currentPage}
      />
      {showModal &&
        createPortal(
          <ConfirmModal
            showModal={showModal}
            onCancel={() => setShowModal(false)}
            onConfirm={handleDeletePost}
          />,
          document.body
        )}
    </div>
  );
}
