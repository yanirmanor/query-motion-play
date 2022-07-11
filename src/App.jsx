import { Menu } from "@headlessui/react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useAnimation } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { fromFetch } from "rxjs/fetch";
import { mergeMap, takeUntil, fromEvent, delay } from "rxjs";

const clicks = fromEvent(document, "click");

const rxGetCharacters = () => {
  return fromFetch("https://rickandmortyapi.com/api/character/")
    .pipe(
      mergeMap((response) => response.json()),
      takeUntil(clicks)
    )
    .toPromise();
};

const getCharacters = async () => {
  await new Promise((r) => setTimeout(r, 500));
  const response = await fetch("https://rickandmortyapi.com/api/character/");
  return response.json();
};

const getCharacter = async (selectedChar) => {
  await new Promise((r) => setTimeout(r, 500));
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/${selectedChar}`
  );
  return response.json();
};

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyMenu />
    </QueryClientProvider>
  );
}

function usePrevious(value) {
  const previousValueRef = useRef();

  useEffect(() => {
    previousValueRef.current = value;
  }, [value]);

  return previousValueRef.current;
}

function BottomSheet({ isOpen, onClose, onOpen, characterQuery }) {
  const controls = useAnimation();
  const prevIsOpen = usePrevious(isOpen);

  useEffect(() => {
    if (prevIsOpen && !isOpen) {
      controls.start("hidden");
    } else if (!prevIsOpen && isOpen) {
      controls.start("visible");
    }
  }, [controls, isOpen, prevIsOpen]);

  function onDragEnd(event, info) {
    const shouldClose =
      info.velocity.y > 20 || (info.velocity.y >= 0 && info.point.y > 45);
    if (shouldClose) {
      controls.start("hidden");
      onClose();
    } else {
      controls.start("visible");
      onOpen();
    }
  }

  return (
    <motion.div
      drag="y"
      onDragEnd={onDragEnd}
      initial="hidden"
      animate={controls}
      transition={{
        type: "spring",
        damping: 40,
        stiffness: 400,
      }}
      variants={{
        visible: { y: 0 },
        hidden: { y: "100%" },
      }}
      dragConstraints={{ top: 0 }}
      dragElastic={0.2}
      className="bg-gray-200 w-full h-96 rounded-t-lg absolute bottom-0"
    >
      {characterQuery.isLoading ? (
        "Loading..."
      ) : (
        <motion.div
          className="w-full"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <div className="m-3 text-2xl font-bold text-center">
            {characterQuery.data.name}
          </div>
          <img
            className="w-full object-cover rounded-lg"
            src={characterQuery.data.image}
            alt="character"
          />
        </motion.div>
      )}
    </motion.div>
  );
}

export function MyMenu() {
  const [isOpen, setIsOpen] = useState(false);

  function onClose() {
    setIsOpen(false);
  }

  function onOpen() {
    setIsOpen(true);
  }

  function onToggle() {
    setIsOpen(!isOpen);
  }
  const charactersQuery = useQuery("characters", getCharacters);
  const [selectedChar, setSelectedChar] = useState(1);
  const characterQuery = useQuery(["character", selectedChar], () =>
    getCharacter(selectedChar)
  );

  // if (charactersQuery.isFetched) {
  //   async function loadMoreData() {
  //     charactersQuery.data?.results.map(
  //       async (char) =>
  //         await queryClient.prefetchQuery(
  //           ["character", char.id],
  //           () => getCharacter(char.id),
  //           {
  //             staleTime: 10 * 1000, // only prefetch if older than 10 seconds
  //           }
  //         )
  //     );
  //   }
  //   loadMoreData();
  // }
  return (
    <div className="flex gap-20">
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <div>
              <Menu.Button
                onClick={() => onClose()}
                className="inline-flex w-full justify-center rounded-md bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                <HamburgerMenuIcon
                  className="mr-2 -ml-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                  aria-hidden="true"
                />
                <div>
                  {charactersQuery.isLoading ? "Loading..." : "Options"}
                </div>
              </Menu.Button>
            </div>
            <AnimatePresence>
              {open && (
                <Menu.Items
                  as={motion.div}
                  initial={{ opacity: 0, height: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    scale: 1,
                    transition: { type: "spring", duration: 0.3 },
                  }}
                  exit={{
                    scale: 0,
                    opacity: 0,
                    height: 0,
                    transition: { duration: 0.2 },
                  }}
                  transition={{ type: "spring", duration: 0.3 }}
                  static
                  className="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  {charactersQuery.data?.results.map((char, index) => (
                    <div className="px-1 py-1" key={index}>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              onOpen();
                              setSelectedChar(char.id);
                            }}
                            onMouseEnter={async () => {
                              await queryClient.prefetchQuery(
                                ["character", char.id],
                                () => getCharacter(char.id),
                                {
                                  staleTime: 10 * 1000, // only prefetch if older than 10 seconds
                                }
                              );
                            }}
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            {char.name}
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  ))}
                </Menu.Items>
              )}
            </AnimatePresence>
          </>
        )}
      </Menu>
      {/* {characterQuery.isLoading ? (
        "Loading..."
      ) : (
        <motion.div
          className="w-56"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <div className="text-2xl">{characterQuery.data.name}</div>
          <img
            className="object-cover rounded-lg"
            src={characterQuery.data.image}
            alt="character"
          />
        </motion.div>
      )} */}
      <BottomSheet
        onOpen={onOpen}
        isOpen={isOpen}
        onClose={onClose}
        characterQuery={characterQuery}
      />
      <ReactQueryDevtools initialIsOpen />
    </div>
  );
}
