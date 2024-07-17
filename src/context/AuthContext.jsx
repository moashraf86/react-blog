/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer, useState } from "react";
import { auth, provider, db } from "../utils/firebase";
import {
  signInWithPopup,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

// create a context for Authentication
export const AuthContext = createContext();

// create a provider for the AuthContext
export const AuthProvider = ({ children }) => {
  // create a reducer for the current user state
  const currentUserReducer = (currentUser, action) => {
    switch (action.type) {
      case "SIGN_IN":
        return action.payload;
      case "SIGN_OUT":
        return action.payload;
      case "UPDATE_USER":
        return {
          ...currentUser,
          ...action.payload,
        };
      default:
        return currentUser;
    }
  };
  const [currentUser, dispatch] = useReducer(currentUserReducer, null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // update the current user state when the user signs in or signs out
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // if user is signed in, update the current user state
      if (user) {
        setLoading(true);
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName || "Anonymous",
            email: user.email,
            photoURL: user.photoURL,
            id: user.uid,
            lastLogin: serverTimestamp(),
            isActive: true,
            bookmarks: [],
            isGuest: user.isAnonymous,
          });
          // get the user data from the database
          const newUserSnap = await getDoc(userRef);
          dispatch({ type: "SIGN_IN", payload: newUserSnap.data() });
          setLoading(false);
        } else {
          await updateDoc(userRef, {
            lastLogin: serverTimestamp(),
            isActive: true,
          });
          dispatch({ type: "SIGN_IN", payload: userSnap.data() });
          setLoading(false);
        }
      } else {
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.id);
          await updateDoc(userRef, {
            isActive: false,
          });
          dispatch({ type: "SIGN_OUT", payload: null });
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  /**
   * Sign in with Google
   */
  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };
  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      await auth.signOut();
      dispatch({ type: "SIGN_OUT", payload: null });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in as Guest
   */
  const signInAsGuest = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        signIn,
        signOut,
        signInAsGuest,
        updateUser: (data) => dispatch({ type: "UPDATE_USER", payload: data }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
