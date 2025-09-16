import React, { useState, useEffect, useRef } from 'react';
import SEO from '@/Components/SEO';
import GeneratorLayout from '@/Layouts/GeneratorLayout';
import ArticleContent from '@/Components/Shared/ArticleContent';
import OtherGenerators from '@/Components/Shared/OtherGenerators';
import SocialShareBlock from '@/Components/Shared/SocialShareBlock';
import ErrorBoundary from '@/Components/ErrorBoundary';
import GeneratorButtons from '@/Components/Forms/GeneratorButtons';
import { Plus, Minus, Share2, RefreshCw, Copy, Heart } from 'lucide-react';
import FavoriteButton from '@/Components/Shared/FavoriteButton';
import CopyButton from '@/Components/Shared/CopyButton';
import { toast } from 'react-hot-toast';

interface NameData {
    male?: Array<{ name: string; numSyllables?: number }>;
    female?: Array<{ name: string; numSyllables?: number }>;
    surname?: Array<{ name: string; numSyllables?: number }>;
    names?: Array<{ name: string; numSyllables?: number }>;
}

export default function Name() {
    const [nameSource, setNameSource] = useState<'database' | 'custom'>('database');
    const [category, setCategory] = useState('real');
    const [subCategory, setSubCategory] = useState('any');
    const [gender, setGender] = useState('both');
    const [quantity, setQuantity] = useState(1);
    const [customNames, setCustomNames] = useState('');
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    // Advanced options
    const [firstNameFirstLetter, setFirstNameFirstLetter] = useState('');
    const [firstNameLastLetter, setFirstNameLastLetter] = useState('');
    const [lastNameFirstLetter, setLastNameFirstLetter] = useState('');
    const [lastNameLastLetter, setLastNameLastLetter] = useState('');
    const [firstNameSizeType, setFirstNameSizeType] = useState('syllables');
    const [lastNameSizeType, setLastNameSizeType] = useState('syllables');
    const [firstNameComparison, setFirstNameComparison] = useState('equals');
    const [lastNameComparison, setLastNameComparison] = useState('equals');
    const [firstNameSize, setFirstNameSize] = useState('');
    const [lastNameSize, setLastNameSize] = useState('');

    // Results and favorites
    const [names, setNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [favorites, setFavorites] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('nameGeneratorFavorites');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [showFavorites, setShowFavorites] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (favorites.length > 0) {
            localStorage.setItem('nameGeneratorFavorites', JSON.stringify(favorites));
        }
    }, [favorites]);

    // Auto-generate a name when the page first loads
    useEffect(() => {
        generateNames();
    }, []); // Empty dependency array means this runs once on mount


    const generateNames = async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        if (nameSource === 'custom') {
            // Generate from custom list
            const customNameList = customNames.split('\n').filter(name => name.trim());
            if (customNameList.length === 0) {
                toast.error('Please enter some names to pick from');
                return;
            }

            const selectedNames: string[] = [];
            const actualQuantity = Math.min(quantity, customNameList.length);

            for (let i = 0; i < actualQuantity; i++) {
                const randomIndex = Math.floor(Math.random() * customNameList.length);
                selectedNames.push(customNameList[randomIndex]);
            }

            setNames(selectedNames);
            setShowFavorites(false);
            return;
        }

        setLoading(true);
        setShowFavorites(false);
        const loadingTimer = setTimeout(() => setShowLoading(true), 300);

        try {
            abortControllerRef.current = new AbortController();

            const params = new URLSearchParams({
                quantity: quantity.toString(),
                category,
                subCategory,
                gender,
                ...(firstNameFirstLetter && { firstNameFirstLetter }),
                ...(firstNameLastLetter && { firstNameLastLetter }),
                ...(lastNameFirstLetter && { lastNameFirstLetter }),
                ...(lastNameLastLetter && { lastNameLastLetter }),
                ...(firstNameSizeType && { firstNameSizeType }),
                ...(lastNameSizeType && { lastNameSizeType }),
                ...(firstNameComparison && { firstNameComparison }),
                ...(lastNameComparison && { lastNameComparison }),
                ...(firstNameSize && { firstNameSize }),
                ...(lastNameSize && { lastNameSize }),
            });

            const response = await fetch(`/api/generate/names?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate names');
            }

            const data = await response.json();
            setNames(data.names || []);

        } catch (error: any) {
            if (error.name === 'AbortError') return;

            let friendlyMessage = 'Failed to generate names. Please try again.';
            if (error.message === 'RATE_LIMIT_ERROR') {
                friendlyMessage = 'Please wait a moment before generating more names.';
            }

            toast.error(friendlyMessage);
            console.error('Error generating names:', error);
        } finally {
            clearTimeout(loadingTimer);
            setLoading(false);
            setShowLoading(false);
            abortControllerRef.current = null;
        }
    };

    const resetOptions = () => {
        setNameSource('database');
        setCategory('real');
        setSubCategory('any');
        setGender('both');
        setQuantity(1);
        setCustomNames('');
        setFirstNameFirstLetter('');
        setFirstNameLastLetter('');
        setLastNameFirstLetter('');
        setLastNameLastLetter('');
        setFirstNameSizeType('syllables');
        setLastNameSizeType('syllables');
        setFirstNameComparison('equals');
        setLastNameComparison('equals');
        setFirstNameSize('');
        setLastNameSize('');
        // Don't clear names - keep current display
        setShowFavorites(false);
        toast.success('Options reset to defaults');
    };

    const addToFavorites = (name: string) => {
        if (!favorites.includes(name)) {
            setFavorites([...favorites, name]);
            toast.success(`Added "${name}" to favorites`);
        }
    };

    const removeFromFavorites = (name: string) => {
        setFavorites(favorites.filter(f => f !== name));
        toast.success(`Removed "${name}" from favorites`);
    };

    const clearFavorites = () => {
        setFavorites([]);
        localStorage.removeItem('nameGeneratorFavorites');
        toast.success('All favorites cleared');
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Copied to clipboard');
        } catch (err) {
            toast.error('Failed to copy');
        }
    };

    const copyAllToClipboard = async () => {
        const textToCopy = (showFavorites ? favorites : names).join('\n');
        await copyToClipboard(textToCopy);
    };

    const displayNames = showFavorites ? favorites : names;

    return (
        <GeneratorLayout>
            <SEO
                title="Random Name Generator — Easy Random Name Picker"
                description="The Random Name Generator creates random names including girl names, boy names, baby names and last names. Use this random name picker to create the best names for your characters."
                keywords={['random name generator', 'names', 'random names', 'baby names', 'character names', 'first names', 'last names']}
                ogImage="https://randomwordgenerator.com/img/random-name-generator.jpg"
                ogType="website"
            />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Left Column - Form */}
                        <ErrorBoundary>
                            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-center !min-h-[250px] sm:!min-h-[413px]">
                                <div className="flex flex-col">
                                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Random Name Generator</h1>

                                {/* Number of Names */}
                                <div className="mb-4">
                                    <label htmlFor="quantity" className="font-medium">
                                        Number of Names:
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                                        className="ml-2 w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="1"
                                        max="100"
                                        aria-label={`Generate ${quantity} names`}
                                    />
                                </div>

                                {/* Name Source Selection */}
                                <div className="mb-4">
                                    <fieldset>
                                        <legend className="block font-medium text-gray-700 mb-2">
                                            Name Type:
                                        </legend>
                                        <div className="space-y-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="name-source"
                                                    value="database"
                                                    checked={nameSource === 'database'}
                                                    onChange={() => setNameSource('database')}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-gray-700">
                                                    Generate random{' '}
                                                    <select
                                                        value={category}
                                                        onChange={(e) => {
                                                            setCategory(e.target.value);
                                                            setSubCategory('any');
                                                        }}
                                                        className="inline-block pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                                    >
                                                        <option value="real">Real Names</option>
                                                        <option value="fantasy">Fantasy Names</option>
                                                        <option value="place">Fantasy Places</option>
                                                        <option value="pop-culture">Pop Culture</option>
                                                    </select>
                                                    {' from '}
                                                    <select
                                                        value={subCategory}
                                                        onChange={(e) => setSubCategory(e.target.value)}
                                                        className="inline-block pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                                    >
                                                        {category === 'real' && (
                                                            <>
                                                                <option value="any">Anywhere</option>
                                                                <option value="austria">Austria</option>
                                                                <option value="canada">Canada</option>
                                                                <option value="china">China</option>
                                                                <option value="england">England</option>
                                                                <option value="germany">Germany</option>
                                                                <option value="greece">Greece</option>
                                                                <option value="italy">Italy</option>
                                                                <option value="japan">Japan</option>
                                                                <option value="malaysia">Malaysia</option>
                                                                <option value="mexico">Mexico</option>
                                                                <option value="netherlands">Netherlands</option>
                                                                <option value="poland">Poland</option>
                                                                <option value="portugal">Portugal</option>
                                                                <option value="russia">Russia</option>
                                                                <option value="spain">Spain</option>
                                                                <option value="thailand">Thailand</option>
                                                                <option value="turkey">Turkey</option>
                                                                <option value="united-states">United States</option>
                                                            </>
                                                        )}
                                                        {category === 'fantasy' && (
                                                            <>
                                                                <option value="any">Any</option>
                                                                <option value="dragon">Dragon</option>
                                                                <option value="elf">Elf</option>
                                                                <option value="evil">Evil</option>
                                                                <option value="gnome">Gnome</option>
                                                                <option value="hobbit">Hobbit</option>
                                                                <option value="orc">Orc</option>
                                                                <option value="pirate">Pirate</option>
                                                                <option value="robot">Robot</option>
                                                                <option value="superhero">Superhero</option>
                                                                <option value="super-villain">Super Villain</option>
                                                                <option value="troll">Troll</option>
                                                                <option value="vampire">Vampire</option>
                                                                <option value="witch">Witch</option>
                                                                <option value="wizard">Wizard</option>
                                                            </>
                                                        )}
                                                        {category === 'place' && (
                                                            <>
                                                                <option value="any">Any</option>
                                                                <option value="city-and-town">Cities and Towns</option>
                                                                <option value="company">Companies</option>
                                                                <option value="country">Countries</option>
                                                                <option value="kingdom">Kingdoms</option>
                                                                <option value="lake">Lakes</option>
                                                                <option value="ocean">Oceans</option>
                                                                <option value="park">Parks</option>
                                                                <option value="school">Schools</option>
                                                                <option value="street">Streets</option>
                                                                <option value="world">Worlds</option>
                                                            </>
                                                        )}
                                                        {category === 'pop-culture' && (
                                                            <>
                                                                <option value="any">Any</option>
                                                                <option value="diablo">Diablo</option>
                                                                <option value="dungeons-and-dragons">Dungeons and Dragons</option>
                                                                <option value="elder-scrolls">Elder Scrolls</option>
                                                                <option value="game-of-thrones">Game of Thrones</option>
                                                                <option value="harry-potter">Harry Potter</option>
                                                                <option value="lord-of-the-rings">Lord of the Rings</option>
                                                                <option value="pokemon">Pokemon</option>
                                                                <option value="voltron">Voltron</option>
                                                            </>
                                                        )}
                                                    </select>
                                                </span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="name-source"
                                                    value="custom"
                                                    checked={nameSource === 'custom'}
                                                    onChange={() => setNameSource('custom')}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-gray-700">Pick a random name from my list</span>
                                            </label>
                                        </div>
                                    </fieldset>
                                </div>

                                {/* Custom Names Input */}
                                {nameSource === 'custom' && (
                                    <div className="mb-4">
                                        <p className="mb-2 font-medium">Input your names:</p>
                                        <textarea
                                            value={customNames}
                                            onChange={(e) => setCustomNames(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={5}
                                            placeholder="Margery Robertson&#10;Brooke Perkins&#10;Cruz Salas&#10;Molly Proctor"
                                        />
                                    </div>
                                )}

                                {/* Gender Selection */}
                                {nameSource === 'database' && category === 'real' && (
                                    <div className="mb-4">
                                        <fieldset>
                                            <legend className="block font-medium text-gray-700 mb-2">
                                                Gender:
                                            </legend>
                                            <div className="flex gap-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="male"
                                                        checked={gender === 'male'}
                                                        onChange={() => setGender('male')}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="ml-2 text-gray-700">Male</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="female"
                                                        checked={gender === 'female'}
                                                        onChange={() => setGender('female')}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="ml-2 text-gray-700">Female</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="both"
                                                        checked={gender === 'both'}
                                                        onChange={() => setGender('both')}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="ml-2 text-gray-700">Both</span>
                                                </label>
                                            </div>
                                        </fieldset>
                                    </div>
                                )}

                                {/* Basic Options - Always Visible */}
                                {nameSource === 'database' && category === 'real' && (
                                    <div className="space-y-4">
                                        {/* First Name Basic Options */}
                                        <div className="border border-gray-200 rounded-md p-4">
                                            <p className="font-medium mb-3 text-gray-700 underline">First Name</p>
                                            <div className="mb-3">
                                                <label htmlFor="firstname-first-letter" className="inline-block mr-2">First letter:</label>
                                                <input
                                                    type="text"
                                                    id="firstname-first-letter"
                                                    value={firstNameFirstLetter}
                                                    onChange={(e) => setFirstNameFirstLetter(e.target.value.slice(0, 1).toUpperCase())}
                                                    className="w-12 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    maxLength={1}
                                                />

                                                <label htmlFor="firstname-last-letter" className="inline-block ml-4 mr-2">Last letter:</label>
                                                <input
                                                    type="text"
                                                    id="firstname-last-letter"
                                                    value={firstNameLastLetter}
                                                    onChange={(e) => setFirstNameLastLetter(e.target.value.slice(0, 1).toLowerCase())}
                                                    className="w-12 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    maxLength={1}
                                                />
                                            </div>
                                        </div>

                                        {/* Last Name Basic Options */}
                                        <div className="border border-gray-200 rounded-md p-4">
                                            <p className="font-medium mb-3 text-gray-700 underline">Last Name</p>
                                            <div className="mb-3">
                                                <label htmlFor="lastname-first-letter" className="inline-block mr-2">First letter:</label>
                                                <input
                                                    type="text"
                                                    id="lastname-first-letter"
                                                    value={lastNameFirstLetter}
                                                    onChange={(e) => setLastNameFirstLetter(e.target.value.slice(0, 1).toUpperCase())}
                                                    className="w-12 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    maxLength={1}
                                                />

                                                <label htmlFor="lastname-last-letter" className="inline-block ml-4 mr-2">Last letter:</label>
                                                <input
                                                    type="text"
                                                    id="lastname-last-letter"
                                                    value={lastNameLastLetter}
                                                    onChange={(e) => setLastNameLastLetter(e.target.value.slice(0, 1).toLowerCase())}
                                                    className="w-12 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    maxLength={1}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Advanced Options - Hidden by default */}
                                {nameSource === 'database' && category === 'real' && (
                                    <div className={`${showMoreOptions ? 'block' : 'hidden'} space-y-4`}>
                                        {/* First Name Advanced Options */}
                                        <div className="border border-gray-200 rounded-md p-4">
                                            <p className="font-medium mb-3 text-gray-700 underline">First Name - Advanced</p>
                                            <div>
                                                <p className="mb-2">Name size by:</p>
                                                <div className="pl-4 space-y-2">
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            checked={firstNameSizeType === 'syllables'}
                                                            onChange={() => setFirstNameSizeType('syllables')}
                                                            className="mr-2"
                                                        />
                                                        Number of Syllables
                                                    </label>
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            checked={firstNameSizeType === 'length'}
                                                            onChange={() => setFirstNameSizeType('length')}
                                                            className="mr-2"
                                                        />
                                                        Name Length
                                                    </label>

                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={firstNameComparison}
                                                            onChange={(e) => setFirstNameComparison(e.target.value)}
                                                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="equals">Equals</option>
                                                            <option value="less_than">Less Than</option>
                                                            <option value="greater_than">Greater Than</option>
                                                        </select>
                                                        <input
                                                            type="number"
                                                            value={firstNameSize}
                                                            onChange={(e) => setFirstNameSize(e.target.value)}
                                                            className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            min="1"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Last Name Advanced Options */}
                                        <div className="border border-gray-200 rounded-md p-4">
                                            <p className="font-medium mb-3 text-gray-700 underline">Last Name - Advanced</p>
                                            <div>
                                                <p className="mb-2">Name size by:</p>
                                                <div className="pl-4 space-y-2">
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            checked={lastNameSizeType === 'syllables'}
                                                            onChange={() => setLastNameSizeType('syllables')}
                                                            className="mr-2"
                                                        />
                                                        Number of Syllables
                                                    </label>
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            checked={lastNameSizeType === 'length'}
                                                            onChange={() => setLastNameSizeType('length')}
                                                            className="mr-2"
                                                        />
                                                        Name Length
                                                    </label>

                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={lastNameComparison}
                                                            onChange={(e) => setLastNameComparison(e.target.value)}
                                                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="equals">Equals</option>
                                                            <option value="less_than">Less Than</option>
                                                            <option value="greater_than">Greater Than</option>
                                                        </select>
                                                        <input
                                                            type="number"
                                                            value={lastNameSize}
                                                            onChange={(e) => setLastNameSize(e.target.value)}
                                                            className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            min="1"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="mt-auto pt-4">
                                    <GeneratorButtons
                                        onGenerate={generateNames}
                                        onReset={resetOptions}
                                        loading={loading}
                                        generateLabel="Generate Random Names"
                                    />
                                </div>

                                {/* Mobile Options Toggle */}
                                {nameSource === 'database' && (
                                    <div className="sm:hidden mt-4 flex justify-between items-center">
                                        <button
                                            onClick={() => setShowMoreOptions(!showMoreOptions)}
                                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                            {showMoreOptions ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                            {showMoreOptions ? 'Less Options' : 'More Options'}
                                        </button>
                                        <button
                                            onClick={() => setShowShareModal(true)}
                                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            Share
                                        </button>
                                    </div>
                                )}

                                {/* Social Share Block */}
                                <SocialShareBlock
                                    url={typeof window !== 'undefined' ? window.location.href : ''}
                                    title="Random Name Generator - Generate Creative Names"
                                    isExpanded={showShareModal}
                                    setIsExpanded={setShowShareModal}
                                />
                                </div>
                            </div>
                        </ErrorBoundary>

                        {/* Right Column - Results */}
                        <ErrorBoundary>
                            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col relative !min-h-[250px] sm:!min-h-[413px]">
                                {/* Header with buttons */}
                                <div className="flex justify-end items-center mb-6">
                                    <div className="flex items-center gap-2">
                                        {favorites.length > 0 && (
                                            <button
                                                onClick={() => setShowFavorites(!showFavorites)}
                                                className={`group flex items-center gap-1 text-sm px-3 py-2 rounded ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                                                aria-pressed={showFavorites}
                                            >
                                                {showFavorites ? (
                                                    <Heart className="w-5 h-5 fill-red-500 text-red-500" aria-hidden="true" />
                                                ) : (
                                                    <>
                                                        <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" aria-hidden="true" />
                                                        ({favorites.length})
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        <button
                                            onClick={copyAllToClipboard}
                                            className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded touch-manipulation"
                                        >
                                            <Copy className="w-5 h-5 transition-colors" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>

                                {loading && showLoading ? (
                                    <div className="flex-1 flex items-center justify-center" role="status" aria-live="polite">
                                        <RefreshCw className="w-8 h-8 text-gray-500 animate-spin" />
                                    </div>
                                ) : displayNames.length > 0 ? (
                                    <>
                                        {displayNames.length === 1 && !showFavorites ? (
                                            // Single name display - large format
                                            <div className="flex-1 flex items-center -translate-y-8">
                                                <div className="w-full text-center">
                                                    <div className="flex items-baseline justify-center gap-3 w-full">
                                                        <div
                                                            className="font-bold text-gray-800 max-w-full text-5xl"
                                                            style={{ lineHeight: '1.1' }}
                                                        >
                                                            {displayNames[0]}
                                                        </div>
                                                        <FavoriteButton
                                                            item={displayNames[0]}
                                                            isFavorited={favorites.includes(displayNames[0])}
                                                            onAdd={addToFavorites}
                                                            onRemove={removeFromFavorites}
                                                            itemLabel={displayNames[0]}
                                                            size="lg"
                                                            className="self-center"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // Multiple names or favorites display - list format
                                            <>
                                                <div className="space-y-2 overflow-y-auto flex-1" role="list" aria-label="List of names">
                                                    {displayNames.map((name, index) => (
                                                        <div
                                                            key={`${name}-${index}`}
                                                            className="group p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                                                            role="listitem"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="text-gray-800 font-medium">{name}</div>
                                                                </div>
                                                                <div className="flex items-center gap-2 ml-3">
                                                                    <CopyButton
                                                                        text={name}
                                                                        onCopy={copyToClipboard}
                                                                        size="sm"
                                                                    />
                                                                    <FavoriteButton
                                                                        item={name}
                                                                        isFavorited={favorites.includes(name)}
                                                                        onAdd={addToFavorites}
                                                                        onRemove={removeFromFavorites}
                                                                        showFavorites={showFavorites}
                                                                        itemLabel={name}
                                                                        size="sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {favorites.length > 0 && showFavorites && (
                                                    <div className="mt-4 text-right">
                                                        <button
                                                            onClick={clearFavorites}
                                                            className="text-sm px-3 py-1 rounded text-gray-600 hover:text-red-600 transition-colors"
                                                        >
                                                            Clear List
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-gray-500">
                                        {showFavorites ? 'No favorites yet' : 'Click generate to create names'}
                                    </div>
                                )}
                            </div>
                        </ErrorBoundary>
                    </div>

                    {/* About Section */}
                    <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
                            <ArticleContent>
                                <p>For those who are looking to create a random name or who are looking for a name randomizer, the Random Name Generator is the perfect tool for you. The tool is quite easy to use. The first step is to choose the actual way you want to use it. There are two distinct ways it can be used depending on whether you want to create entirely new random names or if you want to use a name randomizer as a name picker from a list of names you already have.</p>

                                <p>The name randomizer from a list is pretty simple and straightforward. Once you choose it, a box will appear and all you need to do is paste your list of names into the name randomizer. The first way this can be used is as a random name picker. In this case, you choose the number of names you want to appear. For example, if you're picking a single winner from a list of names, you would choose "1" and the one name generated would be the winner. If you wanted the random name picker to choose two winners, you would choose "2" and two names from the list would appear. Another example of using this as a name picker is if you want to make two teams out of a list of names. If you had 30 people on the list and you wanted two teams, you would choose "15" and the fifteen random names that showed up from the list would be one team while the other 15 names would be the other team.</p>

                                <p>Another option is to use the name randomizer to randomize all the names on your list. In this case, you aren't using it as a random name picker, but as a true name randomizer. For example, if you have a list of 20 students that you want to put into a random order, you would choose "20" and all of the students' names would appear in random order. This can be a great way to assign the names on the list to something specific. For example, if you have a list of chores for your kids to do and they are complaining that you don't assign the chores fairly, you can use the name randomizer to make those assignments. It can be useful for school student assignments and work-related assignments as well where it's important for the assignment to be fair and random.</p>

                                <p>The other use for this tool is as an actual new name generator. In this case, the first step is to choose the number of random names you want to be displayed. You then need to indicate whether you want female names, male names, or a combination of the two. Finally, you get to decide if you want only first names, last names, or full names. Once you've made these choices, you hit the "Generate Random Names" button and a list will appear. The tool has thousands of girl names and boy names, as well as thousands of last names. Together, they can create hundreds of thousands of random names.</p>

                                <p>People who stumble across this free name generator often wonder why it's better than the typical way to find names in a baby book or from a long list of names on a website. There are a few distinct advantages that come with using this free online name tool that you can't get with a name book or long list of names. Most importantly, you have the option to specify the exact types of names you want to see which isn't possible in a name book or from a list of names. For example, if you only want to see girl names or boy names that begin with the letter "S" you can indicate that on this name generator to get exactly the names you want.</p>

                                <p>A second benefit of this generator over traditional ways to search for names is that you get to determine the exact number of results you want to read each time. Long lists and books filled with boy and girl names can easily become overwhelming. It can then be difficult to give each name the proper consideration it deserves. By seeing names in bunches that are easier for you to digest, you're much more likely to find the perfect name with the Random Name Generator than with other ways of searching for names.</p>

                                <p>The above-mentioned two benefits can make this random name generator a wonderful way to search for any number of types of names you may need. The best way to see if this free name tool would benefit your name search is to spend some time using it. Another option is to read some of the many different ways people who visit this name generator commonly use it.</p>

                                <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Character Names</h2>

                                <p>Those writing novels or other books may need to come up with various character names. Coming up with the perfect name for a minor or secondary character can often be difficult, but using this tool as a character name generator can make doing so a lot easier. Creating random results is a great way to brainstorm character names. Seeing random names can also help the author find the perfect character name for each particular character in their stories to make their writing the best it can be.</p>

                                <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Baby Names</h2>
                                <p>Looking through pages and pages of baby names can be quite tiring and frustrating. For soon-to-be parents, it's sometimes more effective to have random girl names or random boy names appear in smaller random groups. In this way, this tool can become a wonderful baby name generator. This will give you the chance to read the baby names listed individually to see if each sounds and looks perfect. Being able to choose specifically between baby girl names and baby boy names can also make the process a lot less overwhelming.</p>

                                <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Create a Nickname</h2>
                                <p>Using this random name generator can be a wonderful way to create a new nickname for yourself or your friends. With the option of choosing the first and last letters, along with the number of syllables, you should be able to find fun nicknames that perfectly fit your needs. Using this tool as a random nickname generator and seeing the random nicknames it produces should help inspire your creativity so that you can find the best nickname for your situation.</p>

                                <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Pet Names</h2>
                                <p>For those who are looking to come up with a unique name for their pet, going through a list of random names can be a wonderful way to brainstorm to ultimately find perfect pet names. The Random Name Generator instantly transforms into a pet name generator. It doesn't matter what type of pet you're searching for. The generator will help you find great dog names, wonderful cat names, interesting bird names, and the perfect name for any other pet you may have.</p>

                                <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Pen Names</h2>
                                <p>There may be times when you don't want to use your real name when writing an article, book, or column. This free online generator can be a great way to create a new identity through a pen name. The fun aspect is that even if you're a man, you can choose a female name, or if you're a woman, you can choose a male name as your pen name. There are a lot of people who write under pen names and if you decide that finding a pen name is correct for you, you want to spend time thinking about different pen names so you finally settle on one that's perfect for you.</p>

                                <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Website Signups</h2>
                                <p>It's common to have to sign up with websites these days, but there will be times when you want to sign up but you don't necessarily want to give your real name in the process. Coming up with a new name to use for these purposes is a way to solve this problem. In fact, you may want to create a unique name for each time you create a new account. By doing this you can see how each site uses your information since the random name you use is unique to that specific website.</p>

                                <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Online Activity</h2>
                                <p>There are many people who are online who wish to keep their identity secret for a variety of legitimate reasons. For those who don't use their real name, finding a random name is important so they can remain anonymous. Again, it can often make sense to create a number of random names for online activity specific to certain groups or websites you frequent so you can follow exactly how your information is being used.</p>

                                <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Change Your Name</h2>
                                <p>If you have a name that you don't like or you come from a foreign country where your given name is difficult for English speakers to pronounce, coming up with an alternative name to go by makes a lot of sense. The fun part is that you get to name yourself which most people never get the chance to do. You should spend a lot of time considering which random name best suits you and your personality since it's a name you will likely use for a long time. Creating a new name for yourself can make life easier for you and those around you.</p>

                                <p>This is by no means a comprehensive list of all the ways the Random Names Generator can be used. The above are just a few examples of why someone might use this online name generator. We always try to make our online tools as useful as they can be. If you have ideas on how we could make this tool better, please contact us.</p>

                                <div className="mt-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">How do you pick a random name?</h3>
                                            <p>It's actually quite simple to pick a random name with our name generator, and you have a lot of options that you can utilize to get the perfect name. You can choose a female name or a male name (or both), choose what letters if any you want the first name and last name to begin with, and indicate the number of syllables in the name and the length of the name you want. All these options allow you to narrow the name and pick a random name that's best for your specific needs. Then all you do is press the generate button and you will be given a list of names with your specific qualifications. That's how simple it is to pick a random name.</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">What are good fake names?</h3>
                                            <p>Good fakes names are names that bring a character or person to life. A good fake name for one character may be a terrible fake name for another. Understanding the character and their overall personality will go a long way to finding a good fake name for them. Generating random names is an excellent way to find good fake names.</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I use the names I find with this name generator?</h3>
                                            <p>Yes! Feel free to use any of the names that you find will fit your needs that come from this random name generator.</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Why are their so many naming options?</h3>
                                            <p>Depending on where you are in your search for a name, you may be broadly or narrowly looking at names. When you first begin you often are just looking for ideas and therefore don't need many options, but as you narrow down what exactly you want in a name, having options can help quite a bit to find that perfect name. You don't have to use the option available, but they're there for those who do.</p>
                                        </div>
                                    </div>
                                </div>
                            </ArticleContent>

                            <OtherGenerators currentPage="/name.php" />
                        </div>
                    </div>
                </div>
            </div>
        </GeneratorLayout>
    );
}