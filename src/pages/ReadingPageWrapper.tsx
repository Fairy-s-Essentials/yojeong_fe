import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ReadingPage from "../components/ReadingPage";
import { useArticles } from "../contexts/ArticleContext";
import type { Article } from "../types/article";

export const ReadingPageWrapper = () => {
  const navigate = useNavigate();
  const { currentArticle, addArticle, setCurrentArticle } = useArticles();

  // 현재 article이 없으면 대시보드로 리다이렉트
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
    setCurrentArticle(null);
    navigate("/");
  };

  if (!currentArticle) {
    return null;
  }

  return (
    <ReadingPage
      article={currentArticle}
      onComplete={handleComplete}
      onBack={handleBack}
    />
  );
};
