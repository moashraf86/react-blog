import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { PostsProvider } from "./context/PostsContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <PostsProvider>
      <AuthProvider>
        <div className="container h-full mx-auto px-4">
          <Header />
          <Outlet />
        </div>
      </AuthProvider>
    </PostsProvider>
  );
}
