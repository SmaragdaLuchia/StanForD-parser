import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Concepts from "./pages/Concepts";
import Pipeline from "./pages/Pipeline";
import Quickstart from "./pages/Quickstart";
import Api from "./pages/Api";

/** Reset scroll position when navigating between pages. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-pine focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/concepts" element={<Concepts />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/quickstart" element={<Quickstart />} />
          <Route path="/api" element={<Api />} />
        </Routes>
      </main>
      <footer className="border-t border-edge">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-muted">
          s4d_tools · forestry machine data, three clean layers.
        </div>
      </footer>
    </div>
  );
}
