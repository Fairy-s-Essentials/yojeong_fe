import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import { useArticles } from "../contexts/ArticleContext";
import type { Article } from "../types/article";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { articles, setCurrentArticle } = useArticles();

  const handleStartReading = (url: string) => {
    const newArticle: Article = {
      id: Date.now().toString(),
      url,
      title: "AI의 미래와 인간의 역할",
      content: `인공지능 기술의 발전은 우리 사회의 모든 영역을 변화시키고 있습니다. 특히 자동화와 기계학습의 발전으로 많은 직업이 대체될 것이라는 우려가 있습니다.

하지만 역사를 되돌아보면, 새로운 기술은 항상 일자리를 대체하는 동시에 새로운 기회를 만들어왔습니다. 산업혁명 시대에도 같은 우려가 있었지만, 결과적으로는 더 많은 일자리와 더 나은 삶의 질을 가져왔습니다.

중요한 것은 AI와 경쟁하는 것이 아니라 AI를 활용하는 능력입니다. AI가 반복적이고 패턴화된 작업을 처리하는 동안, 인간은 창의성, 공감 능력, 비판적 사고와 같은 고유한 능력에 집중할 수 있습니다.

따라서 우리는 AI 시대에 대비하여 평생 학습하는 자세를 가져야 합니다. 기술적 스킬뿐만 아니라 인간만이 가진 소프트 스킬을 개발하는 것이 중요합니다.`,
      readingTime: 0,
    };
    setCurrentArticle(newArticle);
    navigate("/reading");
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
