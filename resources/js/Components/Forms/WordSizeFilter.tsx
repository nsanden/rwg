interface WordSizeFilterProps {
    label?: string;
    sizeType: string;
    setSizeType: (value: string) => void;
    comparing: string;
    setComparing: (value: string) => void;
    count: number;
    setCount: (value: number) => void;
}

export default function WordSizeFilter({
    label = "Word size by:",
    sizeType,
    setSizeType,
    comparing,
    setComparing,
    count,
    setCount
}: WordSizeFilterProps) {
    return (
        <div className="mb-4">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <label htmlFor="size-select" className="font-medium text-gray-700 mr-3">
                        {label}
                    </label>
                    <select
                        id="size-select"
                        value={sizeType}
                        onChange={(e) => setSizeType(e.target.value)}
                        className="inline-block pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        aria-label={`Select ${label.toLowerCase()} type`}
                    >
                        <option value="">None</option>
                        <option value="syllables">Syllables</option>
                        <option value="letters">Letters</option>
                    </select>

                    {sizeType && (
                        <div className="mt-3 flex items-center space-x-2">
                            <label htmlFor="comparing-select" className="sr-only">
                                Size comparison method
                            </label>
                            <select
                                id="comparing-select"
                                value={comparing}
                                onChange={(e) => setComparing(e.target.value)}
                                className="flex-shrink-0 pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                aria-label="Size comparison method"
                            >
                                <option value="equals">Equals</option>
                                <option value="less_than">Less Than</option>
                                <option value="greater_than">Greater Than</option>
                            </select>
                            <label htmlFor="count-input" className="sr-only">
                                Number of {sizeType}
                            </label>
                            <input
                                id="count-input"
                                type="number"
                                min="1"
                                max="20"
                                value={count}
                                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                                className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label={`Number of ${sizeType}`}
                            />
                            <span className="text-gray-600 text-sm">
                                {sizeType}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}