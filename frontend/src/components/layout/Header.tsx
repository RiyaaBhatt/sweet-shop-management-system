import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  Moon,
  Sun,
  Heart,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import {
  toggleTheme,
  toggleMobileMenu,
  toggleSearch,
} from "@/store/slices/uiSlice";
import { logout } from "@/store/slices/authSlice";
import { toggleCart } from "@/store/slices/cartSlice";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, mobileMenuOpen } = useAppSelector((state) => state.ui);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { itemsCount } = useAppSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo */}
        <div className="mr-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-hero flex items-center justify-center">
              <span className="text-white font-bold text-sm">🍯</span>
            </div>
            <span className="font-heading text-xl font-bold text-primary">
              Sweet Delights
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          <Link
            to="/"
            className="transition-colors hover:text-primary text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="transition-colors hover:text-primary text-muted-foreground hover:text-foreground"
          >
            Products
          </Link>

          <Link
            to="/about"
            className="transition-colors hover:text-primary text-muted-foreground hover:text-foreground"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="transition-colors hover:text-primary text-muted-foreground hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Search */}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {/* Cart - hide for admin users */}
          {user?.role !== "admin" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                // Navigate to cart page on click. If user holds shift, toggle the cart drawer instead.
                if ((e as React.MouseEvent).shiftKey) {
                  dispatch(toggleCart());
                } else {
                  navigate("/cart");
                }
              }}
              className="relative z-50"
            >
              <ShoppingCart className="h-4 w-4" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {itemsCount}
                </span>
              )}
            </Button>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <span className="hidden sm:block text-sm text-muted-foreground">
                Hello
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
              {user?.role === "admin" && (
                <Button variant="sweet" size="sm" asChild>
                  <Link to="/admin">Admin Panel</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="sweet" size="sm" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => dispatch(toggleMobileMenu())}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => dispatch(toggleMobileMenu())}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => dispatch(toggleMobileMenu())}
              >
                Products
              </Link>
              <Link
                to="/categories"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => dispatch(toggleMobileMenu())}
              >
                Categories
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => dispatch(toggleMobileMenu())}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => dispatch(toggleMobileMenu())}
              >
                Contact
              </Link>
            </nav>

            {!isAuthenticated && (
              <div className="flex flex-col space-y-2 pt-3 border-t">
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    to="/login"
                    onClick={() => dispatch(toggleMobileMenu())}
                  >
                    Login
                  </Link>
                </Button>
                <Button variant="sweet" size="sm" asChild>
                  <Link
                    to="/register"
                    onClick={() => dispatch(toggleMobileMenu())}
                  >
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
