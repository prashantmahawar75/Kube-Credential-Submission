import { Link, useLocation } from "wouter";
import { Server } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="h-16 border-b border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover-elevate active-elevate-2 px-3 py-2 rounded-lg">
          <Server className="w-6 h-6 text-primary" data-testid="logo-icon" />
          <span className="text-xl font-bold text-foreground" data-testid="logo-text">
            Kube Credential
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/">
            <button
              data-testid="nav-issuance"
              className={`px-6 py-2 font-medium transition-all duration-200 rounded-lg relative ${
                location === "/" || location === "/issuance"
                  ? "text-primary"
                  : "text-muted-foreground hover-elevate"
              }`}
            >
              Issuance
              {(location === "/" || location === "/issuance") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </Link>
          <Link href="/verification">
            <button
              data-testid="nav-verification"
              className={`px-6 py-2 font-medium transition-all duration-200 rounded-lg relative ${
                location === "/verification"
                  ? "text-primary"
                  : "text-muted-foreground hover-elevate"
              }`}
            >
              Verification
              {location === "/verification" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
