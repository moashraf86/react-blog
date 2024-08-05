// Text node formatting constants
export const IS_BOLD = 1;
export const IS_ITALIC = 1 << 1;
export const IS_STRIKETHROUGH = 1 << 2;
export const IS_UNDERLINE = 1 << 3;
export const IS_CODE = 1 << 4;
export const IS_SUBSCRIPT = 1 << 5;
export const IS_SUPERSCRIPT = 1 << 6;
export const IS_HIGHLIGHT = 1 << 7;

export const IS_ALL_FORMATTING =
  IS_BOLD |
  IS_ITALIC |
  IS_STRIKETHROUGH |
  IS_UNDERLINE |
  IS_CODE |
  IS_SUBSCRIPT |
  IS_SUPERSCRIPT |
  IS_HIGHLIGHT;

// Element node formatting constants
export const IS_ALIGN_LEFT = "left";
export const IS_ALIGN_CENTER = "center";
export const IS_ALIGN_RIGHT = "right";
export const IS_ALIGN_JUSTIFY = "justify";
export const IS_ALIGN_START = "start";
export const IS_ALIGN_END = "end";
