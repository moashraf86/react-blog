/**
 * Validate Form Inputs
 */
export const validateTitle = (title) => {
  // min 3 chars, max 60 chars al
  const regExp = /^.{10,60}$/;
  if (!title) {
    return "Title is required";
  } else if (!regExp.test(title)) {
    return "Title must be between 10 and 60 characters";
  }
  return true;
};

export const validateContent = (content) => {
  // min 100 chars  max limit 1000 chars
  // const regExp = /^.{100,500}$/;
  if (!content.root.children.map((child) => child.children)) {
    return "Content is required";
  }
  return true;
};

export const validateTag = (tag) => {
  if (!tag) {
    return "Tag is required";
  }
  return true;
};

export const validateImage = (image, isImageRequired) => {
  // max size 1mb and file type jpg, jpeg, png
  if (!image && isImageRequired) {
    return "Image is required";
  } else if (image?.size > 1000000) {
    return "Image must be less than 1mb";
  }
  return true;
};
