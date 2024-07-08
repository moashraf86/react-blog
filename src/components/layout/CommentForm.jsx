/* eslint-disable no-unused-vars */
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
  const userImg =
    currentUser?.photoURL || "https://robohash.org/mail@ashallendesign.co.uk";
  const isGuest = currentUser?.isGuest;

  //view the form only if the user is not a guest
  if (!currentUser || isGuest) {
    return;
  }

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
          className="w-full p-3 text-primary border border-input bg-transparent rounded-md shadow-sm focus:ring-0 focus:border-primary"
          name="comment"
          id="comment"
          rows={4}
          placeholder="write comment"
          onChange={handleChangeComment}
          value={content}
        ></textarea>

        {error && <p className="text-danger">{error}</p>}
        <Button size="lg" type="submit" className="self-end text-base">
          Send
        </Button>
      </form>
    </div>
  );
};
