import { useState } from 'react';
import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface CharadesGeneratorProps {
    basePath?: string;
}

export default function CharadesGenerator({ basePath = '' }: CharadesGeneratorProps) {
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
            <label htmlFor="difficulty" className="font-medium text-gray-700 mr-3">
                Category:
            </label>
            <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="inline-block pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="really_hard">Really Hard</option>
                <option value="actions">Actions</option>
            </select>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BaseGeneratorForm
                        title="Charades Generator"
                        itemName="Charade Words"
                        quantity={quantity}
                        setQuantity={setQuantity}
                        loading={loading}
                        showLetterFilters={false}
                        showSizeFilter={false}
                        customOptions={customOptions}
                        onGenerate={formState.handleGenerate}
                        onReset={() => {
                            setDifficulty('easy');
                            formState.resetOptions();
                        }}
                        {...formState}
                    />

                    <div className="w-full">
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
                            onReset={() => {
                                setDifficulty('easy');
                                formState.resetAndGenerate();
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
                            <p>You likely ended up at this webpage because you're looking to play a game of charades. If that happens to be the case, we think you'll find our random charades generator of great help. One of the biggest problems when playing the game of charades is coming up with quality charades words to use in the game. The random charade words generator completely takes this issue away and makes playing charades with family or friends super easy whenever the desire to play happens.</p>

                            <p>There are two simple steps to get you going. The first step is to choose the difficulty of the charade words you want to use. These range from easy to extremely hard. By being able to choose the difficulty of the words allows you to adjust the game words to the people you are playing with. This can make the game a lot more fun and a challenge compared to just random words with no difficulty level assigned to them. The last step is choosing the number of charade words you want to be generated each time. Again, this can depend on who you are playing the game with and how difficult you want to make the game. Once you have chosen the difficulty level and the number of words to show each time, all you have to do is click on the generate button and you have a random charades word to begin playing.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How Do You Play Charades?</h2>

                            <p>Charades is a gesture and acting game. One person gets a word or phrase and then has to try to act and use gestures without making any sounds to indicate what that word or phrase is to their teammates. If the teammates are able to decipher the word through the gestures and acting, the team wins a point. What makes the game of charades so much fun is that even though the rules and concept of the game are simple when it comes to attempting to convey the word through gestures to your teammates can often be far more difficult than you imagined. This dichotomy of it appearing simple but actually being quite difficult will bring about a lot of entertainment, fun, and laughter to the game.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How many people can play charades at one time?</h2>

                            <p>There really isn't a maximum number of people that can play charades at one time. While it's possible to play charades with as few as two people, there needs to be a minimum of three if you want a truly competitive game of charades.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How do you make teams in charades?</h2>

                            <p>There are two common ways to split people up when playing charades. The first is when each person is their own team. In this case, one person will do the charade and all the others will try and guess the correct answer. The first person to guess correctly wins a point. Another option is to break into teams with each team having two or more players. In this case, the team gets a point when the person on their team is able to get one of the other teammates to guess the charade being done before a time limit expires. There are also a number of ways to combine these two for those who want to get creative while playing the game.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">What rules are there in charades?</h2>

                            <p>The rules for playing charades are pretty easy and straightforward. A player for each team is chosen to try to gesture and act out a random word or phrase from the random charades word generator. The person doing this isn't allowed to make any noises or say any words out loud. If a player from the team guesses the word, the team gets a point. If the team fails to guess the word in the allotted time limit, there's no point awarded. Each team does this and the team with the most points after the designated number of rounds is declared the winning team.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How long do players have to guess in charades?</h2>

                            <p>The general default time period to guess a charade word is 3 minutes. This isn't set in stone. You can adjust the time period to less or more depending on the group you're playing with and how difficult you want to make the game. As long as all teams abide by the same time period, any designated time limit is acceptable when playing charades.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Where are common charades gestures you can use?</h2>

                            <p>If you are planning to play charades, it's good to know the common gestures that get used in the game because they can help you or your team more easily solve a lot of the charade words. These common charade gestures can help narrow down what the word is which can make guessing it a lot easier. Below you will find some of the more common charades gestures you're likely to see or you'll want to use to help your team do better.</p>

                            <p><strong>Word Count:</strong> Charades can be a single word or they can be a short phrase. Knowing the number of words that need to be guessed can make solving the charade much easier. You can indicate the number of words your team is guessing by simply holding up the number of fingers that corresponds to the number of words in the charade.</p>

                            <p><strong>Syllable Count:</strong> Much in the same way it can be an advantage to know the number of words in a charade, it can also be advantageous to know the number of syllables in a word of a charade as this can greatly narrow down the possibilities. You can place the number of fingers against your forearm to indicate the number of syllables of a word.</p>

                            <p><strong>Short Words:</strong> Knowing if a charade word is short can make it much easier to guess. You can indicate that the charade word your team is trying to guess is short by placing your thumb and index finger close to each other.</p>

                            <p><strong>Long Words:</strong> Knowing if a charade word is long will also give teammates an advantage when trying to guess it. To indicate a word is long, you can hold your thumb and index finger far apart from each other.</p>

                            <p><strong>Words That Sound Alike:</strong> If you happen to have a difficult charade word, one of the ways to help increase the chances of your teammates getting it is to let them know it sounds like another word. This is especially helpful if the word it sounds like is fairly easy for your teammates to guess. The way to indicate that your charade word sounds like another word is to hold your cupped hand behind your ear.</p>

                            <p><strong>Plural Words:</strong> Plural words can often be difficult for teammates to guess because most assume the word will be singular. If you need to advise your teammates that the charade word is plural, you can indicate this by hooking your little fingers together.</p>

                            <p>It can pay huge dividends to take a few minutes to make sure all of the people playing on your team understand these common charade gestures. While it may not seem like much, these common gestures can make it significantly easier to guess words and help your team do much better, especially compared to those who don't know or understand these gestures.</p>

                            <p>In the end, you should have a great time playing charades. The random charade word generator is a simple and convenient way to make the game go a lot more quickly and make the words generated fairer. Not having to worry about what words to use for your game of charades and being able to generate them instantly from your phone is a convenient way to play charades no matter where you happen to be.</p>

                            <p>We're always looking for ways to improve our generators to make them the best that they can be. If you have a suggestion or idea that you think would make the charades generator more useful for those playing the game, we'd love to hear your suggestion. Take a moment and contact us. The more input we get about this free online tool, the more improvements we can make to it so that it's useful to as many people as possible who want to play charades.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What are good charades words?</h3>
                                        <p>Good charades words are ones that can be acted out but aren't too easy or too hard for your group. Our generator offers different difficulty levels so you can find the perfect challenge. Easy words work great for kids or beginners, while harder words provide a challenge for experienced players.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can you talk during charades?</h3>
                                        <p>No, the person acting out the charade cannot speak or make any sounds. All communication must be done through gestures, body movements, and facial expressions. This is what makes charades challenging and fun!</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What's the difference between charades and Pictionary?</h3>
                                        <p>In charades, you act out the word using gestures and body movements without speaking. In Pictionary, you draw the word on paper without speaking or using letters or numbers. Both are great party games that test your communication skills in different ways.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">How many rounds should we play?</h3>
                                        <p>A typical game of charades consists of 5-10 rounds per team, but this can be adjusted based on your group size and available time. The key is to give everyone a chance to act and ensure the game doesn't go on too long.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/charades" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
