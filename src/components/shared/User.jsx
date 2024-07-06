import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useHref } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
export const User = () => {
  const { currentUser, signOut } = useContext(AuthContext);
  const isGuest = currentUser?.isGuest;
  const userImg =
    currentUser?.photoURL || "https://robohash.org/mail@ashallendesign.co.uk";
  const userName = currentUser?.displayName || "Anonymous";
  const currentPage = useHref().split("/")[1];

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
        <DropdownMenuContent align="end" className="min-w-[13rem]">
          <DropdownMenuLabel className="text-base font-bold pt-0 pb-1">
            {userName}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {currentUser && (
            <Link to="/create">
              <DropdownMenuItem>
                <Button
                  variant="default"
                  size="default"
                  className="w-full flex items-center gap-3 text-base"
                >
                  <i className="ri-edit-box-line text-lg text-primary-foreground"></i>
                  Write Post
                </Button>
              </DropdownMenuItem>
            </Link>
          )}
          <DropdownMenuSeparator />
          <Link to="/">
            <DropdownMenuItem
              className={`flex gap-2 items-center h-8 ${
                currentPage === "" && "bg-accent"
              }`}
            >
              <i
                className={`ri-home-5-${
                  currentPage === "" ? "fill" : "line"
                } text-lg`}
              ></i>
              <span className="font-semibold">Home</span>
            </DropdownMenuItem>
          </Link>
          <Link to={`/users/${currentUser.id}`}>
            <DropdownMenuItem
              className={`flex gap-2 items-center h-8 ${
                currentPage === "users" && "bg-accent"
              }`}
            >
              <i
                className={`ri-user-${
                  currentPage === "users" ? "fill" : "line"
                } text-lg`}
              ></i>
              <span className="font-semibold">Profile</span>
            </DropdownMenuItem>
          </Link>
          {!isGuest ? (
            <Link to="/my-posts">
              <DropdownMenuItem
                className={`flex gap-2 items-center h-8 ${
                  currentPage === "my-posts" && "bg-accent"
                }`}
              >
                <i
                  className={`ri-file-list-${
                    currentPage === "my-posts" ? "fill" : "line"
                  } text-lg`}
                ></i>
                <span className="font-semibold">My Posts</span>
              </DropdownMenuItem>
            </Link>
          ) : (
            <Link to="/drafts">
              <DropdownMenuItem
                className={`flex gap-2 items-center h-8 ${
                  currentPage === "drafts" && "bg-accent"
                }`}
              >
                <i
                  className={`ri-bookmark-${
                    currentPage === "drafts" ? "fill" : "line"
                  } text-lg`}
                ></i>
                <span className="font-semibold">Drafts</span>
              </DropdownMenuItem>
            </Link>
          )}
          {!isGuest && (
            <Link to="/bookmarks">
              <DropdownMenuItem
                className={`flex gap-2 items-center h-8 ${
                  currentPage === "bookmarks" && "bg-accent"
                }`}
              >
                <i
                  className={`ri-bookmark-${
                    currentPage === "bookmarks" ? "fill" : "line"
                  } text-lg`}
                ></i>
                <span className="font-semibold">Bookmarks</span>
              </DropdownMenuItem>
            </Link>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 text-danger focus:text-danger h-8"
            onSelect={signOut}
          >
            <i className="ri-logout-box-line text-lg text-danger"></i>
            <span className="font-semibold">Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
