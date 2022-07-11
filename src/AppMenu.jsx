import { useAnimation } from "framer-motion";
import { AnimateSharedLayout } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useQuery, QueryClient, QueryClientProvider } from "react-query";

const links = [
  { label: "Home", url: "home" },
  { label: "Messages", url: "messages" },
  { label: "Profile", url: "profile" },
];
function Nav() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <AnimateSharedLayout>
      <nav>
        <motion.ul className="fixed inset-x-0 bottom-0 h-16 bg-purple-500 flex justify-around items-center">
          {links.map(({ label, url }, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.li key={index} onClick={() => setActiveIndex(index)}>
                <motion.a className="relative rounded-lg" href={"#" + url}>
                  {isActive ? (
                    <motion.span
                      layoutId="shadow"
                      className="absolute bg-black"
                    />
                  ) : null}
                  <span
                  // className={`p-5 ${
                  //   isActive ? "bg-black text-white" : "bg-white text-black"
                  // }`}
                  >
                    {label}
                  </span>
                </motion.a>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>
    </AnimateSharedLayout>
  );
}

export default function App() {
  return (
    <div className="h-full w-full relative overflow-hidden scroll-smooth">
      <Nav />
      <div id="home" className="flex w-full h-full bg-green-300">
        Home
      </div>
      <div id="messages" className="flex w-full h-full bg-red-400">
        messages
      </div>
      <div id="profile" className="flex w-full h-full bg-blue-300">
        profile
      </div>
    </div>
  );
}
