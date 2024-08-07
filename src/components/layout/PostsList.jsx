/* eslint-disable react/prop-types */
import {
  useEffect,
  useContext,
  useState,
  lazy,
  Suspense,
  useMemo,
  useCallback,
} from "react";
import { PostsContext } from "../../context/PostsContext";
import { AuthContext } from "../../context/AuthContext";
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
import { db } from "../../utils/firebase";
import { PostItem } from "./PostItem";
import { Pagination } from "../shared/Pagination";
import { Filter } from "../shared/Filter";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";
import { BreadCrumbs } from "../shared/BreadCrumbs";
import { getTargetSnapShot } from "../../utils/getTargetSnapShot";
import { debounce } from "../../utils/debounce";
import { RiErrorWarningLine, RiInformationLine } from "@remixicon/react";

/**
 * Lazy load ConfirmDeleteModal
 */
const ConfirmDeleteModal = lazy(() =>
  import("../shared/ConfirmDeleteModal").then((module) => ({
    default: module.ConfirmDeleteModal,
  }))
);

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
  const fetchPosts = useCallback(async () => {
    //check for internet connection
    if (!navigator.onLine) {
      setError("No internet Connection!");
      return;
    }
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
  }, [postsQuery]);

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
   * Handle pagination
   */
  const handlePaginate = debounce(async (pageNumber) => {
    if (pageNumber === currentPage) return;
    try {
      setLoading(true);
      setError(null);
      history.pushState({}, "", `?pages=${pageNumber}`);
      let target = await getTargetSnapShot(
        pageNumber,
        postsQuery,
        postsPerPage
      );
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
  }, 300);

  /**
   * Filter posts based on category
   */
  const handleFilter = debounce((key) => {
    const createFilter = async (key) => {
      let postsSnapshot;
      switch (key) {
        case "all":
          fetchPosts();
          break;
        default:
          if (!navigator.onLine) {
            setError("No internet Connection!");
            return;
          }
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
  }, 300);

  /**
   * Memoize the PostItem components
   */
  const MemoizedPostItem = useMemo(() => {
    return posts.map((post) => (
      <PostItem
        key={post.id}
        post={post}
        handleShowModal={() => handleShowModal(post)}
        fetchPosts={fetchPosts}
      />
    ));
  }, [posts, fetchPosts]);

  return (
    <div className="flex flex-col gap-8 mt-6">
      <div className="container px-5 sm:px-8">
        <BreadCrumbs />
        <div className="flex flex-wrap items-center justify-between">
          <h2 className="text-2xl md:text-4xl font-bold">{title}</h2>
          {currentUser && !isGuest && <Filter handleFilter={handleFilter} />}
        </div>
      </div>
      <div className="container px-5 flex justify-start flex-wrap">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 sm:px-3 w-full sm:w-1/2 xl:w-1/4 "
            >
              <div className="bg-muted/30 border border-border rounded-md mb-6">
                <Skeleton className="w-full aspect-video rounded-br-none rounded-bl-none" />
                <div className="flex flex-col gap-3 p-4">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-full h-6 mb-2" />
                  <Skeleton className="w-full h-3" />
                  <Skeleton className="w-3/4 h-3" />
                  <Skeleton className="w-1/2 h-3" />
                  <Skeleton className="w-32 h-4 mt-3" />
                </div>
              </div>
            </div>
          ))}
        {!loading && !error && posts.length > 0 && MemoizedPostItem}
        {!loading && !error && !posts.length && (
          <Alert variant="default" className="flex items-center gap-3">
            <span>
              <RiInformationLine size={24} className="fill-primary" />
            </span>
            <AlertDescription>{alertMsg}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="danger">
            <RiErrorWarningLine
              size={24}
              className="fill-danger absolute top-[10px]"
            />
            <AlertTitle className="pl-8">Error</AlertTitle>
            <AlertDescription className="pl-8">{error}</AlertDescription>
          </Alert>
        )}
      </div>
      <Pagination
        totalPosts={totalPosts}
        paginate={handlePaginate}
        currentPage={currentPage}
        postsPerPage={postsPerPage}
      />
      {/* Confirm Delete Dialog */}
      <Suspense>
        <ConfirmDeleteModal
          showModal={showModal}
          setShowModal={setShowModal}
          handleDeletePost={handleDeletePost}
        />
      </Suspense>
    </div>
  );
};
