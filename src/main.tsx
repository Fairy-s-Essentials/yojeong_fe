import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Router } from "@router/Router";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoadingProvider>
          <Router />
          <ReactQueryDevtools initialIsOpen={false} />
        </LoadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
