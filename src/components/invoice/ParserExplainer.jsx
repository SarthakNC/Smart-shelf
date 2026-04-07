import { Lightbulb, Sparkles, ArrowRight } from 'lucide-react';

export default function ParserExplainer() {
  return (
    <div className="card-base bg-gradient-to-br from-purple-50/80 to-blue-50/50 border-purple-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-purple-600" />
        </div>
        <h3 className="font-heading text-sm font-semibold text-purple-900">AI Invoice Parser</h3>
      </div>

      <div className="space-y-3 text-sm text-purple-800/80">
        <p>
          Paste your supplier's invoice text — even if it's messy or unformatted — and our parser
          will automatically extract item names, quantities, and prices.
        </p>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-purple-700">1</span>
            </div>
            <p>Paste raw invoice text in the box</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-purple-700">2</span>
            </div>
            <p>Click "Parse Invoice" and review extracted items</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-purple-700">3</span>
            </div>
            <p>Edit if needed, then add items to your inventory</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 text-xs font-medium text-purple-600">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Confidence scores show how sure the parser is about each extraction</span>
        </div>
      </div>
    </div>
  );
}
