import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import { useArticles } from "../contexts/ArticleContext";

export const DashboardPageWrapper = () => {
  const navigate = useNavigate();
  const { articles } = useArticles();

  const handleStartReading = () => {
    navigate("/input");
  };

  const handleViewHistory = () => {
    navigate("/history");
  };

  return (
    <Dashboard
      articles={articles}
      onStartReading={handleStartReading}
      onViewHistory={handleViewHistory}
    />
  );
};
