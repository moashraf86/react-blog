import { PostsList } from "./PostsList";
import { collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const MyPosts = () => {
  const { authentication } = useContext(AuthContext);
  const autherId = authentication.user?.userId || "";
  /**
   * Query Variables
   */
  const posts = {
    collection: query(
      collection(db, "posts"),
      where("autherId", "==", autherId)
    ),
  };

  // if user is not logged in
  if (!autherId) {
    return (
      <div className="relative flex flex-col gap-2 justify-center items-start w-full border border-zinc-300 p-6 rounded-md mt-16">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          className="text-zinc-300 fill-current mt-1 absolute top-6 left-6"
        >
          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
        </svg>
        <p className="text-xl font-semibold text-zinc-300 pl-10">
          Please login to see your posts or create new posts 🚀
        </p>
      </div>
    );
  }
  return (
    <>
      <PostsList title="My posts" postsQuery={posts} />
    </>
  );
};
