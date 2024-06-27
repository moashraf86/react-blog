import { useEffect, useContext, useState } from "react";
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
import { Pagination } from "./Pagination";
import { Filter } from "./Filter";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
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
  const postsPerPage = 4;

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
    <div className="flex flex-col gap-8 mt-12">
      <div className="container flex flex-wrap items-center justify-between">
        <h2 className="text-2xl md:text-4xl font-bold">{title}</h2>
        {currentUser && !isGuest && <Filter handleFilter={handleFilter} />}
      </div>

      <div className="container px-5 flex justify-start flex-wrap">
        {loading && !posts.length && <Loader style={"w-full"} />}
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
              fetchPosts={fetchPosts}
            />
          ))}
        {error && (
          <Alert variant="danger">
            <i className="ri-error-warning-line text-xl text-danger absolute top-[10px]"></i>
            <AlertTitle className="pl-8">Error</AlertTitle>
            <AlertDescription className="pl-8">{error}</AlertDescription>
          </Alert>
        )}
        {!posts.length && !loading && !error && (
          <Alert variant="default" className="flex items-center gap-3">
            <i className="ri-information-line text-2xl text-primary"></i>
            <AlertDescription>{alertMsg}</AlertDescription>
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
      <AlertDialog open={showModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowModal(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              className="bg-danger text-danger-foreground hover:text-danger-foreground hover:bg-danger/95"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
