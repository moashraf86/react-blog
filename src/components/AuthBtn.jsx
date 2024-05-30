// set up firebase authentication with google
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
export const AuthBtn = () => {
  const { authDispatch, authentication } = useContext(AuthContext);
  let isSignedIn = authentication.signedIn;
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const { docId } = authentication.user || {};
  let navigate = useNavigate();

  //get user from firebase once loaded if signed in and update current state accordinly
  const fetchUser = async () => {
    try {
      const userSnap = await getDocs(query(collection(db, "currentUser")));
      const user = userSnap.docs.map((doc) => doc.data());
      if (user.length) {
        authDispatch({
          type: "LOGIN",
          payload: {
            docId: user[0].docId,
            userId: user[0].userId,
            name: user[0].name,
            photoURL: user[0].photoURL,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /**
   * Handle Sign In
   */
  const handleSignIn = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      // add the user to the database
      const docRef = doc(collection(db, "currentUser"));
      const data = {
        isSignedIn: true,
        docId: docRef.id,
        name: user.displayName,
        photoURL: user.photoURL,
        userId: user.uid,
      };
      await setDoc(docRef, data);
      authDispatch({
        type: "LOGIN",
        payload: {
          docId: docRef.id,
          userId: user.uid,
          name: user.displayName,
          photoURL: user.photoURL,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Handle Sign Out
   */
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      const docRef = doc(db, "currentUser", docId);
      await deleteDoc(docRef);
      authDispatch({
        type: "LOGOUT",
        payload: null,
      });
      redirectToHome();
    } catch (err) {
      console.log(err);
    }
  };

  function redirectToHome() {
    // navigate("/");
  }

  return (
    <div>
      {!isSignedIn && (
        <button
          onClick={handleSignIn}
          className="bg-zinc-50 text-zinc-900 px-4 py-2 rounded-md"
        >
          Sign In
        </button>
      )}
      {isSignedIn && (
        <button
          onClick={handleSignOut}
          className="bg-zinc-50 text-zinc-900 px-4 py-2 rounded-md"
        >
          Sign Out
        </button>
      )}
    </div>
  );
};
