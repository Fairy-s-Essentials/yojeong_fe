import { createBrowserRouter, RouterProvider } from "react-router";
import { MainPage } from "../pages/MainPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
