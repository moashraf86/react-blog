import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import { PostsProvider } from "./context/PostsContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeProviderContext";
import { CommentsProvider } from "./context/CommentsContext";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <PostsProvider>
        <AuthProvider>
          <Header />
          <CommentsProvider>
            <Outlet />
          </CommentsProvider>
        </AuthProvider>
      </PostsProvider>
    </ThemeProvider>
  );
}
