import {
  IS_BOLD,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_UNDERLINE,
  IS_CODE,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_HIGHLIGHT,
} from "../lib/lexicalConstants";

function applyTextFormatting(text, format) {
  let formattedText = text;
  if (format & IS_BOLD) formattedText = `<strong>${formattedText}</strong>`;
  if (format & IS_ITALIC) formattedText = `<em>${formattedText}</em>`;
  if (format & IS_STRIKETHROUGH) formattedText = `<s>${formattedText}</s>`;
  if (format & IS_UNDERLINE) formattedText = `<u>${formattedText}</u>`;
  if (format & IS_CODE) formattedText = `<code>${formattedText}</code>`;
  if (format & IS_SUBSCRIPT) formattedText = `<sub>${formattedText}</sub>`;
  if (format & IS_SUPERSCRIPT) formattedText = `<sup>${formattedText}</sup>`;
  if (format & IS_HIGHLIGHT) formattedText = `<mark>${formattedText}</mark>`;

  return formattedText;
}

function applyElementFormatting(node) {
  let style = "";

  if (node.format === "left") style = "text-align: left;";
  if (node.format === "center") style = "text-align: center;";
  if (node.format === "right") style = "text-align: right;";
  if (node.format === "justify") style = "text-align: justify;";
  if (node.format === "start") style = "text-align: start;";
  if (node.format === "end") style = "text-align: end;";

  return style;
}

export const convertToHtml = (node) => {
  if (!node) return "";

  if (node.type === "root" || node.type === "paragraph") {
    const tag = node.type === "root" ? "div" : "p";
    let childrenHtml = "";
    if (node.children && node.children.length > 0) {
      childrenHtml = node.children
        .map((child) => convertToHtml(child))
        .join("");
    }
    const style = node.format ? `style="${applyElementFormatting(node)}"` : "";
    const dir = node.direction === "rtl" ? `dir="${node.direction}"` : "";
    return `<${tag} ${style} ${dir}>${childrenHtml}</${tag}>`;
  } else if (node.type === "text") {
    return applyTextFormatting(node.text, node.format);
  }
  return "";
};
