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
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export default function PostsList() {
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
  const postsPerPage = 2;
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
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="px-4 text-2xl md:text-4xl font-bold mb-4 text-zinc-50">
          All Posts
        </h2>
        <div className="flex items-center gap-3 px-4 text-zinc-400">
          <label
            htmlFor="all"
            className="hover:text-zinc-50 cursor-pointer text-sm has-[:checked]:text-zinc-50"
          >
            <input
              type="radio"
              name="filter"
              id="all"
              className="hidden"
              value="all"
              onChange={(e) => handleFilter(e.target.value)}
            />
            All
          </label>
          <label
            htmlFor="tech"
            className="hover:text-zinc-50 cursor-pointer text-sm has-[:checked]:text-zinc-50"
          >
            <input
              type="radio"
              name="filter"
              id="tech"
              className="hidden"
              value="tech"
              onChange={(e) => handleFilter(e.target.value)}
            />
            Tech
          </label>
          <label
            htmlFor="science"
            className="hover:text-zinc-50 cursor-pointer text-sm has-[:checked]:text-zinc-50"
          >
            <input
              type="radio"
              name="filter"
              id="science"
              className="hidden"
              value="science"
              onChange={(e) => handleFilter(e.target.value)}
            />
            Science
          </label>
          <label
            htmlFor="culture"
            className="hover:text-zinc-50 cursor-pointer text-sm has-[:checked]:text-zinc-50"
          >
            <input
              type="radio"
              name="filter"
              id="culture"
              className="hidden"
              value="culture"
              onChange={(e) => handleFilter(e.target.value)}
            />
            Culture
          </label>
        </div>
      </div>
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
    </div>
  );
}
