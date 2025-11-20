import React, { useContext, useState } from "react";
import { Sprout, Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  return (
    <>
      {/* ---------------- NAVBAR ---------------- */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-md bg-white/70 shadow-md border-b border-green-100 sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <a href="/">
            <Sprout className="text-green-600 w-9 h-9 drop-shadow-md" />
          </a>

          <a href="/">
            <span className="text-3xl font-extrabold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
              KrishiMitra
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10 text-gray-700 font-medium">
          <motion.a
            whileHover={{ scale: 1.08, color: "#16a34a" }}
            href="#features"
            className="transition-all cursor-pointer"
          >
            Features
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.08, color: "#16a34a" }}
            href="#about"
            className="transition-all cursor-pointer"
          >
            About
          </motion.a>

          {/* Logout if user logged in */}
          {user && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="px-6 py-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition-all"
            >
              Logout
            </motion.button>
          )}
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </motion.nav>

      {/* ---------------- MOBILE MENU ---------------- */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Slide-down menu */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-lg z-50 py-6 px-6 space-y-5 border-b border-green-200 rounded-b-2xl"
            >
              {/* Mobile Close Button */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Sprout className="text-green-600 w-8 h-8" />
                  <span className="text-2xl font-bold text-green-700">Menu</span>
                </div>
                <X
                  size={28}
                  className="cursor-pointer hover:text-green-600"
                  onClick={() => setMenuOpen(false)}
                />
              </div>

              <a
                href="#features"
                onClick={() => setMenuOpen(false)}
                className="block text-lg font-medium text-gray-700 hover:text-green-700"
              >
                Features
              </a>

              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="block text-lg font-medium text-gray-700 hover:text-green-700"
              >
                About
              </a>

              {user && (
                <button
                  onClick={async () => {
                    await logout();
                    setMenuOpen(false);
                  }}
                  className="w-full py-3 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700"
                >
                  Logout
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
