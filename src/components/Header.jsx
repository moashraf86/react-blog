import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
export default function Header() {
  const { currentUser, signIn, signOut } = useContext(AuthContext);
  const isSignedIn = currentUser ? true : false;
  return (
    <header className="sticky w-full top-0 z-40 backdrop-blur border-b bg-zinc-900/ border-zinc-800 ">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link to="/" className="text-2xl font-semibold text-zinc-50">
          <h1 className="text-2xl font-bold text-zinc-50 font-mono">Blogy</h1>
        </Link>
        <nav>
          <ul className="flex gap-4 items-center">
            {isSignedIn && (
              <li>
                <button
                  onClick={signOut}
                  className="text-zinc-50 font-semibold text-sm md:text-base"
                >
                  Sign Out
                </button>
              </li>
            )}
            {!isSignedIn && (
              <li>
                <button
                  onClick={signIn}
                  className="text-zinc-50 font-semibold text-sm md:text-base"
                >
                  Sign In
                </button>
              </li>
            )}
            <li>
              <Link
                to="/"
                className="text-zinc-50 font-semibold text-sm md:text-base"
              >
                All Posts
              </Link>
            </li>
            <li>
              <Link
                to="/bookmarks"
                className="text-zinc-50 font-semibold text-sm md:text-base"
              >
                Bookmarks
              </Link>
            </li>
            {isSignedIn && (
              <li>
                <Link
                  to="/my-posts"
                  className="text-zinc-50 font-semibold text-sm md:text-base"
                >
                  My Posts
                </Link>
              </li>
            )}
            <li className="flex">
              <Link
                to="/create"
                className="px-4 py-2 bg-zinc-50 text-zink-900 font-semibold rounded-md text-sm md:text-base"
              >
                Create Post
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
