import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import {
  validateTitle,
  validateContent,
  validateImage,
  validateTag,
} from "../utils/validateForm";
import { Form } from "../components/layout/Form";
import { markdownToPlainText } from "../utils/markdownToPlainText";
import { useQuery } from "@tanstack/react-query";

export const EditPost = () => {
  const id = useParams().id;
  // fetch single post from firebase based on the id
  const fetchPost = async () => {
    const postCollection = collection(db, "posts");
    const postDoc = doc(postCollection, id);
    const postSnap = await getDoc(postDoc);
    const postData = postSnap.data();
    return postData;
  };
  /**
   * Custom Hook to fetch a single post
   */
  const useFetchPost = () => {
    return useQuery({
      queryKey: ["post", id],
      queryFn: fetchPost,
    });
  };
  const { data: post } = useFetchPost();

  let navigate = useNavigate();
  const [image, setImage] = useState(post.image);
  const [isImageRequired, setIsImageRequired] = useState(true);
  const [formData, setFormData] = useState({
    title: post.title || "",
    content: post.content || "",
    tag: post.tag || "",
  });
  const { title, content, tag } = formData;
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    tag: "",
    image: "",
  });

  /**
   * Convert Markdown to Plain Text
   */
  const plainTextContent = markdownToPlainText(content || "");
  /**
   * Validate Form Inputs
   */
  const validateForm = () => {
    let validationErrors = {};
    validationErrors.title = validateTitle(title);
    validationErrors.content = validateContent(plainTextContent);
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
      validationErrors.content = validateContent(
        markdownToPlainText(e.target.value)
      );
    if (e.target.name === "tag")
      validationErrors.tag = validateTag(e.target.value);
    setErrors(validationErrors);
  };

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
    if (!validateForm()) {
      console.log("ERRORS");
      return;
    }
    const editPost = async () => {
      // Update the post on firebase
      const postRef = doc(db, "posts", id);
      const data = {
        title,
        content,
        tag,
        image: image || `https://picsum.photos/seed/${tag}/800/600`,
      };
      await updateDoc(postRef, data);
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
      onSelect={(e) => handleChange(e)}
      handleImageChange={handleImageChange}
      handleRemoveImage={handleRemoveImage}
      handleChange={handleChange}
      handleSelectRandomImage={() => setIsImageRequired(!isImageRequired)}
      isImageRequired={isImageRequired}
      errors={errors}
    />
  );
};
