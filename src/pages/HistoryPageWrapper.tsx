import { useNavigate } from "react-router-dom";
import HistoryPage from "../components/HistoryPage";
import { useArticles } from "../contexts/ArticleContext";
import type { Article } from "../types/article";

export const HistoryPageWrapper = () => {
  const navigate = useNavigate();
  const { articles, setCurrentArticle } = useArticles();

  const handleBack = () => {
    navigate("/");
  };

  const handleViewResult = (article: Article) => {
    setCurrentArticle(article);
    navigate("/result");
  };

  return (
    <HistoryPage
      articles={articles}
      onBack={handleBack}
      onViewResult={handleViewResult}
    />
  );
};
