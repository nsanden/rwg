interface SynonymTypeFilterProps {
    synonymType: string;
    setSynonymType: (type: string) => void;
}

export default function SynonymTypeFilter({ synonymType, setSynonymType }: SynonymTypeFilterProps) {
    const synonymTypes = [
        { value: 'synonym_all', label: 'All' },
        { value: 'actions', label: 'Actions' },
        { value: 'antonyms', label: 'Antonyms' },
        { value: 'descriptive', label: 'Descriptive' },
        { value: 'feelings', label: 'Feelings' },
        { value: 'negative', label: 'Negative' },
        { value: 'positive', label: 'Positive' },
        { value: 'talk_speech', label: 'Talk / Speech' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <div className="mb-4">
            <label htmlFor="synonym-type" className="font-medium text-gray-700 mr-3">
                Synonym Type:
            </label>
            <select
                id="synonym-type"
                value={synonymType}
                onChange={(e) => setSynonymType(e.target.value)}
                className="inline-block pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                aria-label="Select synonym category type"
            >
                {synonymTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                        {type.label}
                    </option>
                ))}
            </select>
        </div>
    );
}