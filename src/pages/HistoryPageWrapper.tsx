import { useNavigate } from "react-router-dom";
import HistoryPage from "../components/HistoryPage";
import { useArticles } from "../contexts/ArticleContext";

export const HistoryPageWrapper = () => {
  const navigate = useNavigate();
  const { articles } = useArticles();

  const handleBack = () => {
    navigate("/");
  };

  return <HistoryPage articles={articles} onBack={handleBack} />;
};
