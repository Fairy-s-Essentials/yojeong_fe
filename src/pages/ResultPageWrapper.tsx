import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ResultPage from "../components/ResultPage";
import { useArticles } from "../contexts/ArticleContext";
import type { Article } from "../types/article";

export const ResultPageWrapper = () => {
  const navigate = useNavigate();
  const { currentArticle, setCurrentArticle, addArticle } = useArticles();

  useEffect(() => {
    if (!currentArticle) {
      navigate("/");
    }
  }, [currentArticle, navigate]);

  const handleComplete = (article: Article) => {
    addArticle(article);
    setCurrentArticle(null);
    navigate("/");
  };

  const handleBack = () => {
    navigate("/");
  };

  if (!currentArticle) {
    return null;
  }

  return (
    <ResultPage
      article={currentArticle}
      onComplete={handleComplete}
      onBack={handleBack}
    />
  );
};
