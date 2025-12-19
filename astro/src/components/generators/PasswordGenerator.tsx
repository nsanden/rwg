import { useState } from 'react';
import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface PasswordGeneratorProps {
    basePath?: string;
}

// All special characters organized by category
const SPECIAL_CHAR_GROUPS = [
    {
        name: 'Punctuation',
        chars: [
            { char: '.', label: 'period' },
            { char: ',', label: 'comma' },
            { char: ':', label: 'colon' },
            { char: ';', label: 'semicolon' },
            { char: "'", label: 'apostrophe' },
            { char: '"', label: 'quotation mark' },
            { char: '`', label: 'backtick' },
        ]
    },
    {
        name: 'Brackets',
        chars: [
            { char: '>', label: 'greater-than' },
            { char: '<', label: 'less-than' },
            { char: ']', label: 'right bracket' },
            { char: '[', label: 'left bracket' },
            { char: '}', label: 'right brace' },
            { char: '{', label: 'left brace' },
            { char: '_', label: 'underscore' },
        ]
    },
    {
        name: 'Slashes',
        chars: [
            { char: '/', label: 'forward slash' },
            { char: '\\', label: 'backslash' },
            { char: '|', label: 'pipe' },
            { char: '?', label: 'question mark' },
            { char: ')', label: 'closing parenthesis' },
            { char: '(', label: 'opening parenthesis' },
        ]
    },
    {
        name: 'Mathematical',
        chars: [
            { char: '=', label: 'equals' },
            { char: '+', label: 'plus' },
            { char: '-', label: 'hyphen' },
            { char: '*', label: 'asterisk' },
            { char: '&', label: 'ampersand' },
            { char: '%', label: 'percent' },
        ]
    },
    {
        name: 'Symbols',
        chars: [
            { char: '^', label: 'caret' },
            { char: '$', label: 'dollar sign' },
            { char: '#', label: 'hash' },
            { char: '@', label: 'at sign' },
            { char: '!', label: 'exclamation mark' },
            { char: '~', label: 'tilde' },
        ]
    }
];

// Get all special chars as flat array
const ALL_SPECIAL_CHARS = SPECIAL_CHAR_GROUPS.flatMap(g => g.chars.map(c => c.char));

