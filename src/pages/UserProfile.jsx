import { useParams } from "react-router-dom";
import { collection, query, where, getDoc, doc } from "@firebase/firestore";
import { db } from "../utils/firebase";
import { PostsList } from "../components/layout/PostsList";
import { useQuery } from "@tanstack/react-query";

export const UserProfile = () => {
  // const [userName, setUserName] = useState("");
  const { id } = useParams();

  //Fetch User Name from firestore
  const fetchUser = async () => {
    const userRef = doc(db, "users", id);
    const userSnap = await getDoc(userRef);
    const userName = userSnap.data().name;
    return userName;
  };

  const useFetchUser = () => {
    return useQuery({
      queryKey: ["user", id],
      queryFn: fetchUser,
    });
  };

  const { data: userName, isPending, isError, error } = useFetchUser();

  const getTitle = () => {
    if (isPending) return "Loading...";
    if (isError) return <p>Error: {error}</p>;
    return userName;
  };

  // Update the URL
  // history.pushState({}, "", `/users/${userName}`);

  /**
   * Query Variables
   */
  const posts = {
    collection: query(
      collection(db, "posts"),
      where("authorId", "==", `${id}`)
    ),
  };

  return (
    <>
      <PostsList
        title={getTitle()}
        postsQuery={posts}
        alertMsg="No Posts Added yet."
      />
    </>
  );
};
