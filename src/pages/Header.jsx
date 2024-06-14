import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { SignInModal } from "./SignInModal";
import { createPortal } from "react-dom";
import { User } from "./user";
import { Button } from "../components/ui/button";
export default function Header() {
  const { currentUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="sticky w-full top-0 z-10 backdrop-blur border-b bg-zinc-900/ border-zinc-800 ">
        <div className="container mx-auto flex justify-between items-center py-4 px-4">
          <Link to="/" className="text-2xl font-semibold text-zinc-50">
            <h1 className="text-2xl font-bold text-zinc-50 font-mono">Blogy</h1>
          </Link>
          <nav>
            <ul className="flex gap-4 items-center">
              {currentUser && (
                <li className="flex">
                  <Button variant="default" size="default" asChild={true}>
                    <Link to="/create">Create Post</Link>
                  </Button>
                </li>
              )}
              {currentUser && <User />}
              {!currentUser && (
                <li>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-2 bg-zinc-50 text-zinc-900 font-semibold rounded-md md:text-lg"
                  >
                    Sign In
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
      {showModal &&
        createPortal(
          <SignInModal
            showModal={showModal}
            onCancel={() => setShowModal(false)}
          />,
          document.body
        )}
    </>
  );
}
