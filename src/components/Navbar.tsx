import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

const NavbarItem = ({
  title,
  className,
}: {
  title: string;
  className: string | null;
}) => {
  return <li className={cn("mx-4 cursor-pointer", className)}>{title}</li>;
};

const navs: string[] = ["Market", "Exchange", "Tutorials", "Wallets"];

import { cn } from "@/lib/utils";
import { useState } from "react";
function Navbar() {
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  return (
    <nav
      className={cn(
        "w-full flex md:justify-center justify-between items-center p-4"
      )}
    >
      <div
        className={cn("md:flex-[0.5] flex-initial justify-center items-center")}
      >
        <img
          draggable={false}
          src="/logo.png"
          alt="logo"
          className={cn("w-32 cursor-pointer")}
        />
      </div>
      <ul
        className={cn(
          "text-white md:flex hidden list-none flex-row justify-between items-center flex-initial"
        )}
      >
        {navs.map((n) => (
          <NavbarItem key={n} title={n} className={""} />
        ))}
        <li
          className={cn(
            "bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]"
          )}
        >
          Login
        </li>
      </ul>
      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in animate-slide-out"
          >
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {navs.map((n) => (
              <NavbarItem key={n} title={n} className={"my-2 text-lg"} />
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
