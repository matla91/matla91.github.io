import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { profile } from "../content/portfolio";
const items = [
  ["About", "about"],
  ["Experience", "experience"],
  ["Projects", "projects"],
  ["Education", "education"],
] as const;
export default function Header({ home = false }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        menu.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            href="/"
            className="wordmark"
            aria-label="Matthis Lahargoue — home"
          >
            m<span>l</span>
            <span className="wordmark-dot">.</span>
          </a>
          <span className="header-status micro">
            <i /> RESEARCH & ENGINEERING
          </span>
          <button
            ref={menu}
            className="menu-toggle icon-button"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
          <nav
            id="main-nav"
            aria-label="Main navigation"
            className={open ? "main-nav is-open" : "main-nav"}
            onBlur={(event) => {
              if (
                !event.currentTarget.contains(event.relatedTarget) &&
                event.relatedTarget !== menu.current
              )
                setOpen(false);
            }}
          >
            {items.map(([label, id]) => (
              <a
                key={id}
                href={`${home ? "" : "/"}#${id}`}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            <a
              href={`${home ? "" : "/"}#contact`}
              className="nav-contact"
              onClick={() => setOpen(false)}
            >
              Let’s talk <ArrowUpRight size={15} />
            </a>
            <a className="nav-cv" href={profile.cv}>
              CV <ArrowUpRight size={14} />
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
