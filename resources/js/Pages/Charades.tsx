import React, { useState } from 'react';
import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

export default function Charades() {
    const [difficulty, setDifficulty] = useState('easy');

    const {
        words: charades,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords: generateCharades,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'charadesFavorites',
        apiEndpoint: '/api/generate/charades',
        itemName: 'charades',
        transformResponse: (data: any) => {
            return data.charades || [];
        }
    });

    const formState = useGeneratorForm({
        wordType: 'charade',
        onGenerate: (params) => generateCharades({ ...params, difficulty }),
        setShowFavorites,
        setQuantity
    });

    const customOptions = (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Category:
            </label>
            <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="really_hard">Really Hard</option>
                <option value="actions">Actions</option>
            </select>
        </div>
    );

    const formPanel = (
        <BaseGeneratorForm
            title="Charades Generator"
            itemName="Charade Words"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            onGenerate={formState.handleGenerate}
            onReset={formState.resetOptions}
            showLetterFilters={false}
            showSizeFilter={false}
            customOptions={customOptions}
            {...formState}
        />
    );

    const resultsPanel = (
        <ItemsDisplay
            words={charades}
            favorites={favorites}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            quantity={quantity}
            loading={showLoading}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            copyToClipboard={copyToClipboard}
            clearAllFavorites={clearAllFavorites}
            itemName="charades"
            textSize="medium"
        />
    );

    const articleContent = (
        <>
            <p>
                You likely ended up at this webpage because you're looking to play a game of charades. If that happens to be the case, we think you'll find our random charades generator of great help. One of the biggest problems when playing the game of charades is coming up with quality charades words to use in the game. The random charade words generator completely takes this issue away and makes playing charades with family or friends super easy whenever the desire to play happens.
            </p>

            <p>
                There are two simple steps to get you going. The first step is to choose the difficulty of the charade words you want to use. These range from easy to extremely hard. By being able to choose the difficulty of the words allows you to adjust the game words to the people you are playing with. This can make the game a lot more fun and a challenge compared to just random words with no difficulty level assigned to them. The last step is choosing the number of charade words you want to be generated each time. Again, this can depend on who you are playing the game with and how difficult you want to make the game. Once you have chosen the difficulty level and the number of words to show each time, all you have to do is click on the generate button and you have a random charades word to begin playing.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How Do You Play Charades?</h2>

            <p>
                Charades is a gesture and acting game. One person gets a word or phrase and then has to try to act and use gestures without making any sounds to indicate what that word or phrase is to their teammates. If the teammates are able to decipher the word through the gestures and acting, the team wins a point. What makes the game of charades so much fun is that even though the rules and concept of the game are simple when it comes to attempting to convey the word through gestures to your teammates can often be far more difficult than you imagined. This dichotomy of it appearing simple but actually being quite difficult will bring about a lot of entertainment, fun, and laughter to the game.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How many people can play charades at one time?</h2>

            <p>
                There really isn't a maximum number of people that can play charades at one time. While it's possible to play charades with as few as two people, there needs to be a minimum of three if you want a truly competitive game of charades.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How do you make teams in charades?</h2>

            <p>
                There are two common ways to split people up when playing charades. The first is when each person is their own team. In this case, one person will do the charade and all the others will try and guess the correct answer. The first person to guess correctly wins a point. Another option is to break into teams with each team having two or more players. In this case, the team gets a point when the person on their team is able to get one of the other teammates to guess the charade being done before a time limit expires. There are also a number of ways to combine these two for those who want to get creative while playing the game.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">What rules are there in charades?</h2>

            <p>
                The rules for playing charades are pretty easy and straightforward. A player for each team is chosen to try to gesture and act out a random word or phrase from the random charades word generator. The person doing this isn't allowed to make any noises or say any words out loud. If a player from the team guesses the word, the team gets a point. If the team fails to guess the word in the allotted time limit, there's no point awarded. Each team does this and the team with the most points after the designated number of rounds is declared the winning team.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Common Charades Gestures</h2>

            <p>
                If you are planning to play charades, it's good to know the common gestures that get used in the game because they can help you or your team more easily solve a lot of the charade words. These common charade gestures can help narrow down what the word is which can make guessing it a lot easier.
            </p>

            <p>
                <strong>Word Count:</strong> Indicate the number of words by holding up the corresponding number of fingers.
            </p>

            <p>
                <strong>Syllable Count:</strong> Place fingers against your forearm to indicate syllables in a word.
            </p>

            <p>
                <strong>Short/Long Words:</strong> Use thumb and index finger close together for short words, far apart for long words.
            </p>

            <p>
                <strong>Sounds Like:</strong> Cup your hand behind your ear to indicate the word sounds like another word.
            </p>

            <p>
                <strong>Plural Words:</strong> Hook your little fingers together to indicate plural.
            </p>

            <p>
                Understanding these gestures can significantly improve your team's performance in charades. The random charade word generator makes it easy to play charades anywhere, anytime, without having to worry about coming up with words yourself.
            </p>
        </>
    );

    return (
        <>
            <SEO
                title="Charades"
                description="The Charades word generator can be used to play Charades anywhere. It also has a charades word generator and catchphrase word generator options to play charades and catchphrase."
                keywords={['charades generator', 'random charades words', 'charades game', 'family games', 'party games']}
                ogImage="https://randomwordgenerator.com/img/charades.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Charades Generator"
                currentPage="/charades.php"
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