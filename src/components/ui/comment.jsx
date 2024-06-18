/* eslint-disable react/prop-types */
import { Link, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { PostsContext } from "../../context/PostsContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
export const Comment = ({ comment, commentToEdit, handleDelete }) => {
  const { posts } = useContext(PostsContext);
  const { authorName, authorImage, authorId, content, createdAt } = comment;
  const { id } = useParams();
  const post = posts.find((post) => post.id === id) || {};
  const { currentUser } = useContext(AuthContext);
  const isCommentOwner = currentUser?.id === authorId;
  const isPostOwner = currentUser?.id === post.authorId;

  /**
   * Comment To Edit
   */
  // const commentToEdit = () => {
  //   handleEditComment(comment);
  //   console.log("Edit Comment", comment);
  // };

  return (
    <div key={comment.id} className="mb-4 p-4 border border-border rounded-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            src={authorImage || "https://i.pravatar.cc/150?img=1"}
            alt={authorName}
            className="w-8 h-8 rounded-full mr-2"
          />
          <Link to={`/users/${authorId}`}>
            <p className="text-sm font-bold">{authorName}</p>
          </Link>
        </div>
        <p className="text-xs text-gray-500">
          {/* {createdAt?.toDate().toLocaleDateString()} */}
        </p>
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
      <p className="text-base text-muted-foreground">{content}</p>
    </div>
  );
};
