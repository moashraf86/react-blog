import { useState, useContext } from "react";
import { PostsDispatchContext } from "../context/PostsDispatchContext";
import { useParams } from "react-router-dom";
import { PostsContext } from "../context/PostsContext";
import { useNavigate } from "react-router-dom";
import { Form } from "./Form";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function EditPost() {
  const posts = useContext(PostsContext);
  const dispatch = useContext(PostsDispatchContext);
  const id = useParams().id;
  const post = posts.find((post) => post.id === id);
  const [title, setTitle] = useState(id ? post.title : "");
  const [content, setContent] = useState(id ? post.content : "");
  const [image, setImage] = useState(null);
  let navigate = useNavigate();

  /**
   * Handle Image Change
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };
  /**
   * Handle Edit Post
   */
  const handleEditPost = (e) => {
    e.preventDefault();
    const editPost = async () => {
      // Update the post on firebase
      await updateDoc(doc(db, "posts", id), {
        title,
        content,
        image: image || post.image,
      });
      dispatch({
        type: "EDIT_POST",
        payload: { id, title, content, image: image || post.image },
      });
    };
    editPost();
    setTitle("");
    setContent("");
    setImage(null);
    setTimeout(() => {
      navigate("/");
    }, 300);
  };
  return (
    <Form
      heading="Edit Post"
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      onsubmit={handleEditPost}
      handleImageChange={handleImageChange}
      imageName={post && post.image}
    />
  );
}
