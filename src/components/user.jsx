import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
export const User = () => {
  const { currentUser, signOut, signIn } = useContext(AuthContext);
  const isSignedIn = currentUser ? true : false;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userImg = currentUser?.photoURL || "https://via.placeholder.com/150";
  // toggle modal
  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // hide modal when clicked outside
  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".relative")) {
          setIsMenuOpen(false);
        }
        // close the modal when clicked on any Link or button
        if (e.target.closest("a") || e.target.closest("button")) {
          setIsMenuOpen(false);
        }
      });
      // cleanup
      return () => document.removeEventListener("click", setIsMenuOpen(false));
    }
  }, [isMenuOpen]);
  return (
    <div className="relative h-10">
      {/* user avatar */}
      <div
        role="button"
        className="w-10 h-10 rounded-full cursor-pointer overflow-clip p-[1px] border-2 border-zinc-600"
        onClick={handleToggleMenu}
      >
        <img
          src={userImg}
          alt="user avatar"
          className="rounded-full w-full h-full mx-auto"
        />
      </div>
      {/* dropdown menu */}
      {isMenuOpen && (
        <div className="absolute min-w-52  top-12 right-0 w-40 text-zinc-200 bg-zinc-900 border border-zinc-800 rounded-md">
          <div className="py-3 px-4 border-b border-zinc-800 font-bold">
            My Account
          </div>
          <ul className="flex flex-col p-1">
            <li className="px-4 py-1 hover:bg-zinc-800 rounded-md">
              <Link to="/" className="w-full text-left font-semibold">
                Home
              </Link>
            </li>
            <li className="px-4 py-1 hover:bg-zinc-800 rounded-md">
              <Link to="/" className="w-full text-left font-semibold">
                Profile
              </Link>
            </li>
            {isSignedIn && (
              <li className="px-4 py-1 hover:bg-zinc-800 rounded-md">
                <Link to="/my-posts" className="w-full text-left font-semibold">
                  My Posts
                </Link>
              </li>
            )}
            <li className="px-4 py-1 hover:bg-zinc-800 rounded-md">
              <Link to="/bookmarks" className="w-full text-left font-semibold">
                Bookmarks
              </Link>
            </li>
            {/* sparator */}
            <li className="border-t my-1 border-zinc-800 -ms-1 -me-1"></li>
            <li className="px-4 py-1 hover:bg-zinc-800 rounded-md">
              {isSignedIn ? (
                <button
                  className="w-full text-left font-semibold"
                  onClick={signOut}
                >
                  Sign Out
                </button>
              ) : (
                <button
                  className="w-full text-left font-semibold"
                  onClick={signIn}
                >
                  Sign In
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
