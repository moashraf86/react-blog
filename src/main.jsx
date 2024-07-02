import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CreatePost } from "./pages/CreatePost.jsx";
import { EditPost } from "./pages/EditPost.jsx";
import { Post } from "./pages/Post.jsx";
import { Bookmarks } from "./pages/Bookmarks.jsx";
import { Posts } from "./pages/posts.jsx";
import { MyPosts } from "./pages/MyPosts.jsx";
import { UserProfile } from "./pages/UserProfile.jsx";
import "remixicon/fonts/remixicon.css";
import App from "./App.jsx";
import "./index.css";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Not Found</div>,
    children: [
      { path: "/", element: <Posts /> },
      {
        path: "/post/:id",
        element: <Post />,
        handle: {
          crumb: () => `Post`,
        },
      },
      {
        path: "/create",
        element: <CreatePost />,
        handle: { crumb: () => `Create Post` },
      },
      {
        path: "/edit/:id",
        element: <EditPost />,
        handle: { crumb: () => `Edit Post` },
      },
      {
        path: "/bookmarks",
        element: <Bookmarks />,
        loader: () => import("./pages/Bookmarks.jsx"),
        handle: { crumb: () => `Bookmarks` },
      },
      {
        path: "/my-posts",
        element: <MyPosts />,
        handle: { crumb: () => `My Posts` },
      },
      {
        path: "/drafts",
        element: <MyPosts />,
        handle: { crumb: () => `Drafts` },
      },
      {
        path: "/users/:id",
        element: <UserProfile />,
        handle: { crumb: () => `User Profile` },
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
