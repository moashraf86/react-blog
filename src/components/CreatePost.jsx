import { useState, useContext } from "react";
import axios from "axios";
import { PostsDispatchContext } from "../context/PostsDispatchContext";
import { useNavigate } from "react-router-dom";
import { Form } from "./Form";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const dispatch = useContext(PostsDispatchContext);
  let navigate = useNavigate();

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImage(reader.result);
      setImageName(file.name);
    };
  };
  /**
   * Handle Create Post
   */
  const handleCreatePost = (e) => {
    e.preventDefault();
    // Validate the title and content fields
    if (!title || !content) {
      e.preventDefault();
      return;
    }

    // Write posts to the server
    const createPost = async () => {
      const { data } = await axios.post("http://localhost:3000/posts", {
        id: Date.now().toString(),
        title,
        content,
        image: image || `https://source.unsplash.com/random/${title}`,
      });
      // Dispatch the action to create post to the reducer
      dispatch({
        type: "CREATE_POST",
        payload: data,
      });
    };
    createPost();
    setTitle("");
    setContent("");
    setImage(null);
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  return (
    <Form
      heading="Add Post"
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      onsubmit={handleCreatePost}
      handleImageChange={handleImageChange}
      imageName={imageName}
    />
  );
}
