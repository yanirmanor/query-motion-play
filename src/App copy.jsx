import "./App.css";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import cx from "classnames";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="inline-block text-left">
        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
          <DropdownMenu.Trigger asChild className={`relative `}>
            <div
              className={`relative bg-indigo-500 text-white py-2 px-5 rounded cursor-default flex gap-3 justify-center items-center`}
            >
              <HamburgerMenuIcon />
              <div>Trigger</div>
            </div>
          </DropdownMenu.Trigger>
          <AnimatePresence>
            {open ? (
              <DropdownMenu.Content
                className={cx(
                  "rounded-lg px-1.5 py-1 shadow-md md:w-28",
                  "bg-white dark:bg-gray-800"
                )}
                loop
                asChild
                align="end"
                sideOffset={5}
                forceMount
              >
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", duration: 0.3 },
                  }}
                  exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
                  transition={{ type: "spring", duration: 0.3 }}
                >
                  <DropdownMenu.Item
                    className={`py-2 px-8 rounded cursor-default
          focus:outline-none focus:bg-indigo-400 focus:text-white br-1`}
                  >
                    Cut
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className={`py-2 px-8 rounded cursor-default
          focus:outline-none focus:bg-indigo-400 focus:text-white br-1`}
                  >
                    Copy
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className={`py-2 px-8 rounded cursor-default
          focus:outline-none focus:bg-indigo-400 focus:text-white br-1`}
                  >
                    Paste
                  </DropdownMenu.Item>
                  {/* <DropdownMenu.Arrow
                    className="text-white"
                    fill="currentColor"
                  /> */}
                </motion.div>
              </DropdownMenu.Content>
            ) : null}
          </AnimatePresence>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}

export default App;
