export const markdownToPlainText = (content) => {
  return content
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // italic
    .replace(/(~~)(.*?)\1/g, "$2") // strikethrough
    .replace(/\!\[.*?\]\(.*?\)/g, "") // images
    .replace(/\[.*?\]\(.*?\)/g, "$1") // links
    .replace(/`(.*?)`/g, "$1") // inline code
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/#+\s+(.*?)(\n|$)/g, "$1") // headers
    .replace(/> (.*?)(\n|$)/g, "$1") // blockquotes
    .replace(/-\s+(.*?)(\n|$)/g, "$1") // list items
    .replace(/\*\s+(.*?)(\n|$)/g, "$1") // unordered list items
    .replace(/\d+\.\s+(.*?)(\n|$)/g, "$1") // ordered list items
    .replace(/\n+/g, " ") // new lines
    .replace(/\s\s+/g, " ") // multiple spaces
    .trim();
};
