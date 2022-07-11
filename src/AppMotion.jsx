import React from "react";
import { motion, useAnimation } from "framer-motion";
import { createMachine } from "xstate";
import { useMachine } from "@xstate/react";
import "./App.scss";
import { Graph } from "./graph.jsx";

const uploadMachine = createMachine({
  id: "upload-machine",
  initial: "idle",
  states: {
    idle: {
      invoke: {
        src: "stopHover",
      },
      on: {
        MOUSE_ENTER: "hover",
      },
    },
    hover: {
      invoke: {
        src: "startHover",
      },
      on: {
        MOUSE_EXIT: "idle",
        CLICK: "uploading",
      },
    },
    uploading: {
      invoke: {
        src: "loading",
        onDone: { target: "uploaded" },
      },
    },
    uploaded: {
      invoke: {
        src: "upload",
        onDone: { target: "idle" },
      },
    },
  },
});

const iconHoveredVariants = {
  hovered: {
    y: [0, -2, 0, 2, 0],
    transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" },
  },
};
export default function App() {
  const hoverControls = useAnimation();
  const uploadControls = useAnimation();
  const loadingControls = useAnimation();
  const doneControls = useAnimation();
  const loaderControls = useAnimation();
  const loadingBarControls = useAnimation();

  const startHover = () => {
    hoverControls.start("hovered");
  };
  const stopHover = () => {
    hoverControls.stop();
  };
  const loading = async () => {
    uploadControls.start({
      zIndex: 1,
    });
    await loadingControls.start({
      top: 0,
      transition: { duration: 0.3 },
    });
    loadingBarControls.start({
      width: "100%",
      transition: { duration: 1.35 },
    });
    loaderControls.start({
      rotate: 360,
      transition: { repeat: Infinity, ease: "linear", duration: 0.5 },
    });
    uploadControls.start({
      top: "-100%",
      transition: { duration: 0 },
    });
  };
  const upload = async () => {
    await doneControls.start({
      top: 0,
      transition: { delay: 1.5, duration: 0.3 },
    });
    loadingControls.start({
      top: "-100%",
      transition: { duration: 0 },
    });
    loadingBarControls.start({
      width: "0%",
    });

    await uploadControls.start({
      top: 0,
      zIndex: 4,
      transition: { delay: 1, duration: 0.3 },
    });
    doneControls.start({
      top: "-100%",
      transition: { duration: 0 },
    });
  };

  const [state, send] = useMachine(uploadMachine, {
    services: {
      loading,
      upload,
      startHover,
      stopHover,
    },
  });

  console.log("state", state.value);

  return (
    <div className="upload-button p-10">
      <div
        className="my-wrapper"
        onClick={() => send("CLICK")}
        onMouseEnter={() => send("MOUSE_ENTER")}
        onMouseLeave={() => send("MOUSE_EXIT")}
      >
        <motion.div className="container upload" animate={uploadControls}>
          <motion.i
            className="fas fa-angle-double-up"
            animate={hoverControls}
            variants={iconHoveredVariants}
          />
          <div>upload</div>
        </motion.div>
        <motion.div className="container loading" animate={loadingControls}>
          <motion.div className="loader" animate={loaderControls} />
          <div>loading</div>
          <motion.div className="loading-bar" animate={loadingBarControls} />
        </motion.div>

        <motion.div className="container done" animate={doneControls}>
          <i className="fas fa-check" />
          <div>done</div>
        </motion.div>
      </div>
    </div>
  );
}
