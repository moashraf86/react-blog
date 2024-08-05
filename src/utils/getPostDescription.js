/**
 * Get Post Description from content JSON Object
 */

export const getPostDescription = (node) => {
  if (!node) return "";
  if (node.type === "root" || node.type === "paragraph") {
    let plainText = "";
    if (node.children && node.children.length > 0) {
      plainText = node.children
        .map((child) => getPostDescription(child))
        .join(" ");
    }
    return plainText;
  } else if (node.type === "text") {
    return node.text;
  }
  return "";
};
