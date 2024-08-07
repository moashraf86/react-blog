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
  // set min 500 chars and without limit
  const regExp = /^.{1500,10000}$/;
  if (!content) {
    return "Content is required";
  } else if (!regExp.test(content)) {
    return "Content must be between 1500 and 10000 characters";
  }
  return true;
};

export const validateTag = (tag) => {
  if (!tag) {
    console.log("no tag");

    return "Tag is required";
  }
  console.log("tag is set");

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
