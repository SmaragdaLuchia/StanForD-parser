import { NavLink } from "react-router-dom";

/** Primary documentation navigation, shared across every docs page. */
export const SITE_SECTIONS = [
  {
    section: "Learn",
    links: [
      { to: "/concepts", label: "Forestry Data 101" },
      { to: "/pipeline", label: "The Layered Architecture" },
    ],
  },
  {
    section: "Build",
    links: [
      { to: "/quickstart", label: "Quickstart" },
      { to: "/api", label: "API Reference" },
    ],
  },
];

export default function SiteNav() {
  return (
    <div className="space-y-6">
      {SITE_SECTIONS.map((group) => (
        <div key={group.section}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            {group.section}
          </p>
          <ul className="space-y-0.5">
            {group.links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-1.5 text-sm ${
                      isActive
                        ? "bg-pine-tint font-medium text-pine-dark"
                        : "text-muted hover:bg-surface hover:text-gunmetal"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
