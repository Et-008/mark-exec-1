import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  DarkThemeToggle,
} from "flowbite-react";
import { Link, useLocation, useLinkClickHandler } from "react-router-dom";
import { SlidersHorizontalIcon } from "lucide-react";
import { useUserStore } from "../stores";

interface MyNavLinkProps {
  to: string;
  children: React.ReactNode;
}

export function MyNavLink({ to, children }: MyNavLinkProps) {
  const location = useLocation();
  const clickHandler = useLinkClickHandler(to);

  return (
    <NavbarLink
      href={to}
      active={location.pathname === to}
      onClick={clickHandler}
      className="h-full flex items-center"
    >
      {children}
    </NavbarLink>
  );
}

const NavbarComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = useLocation().pathname;
  const { isAuthenticated } = useUserStore();
  return (
    <>
      <Navbar
        fluid
        rounded
        theme={{
          root: {
            // base: "bg-violet-600 text-white dark:bg-gray-500 dark:text-white",
            rounded: {
              on: "rounded-lg",
              off: "rounded-none",
            },
          },
        }}
      >
        <NavbarBrand as={Link} href="/">
          <img
            src="/favicon.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite React Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            eXec
          </span>
        </NavbarBrand>
        <NavbarToggle />
        <NavbarCollapse>
          <MyNavLink to="/">Home</MyNavLink>
          <MyNavLink to="/subscription">Subscribers</MyNavLink>
          <MyNavLink to="/newsletters">Newsletters</MyNavLink>
          {isAuthenticated && (
            <MyNavLink to="/settings">
              <SlidersHorizontalIcon size={20} />
            </MyNavLink>
          )}
          <DarkThemeToggle />
        </NavbarCollapse>
      </Navbar>
      <div className="p-2 md:p-4 lg:p-8 h-[calc(100vh-64px)] w-full overflow-y-auto bg-violet-100 dark:bg-gray-900">
        {children}
      </div>
    </>
  );
};

export default NavbarComponent;
