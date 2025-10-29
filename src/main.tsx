import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Router } from "@router/Router";
import { ArticleProvider } from "./contexts/ArticleContext";
import { Toaster } from "./components/ui/feedback/sonner";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ArticleProvider>
        <Router />
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </ArticleProvider>
    </QueryClientProvider>
  </StrictMode>
);
