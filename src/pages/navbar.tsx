import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { useTheme } from "next-themes";
import { FaSun, FaMoon, FaChevronRight } from "react-icons/fa";
import { IconContext } from "react-icons";


export const NavBar = () => {
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const {theme, setTheme} = useTheme() as {theme:string, setTheme:(theme:string)=>void};
  const [navbar, setNavbar] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const documentHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
    };
    console.log(theme);
    window.addEventListener("resize", () => {
      documentHeight;
    });

    documentHeight();
  });
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="w-full bg-lavender  dark:bg-slate-800 shadow  ">
      {navbar && (
        <div
          className="h-full w-full bg-gray-700 z-30 absolute top-0 right-0 opacity-60"
          onClick={() => setNavbar(false)}
        ></div>
      )}
      <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8 h-16">
        <div>
          <div className="flex items-center justify-between py-3 md:py-5 md:block ">
            <a href="#">
              <h2 className="text-xl font-bold text-white">
                Leggings 4Life📚Book Club
              </h2>
            </a>
            <div className="md:hidden">
              <button
                className="p-2 rounded-md outline-none focus:ring-1 text-white "
                onClick={() => setNavbar(!navbar)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <IconContext.Provider
          value={{ className: "text-gray-200", size: "2em" }}
        >
          <div>
            <div
              className={`top-0 right-0 w-[85vw]  h-full bg-lavender dark:bg-slate-800  fixed z-40 ease-in-out duration-300 rounded-tl-xl rounded-bl-xl ${
                navbar ? "translate-x-0 " : "translate-x-full"
              }`}
            >
              <div
                className="items-center cursor-pointer fixed right-3 top-2 z-50 p-4 "
                onClick={() => setNavbar(!navbar)}
              >
                <FaChevronRight />
              </div>

              <div className="flex flex-col items-center h-full justify-between ">
                <ul className="space-y-12 w-full md:flex md:space-x-6 md:space-y-0  ">
                  <li className="pt-6 rounded-tl-xl">
                    <a
                      className="block text-2xl font-semibold text-white text-center pb-4 border-b-[2px] border-gray-200"
                      href="#"
                    >
                      PROFILE
                    </a>
                  </li>

                  <li className=" text-4xl font-semibold text-white text-center">
                    <a href="#">Home</a>
                  </li>
                  <li className=" text-4xl font-semibold text-white text-center">
                    <a href="#">Blog</a>
                  </li>
                  <li className=" text-4xl font-semibold text-white text-center">
                    <a href="#">About US</a>
                  </li>
                  <li className=" text-4xl font-semibold text-white text-center">
                    <a href="#">Contact US</a>
                  </li>
                </ul>
                <div className="flex gap-5 justify-items-center items-center h-16 ">
                  <FaSun />
                  <Switch
                    checked={enabled}
                    onChange={(val:boolean) => {
                      setEnabled(val);
                      setTheme(theme === "light" ? "dark" : "light");
                    }}
                    className={`${
                      enabled ? "bg-gray-200" : "bg-gray-200"
                    } relative inline-flex h-8 w-14 items-center rounded-full`}
                  >
                    <span className="sr-only">Enable DarkMode</span>
                    <span
                      className={`${
                        enabled ? "translate-x-1" : "translate-x-8"
                      } inline-block h-4 w-4 transform rounded-full bg-lavender dark:bg-slate-800`}
                    />
                  </Switch>
                  <FaMoon />
                </div>
              </div>
            </div>
          </div>
        </IconContext.Provider>
      </div>
    </nav>
  );
};
