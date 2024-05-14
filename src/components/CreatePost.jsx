import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "./Form";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
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
      // Add a new document with a generated id fireebase collection
      const docRef = doc(collection(db, "posts"));
      const data = {
        id: docRef.id,
        title,
        content,
        image: image || `https://source.unsplash.com/random/${docRef.id}`,
      };
      await setDoc(docRef, data);
      /**
       * we don't need to dispatch the action here anymore
      dispatch({
        type: "CREATE_POST",
        payload: data,
      });*/
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
