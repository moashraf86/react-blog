export const Loader = ({ style }) => {
  return (
    // loader card placeholder
    <li className={`flex w-full ${style} sm:px-2 mb-6 sm:mb-4 `}>
      <div className="flex flex-col gap-2 p-4 border-zinc-800 w-full rounded-md">
        <div className="h-[120px] bg-gradient-to-r from-zinc-400 to-zinc-800 rounded-md mb-2"></div>
        <div className="h-[15px] w-1/2 bg-gradient-to-r from-zinc-400 to-zinc-800 mb-2"></div>
        <div className="h-[10px] bg-gradient-to-r from-zinc-400 to-zinc-800 "></div>
        <div className="h-[10px] w-10/12 bg-gradient-to-r from-zinc-400 to-zinc-800 "></div>
        <div className="h-[10px] w-8/12 bg-gradient-to-r from-zinc-400 to-zinc-800 "></div>
      </div>
    </li>
  );
};
