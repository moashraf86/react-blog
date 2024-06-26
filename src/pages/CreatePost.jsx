import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "./Form";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

export const CreatePost = () => {
  const { currentUser } = useContext(AuthContext);
  const authorId = currentUser?.id;
  const authorName = currentUser?.name || "Anonymous";
  const authorImage =
    currentUser?.photoURL || `https://i.pravatar.cc/150?img=${authorId}`;
  const isGuest = currentUser?.isGuest;
  const [image, setImage] = useState(null);
  const [isImageRequired, setIsImageRequired] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tag: "",
  });
  const { title, content, tag } = formData;
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    tag: "",
    image: "",
  });
  let navigate = useNavigate();

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
      return "Content must be between 100 and 500 characters";
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
    if (!image && isImageRequired) {
      return "Image is required";
    } else if (image?.size > 1000000) {
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
   * Handle Create Post
   */
  const handleCreatePost = (e) => {
    e.preventDefault();
    // check if there are any errors
    if (!validateForm()) return;
    // Add post to the posts collection
    const createPost = async () => {
      const postsRef = doc(collection(db, "posts"));
      const data = {
        id: postsRef.id,
        title,
        content,
        tag,
        image: image || `https://picsum.photos/seed/${tag}/800/600`,
        bookmarksCount: 0,
        authorId: authorId,
        authorName: authorName,
        authorImage: authorImage,
        published: isGuest ? false : true,
        createdAt: new Date().toISOString(),
      };
      await setDoc(postsRef, data);
    };
    createPost();
    setImage(null);
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  return (
    <Form
      heading="Add Post"
      title={title}
      content={content}
      tag={tag}
      image={image}
      onsubmit={handleCreatePost}
      handleImageChange={handleImageChange}
      handleRemoveImage={handleRemoveImage}
      handleChange={handleChange}
      handleSelectRandomImage={() => setIsImageRequired(!isImageRequired)}
      isImageRequired={isImageRequired}
      errors={errors}
    />
  );
};
