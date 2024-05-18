import { useReducer } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { PostsContext } from "./context/PostsContext";
import { PostsDispatchContext } from "./context/PostsDispatchContext";
import { BookmarksContext } from "./context/BookmarksContext";
import { BookmarksDispatchContext } from "./context/BookmarksDispatchContext";

export default function App() {
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
      default:
        return posts;
    }
  };

  // bookmarksReducer function
  const bookmarksReducer = (bookmarks, action) => {
    switch (action.type) {
      case "FETCH_BOOKMARKS":
        return action.payload;
      case "ADD_BOOKMARK":
        return [...bookmarks, action.payload];
      case "REMOVE_BOOKMARK":
        return [
          ...bookmarks.filter((bookmark) => bookmark.id !== action.payload.id),
        ];
      default:
        return bookmarks;
    }
  };

  const [posts, dispatch] = useReducer(postsReducer, initialPosts);
  const [bookmarks, bookmarksDispatch] = useReducer(
    bookmarksReducer,
    initialPosts
  );

  return (
    <PostsContext.Provider value={posts}>
      <PostsDispatchContext.Provider value={dispatch}>
        <div className="container h-full mx-auto px-4">
          <Header />
          <BookmarksContext.Provider value={bookmarks}>
            <BookmarksDispatchContext.Provider value={bookmarksDispatch}>
              <Outlet />
            </BookmarksDispatchContext.Provider>
          </BookmarksContext.Provider>
        </div>
      </PostsDispatchContext.Provider>
    </PostsContext.Provider>
  );
}
