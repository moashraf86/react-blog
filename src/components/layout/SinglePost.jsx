/* eslint-disable react/prop-types */
import { PostHead } from "./PostHead";
import { PostBody } from "./PostBody";
import { PostFooter } from "./PostFooter";
export const SignlePost = ({ post, comments }) => {
  return (
    <>
      <PostHead post={post} />
      <PostBody post={post} />
      <PostFooter post={post} comments={comments} />
    </>
  );
};
