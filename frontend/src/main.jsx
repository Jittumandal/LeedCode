import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import AppRoutes from "./Routes/AppRoutes";
import { ThemeProvider } from "./ThemeContext";
import "./index.css";
import "@mantine/core/styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AppRoutes />
        </MantineProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
