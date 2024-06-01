/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
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
  const [currentUser, setCurrentUser] = useState(null);

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
            lastLogin: serverTimestamp(),
            isActive: true,
          });
        } else {
          await updateDoc(userRef, {
            lastLogin: serverTimestamp(),
            isActive: true,
          });
        }
        setCurrentUser(user);
      } else {
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid);
          await updateDoc(userRef, {
            isActive: false,
          });
          setCurrentUser(null);
        }
      }
    });
    return () => unsubscribe();
  }, [currentUser]);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
