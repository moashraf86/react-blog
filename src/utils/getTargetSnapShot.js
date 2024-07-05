import { getDocs, query, orderBy } from "firebase/firestore";

/**
 *  Get Target snapShot for pagination based on page number
 */
export const getTargetSnapShot = async (i, postsQuery, postsPerPage) => {
  const targetDoc = await getDocs(
    query(postsQuery.collection, orderBy("title", "asc"))
  );
  let targetSnapShot = targetDoc.docs[(i - 1) * postsPerPage];
  return targetSnapShot;
};
