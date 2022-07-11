// @ts-check
import "@testing-library/jest-dom/extend-expect";
import { jestPreviewConfigure } from "jest-preview";
import "./index.css";
import "./App.scss";

jestPreviewConfigure({
  autoPreview: true,
});
