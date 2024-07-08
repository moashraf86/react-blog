/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
export const PostHead = ({ post }) => {
  const { tag, id, title, authorImage, authorName, authorId, createdAt } = post;

  return (
    <>
      {/* Post Tag */}
      {tag && (
        <div className="flex justify-between items-center mb-3">
          <span className="bg-accent py-2 px-4 rounded-full text-muted-foreground text-xs font-medium uppercase tracking-widest">
            {tag}
          </span>
        </div>
      )}
      {/* Post Title */}
      <h3 className="text-2xl md:text-4xl text-primary font-bold capitalize mb-4">
        <Link to={`/post/${id}`}>{title}</Link>
      </h3>
      {/* Author Img / Create Date */}
      <div className="flex items-center gap-2 mb-8">
        <img
          src={authorImage}
          alt={authorName}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">
            <Link to={`/users/${authorId}`}>{authorName}</Link> |{" "}
            {createdAt?.split("T")[0]}
          </p>
        </div>
      </div>
    </>
  );
};
