  import { Link } from "react-router-dom";

  interface BreadcrumbItem {
    label: string;
    path?: string;
  }

  interface BreadcrumbProps {
    items: BreadcrumbItem[];
  }

  export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
      <nav className="text-sm text-black">
        <div className="flex items-center gap-2 justify-items-center">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <div key={index} className="flex items-center gap-2">
                {item.path && !isLast ? (
                  <Link
                    to={item.path}
                    className="hover:text-primary transition"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-black font-medium">
                    {item.label}
                  </span>
                )}

                {!isLast && <span className="text-black">›</span>}
              </div>
            );
          })}
        </div>
      </nav>
    );
  }