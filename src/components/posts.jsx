import { PostsList } from "./PostsList";
import { useContext, useEffect } from "react";
import { PostsContext } from "../context/PostsContext";
import { PostsDispatchContext } from "../context/PostsDispatchContext";
import { useState } from "react";
import { Pagination } from "./Pagination";
import { createPortal } from "react-dom";
import { ConfirmModal } from "./ConfirmModal";
import { Error } from "./Error";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  limit,
  startAfter,
  endBefore,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export const Posts = () => {
  const posts = useContext(PostsContext);
  const dispatch = useContext(PostsDispatchContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [filterKey, setFilterKey] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  /**
   * Fetch posts from the Firebase store After the component mounts
   */

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const totalPosts = collection(db, "posts");
      const postsQuery = query(collection(db, "posts"), limit(postsPerPage));
      const postsSnapshot = await getDocs(postsQuery);
      const totalPostsSnapshot = await getDocs(totalPosts);
      setFirstVisible(postsSnapshot.docs[0]);
      setLastVisible(postsSnapshot.docs[postsSnapshot.docs.length - 1]);
      setTotalPosts(totalPostsSnapshot.docs.length);
      const postsData = postsSnapshot.docs.map((doc) => doc.data());
      console.log(postsData);
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
      history.pushState({}, "", `?pages=${pageNumber}`);
      let postsQuery;
      if (pageNumber > currentPage) {
        if (filterKey === "all") {
          postsQuery = query(
            collection(db, "posts"),
            startAfter(lastVisible), // startAfter
            limit(postsPerPage)
          );
        } else {
          postsQuery = query(
            collection(db, "posts"),
            startAfter(lastVisible), // startAfter
            where("tag", "==", `${filterKey}`),
            limit(postsPerPage)
          );
        }
      } else {
        if (filterKey === "all") {
          postsQuery = query(
            collection(db, "posts"),
            endBefore(firstVisible), // endBefore
            limit(postsPerPage)
          );
        } else {
          postsQuery = query(
            collection(db, "posts"),
            endBefore(firstVisible), // endBefore
            where("tag", "==", `${filterKey}`),
            limit(postsPerPage)
          );
        }
      }
      const postsSnapshot = await getDocs(postsQuery);
      setFirstVisible(postsSnapshot.docs[0]);
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
   * Filter posts based on category
   */
  const handleFilter = (key) => {
    const createFilter = async (key) => {
      switch (key) {
        case "all":
          fetchPosts();
          break;
        default:
          try {
            setLoading(true);
            setError(null);
            const postsCollection = query(
              collection(db, "posts"),
              where("tag", "==", `${key}`)
            );
            const postsQuery = query(
              collection(db, "posts"),
              where("tag", "==", `${key}`),
              limit(postsPerPage)
            );
            const postsSnapshot = await getDocs(postsQuery);
            const totalPostsSnapshot = await getDocs(postsCollection);
            setFirstVisible(postsSnapshot.docs[0]);
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
          break;
      }
    };
    createFilter(key);
    setFilterKey(key);
    setCurrentPage(1);
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
      const bookmarkRef = doc(db, "bookmarks", postToDelete.id);
      await deleteDoc(postRef);
      await deleteDoc(bookmarkRef);
      dispatch({
        type: "DELETE_POST",
        payload: { id: postToDelete.id },
      });
      setShowModal(false);
    };
    deletePost();
    fetchPosts();
  };

  return (
    <>
      <PostsList
        title="All posts"
        items={posts}
        loading={loading}
        error={error}
        handleFilter={handleFilter}
        handleShowModal={handleShowModal}
        fetchPosts={fetchPosts}
      />
      <Pagination
        totalPosts={totalPosts}
        paginate={handlePaginate}
        currentPage={currentPage}
        postsPerPage={postsPerPage}
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
    </>
  );
};
