import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const {token,setToken,userData}=useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false);
  const logout =()=>{
    setToken(false)
    localStorage.removeItem('token')

  }
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />

      {/* Desktop Navigation Links */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          {({ isActive }) => (
            <>
              <li className="py-1">HOME</li>
              <hr className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${isActive ? 'block' : 'hidden'}`} />
            </>
          )}
        </NavLink>

        <NavLink to="/doctors">
          {({ isActive }) => (
            <>
              <li className="py-1">ALL DOCTORS</li>
              <hr className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${isActive ? 'block' : 'hidden'}`} />
            </>
          )}
        </NavLink>

        <NavLink to="/about">
          {({ isActive }) => (
            <>
              <li className="py-1">ABOUT</li>
              <hr className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${isActive ? 'block' : 'hidden'}`} />
            </>
          )}
        </NavLink>

        <NavLink to="/contact">
          {({ isActive }) => (
            <>
              <li className="py-1">CONTACT</li>
              <hr className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${isActive ? 'block' : 'hidden'}`} />
            </>
          )}
        </NavLink>
      </ul>

      {/* User Actions / Token handling */}
      <div className="flex items-center gap-4">
        {
        token && userData
        ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={userData.image} alt="Profile" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={logout}
                  className="hover:text-black cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="Menu"
        />

        {/* Mobile Menu Drawer */}
        <div
          className={`fixed top-0 right-0 bottom-0 z-20 overflow-hidden bg-white transition-all duration-300 md:hidden ${
            showMenu ? 'w-full' : 'w-0'
          }`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="Logo" />
            <img
              className="w-7 cursor-pointer"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt="Close"
            />
          </div>

          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/"
              className="px-4 py-2 rounded inline-block w-full text-center hover:text-primary transition-colors"
            >
              HOME
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/doctors"
              className="px-4 py-2 rounded inline-block w-full text-center hover:text-primary transition-colors"
            >
              ALL DOCTORS
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/about"
              className="px-4 py-2 rounded inline-block w-full text-center hover:text-primary transition-colors"
            >
              ABOUT
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/contact"
              className="px-4 py-2 rounded inline-block w-full text-center hover:text-primary transition-colors"
            >
              CONTACT
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;