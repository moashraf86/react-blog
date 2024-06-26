export const Filter = ({ handleFilter }) => {
  return (
    <div className="flex items-center gap-3  text-zinc-400">
      <label
        htmlFor="all"
        className="hover:text-primary cursor-pointer text-sm has-[:checked]:text-primary"
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
        className="hover:text-primary cursor-pointer text-sm has-[:checked]:text-primary"
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
        className="hover:text-primary cursor-pointer text-sm has-[:checked]:text-primary"
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
        className="hover:text-primary cursor-pointer text-sm has-[:checked]:text-primary"
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
  );
};
