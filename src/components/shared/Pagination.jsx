/* eslint-disable react/prop-types */
export const Pagination = ({
  paginate,
  currentPage,
  totalPosts,
  postsPerPage,
}) => {
  let pagesNumber = Math.ceil(totalPosts / postsPerPage);
  let pages = Array.from({ length: pagesNumber }, (_, i) => i + 1); // [1, 2]
  return (
    <nav>
      <ul className="flex justify-center gap-3 py-4">
        {pagesNumber > 1 &&
          pages.map((page) => (
            <li key={page}>
              <button
                onClick={() => paginate(page)}
                className={`py-1 px-3 ${
                  page === currentPage
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted  text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                } text-primary rounded-md font-medium`}
              >
                {page}
              </button>
            </li>
          ))}
      </ul>
    </nav>
  );
};
