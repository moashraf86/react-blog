/* eslint-disable react/prop-types */
import { useContext, useState, lazy, Suspense } from "react";
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
import { getTargetSnapShot } from "../../utils/getTargetSnapShot";
import { debounce } from "../../utils/debounce";
import { RiErrorWarningLine, RiInformationLine } from "@remixicon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    let postsSnapshot;
    if (filterKey === "all") {
      postsSnapshot = await getDocs(
        query(
          postsQuery.collection,
          orderBy("title", "asc"),
          limit(postsPerPage)
        )
      );
    } else {
      postsSnapshot = await getDocs(
        query(
          postsQuery.collection,
          orderBy("title", "asc"),
          where("tag", "==", filterKey),
          limit(postsPerPage)
        )
      );
    }

    const totalPostsSnapshot = await getDocs(
      query(postsQuery.collection, orderBy("title", "asc"))
    );
    setTotalPosts(totalPostsSnapshot.docs.length);

    const postsData = postsSnapshot.docs.map((doc) => doc.data());

    return postsData;
  };

  /**
   * Custom Hook to fetch posts
   */
  const useFetchedPosts = (postsQuery, postsPerPage, filterKey) => {
    const queryClient = useQueryClient();
    const postsQueryResult = useQuery({
      queryKey: ["posts", postsQuery, postsPerPage, filterKey],
      queryFn: fetchPosts,
    });

    const handleDeleteMutation = useMutation({
      mutationFn: async () => {
        const postRef = doc(db, "posts", postToDelete.id);
        await deleteDoc(postRef);
        setShowModal(false);
      },
      // Invalidate and refetch the data after the mutation
      onSuccess: () => {
        queryClient.invalidateQueries([
          "posts",
          postsQuery,
          postsPerPage,
          filterKey,
        ]);
      },
    });

    return { ...postsQueryResult, handleDeleteMutation };
  };

  /**
   * Destructuring the data, isLoading, isError and error from the custom hook
   */
  const { data, isLoading, isError, error, handleDeleteMutation } =
    useFetchedPosts(postsQuery, postsPerPage, filterKey);

  /**
   * Filter posts based on category
   */
  const handleFilter = (key) => {
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
    handleDeleteMutation.mutate();
  };

  /**
   * Handle pagination
   */
  const handlePaginate = debounce(async (pageNumber) => {
    if (pageNumber === currentPage) return;
    try {
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
    } catch (error) {
      console.log(error);
    }
  }, 300);

  return (
    <div className="flex flex-col gap-8 mt-6">
      <div className="container px-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <h2 className="text-2xl md:text-4xl font-bold">{title}</h2>
          {currentUser && !isGuest && <Filter handleFilter={handleFilter} />}
        </div>
      </div>
      <div className="container px-5 flex justify-start flex-wrap">
        {isLoading &&
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
        {data &&
          data.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              handleShowModal={() => handleShowModal(post)}
              fetchPosts={data}
            />
          ))}
        {!isLoading && !isError && !data.length && (
          <Alert variant="default" className="flex items-center gap-3">
            <span>
              <RiInformationLine size={24} className="fill-primary" />
            </span>
            <AlertDescription>{alertMsg}</AlertDescription>
          </Alert>
        )}
        {isError && (
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
