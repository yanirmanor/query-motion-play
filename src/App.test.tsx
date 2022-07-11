import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import App from "./App";
import preview from "jest-preview";

test("should render", () => {
  render(<App />);
  preview.debug();
  fireEvent.click(screen.getByText("upload"));
});
