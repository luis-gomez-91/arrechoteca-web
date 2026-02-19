import { useState } from "react"
import { Word } from '@/types/word';

interface WordCardProps {
  word: Word;
}

const WordCard = ({ word }: WordCardProps) => {
  const [expand, setExpand] = useState(false)
  const hasExamples = word.examples && word.examples.length > 0;


  return (
    <div 
      className={`bg-white p-4 rounded-lg border border-gray-200 ${
        hasExamples ? 'cursor-pointer' : ''
      }`}
      onClick={hasExamples ? () => setExpand(!expand) : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {word.word}
          </h3>
          <p className="text-gray-600 mb-3">
            {word.meaning}
          </p>

          {word.categories && word.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {word.categories.map(cat => (
                <span
                  key={cat.id}
                  className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-600"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {word.examples && word.examples.length > 0 && (
            <div className="mt-5 text-xs text-gray-500">
              {expand ? '▲ Ocultar ejemplos' : '▼ Ver ejemplos'}
            </div>
          )}

          {expand && word.examples && word.examples.length > 0 && (
            <div className="mt-3 p-3 bg-sky-50 border-l-4 border-blue-200 rounded-r-lg">
              <p className="text-sm font-semibold text-sky-800 mb-2">💡 Ejemplos:</p>
              <div className="space-y-2">
                {word.examples.map(ex => (
                  <p key={ex.id} className="text-sm text-sky-700 italic">
                    • "{ex.text}"
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WordCard