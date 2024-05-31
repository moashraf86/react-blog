import { useState, useContext } from "react";
import { PostsDispatchContext } from "../context/PostsDispatchContext";
import { useParams } from "react-router-dom";
import { PostsContext } from "../context/PostsContext";
import { useNavigate } from "react-router-dom";
import { Form } from "./Form";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const EditPost = () => {
  const posts = useContext(PostsContext);
  const dispatch = useContext(PostsDispatchContext);
  const id = useParams().id;
  let navigate = useNavigate();
  const post = posts.find((post) => post.id === id);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    title: id ? post.title : "",
    content: id ? post.content : "",
    tag: id ? post.tag : "",
  });
  const { title, content, tag } = formData;
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    tag: "",
    image: "",
  });

  // load image if post exists
  if (post && !image) {
    setImage(post.image);
  }
  /**
   * Validate Form Inputs
   */
  const validateTitle = (title) => {
    // min 3 chars, max 60 chars al
    const regExp = /^.{10,60}$/;
    if (!title) {
      return "Title is required";
    } else if (!regExp.test(title)) {
      return "Title must be between 10 and 60 characters";
    }
    return true;
  };

  const validateContent = (content) => {
    // min 100 chars  max limit 1000 chars
    const regExp = /^.{100,500}$/;
    if (!content) {
      return "Content is required";
    } else if (!regExp.test(content)) {
      return "Content must be between 10 and 1000 characters";
    }
    return true;
  };

  const validateTag = (tag) => {
    if (!tag) {
      return "Tag is required";
    }
    return true;
  };

  const validateImage = (image) => {
    // max size 1mb and file type jpg, jpeg, png
    if (!image) {
      return "Image is required";
    } else if (image.size > 1000000) {
      return "Image must be less than 1mb";
    }
    return true;
  };

  const validateForm = () => {
    let validationErrors = {};
    validationErrors.title = validateTitle(title);
    validationErrors.content = validateContent(content);
    validationErrors.tag = validateTag(tag);
    validationErrors.image = validateImage(image);
    setErrors(validationErrors);
    return Object.values(validationErrors).every((err) => err === true); // True || False
  };

  /**
   * Handle Inputs Change
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    let validationErrors = errors;
    if (e.target.name === "title")
      validationErrors.title = validateTitle(e.target.value);
    if (e.target.name === "content")
      validationErrors.content = validateContent(e.target.value);
    if (e.target.name === "tag")
      validationErrors.tag = validateTag(e.target.value);
    setErrors(validationErrors);
  };

  /**
   * Handle Image Change
   */
  /**
   * Handle Image Change
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadstart = () => {
      // check if the image is valid
      let validationErrors = {};
      validationErrors.image = validateImage(file); //
      setErrors(validationErrors);
    };

    if (file && file.size < 1000000) {
      reader.onloadend = () => {
        setImage(reader.result);
      };
    }
  };

  /**
   * Handle Remove Image
   */
  const handleRemoveImage = () => {
    setImage(null);
  };
  /**
   * Handle Edit Post
   */
  const handleEditPost = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const editPost = async () => {
      // Update the post on firebase
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, {
        title,
        content,
        tag,
        image: image || post.image,
      });
      dispatch({
        type: "EDIT_POST",
        payload: { id, title, content, tag, image: image || post.image },
      });
    };
    editPost();
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  return (
    <Form
      heading="Edit Post"
      title={title}
      content={content}
      tag={tag}
      image={image}
      onsubmit={handleEditPost}
      handleImageChange={handleImageChange}
      handleRemoveImage={handleRemoveImage}
      handleChange={handleChange}
      errors={errors}
    />
  );
};
