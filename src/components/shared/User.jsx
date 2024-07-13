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
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
export const User = () => {
  const { currentUser, signOut } = useContext(AuthContext);
  const isGuest = currentUser?.isGuest;
  const userImg = currentUser?.photoURL;
  const userName = currentUser?.name || "Anonymous";
  const currentPage = useHref().split("/")[1];
  /**
   * Get the first char of the user name and the first char after the space
   */
  const [firstName, lastName] = userName.split(" ");

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full cursor-pointer overflow-clip border border-zinc-300 dark:border-zinc-800"
          >
            {!isGuest ? (
              <Avatar className="flex w-full h-full items-center justify-center">
                <AvatarImage src={userImg} alt="User avatar" />
                <AvatarFallback>
                  {firstName[0]} {lastName[0]}
                </AvatarFallback>
              </Avatar>
            ) : (
              <i className="ri-user-line text-2xl text-muted-foreground"></i>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[16rem]">
          <DropdownMenuLabel className="text-base font-bold">
            {userName}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {currentUser && (
            <Link to="/create">
              <DropdownMenuItem>
                <Button
                  variant="default"
                  size="default"
                  className="w-full flex items-center gap-3 md:text-base"
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
              className={`flex gap-2 items-center ${
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
              className={`flex gap-2 items-center ${
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
                className={`flex gap-2 items-center ${
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
                className={`flex gap-2 items-center ${
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
                className={`flex gap-2 items-center ${
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
            className="flex items-center gap-2 text-danger focus:text-danger mb-0"
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
