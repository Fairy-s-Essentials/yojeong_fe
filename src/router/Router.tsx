import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardPage } from "../pages/DashboardPage";
import { ReadingPageWrapper } from "../pages/ReadingPageWrapper";
import { HistoryPageWrapper } from "../pages/HistoryPageWrapper";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
  },
  {
    path: "/reading",
    element: <ReadingPageWrapper />,
  },
  {
    path: "/history",
    element: <HistoryPageWrapper />,
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
