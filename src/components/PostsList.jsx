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
import { PostItem } from "./PostItem";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  limit,
  startAfter,
  endBefore,
} from "firebase/firestore";
import { db } from "../firebase";

export default function PostsList() {
  const posts = useContext(PostsContext);
  const dispatch = useContext(PostsDispatchContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  // const [firstDocs, setFirstDocs] = useState([]);
  const [firstPost, setFirstPost] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Fetch posts from the Firebase store After the component mounts
   */

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const totalPosts = collection(db, "posts");
      const postsQuery = query(collection(db, "posts"), limit(2));
      const postsSnapshot = await getDocs(postsQuery);
      const totalPostsSnapshot = await getDocs(totalPosts);
      setFirstPost(postsSnapshot.docs[0]);
      setLastVisible(postsSnapshot.docs[postsSnapshot.docs.length - 1]);
      setTotalPosts(totalPostsSnapshot.docs.length);
      const postsData = postsSnapshot.docs.map((doc) => doc.data());
      if (!postsData) throw new Error("Error fetching posts");
      dispatch({ type: "FETCH_POSTS", payload: postsData });
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

  const handlePaginate = async (pageNumber) => {
    if (pageNumber === currentPage) return;
    try {
      setLoading(true);
      let postsQuery;
      if (pageNumber > currentPage) {
        postsQuery = query(
          collection(db, "posts"),
          startAfter(lastVisible), // startAfter
          limit(2)
        );
      } else {
        postsQuery = query(
          collection(db, "posts"),
          endBefore(firstPost), // endBefore
          limit(2)
        );
      }
      const postsSnapshot = await getDocs(postsQuery);
      setFirstPost(postsSnapshot.docs[0]);
      setLastVisible(postsSnapshot.docs[postsSnapshot.docs.length - 1]);
      setCurrentPage(pageNumber);
      const postsData = postsSnapshot.docs.map((doc) => doc.data());
      if (!postsData) throw new Error("Error fetching posts");
      dispatch({ type: "FETCH_POSTS", payload: postsData });
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
        {loading &&
          posts.map((post) => (
            <Loader key={post.id} style={"sm:w-1/2 xl:w-1/3"} />
          ))}
        {!loading &&
          !error &&
          posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              handleShowModal={() => handleShowModal(post)}
            />
          ))}
        {error && <Error errMsg={error} />}
      </ul>
      <Pagination
        totalPosts={totalPosts}
        paginate={handlePaginate}
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
