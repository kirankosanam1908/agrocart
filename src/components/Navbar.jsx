import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Place Order", path: "/order" },
    { label: "Track Order", path: "/status" },
    { label: "Admin", path: "/admin" },
  ];

  return (
    <nav className="bg-primary/90 backdrop-blur text-white shadow-lg fixed w-full z-50 transition-all duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand */}
        <h1 className="text-2xl font-bold tracking-wider">
          <Link to="/" className="hover:text-accent transition duration-300">
            AgriCart
          </Link>
        </h1>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
          {navItems.map(({ label, path }, idx) => (
            <Link
              key={idx}
              to={path}
              className="relative group transition duration-300 font-semibold hover:text-accent hover:scale-105 transform"
            >
              {label}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-accent transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none transition-transform duration-200"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-primary/95 backdrop-blur-lg overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen
            ? "max-h-96 py-4 px-6 space-y-3 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        {navItems.map(({ label, path }, idx) => (
          <Link
            key={idx}
            to={path}
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium tracking-wide hover:text-accent hover:scale-105 transition duration-300 transform"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
