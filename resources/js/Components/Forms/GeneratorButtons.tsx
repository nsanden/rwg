import { RefreshCw } from 'lucide-react';

interface GeneratorButtonsProps {
    onGenerate: () => void;
    onReset: () => void;
    loading?: boolean;
    generateLabel?: string;
    resetLabel?: string;
    disabled?: boolean;
    formRef?: React.RefObject<HTMLFormElement>;
}

export default function GeneratorButtons({
    onGenerate,
    onReset,
    loading = false,
    generateLabel = "Generate Random Words",
    resetLabel = "Reset",
    disabled = false,
    formRef
}: GeneratorButtonsProps) {

    const handleReset = () => {
        // Reset form elements if formRef is provided
        if (formRef?.current) {
            formRef.current.reset();
        }

        onReset(); // Let the caller handle toast
    };
    return (
        <div className="flex gap-3 mt-6">
            <button
                type="submit"
                onClick={(e) => { e.preventDefault(); onGenerate(); }}
                disabled={loading || disabled}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-medium"
                aria-label={generateLabel}
            >
                {loading ? (
                    <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                        Generating...
                    </>
                ) : (
                    <>
                        <RefreshCw className="w-5 h-5 mr-2" aria-hidden="true" />
                        {generateLabel}
                    </>
                )}
            </button>
            <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={resetLabel}
            >
                {resetLabel}
            </button>
        </div>
    );
}