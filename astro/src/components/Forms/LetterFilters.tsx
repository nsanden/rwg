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
        <div className="mb-4 space-y-3">
            <div>
                <label htmlFor="first-letter" className="font-medium text-gray-700 mr-3">
                    {firstLabel}
                </label>
                <input
                    id="first-letter"
                    type="text"
                    maxLength={1}
                    value={firstLetter}
                    onChange={(e) => setFirstLetter(e.target.value.toLowerCase())}
                    placeholder="Any"
                    className="inline-block w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    aria-label="Filter by first letter"
                />
            </div>
            <div>
                <label htmlFor="last-letter" className="font-medium text-gray-700 mr-3">
                    {lastLabel}
                </label>
                <input
                    id="last-letter"
                    type="text"
                    maxLength={1}
                    value={lastLetter}
                    onChange={(e) => setLastLetter(e.target.value.toLowerCase())}
                    placeholder="Any"
                    className="inline-block w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    aria-label="Filter by last letter"
                />
            </div>
        </div>
    );
}
