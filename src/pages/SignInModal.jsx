import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export const SignInModal = ({ onCancel }) => {
  const { signIn, signInAsGuest } = useContext(AuthContext);

  /**
   * Handle Sign In With Google
   */
  const handleGoogleSignIn = () => {
    signIn();
    onCancel();
  };

  /**
   * Handle Sign In as Guest
   */
  const handleGuestSignIn = () => {
    signInAsGuest();
    onCancel();
  };

  /**
   * Hide the modal when the user clicks outside the modal
   */
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("fixed")) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[1px] flex items-center justify-center px-4 z-20"
      onClick={handleOutsideClick}
    >
      <div className="relative bg-zinc-900 border border-zinc-700 p-6 rounded-lg w-full sm:max-w-[350px]">
        <h3 className="text-xl md:text-2xl text-center font-semibold text-zinc-50 mb-6">
          Sign in to Blogy
        </h3>
        <ul className="flex flex-col justify-end gap-4">
          <li>
            <button
              className="w-full md:text-lg flex gap-[10px] items-center justify-center py-2 px-3 bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-md"
              onClick={handleGoogleSignIn}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="28px"
                height="28px"
              >
                <path
                  fill="#fbc02d"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#e53935"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4caf50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1565c0"
                  d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Sign in with Google
            </button>
          </li>
          <li>
            <button
              className="w-full flex gap-[10px] items-center justify-center md:text-lg px-4 py-2 bg-zinc-950 text-zinc-100 border border-zinc-700 rounded-md"
              onClick={handleGuestSignIn}
            >
              <i className="ri-user-line text-xl"></i>
              Continue as Guest
            </button>
          </li>
        </ul>
        {/* Close icon */}
        <button
          className="absolute w-6 h-6 text-center leading-6 top-3 right-3 text-zinc-400 hover:text-zinc-100"
          onClick={onCancel}
        >
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>
    </div>
  );
};
