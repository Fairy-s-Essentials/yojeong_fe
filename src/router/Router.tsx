import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardPageWrapper } from "../pages/DashboardPageWrapper";
import { ArticleInputPageWrapper } from "../pages/ArticleInputPageWrapper";
import { ReadingPageWrapper } from "../pages/ReadingPageWrapper";
import { ResultPageWrapper } from "../pages/ResultPageWrapper";
import { HistoryPageWrapper } from "../pages/HistoryPageWrapper";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPageWrapper />,
  },
  {
    path: "/input",
    element: <ArticleInputPageWrapper />,
  },
  {
    path: "/reading",
    element: <ReadingPageWrapper />,
  },
  {
    path: "/result",
    element: <ResultPageWrapper />,
  },
  {
    path: "/history",
    element: <HistoryPageWrapper />,
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
