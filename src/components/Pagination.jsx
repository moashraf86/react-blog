import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
export const Pagination = ({ paginate, currentPage, totalPosts }) => {
  let pagesNumber = Math.ceil(totalPosts / 2); // 2
  let pages = Array.from({ length: pagesNumber }, (_, i) => i + 1); // [1, 2]

  return (
    <nav>
      <ul className="flex justify-center gap-3 mb-4">
        {pages.map((page) => (
          <li key={page}>
            <button
              onClick={() => paginate(page)}
              className={`py-1 px-3 ${
                page === currentPage
                  ? "bg-zinc-50"
                  : "bg-zinc-900 hover:bg-zin-800 border-zinc-700 text-zinc-50"
              }  border border-slate-200 rounded-md font-medium`}
            >
              <Link to={`/pages/${page}`}>{page}</Link>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
