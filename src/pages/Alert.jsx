/* eslint-disable react/prop-types */
export const Alert = ({ msg, type = "default" }) => {
  const colorClass = {
    error: "text-red-800",
    success: "text-green-800",
    warn: "text-yellow-800",
    default: "text-zinc-300",
  };

  const borderClass = {
    error: "border-red-800",
    success: "border-green-800",
    warn: "border-yellow-800",
    default: "border-zinc-300",
  };

  const color = colorClass[type] || color.default;
  const border = borderClass[type] || border.default;

  return (
    <div
      className={`relative flex gap-2 justify-start items-center w-full border p-6 rounded-md ${color} ${border} mt-16`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="28"
        height="28"
        className="text-inherit fill-current"
      >
        <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
      </svg>
      <div>
        {type == "error" && (
          <h3 className="text-2xl font-semibold text-inherit">Error</h3>
        )}
        <p className="text-inherit">{msg}</p>
      </div>
    </div>
  );
};
