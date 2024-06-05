/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer } from "react";
import { auth, provider, db } from "../firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
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

  // use the reducer to create the current user state
  const [currentUser, dispatch] = useReducer(currentUserReducer, null);

  useEffect(() => {
    // update the current user state when the user signs in or signs out
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // if user is signed in, update the current user state
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            id: user.uid,
            lastLogin: serverTimestamp(),
            isActive: true,
            bookmarks: [],
          });
          // get the user data from the database
          const newUserSnap = await getDoc(userRef);
          dispatch({ type: "SIGN_IN", payload: newUserSnap.data() });
        } else {
          await updateDoc(userRef, {
            lastLogin: serverTimestamp(),
            isActive: true,
          });
          dispatch({ type: "SIGN_IN", payload: userSnap.data() });
        }
      } else {
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.id);
          await updateDoc(userRef, {
            isActive: false,
          });
          dispatch({ type: "SIGN_OUT", payload: null });
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signIn,
        signOut,
        updateUser: (data) => dispatch({ type: "UPDATE_USER", payload: data }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
