import { useReducer } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { PostsContext } from "./context/PostsContext";
import { PostsDispatchContext } from "./context/PostsDispatchContext";

export default function App() {
  const initialPosts = [];

  // Reducer function
  const postsReducer = (posts, action) => {
    switch (action.type) {
      case "CREATE_POST":
        return [...posts, action.payload];
      case "EDIT_POST":
        return posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        );
      case "FETCH_POSTS":
        return action.payload;
      case "DELETE_POST":
        return [...posts.filter((post) => post.id !== action.payload.id)];
      default:
        return posts;
    }
  };

  const [posts, dispatch] = useReducer(postsReducer, initialPosts);

  return (
    <PostsContext.Provider value={posts}>
      <PostsDispatchContext.Provider value={dispatch}>
        <div className="container h-full mx-auto px-4">
          <Header />
          <Outlet />
        </div>
      </PostsDispatchContext.Provider>
    </PostsContext.Provider>
  );
}
