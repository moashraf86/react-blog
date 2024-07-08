/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { getRelTime } from "../../utils/getRelTime";
export const Comment = ({ comment, commentToEdit, handleDelete }) => {
  const { authorName, authorImage, authorId, content, createdAt } = comment;
  const { currentUser } = useContext(AuthContext);
  const isCommentOwner = currentUser?.id === authorId;
  const date = new Date(createdAt.seconds * 1000);
  const timeAgo = getRelTime(date);

  return (
    <div
      key={comment.id}
      className="mb-4 p-4 bg-muted/30 border border-border rounded-md"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            src={authorImage || "https://i.pravatar.cc/150?img=1"}
            alt={authorName}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div className="flex items-center gap-1">
            <Link to={`/users/${authorId}`}>
              <p className="text-sm font-bold">{authorName}</p>
            </Link>
            <span className="text-xs text-gray-500">•</span>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
        {/* Edit/Delete Dropdown */}
        {isCommentOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger className="text-primary cursor-pointer p-1">
              <i className="ri-more-2-fill text-lg"></i>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="font-medium"
                onSelect={() => commentToEdit(comment)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="font-medium text-red-500 focus:text-red-500"
                onSelect={() => handleDelete(comment)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <p
        dir="auto"
        className="text-base text-primary/95 whitespace-pre-wrap leading-5"
      >
        {content}
      </p>
    </div>
  );
};
