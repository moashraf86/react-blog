import { useContext, useEffect, useState } from "react";
import { BookmarksContext } from "../context/BookmarksContext";
import { BookmarksDispatchContext } from "../context/BookmarksDispatchContext";
import { Error } from "./Error";
import { Pagination } from "./Pagination";
import { ConfirmModal } from "./ConfirmModal";
import { createPortal } from "react-dom";
import {
  collection,
  getDocs,
  limit,
  query,
  startAfter,
  endBefore,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { PostsList } from "./PostsList";

export const Bookmarks = () => {
  const bookmarks = useContext(BookmarksContext);
  const bookmarksDispatch = useContext(BookmarksDispatchContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [totalBookmarks, setTotalBookmarks] = useState(0);
  const [filterKey, setFilterKey] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  /**
   * Fetch Bookmarks from the Firebase store After the component mounts
   */
  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const totalBookmarks = collection(db, "bookmarks");
      const bookmarksQuery = query(
        collection(db, "bookmarks"),
        limit(postsPerPage)
      );
      const bookmarksSnapshot = await getDocs(bookmarksQuery);
      const totalBookmarksSnapshot = await getDocs(totalBookmarks);
      const bookmarksData = bookmarksSnapshot.docs.map((doc) => doc.data());
      setFirstVisible(bookmarksSnapshot.docs[0]);
      setLastVisible(bookmarksSnapshot.docs[bookmarksSnapshot.docs.length - 1]);
      setTotalBookmarks(totalBookmarksSnapshot.docs.length);
      if (!bookmarksData) throw new Error("Error fetching bookmarks");
      bookmarksDispatch({ type: "FETCH_BOOKMARKS", payload: bookmarksData });
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
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
            collection(db, "bookmarks"),
            startAfter(lastVisible), // startAfter
            limit(postsPerPage)
          );
        } else {
          postsQuery = query(
            collection(db, "bookmarks"),
            startAfter(lastVisible), // startAfter
            where("tag", "==", `${filterKey}`),
            limit(postsPerPage)
          );
        }
      } else {
        if (filterKey === "all") {
          postsQuery = query(
            collection(db, "bookmarks"),
            endBefore(firstVisible), // endBefore
            limit(postsPerPage)
          );
        } else {
          postsQuery = query(
            collection(db, "bookmarks"),
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
      bookmarksDispatch({ type: "FETCH_BOOKMARKS", payload: postsData });
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
          fetchBookmarks();
          break;
        default:
          try {
            setLoading(true);
            setError(null);
            const postsCollection = query(
              collection(db, "bookmarks"),
              where("tag", "==", `${key}`)
            );
            const postsQuery = query(
              collection(db, "bookmarks"),
              where("tag", "==", `${key}`),
              limit(postsPerPage)
            );
            const postsSnapshot = await getDocs(postsQuery);
            const totalBookmarksSnapshot = await getDocs(postsCollection);
            setFirstVisible(postsSnapshot.docs[0]);
            setLastVisible(postsSnapshot.docs[postsSnapshot.docs.length - 1]);
            setTotalBookmarks(totalBookmarksSnapshot.docs.length);
            const postsData = postsSnapshot.docs.map((doc) => doc.data());
            if (!postsData) throw new Error("Error fetching posts");
            bookmarksDispatch({ type: "FETCH_BOOKMARKS", payload: postsData });
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
      bookmarksDispatch({
        type: "DELETE_BOOKMARK",
        payload: { id: postToDelete.id },
      });
      setShowModal(false);
    };
    deletePost();
    fetchBookmarks();
  };

  return (
    <>
      <PostsList
        title="Bookmarks"
        items={bookmarks}
        loading={loading}
        error={error}
        handleFilter={handleFilter}
        handleShowModal={handleShowModal}
        fetchPosts={fetchBookmarks}
      />
      <Pagination
        totalPosts={totalBookmarks}
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
