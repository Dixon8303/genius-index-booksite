import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { lazy, Suspense } from "react";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

// Deployed under /genius-index-booksite/ (a GitHub Pages project site, not
// the root <user>.github.io repo) -- wouter needs to know that prefix or
// every route "matches nothing" and falls through to NotFound. Derived from
// Vite's own BASE_URL so there's one source of truth for the subpath.
const ROUTER_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// Product pages are lazy so the marketing home keeps its original bundle;
// the assessment engine + content libraries load only when someone enters
// the app side.
const Assessment = lazy(() => import("./pages/Assessment"));
const Results = lazy(() => import("./pages/Results"));
const Profile = lazy(() => import("./pages/Profile"));
const Protocol = lazy(() => import("./pages/Protocol"));
const Braids = lazy(() => import("./pages/Braids"));
const Domains = lazy(() => import("./pages/Domains"));

function LazyFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "oklch(0.10 0.008 285)",
        color: "oklch(0.72 0.14 75)",
        fontFamily: "'Lato', sans-serif",
        letterSpacing: "0.2em",
        fontSize: 12,
        textTransform: "uppercase",
      }}
    >
      Loading…
    </div>
  );
}

function Router() {
  return (
    <WouterRouter base={ROUTER_BASE}>
      <Suspense fallback={<LazyFallback />}>
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/assessment"} component={Assessment} />
          <Route path={"/results"} component={Results} />
          <Route path={"/results/:id"} component={Results} />
          <Route path={"/profile"} component={Profile} />
          <Route path={"/protocol"} component={Protocol} />
          <Route path={"/braids"} component={Braids} />
          <Route path={"/braids/:slug"} component={Braids} />
          <Route path={"/domains"} component={Domains} />
          <Route path={"/domains/:id"} component={Domains} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </WouterRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
