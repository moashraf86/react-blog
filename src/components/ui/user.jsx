import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./dropdown-menu";
import { Button } from "./button";
export const User = () => {
  const { currentUser, signOut } = useContext(AuthContext);
  const isGuest = currentUser?.isGuest;
  const userImg =
    currentUser?.photoURL || "https://robohash.org/mail@ashallendesign.co.uk";

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full cursor-pointer overflow-clip p-[1px] border border-zinc-300 dark:border-zinc-800"
          >
            <img
              src={userImg}
              alt="user avatar"
              className="rounded-full w-full h-full mx-auto"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[12rem]">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link to="/" className="w-full text-left font-semibold">
            <DropdownMenuItem>Home</DropdownMenuItem>
          </Link>
          <Link to={`/users/${currentUser.id}`} className="font-semibold">
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          {!isGuest ? (
            <Link to="/my-posts" className="font-semibold">
              <DropdownMenuItem>My Posts</DropdownMenuItem>
            </Link>
          ) : (
            <Link to="/drafts" className="font-semibold">
              <DropdownMenuItem>Drafts</DropdownMenuItem>
            </Link>
          )}
          {!isGuest && (
            <Link to="/bookmarks" className="w-full text-left font-semibold">
              <DropdownMenuItem>Bookmarks</DropdownMenuItem>
            </Link>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button className="font-semibold" onClick={signOut}>
              Sign Out
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
