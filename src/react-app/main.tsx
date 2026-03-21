import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/react-app/index.css";

const isRootOAuthCodeReturn =
  typeof window !== "undefined" &&
  window.location.pathname === "/" &&
  new URLSearchParams(window.location.search).has("code");

if (isRootOAuthCodeReturn) {
  window.location.replace(`/auth/callback${window.location.search}`);
} else {
  import("@/react-app/App.tsx").then(({ default: App }) => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  });
}