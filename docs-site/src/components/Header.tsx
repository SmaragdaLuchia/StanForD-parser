import { NavLink } from "react-router-dom";
import Logo from "./Logo";

const NAV = [
  { to: "/concepts", label: "Concepts" },
  { to: "/pipeline", label: "Pipeline" },
  { to: "/quickstart", label: "Quickstart" },
  { to: "/api", label: "API" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-alabaster/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-6">
        <NavLink to="/" className="flex items-center gap-2.5" aria-label="s4d_tools home">
          <Logo />
          <span className="font-mono text-[15px] font-medium">s4d_tools</span>
        </NavLink>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-pine-tint text-pine-dark"
                        : "text-muted hover:bg-surface hover:text-gunmetal"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
