












import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, LogOut } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/first-aid", label: "First Aid" },
    { to: "/emergency", label: "Emergency" },
    { to: "/hospitals", label: "Hospitals" },
    { to: "/profile", label: "My Profile" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-sm">
      <nav className="container mx-auto px-4 md:px-8 lg:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center  gap-2 focus:outline-none  rounded"
        >
          <Heart className="h-8 w-8 text-emergency" fill="currentColor" />
          <span className="text-xl md:text-2xl font-extrabold tracking-wide text-foreground select-none">
            Emergency Aid
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              aria-current={location.pathname === to ? "page" : undefined}
              className={`relative text-lg font-medium transition-colors duration-200  focus:outline-none rounded ${
                location.pathname === to
                  ? "text-emergency"
                  : "text-foreground/80 "
              }`}
            >
              {label}
              {location.pathname === to && (
                <span className="absolute bottom-[-6px] left-0 right-0 h-1 bg-emergency rounded-full" />
              )}
            </Link>
          ))}

          {currentUser ? (
            <Button
              onClick={logout}
              className="bg-emergency px-5 py-2 text-sm font-semibold flex items-center gap-2 rounded-md shadow-md hover:bg-emergency/90 transition"
              aria-label="Sign Out"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          ) : (
            <Link
              to="/register"
              className="focus:outline-none focus:ring-2 focus:ring-emergency rounded"
            >
              <Button className="bg-emergency px-5 py-2 text-sm font-semibold rounded-md shadow-md hover:bg-emergency/90 transition">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emergency"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-background/95 backdrop-blur-md border-t border-foreground/10 shadow-lg overflow-hidden transition-max-height duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-4 px-6 py-6">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={location.pathname === to ? "page" : undefined}
              className={`block text-base font-medium rounded-md py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emergency ${
                location.pathname === to
                  ? "text-emergency bg-emergency/10"
                  : "text-foreground/80 hover:text-emergency hover:bg-emergency/10"
              }`}
            >
              {label}
            </Link>
          ))}

          {currentUser ? (
            <Button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-emergency py-2 mt-2 text-sm font-semibold rounded-md shadow-md hover:bg-emergency/90 transition flex justify-center items-center gap-2"
              aria-label="Sign Out"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          ) : (
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-emergency py-2 mt-2 text-sm font-semibold rounded-md shadow-md hover:bg-emergency/90 transition">
                Sign In
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;


