export default function PasswordGenerator({ basePath = '' }: PasswordGeneratorProps) {
    const {
        words: passwords,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords: generatePasswords,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'passwordFavorites',
        apiEndpoint: '/api/generate/passwords',
        itemName: 'passwords'
    });

    const [passwordLength, setPasswordLength] = useState(16);
    const [includeCapital, setIncludeCapital] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
    const [selectedSpecialChars, setSelectedSpecialChars] = useState<string[]>(ALL_SPECIAL_CHARS);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleGeneratePasswords = () => {
        // Validation: at least one option must be checked
        if (!includeCapital && !includeLowercase && !includeNumbers && !includeSpecialChars) {
            setValidationError('You must check at least one of the options above');
            return;
        }
        if (includeSpecialChars && selectedSpecialChars.length === 0) {
            setValidationError('You must select at least one special character');
            return;
        }
        setValidationError(null);

        generatePasswords({
            length: passwordLength,
            includeCapital,
            includeLowercase,
            includeNumbers,
            includeSpecialChars,
            specialChars: includeSpecialChars ? selectedSpecialChars : []
        });
    };

    const toggleSpecialChar = (char: string) => {
        setSelectedSpecialChars(prev =>
            prev.includes(char)
                ? prev.filter(c => c !== char)
                : [...prev, char]
        );
    };

    const selectAllSpecialChars = () => {
        setSelectedSpecialChars(ALL_SPECIAL_CHARS);
    };

    const deselectAllSpecialChars = () => {
        setSelectedSpecialChars([]);
    };

    const resetToDefaults = () => {
        setPasswordLength(16);
        setIncludeCapital(true);
        setIncludeLowercase(true);
        setIncludeNumbers(true);
        setIncludeSpecialChars(true);
        setSelectedSpecialChars(ALL_SPECIAL_CHARS);
        setValidationError(null);
    };

    const formState = useGeneratorForm({
        wordType: 'passwords',
        onGenerate: handleGeneratePasswords,
        setShowFavorites,
        setQuantity
    });

    const passwordOptions = (
        <div className="space-y-4">
            {/* Password Length */}
            <div className="flex items-center gap-3">
                <label className="font-medium text-gray-700">Length of Password:</label>
                <input
                    type="number"
                    min="4"
                    max="128"
                    value={passwordLength}
                    onChange={(e) => setPasswordLength(parseInt(e.target.value) || 16)}
                    className="inline-block w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Character Type Checkboxes */}
            <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={includeCapital}
                        onChange={(e) => setIncludeCapital(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700">Capital letters</span>
                </label>

                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={includeLowercase}
                        onChange={(e) => setIncludeLowercase(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700">Lowercase letters</span>
                </label>

                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={includeNumbers}
                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700">Numbers</span>
                </label>

                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={includeSpecialChars}
                        onChange={(e) => setIncludeSpecialChars(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700">Special Characters</span>
                </label>

                {/* Special Character Selection - shown when Special Characters is checked */}
                {includeSpecialChars && (
                    <div className="ml-6 mt-3 p-4 bg-gray-50 rounded-md border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-600">Select special characters:</span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={selectAllSpecialChars}
                                    className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                >
                                    Select All
                                </button>
                                <button
                                    type="button"
                                    onClick={deselectAllSpecialChars}
                                    className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                >
                                    Deselect All
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {SPECIAL_CHAR_GROUPS.map((group) => (
                                <div key={group.name}>
                                    <div className="text-xs font-medium text-gray-500 mb-2">{group.name}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {group.chars.map(({ char, label }) => (
                                            <label
                                                key={char}
                                                className={`inline-flex items-center justify-center w-8 h-8 rounded cursor-pointer text-sm font-mono transition-all ${
                                                    selectedSpecialChars.includes(char)
                                                        ? 'bg-brand-teal text-white shadow-sm'
                                                        : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                                                }`}
                                                title={label}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSpecialChars.includes(char)}
                                                    onChange={() => toggleSpecialChar(char)}
                                                    className="sr-only"
                                                />
                                                {char}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Validation Error */}
            {validationError && (
                <div className="text-red-600 text-sm font-medium">
                    {validationError}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BaseGeneratorForm
                        title="Random Password Generator"
                        itemName="Passwords"
                        quantity={quantity}
                        setQuantity={setQuantity}
                        loading={loading}
                        showLetterFilters={false}
                        showSizeFilter={false}
                        showNoDuplicates={false}
                        customOptions={passwordOptions}
                        onGenerate={handleGeneratePasswords}
                        onReset={() => {
                            resetToDefaults();
                            formState.resetOptions();
                        }}
                        {...formState}
                    />

                    <div className="w-full">
                        <ItemsDisplay
                            words={passwords}
                            favorites={favorites}
                            showFavorites={showFavorites}
                            setShowFavorites={setShowFavorites}
                            quantity={quantity}
                            loading={showLoading}
                            addToFavorites={addToFavorites}
                            removeFromFavorites={removeFromFavorites}
                            copyToClipboard={copyToClipboard}
                            clearAllFavorites={clearAllFavorites}
                            fontFamily="mono"
                            onReset={() => {
                                resetToDefaults();
                                formState.resetOptions();
                                generatePasswords({
                                    length: 16,
                                    includeCapital: true,
                                    includeLowercase: true,
                                    includeNumbers: true,
                                    includeSpecialChars: true,
                                    specialChars: ALL_SPECIAL_CHARS
                                });
                            }}
                        />
                    </div>
                </div>

                <div id="RWG_Below_Generator_Mobile_300px" className="md:hidden google-ad-container flex justify-center mt-8" style={{ height: '280px', maxWidth: '336px', margin: '2rem auto' }}>
                    <div id="div-gpt-ad-1578531360465-0" className="text-center"></div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        <ArticleContent>
                            <p>If you are looking to create a strong password for any of your accounts, creating a random password is an excellent way to protect them. This Random Password Generator will allow you to create passwords while also allowing you to determine which special characters you would like to include in the password. This will allow you to create the strongest possible password while only including the special characters you are comfortable with and will more easily remember.</p>

                            <p>The key to creating a strong password these days is to include special characters as part of your password. If you only create ones with letters and numbers, they are far less secure than those which also include special characters. In fact, more and more places where you must create a password are insisting that you use at least one special character as part of your password.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">What are special characters in passwords?</h2>

                            <p>When you're asked to set up a password, you're sometimes given parameters of the password. For example, it may need to be a minimum of eight characters long. Another common parameter is that it should contain letters, numbers and 'special characters'. A lot of people aren't exactly sure what these special characters are, but they're simply other symbols you find on a standard keyboard. These include ! @ # $ % ^ &amp; * ( ) which all run along the top of your keyboard above the numbers. Then you have the ones down the right-hand side of your keyboard. From top to bottom they are: - _ = + [ ] {'{}'} | : ; " ' , &lt; . &gt; / ?</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Memory Games</h2>

                            <p>Great, so now you know, but how on earth are you to remember them? While you can set up your personal gadgets with a 'remember me', what if you need to access that particular account from someone else's machine - or you clear your browser history. Now you're in trouble. No more automatic logins.</p>

                            <p>The problems with common tricks to remembering the special characters in your passwords is that these tricks make your password less secure than if the special characters were random. For example, a lot of people use the special character @ as a substitute for the letter a. In this case, they would write "trampoline" as "tr@mpoline". While this is using a special character, it doesn't help the security of the password much because hackers know this is a common substitute people make. The same can be said of substituting "!" for an "i" or an "l". Using emoticons at the beginning or end of passwords is also common.</p>

                            <p>For these reasons, it's much more secure to have a random password generated even though it might be a bit more difficult to remember. If you find it easier to remember certain special characters over others, then you can select to only have those placed in the random password which should make it a bit easier to remember. The key is to understand that if you opt to use common tricks to help you remember your password over generating a random password, you're going to end up with one that is less secure.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Frequently Asked Questions</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">How long should my password be?</h3>
                                    <p>We recommend at least 12 characters for most accounts, and 16+ characters for sensitive accounts like banking or email.</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Should I use the same password for multiple accounts?</h3>
                                    <p>No, you should use a unique password for each account. If one account is compromised, using unique passwords prevents hackers from accessing your other accounts.</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">How can I remember complex passwords?</h3>
                                    <p>Consider using a password manager to securely store your passwords. This allows you to use strong, unique passwords for every account without having to memorize them all.</p>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/password" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
