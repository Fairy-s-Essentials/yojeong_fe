import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Router } from "@router/Router";
import { LoadingProvider } from "@/contexts";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <LoadingProvider>
      <AuthProvider>
        <Router />
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
      </LoadingProvider>
    </QueryClientProvider>
  </StrictMode>,
);
