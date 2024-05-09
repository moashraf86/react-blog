export const Error = ({ errMsg }) => {
  return (
    <div className="relative flex flex-col gap-2 justify-center items-start w-full border border-red-800 p-6 rounded-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="28"
        height="28"
        className="text-red-800 fill-current mt-1 absolute top-6 left-6"
      >
        <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
      </svg>
      <h3 className="text-2xl font-semibold text-red-800 pl-10">Error</h3>
      <p className="text-red-800 pl-10">{errMsg}</p>
    </div>
  );
};
