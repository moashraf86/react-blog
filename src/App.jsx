import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import { PostsProvider } from "./context/PostsContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeProviderContext";
import { CommentsProvider } from "./context/CommentsContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <PostsProvider>
        <AuthProvider>
          <Header />
          <QueryClientProvider client={queryClient}>
            <CommentsProvider>
              <Outlet />
            </CommentsProvider>
          </QueryClientProvider>
        </AuthProvider>
      </PostsProvider>
    </ThemeProvider>
  );
}
