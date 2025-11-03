import { Lightbulb } from 'lucide-react';

const TipBox = ({ tip }: { tip: string }) => {
  return (
    <div className="flex w-full bg-app-orange-light border border-yellow-300 rounded-xl px-4 py-3 items-center gap-3">
      <Lightbulb className="w-6 h-6 text-app-orange shrink-0 mt-0.5" />
      <div>
        <p className="text-sm text-yellow-900">
          <strong>Tip:</strong> {tip}
        </p>
      </div>
    </div>
  );
};

export default TipBox;
