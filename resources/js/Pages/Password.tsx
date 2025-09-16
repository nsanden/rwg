import SEO from '@/Components/SEO';
import { useState } from 'react';
import toast from 'react-hot-toast';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

export default function Password() {
    const {
        items: passwords,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateItems,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'passwordsFavorites',
        apiEndpoint: '/api/generate/passwords',
        itemName: 'passwords'
    });

    // Form state specific to Password page
    const [passwordLength, setPasswordLength] = useState(16);
    const [includeCapital, setIncludeCapital] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSpecialChars, setIncludeSpecialChars] = useState(true);

    // Individual special character controls
    const [selectedSpecialChars, setSelectedSpecialChars] = useState<Record<string, boolean>>({
        '.': true, ',': true, ':': true, ';': true, "'": true, '"': true, '`': true,
        '>': true, '<': true, ']': true, '[': true, '}': true, '{': true, '_': true,
        '/': true, '\\': true, '|': true, '?': true, ')': true, '(': true,
        '=': true, '+': true, '-': true, '*': true, '&': true, '%': true,
        '^': true, '$': true, '#': true, '@': true, '!': true, '~': true
    });

    const handleGeneratePasswords = () => {
        // Validate at least one character type is selected
        const hasSelectedChars = includeCapital || includeLowercase || includeNumbers ||
            (includeSpecialChars && Object.values(selectedSpecialChars).some(val => val));

        if (!hasSelectedChars) {
            toast.error('Please select at least one character type.');
            return;
        }

        const params: any = {
            quantity,
            length: passwordLength,
            include_capital: includeCapital,
            include_lowercase: includeLowercase,
            include_numbers: includeNumbers,
            include_special_chars: includeSpecialChars && Object.values(selectedSpecialChars).some(val => val)
        };

        // Only include selected_special_chars if we're actually using special characters
        if (includeSpecialChars && Object.values(selectedSpecialChars).some(val => val)) {
            params.selected_special_chars = Object.entries(selectedSpecialChars)
                .filter(([_, selected]) => selected)
                .map(([char, _]) => char);
        }

        generateItems(params);
    };

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'passwords',
        onGenerate: handleGeneratePasswords,
        setShowFavorites,
        setQuantity,
        customState: {
            passwordLength: {
                value: passwordLength,
                setter: setPasswordLength,
                defaultValue: 16
            },
            includeCapital: {
                value: includeCapital,
                setter: setIncludeCapital,
                defaultValue: true
            },
            includeLowercase: {
                value: includeLowercase,
                setter: setIncludeLowercase,
                defaultValue: true
            },
            includeNumbers: {
                value: includeNumbers,
                setter: setIncludeNumbers,
                defaultValue: true
            },
            includeSpecialChars: {
                value: includeSpecialChars,
                setter: setIncludeSpecialChars,
                defaultValue: true
            },
            selectedSpecialChars: {
                value: selectedSpecialChars,
                setter: setSelectedSpecialChars,
                defaultValue: {
                    '.': true, ',': true, ':': true, ';': true, "'": true, '"': true, '`': true,
                    '>': true, '<': true, ']': true, '[': true, '}': true, '{': true, '_': true,
                    '/': true, '\\': true, '|': true, '?': true, ')': true, '(': true,
                    '=': true, '+': true, '-': true, '*': true, '&': true, '%': true,
                    '^': true, '$': true, '#': true, '@': true, '!': true, '~': true
                } as Record<string, boolean>
            }
        }
    });

    const toggleAllSpecialChars = (selectAll: boolean) => {
        const newState = Object.keys(selectedSpecialChars).reduce((acc, char) => {
            acc[char] = selectAll;
            return acc;
        }, {} as typeof selectedSpecialChars);
        setSelectedSpecialChars(newState);
    };

    const handleSpecialCharToggle = (char: string) => {
        setSelectedSpecialChars(prev => ({
            ...prev,
            [char]: !prev[char]
        }));
    };

    const specialCharGroups = [
        ['.', ',', ':', ';', "'", '"', '`'],
        ['>', '<', ']', '[', '}', '{', '_'],
        ['/', '\\', '|', '?', ')', '('],
        ['=', '+', '-', '*', '&', '%'],
        ['^', '$', '#', '@', '!', '~']
    ];

    // Password options component for customOptions
    const passwordOptions = (
        <div className="space-y-4">
            {/* Password Length */}
            <div className="flex items-center gap-3">
                <label className="font-medium text-gray-700">
                    Length of password:
                </label>
                <input
                    type="number"
                    min="4"
                    max="128"
                    value={passwordLength}
                    onChange={(e) => setPasswordLength(parseInt(e.target.value) || 16)}
                    className="inline-block w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Length of password"
                />
            </div>

            {/* Character Type Options */}
            <div className="space-y-3">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={includeCapital}
                        onChange={(e) => setIncludeCapital(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">Capital letters (A-Z)</span>
                </label>

                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={includeLowercase}
                        onChange={(e) => setIncludeLowercase(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">Lowercase letters (a-z)</span>
                </label>

                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={includeNumbers}
                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">Numbers (0-9)</span>
                </label>

                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={includeSpecialChars}
                        onChange={(e) => setIncludeSpecialChars(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">Special characters</span>
                </label>
            </div>

            {/* Special Characters Detail */}
            {includeSpecialChars && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700">Select special characters:</h4>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => toggleAllSpecialChars(true)}
                                className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800"
                            >
                                All
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleAllSpecialChars(false)}
                                className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800"
                            >
                                None
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {specialCharGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="flex flex-wrap gap-2">
                                {group.map((char) => (
                                    <label key={char} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedSpecialChars[char]}
                                            onChange={() => handleSpecialCharToggle(char)}
                                            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-1"
                                        />
                                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                            {char}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const formPanel = (
        <BaseGeneratorForm
            title="Random Password Generator"
            itemName="Passwords"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            showLetterFilters={false}
            showSizeFilter={false}
            customOptions={passwordOptions}
            onGenerate={formState.handleGenerate}
            onReset={formState.resetOptions}
            {...formState}
        />
    );

    const resultsPanel = (
        <ItemsDisplay
            items={passwords}
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
            itemName="passwords"
        />
    );

    const articleContent = (
        <div className="space-y-6">
            <p>
                If you are looking to create a strong password for any of your accounts, creating a random password is an excellent way to protect them. This Random Password Generator will allow you to create passwords while also allowing you to determine which special characters you would like to include in the password. This will allow you to create the strongest possible password while only including the special characters you are comfortable with and will more easily remember.
            </p>

            <p>
                The key to creating a strong password these days is to include special characters as part of your password. If you only create ones with letters and numbers, they are far less secure than those which also include special characters. In fact, more and more places where you must create a password are insisting that you use at least one special character as part of your password.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">What are special characters in passwords?</h2>

            <p>
                When you're asked to set up a password, you're sometimes given parameters of the password. For example, it may need to be a minimum of eight characters long. Another common parameter is that it should contain letters, numbers and 'special characters'. A lot of people aren't exactly sure what these special characters are, but they're simply other symbols you find on a standard keyboard. These include ! @ # $ % ^ & * ( ) which all run along the top of your keyboard above the numbers. Then you have the ones down the right-hand side of your keyboard. From top to bottom they are: - _ = + [ ] { } | : ; " ' , &lt; . &gt; / ?
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Memory Games</h2>

            <p>
                Great, so now you know, but how on earth are you to remember them? While you can set up your personal gadgets with a 'remember me', what if you need to access that particular account from someone else's' machine - or you clear your browser history. Now you're in trouble. No more automatic logins.
            </p>

            <p>
                The problems with common tricks to remembering the special characters in your passwords is that these tricks make your password less secure than if the special characters were random. For example, a lot of people use the special character @ as a substitute for the letter a. In this case, they would write "trampoline" as "tr@mpoline". While this is using a special character, it doesn't help the security of the password much because hackers know this is a common substitute people make. The same can be said of substituting "!" for an "i" or an "l". Using emoticons at the beginning or end of passwords is also common.
            </p>

            <p>
                For these reasons, it's much more secure to have a random password generated even though it might be a bit more difficult to remember. If you find it easier to remember certain special characters over others, then you can select to only have those placed in the random password which should make it a bit easier to remember. The key is to understand that if you opt to use common tricks to help you remember your password over generating a random password, you're going to end up with one that is less secure.
            </p>
        </div>
    );

    return (
        <>
            <SEO
                title="Random Password Generator — Generate Strong Passwords"
                description="The Random Password Generator creates secure and strong passwords."
                keywords={['random password generator', 'password generator', 'strong passwords', 'secure passwords', 'password creator', 'password maker']}
                ogImage="https://randomwordgenerator.com/img/random-password-generator.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Random Password Generator - Generate Strong Passwords"
                currentPage="/password.php"
            >
                {{
                    formPanel,
                    resultsPanel,
                    articleContent
                }}
            </GeneratorPageLayout>
        </>
    );
}
