import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { RiCloseLine, RiUserLine } from "@remixicon/react";
import { GoogleIcon } from "../shared/GoogleIcon";

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

  return (
    <AlertDialog open={showModal}>
      <AlertDialogContent>
        <AlertDialogTitle className="mb-4 font-semibold text-primary">
          Sign in to Blogy
        </AlertDialogTitle>
        <div className="flex flex-col items-stretch gap-2">
          <Button
            size="lg"
            variant="default"
            className="md:text-base flex gap-[10px] h-11"
            onClick={handleGoogleSignIn}
          >
            <GoogleIcon />
            Sign in with Google
          </Button>
          <span className="text-center text-muted-foreground">OR</span>
          <Button
            size="lg"
            variant="outline"
            className="md:text-base flex gap-[10px] h-11"
            onClick={handleGuestSignIn}
          >
            <RiUserLine size={20} />
            Continue as Guest
          </Button>
        </div>
        <Button
          className="absolute top-6 right-6"
          variant="ghost"
          size="icon"
          onClick={onCancel}
        >
          <RiCloseLine size={20} />
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
};
