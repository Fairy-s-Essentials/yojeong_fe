import { useNavigate } from "react-router-dom";
import ArticleInputPage from "../components/ArticleInputPage";
import { useArticles } from "../contexts/ArticleContext";
import type { Article } from "../types/article";

export const ArticleInputPageWrapper = () => {
  const navigate = useNavigate();
  const { setCurrentArticle } = useArticles();

  const handleSubmit = (url: string, content: string, summary: string) => {
    const newArticle: Article = {
      id: Date.now().toString(),
      url,
      title: "입력한 글",
      content,
      readingTime: 0,
      userSummary: [summary],
    };
    setCurrentArticle(newArticle);
    navigate("/reading");
  };

  const handleBack = () => {
    navigate("/");
  };

  return <ArticleInputPage onSubmit={handleSubmit} onBack={handleBack} />;
};
