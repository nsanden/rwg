import SEO from '@/Components/SEO';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from "@/hooks/useGenerator";
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

export default function Letter() {
    const {
        words,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        favoritesKey: "wordsFavorites",
        apiEndpoint: "/api/generate/words",
        itemName: "words",
        defaultType: 'letter',
        autoGenerate: true
    });

    // Letter-specific state
    const [caseType, setCaseType] = useState('mixed');

    // Use the shared form state management hook with custom param builder
    const formState = useGeneratorForm({
        wordType: 'letter',
        onGenerate: generateWords,
        setShowFavorites,
        setQuantity,
        customParamBuilder: (baseParams) => {
            baseParams.case = caseType;
            return baseParams;
        },
        customState: {
            caseType: {
                value: caseType,
                setter: setCaseType,
                defaultValue: 'mixed'
            }
        }
    });

    // Case type options component
    const caseOptions = (
        <div className="mb-4">
            <fieldset>
                <legend className="block font-medium text-gray-700 mb-2">
                    Letter Case:
                </legend>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="case-type"
                            value="mixed"
                            checked={caseType === 'mixed'}
                            onChange={(e) => setCaseType(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Mixed Case (A-Z, a-z)</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="case-type"
                            value="uppercase"
                            checked={caseType === 'uppercase'}
                            onChange={(e) => setCaseType(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Uppercase Only (A-Z)</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="case-type"
                            value="lowercase"
                            checked={caseType === 'lowercase'}
                            onChange={(e) => setCaseType(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Lowercase Only (a-z)</span>
                    </label>
                </div>
            </fieldset>
        </div>
    );

    const formPanel = (
        <BaseGeneratorForm
            title="Random Letter Generator"
            itemName="Letters"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            showLetterFilters={false}
            showSizeFilter={false}
            customOptions={caseOptions}
            onGenerate={formState.handleGenerate}
            onReset={formState.resetOptions}
            {...formState}
        />
    );

    const resultsPanel = (
        <ItemsDisplay
            words={words}
            favorites={favorites}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            quantity={quantity}
            loading={showLoading}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            copyToClipboard={copyToClipboard}
            clearAllFavorites={clearAllFavorites}
        />
    );

    const articleContent = (
        <>
            <p>The Random Letter Generator is a free online tool that allows you to generate random letters. If you want to see letters in cursive, check our our <Link href="/cursive-letter.php" className="text-blue-600 hover:text-blue-700 underline">Cursive Letters</Link> generator instead. The process is quite easy. All you need to do is select the number of different random letters your want generated, what language alphabet you want and then if you want upper, lower or both cases displayed. Once this is done, all you need to do is hit the "Generate Random Letter" button and your random letters will appear.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">English Letters</h2>

            <p>This tool is set at default to display English letters. It can be an excellent way to teach children or students learning English as a second language the 26 letters of the alphabet. Since you have the option of choosing upper or lower case (or both), you can test knowledge of both the capitalized and lower case alphabets simply by clicking the button to reveal a new random letter once the previous one has been identified.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">French, German and Spanish</h2>

            <p>In addition to English, the tool also will generate random letters for French, German, and Spanish. All these are similar to English with their alphabets but they do contain a few more than the standard 26 English letters. These additional letters will randomly display as well if you choose German, French or Spanish as the language.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Hebrew and Greek</h2>

            <p>For those who are studying Hebrew letters and Greek letters, both the Hebrew alphabet and Greek alphabet are also available. The Greek alphabet has 24 letters while the Hebrew alphabet has 22 letters. When you select Greek from the drop down menu, you'll see random Greek Letters and when you select Hebrew, you'll see random Hebrew letters. Using the letter generator is a fun way to study both of these alphabets.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Non Latin Alphabet Letters</h2>

            <p>The tool also offers a number of random letters for non-Latin languages. These include Armenian, Chinese, Japanese, and Russian. The alphabets of all these languages look nothing like English, so using this tool can be an excellent way to study the alphabets and characters of these languages. For example, the tool has over 3000 Chinese characters and the Japanese version has all the Hiragana Japanese character letters.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Writing Creativity</h2>

            <p>This tool can be used to challenge writers to use their creativity in coming up with stories to enhance and practice their writing. For example, you can use the tool to generate 10 random letters. The writer then must write 10 <Link href="/sentence.php" className="text-blue-600 hover:text-blue-700 underline">sentences</Link> to create an interesting story with each sentence beginning with the random letter generated.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Increase Vocabulary</h2>

            <p>It can also be an excellent way to test your vocabulary when you first begin learning any of these languages. After you generate a random letter, you can use the tool to come up with as many <Link href="/" className="text-blue-600 hover:text-blue-700 underline">words</Link> as you can that begin with that letter. You can make it a bit more difficult and also use it to come up with words that end with that letter.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Word Games</h2>

            <p>If you happen to be playing a game where you are looking for words while driving or doing other activities, you can use the tool so that the letter you choose is completely random. For example, you may play a game where you say or write down as many things as you can see starting with a specific letter, and this tool will determine what that letter is for each round.</p>

            <p>While this is a simple tool, it's a great way to test your basic understanding of each language when you first begin to learn and begin to write and read it. The more you practice, the quicker you'll master each of the alphabets.</p>

            <p>The above are just a few ideas on how this tool can be used and there are surely a lot more ways individuals can incorporate this tool for their needs. We always try to make our tools as useful as possible. If there's another language you would like to see included as part of the Random Letter Generator, feel free to contact to let us know and we'll try to add it.</p>

            <div className="mt-8" id="faq">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">How many letters are in the alphabet?</h3>
                        <p>There are currently 26 letters in the English alphabet although at one time there were 27. The 26 letters range from A (the first letter) to Z (the 26th letter).</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What was the 27th letter of the alphabet?</h3>
                        <p>There are currently 26 letters in the English alphabet, but there was once a 27th letter. In fact, it still exists on computer keyboards. The 27th letter was "Et" and referred to as an "ampersand" or more commonly "and" -- it is now "&" on computer keyboards was part of the alphabet until 1835. It came after Z.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Does this generator only produce random English letters?</h3>
                        <p>While the default is for English letters, there are quite a few different letters from other languages that you can choose to generate. These include Armenian, Chinese, French, German, Greek, Hebrew, Japanese, Russian and Spanish letters in addition to English letters.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What are letter numbers?</h3>
                        <p>Letter numbers are the numbers that correspond the the placement of each letter in the alphabet. For example A has a letter number of 1 and Z has a letter number of 26. A (1), B (2), C (3), D (4), E (5), F (6), G (7), H (8), I (9), J (10), K (11), L (12), M (13), N (14), O (15), P (16), Q (17), R (18), S (19), T (20), U (21), V (22), W (23), X (24), Y (25), and Z (26)</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <SEO
                title="Random Letter Generator — Random letters from a to z"
                description="The Random Letter Generator allows you to generate random letters, English letters, capital letters and more!"
                keywords={['random letter generator', 'letters', 'random letters', 'alphabet', 'capital letters', 'lowercase letters']}
                ogImage="https://randomwordgenerator.com/img/random-letter-generator.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Random Letter Generator - Generate Random Letters"
                currentPage="/letter.php"
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
