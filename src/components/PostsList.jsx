/* eslint-disable react/prop-types */
export const PostsList = ({ title, children, handleFilter }) => {
  return (
    <div className="flex flex-col gap-6 mt-12">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="px-4 text-2xl md:text-4xl font-bold mb-4 text-zinc-50">
          {title}
        </h2>
        <div className="flex items-center gap-3 px-4 text-zinc-400">
          <label
            htmlFor="all"
            className="hover:text-zinc-50 cursor-pointer text-sm has-[:checked]:text-zinc-50"
          >
            <input
              type="radio"
              name="filter"
              id="all"
              className="hidden"
              value="all"
              onChange={(e) => handleFilter(e.target.value)}
            />
            All
          </label>
          <label
            htmlFor="tech"
            className="hover:text-zinc-50 cursor-pointer text-sm has-[:checked]:text-zinc-50"
          >
            <input
              type="radio"
              name="filter"
              id="tech"
              className="hidden"
              value="tech"
              onChange={(e) => handleFilter(e.target.value)}
            />
            Tech
          </label>
          <label
            htmlFor="science"
            className="hover:text-zinc-50 cursor-pointer text-sm has-[:checked]:text-zinc-50"
          >
            <input
              type="radio"
              name="filter"
              id="science"
              className="hidden"
              value="science"
              onChange={(e) => handleFilter(e.target.value)}
            />
            Science
          </label>
          <label
            htmlFor="culture"
            className="hover:text-zinc-50 cursor-pointer text-sm has-[:checked]:text-zinc-50"
          >
            <input
              type="radio"
              name="filter"
              id="culture"
              className="hidden"
              value="culture"
              onChange={(e) => handleFilter(e.target.value)}
            />
            Culture
          </label>
        </div>
      </div>
      {children}
    </div>
  );
};
