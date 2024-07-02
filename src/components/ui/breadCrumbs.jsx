import { useMatches } from "react-router-dom";
import { Link } from "react-router-dom";
export const BreadCrumbs = ({ className }) => {
  let matches = useMatches();
  let crumb = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => match.handle.crumb(match.data));

  return (
    <nav aria-label="breadcrumb" className={className}>
      <ol className="flex items-center gap-3 mb-4">
        {crumb.map((crumb, index) => (
          <>
            <li key={index} className="breadcrumb-item">
              <Link className="text-sm text-muted-foreground" to="/">
                Home
              </Link>
            </li>
            {/* Separator */}
            <li key={index + 1} className="breadcrumb-item">
              /
            </li>
            {/* Current Page */}
            <li key={index + 2} className="text-sm text-foreground">
              {crumb}
            </li>
          </>
        ))}
      </ol>
    </nav>
  );
};
