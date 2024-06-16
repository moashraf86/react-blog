import { Outlet } from "react-router-dom";
import Header from "./pages/Header";
import { PostsProvider } from "./context/PostsContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeProviderContext";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <PostsProvider>
        <AuthProvider>
          <Header />
          <Outlet />
        </AuthProvider>
      </PostsProvider>
    </ThemeProvider>
  );
}
