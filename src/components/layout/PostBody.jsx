import MDEditor from "@uiw/react-md-editor";

/* eslint-disable react/prop-types */
export const PostBody = ({ post }) => {
  const { image, title, content } = post;
  return (
    <>
      {/* Post Image */}
      <div className="h-[360px] bg-gradient-to-r from-zinc-400 to-zinc-800 rounded-none mb-6">
        {image && (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover rounded-none"
          />
        )}
      </div>
      {/* Post Content */}
      <div className="flex flex-col gap-2">
        {
          <MDEditor.Markdown
            source={content}
            className="blog-content bg-background text-primary"
          />
        }
      </div>
    </>
  );
};
