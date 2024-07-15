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
import { buttonVariants } from "@/components/ui/button";

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
            <DropdownMenuItem asChild>
              <Link
                className={
                  buttonVariants({ variant: "default" }) +
                  " w-full gap-3 mt-1 focus:bg-accent-foreground focus:text-accent focus-visible:outline-accent-foreground"
                }
                to="/create"
                aria-label="Create a new post"
              >
                <i className="ri-edit-box-line text-lg text-primary-foreground"></i>
                <span>Write Post</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator aria-label="separator line" />
          <DropdownMenuItem
            asChild
            className={`flex gap-2 items-center ${
              currentPage === "" && "bg-accent"
            }`}
          >
            <Link to="/" aria-label="Home page">
              <i
                className={`ri-home-5-${
                  currentPage === "" ? "fill" : "line"
                } text-lg`}
              ></i>
              <span className="font-semibold">Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className={`flex gap-2 items-center ${
              currentPage === "users" && "bg-accent"
            }`}
          >
            <Link to={`/users/${currentUser.id}`} aria-label="Profile page">
              <i
                className={`ri-user-${
                  currentPage === "users" ? "fill" : "line"
                } text-lg`}
              ></i>
              <span className="font-semibold">Profile</span>
            </Link>
          </DropdownMenuItem>
          {!isGuest ? (
            <DropdownMenuItem
              asChild
              className={`flex gap-2 items-center ${
                currentPage === "my-posts" && "bg-accent"
              }`}
            >
              <Link to="/my-posts" aria-label="my posts page">
                <i
                  className={`ri-file-list-${
                    currentPage === "my-posts" ? "fill" : "line"
                  } text-lg`}
                ></i>
                <span className="font-semibold">My Posts</span>
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              asChild
              className={`flex gap-2 items-center ${
                currentPage === "drafts" && "bg-accent"
              }`}
            >
              <Link to="/drafts" aria-label="Drafts page">
                <i
                  className={`ri-bookmark-${
                    currentPage === "drafts" ? "fill" : "line"
                  } text-lg`}
                ></i>
                <span className="font-semibold">Drafts</span>
              </Link>
            </DropdownMenuItem>
          )}
          {!isGuest && (
            <DropdownMenuItem
              asChild
              className={`flex gap-2 items-center ${
                currentPage === "bookmarks" && "bg-accent"
              }`}
            >
              <Link to="/bookmarks" aria-label="Bookmarks page">
                <i
                  className={`ri-bookmark-${
                    currentPage === "bookmarks" ? "fill" : "line"
                  } text-lg`}
                ></i>
                <span className="font-semibold">Bookmarks</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator aria-label="separator line" />
          <DropdownMenuItem
            className="flex items-center gap-2 text-danger focus:text-danger mb-0"
            onSelect={signOut}
            aria-label="Sign out Button"
          >
            <i className="ri-logout-box-line text-lg text-danger"></i>
            <span className="font-semibold">Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
