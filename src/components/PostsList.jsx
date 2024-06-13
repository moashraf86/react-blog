import { useEffect, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { PostsContext } from "../context/PostsContext";
import { AuthContext } from "../context/AuthContext";
import {
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  limit,
  orderBy,
  startAt,
} from "firebase/firestore";
import { db } from "../firebase";
import { PostItem } from "./PostItem";
import { Loader } from "./Loader";
import { Alert } from "./Alert";
import { ConfirmModal } from "./ConfirmModal";
import { Pagination } from "./Pagination";
/* eslint-disable react/prop-types */
export const PostsList = ({ title, postsQuery, alertMsg }) => {
  const { currentUser } = useContext(AuthContext);
  const isGuest = currentUser?.isGuest;
  const { posts, dispatch } = useContext(PostsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterKey, setFilterKey] = useState("all");
  const postsPerPage = 3;

  /**
   * Fetch posts from the Firebase store After the component mounts
   */
  const fetchPosts = async () => {
    try {
      let postsSnapshot;
      setLoading(true);
      setError(null);
      if (!postsQuery) {
        setLoading(false);
        return;
      }
      postsSnapshot = await getDocs(
        query(
          postsQuery.collection,
          orderBy("title", "asc"),
          limit(postsPerPage)
        )
      );
      const totalPostsSnapshot = await getDocs(postsQuery.collection);
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
    return () => {
      dispatch({ type: "RESET_POSTS" });
    };
  }, [postsQuery]);

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
      const postRef = doc(db, "posts", postToDelete.id);
      await deleteDoc(postRef);
      dispatch({
        type: "DELETE_POST",
        payload: { id: postToDelete.id },
      });
      setShowModal(false);
      fetchPosts();
    };
    deletePost();
  };

  /**
   *  Get Target snapShot for pagination based on page number
   */
  const getTargetSnapShot = async (i) => {
    const targetDoc = await getDocs(
      query(postsQuery.collection, orderBy("title", "asc"))
    );
    let targetSnapShot = targetDoc.docs[(i - 1) * postsPerPage];
    return targetSnapShot;
  };

  /**
   * Handle pagination
   */
  const handlePaginate = async (pageNumber) => {
    if (pageNumber === currentPage) return;
    try {
      setLoading(true);
      setError(null);
      history.pushState({}, "", `?pages=${pageNumber}`);
      await getTargetSnapShot(pageNumber);
      let target = await getTargetSnapShot(pageNumber);
      let snapShot;
      if (pageNumber > currentPage) {
        if (filterKey === "all") {
          snapShot = query(
            postsQuery.collection,
            orderBy("title", "asc"),
            startAt(target),
            limit(postsPerPage)
          );
        } else {
          snapShot = query(
            postsQuery.collection,
            orderBy("title", "asc"),
            where("tag", "==", `${filterKey}`),
            startAt(target),
            limit(postsPerPage)
          );
        }
      } else {
        if (filterKey === "all") {
          snapShot = query(
            postsQuery.collection,
            orderBy("title", "asc"),
            startAt(target),
            limit(postsPerPage)
          );
        } else {
          snapShot = query(
            postsQuery.collection,
            orderBy("title", "asc"),
            where("tag", "==", `${filterKey}`),
            startAt(target),
            limit(postsPerPage)
          );
        }
      }
      const postsSnapshot = await getDocs(snapShot);
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
      let postsSnapshot;
      switch (key) {
        case "all":
          fetchPosts();
          break;
        default:
          try {
            setLoading(true);
            setError(null);
            postsSnapshot = await getDocs(
              query(
                postsQuery.collection,
                where("tag", "==", key),
                limit(postsPerPage)
              )
            );
            const totalPostsSnapshot = await getDocs(
              query(postsQuery.collection, where("tag", "==", key))
            );
            setTotalPosts(totalPostsSnapshot.docs.length);
            const postsData = postsSnapshot.docs.map((doc) => doc.data());
            if (!postsData) throw new Error("Error fetching posts");
            dispatch({ type: "FETCH_POSTS", payload: postsData });
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

  return (
    <div className="flex flex-col gap-6 mt-12">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="px-4 text-2xl md:text-4xl font-bold mb-4 text-zinc-50">
          {title}
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
        {loading && !posts.length && <Loader style={"w-full"} />}
        {loading &&
          posts.map((post) => (
            <Loader key={post.id} style={"sm:w-1/2 xl:w-1/3"} />
          ))}
        {!loading &&
          !error &&
          posts.map((post) => (
            <PostItem
              className={"sm:w-1/2 xl:w-1/3"}
              key={post.id}
              post={post}
              handleShowModal={() => handleShowModal(post)}
              fetchPosts={fetchPosts}
            />
          ))}
        {error && <Alert type="error" msg={error} />}
        {!posts.length && !loading && !error && (
          <Alert type="default" msg={alertMsg} />
        )}
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
};
