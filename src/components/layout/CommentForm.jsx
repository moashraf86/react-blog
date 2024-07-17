/* eslint-disable react/prop-types */
import { Button } from "../ui/button";
export const CommentForm = ({
  handleChangeComment,
  handleSubmit,
  content,
  currentUser,
  error,
  formRef,
}) => {
  const isGuest = currentUser?.isGuest;
  return (
    <div ref={formRef}>
      <label
        htmlFor="comment"
        className="inline-block text-primary font-bold text-xl mb-6"
      >
        Write a Comment
      </label>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
        <textarea
          className="w-full p-3 text-primary border border-input bg-transparent rounded-md shadow-sm focus:ring-0 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          name="comment"
          id="comment"
          rows={4}
          placeholder={
            isGuest || !currentUser ? "Sign in to comment" : "Write a comment"
          }
          onChange={handleChangeComment}
          value={content}
          disabled={isGuest || !currentUser}
        ></textarea>
        {error && <p className="text-danger">{error}</p>}
        <Button
          size="lg"
          type="submit"
          className="self-end text-base"
          disabled={isGuest || !currentUser}
        >
          Send
        </Button>
      </form>
    </div>
  );
};
