interface LetterFiltersProps {
    firstLetter: string;
    setFirstLetter: (value: string) => void;
    lastLetter: string;
    setLastLetter: (value: string) => void;
    firstLabel?: string;
    lastLabel?: string;
}

export default function LetterFilters({
    firstLetter,
    setFirstLetter,
    lastLetter,
    setLastLetter,
    firstLabel = "First letter:",
    lastLabel = "Last letter:"
}: LetterFiltersProps) {
    return (
        <div className="mb-4">
            <label htmlFor="first-letter-input" className="font-medium text-gray-700 mr-3">
                {firstLabel}
            </label>
            <input
                id="first-letter-input"
                type="text"
                maxLength={1}
                value={firstLetter}
                onChange={(e) => setFirstLetter(e.target.value)}
                className="inline-block w-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mr-6"
                aria-label={firstLabel}
                placeholder="A"
            />
            <label htmlFor="last-letter-input" className="font-medium text-gray-700 mr-3">
                {lastLabel}
            </label>
            <input
                id="last-letter-input"
                type="text"
                maxLength={1}
                value={lastLetter}
                onChange={(e) => setLastLetter(e.target.value)}
                className="inline-block w-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label={lastLabel}
                placeholder="Z"
            />
        </div>
    );
}