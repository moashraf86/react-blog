import {
  RiBold,
  RiCodeBlock,
  RiCodeSSlashLine,
  RiDoubleQuotesR,
  RiEditBoxLine,
  RiEyeLine,
  RiFullscreenLine,
  RiH1,
  RiH2,
  RiH3,
  RiH4,
  RiH5,
  RiH6,
  RiHeading,
  RiImageAddFill,
  RiItalic,
  RiLayoutColumnLine,
  RiLink,
  RiListOrdered,
  RiListUnordered,
  RiQuestionLine,
  RiSeparator,
} from "@remixicon/react";
/**
 * Edit command icons in the markdown editor
 */
export const handleToolbarIcons = (cmd) => {
  const iconStyle = {
    width: "24px",
    height: "24px",
  };
  switch (cmd.name) {
    case "table":
      return false;
    case "checked-list":
      return false;
    case "strikethrough":
      return false;
    case "comment":
      return false;
    case "bold":
      return {
        ...cmd,
        icon: <RiBold style={iconStyle} />,
      };
    case "italic":
      return {
        ...cmd,
        icon: <RiItalic style={iconStyle} />,
      };
    case "hr":
      return {
        ...cmd,
        icon: <RiSeparator style={iconStyle} />,
      };
    case "title":
      return {
        ...cmd,
        icon: <RiHeading style={iconStyle} />,
        // loop through the children of the title command
        children: cmd.children.map((child) => {
          switch (child.name) {
            case "title1":
              return {
                ...child,
                icon: <RiH1 />,
              };
            case "title2":
              return {
                ...child,
                icon: <RiH2 />,
              };
            case "title3":
              return {
                ...child,
                icon: <RiH3 />,
              };
            case "title4":
              return {
                ...child,
                icon: <RiH4 />,
              };
            case "title5":
              return {
                ...child,
                icon: <RiH5 />,
              };
            case "title6":
              return {
                ...child,
                icon: <RiH6 />,
              };
            default:
              return child;
          }
        }),
      };
    case "link":
      return {
        ...cmd,
        icon: <RiLink style={iconStyle} />,
      };
    case "quote":
      return {
        ...cmd,
        icon: <RiDoubleQuotesR style={iconStyle} />,
      };
    case "code":
      return {
        ...cmd,
        icon: <RiCodeSSlashLine style={iconStyle} />,
      };
    case "codeBlock":
      return {
        ...cmd,
        icon: <RiCodeBlock style={iconStyle} />,
      };
    case "image":
      return {
        ...cmd,
        icon: <RiImageAddFill style={iconStyle} />,
      };
    case "unordered-list":
      return {
        ...cmd,
        icon: <RiListUnordered style={iconStyle} />,
      };
    case "ordered-list":
      return {
        ...cmd,
        icon: <RiListOrdered style={iconStyle} />,
      };
    case "help":
      return {
        ...cmd,
        icon: <RiQuestionLine style={iconStyle} />,
      };
    case "edit":
      return {
        ...cmd,
        icon: <RiEditBoxLine style={iconStyle} />,
      };
    case "live":
      return {
        ...cmd,
        icon: <RiLayoutColumnLine style={iconStyle} />,
      };
    case "preview":
      return {
        ...cmd,
        icon: <RiEyeLine style={iconStyle} />,
      };
    case "fullscreen":
      return {
        ...cmd,
        icon: <RiFullscreenLine style={iconStyle} />,
      };
    case "title1":
      return {
        ...cmd,
        name: "title",
        keyCommand: "title",
        buttonProps: { "aria-label": "Insert title" },
        icon: <RiHeading style={iconStyle} />,
      };
    default:
      return cmd;
  }
};
