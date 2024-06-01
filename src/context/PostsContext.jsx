/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";

// create a context for Posts
export const PostsContext = createContext();

// create a provider for the PostsContext
export const PostsProvider = ({ children }) => {
  // initial posts state
  const initialPosts = [];
  // postsReducer function
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
      case "FETCH_POST":
        return action.payload;
      case "DELETE_POST":
        return [...posts.filter((post) => post.id !== action.payload.id)];
      case "DELETE_BOOKMARK":
        return [...posts.filter((post) => post.id !== action.payload.id)];
      default:
        return posts;
    }
  };
  // create a reducer for posts
  const [posts, dispatch] = useReducer(postsReducer, initialPosts);

  return (
    <PostsContext.Provider
      value={{
        posts,
        dispatch,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
