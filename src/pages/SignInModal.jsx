import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
export const SignInModal = ({ onCancel, showModal }) => {
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
  const handleOutsideClick = () => {
    // if (e.target.classList.contains("fixed")) {
    //   onCancel();
    // }
  };

  return (
    <AlertDialog open={showModal}>
      <AlertDialogContent className="max-w-[350px]">
        <AlertDialogTitle className="mb-4 font-semibold text-primary">
          Sign in to Blogy
        </AlertDialogTitle>
        <div className="flex flex-col items-stretch gap-2">
          <Button
            size="lg"
            variant="outline"
            className="md:text-base flex gap-[10px] h-11"
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
          </Button>
          <span className="text-center text-muted-foreground">OR</span>
          <Button
            size="lg"
            variant="outline"
            className="md:text-base flex gap-[10px] h-11"
            onClick={handleGuestSignIn}
          >
            <i className="ri-user-line text-xl"></i>
            Continue as Guest
          </Button>
        </div>
        <Button
          className="absolute top-6 right-6"
          variant="ghost"
          size="icon"
          onClick={onCancel}
        >
          <i className="ri-close-line text-xl"></i>
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
};
