import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreatePost from "./components/CreatePost.jsx";
import EditPost from "./components/EditPost.jsx";
import PostsList from "./components/PostsList.jsx";
import { Post } from "./components/Post.jsx";
import "remixicon/fonts/remixicon.css";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Not Found</div>,
    children: [
      { path: "/", element: <PostsList /> },
      { path: "/post/:id", element: <Post /> },
      { path: "/create", element: <CreatePost /> },
      { path: "/edit/:id", element: <EditPost /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
