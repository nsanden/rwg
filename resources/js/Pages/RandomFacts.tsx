import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

export default function RandomFacts() {
    const {
        words: facts,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords: generateFacts,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'randomFactsFavorites',
        apiEndpoint: '/api/generate/facts',
        itemName: 'facts',
        transformResponse: (data: any) => {
            return data.facts || [];
        }
    });

    const formState = useGeneratorForm({
        onGenerate: generateFacts,
        setShowFavorites,
        setQuantity,
        wordType: 'fact'
    });

    const formPanel = (
        <BaseGeneratorForm
            title="Random Facts Generator"
            itemName="Facts"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            onGenerate={formState.handleGenerate}
            onReset={formState.resetOptions}
            showLetterFilters={false}
            showSizeFilter={false}
            {...formState}
        />
    );

    const resultsPanel = (
        <ItemsDisplay
            words={facts}
            favorites={favorites}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            quantity={quantity}
            loading={showLoading}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            copyToClipboard={copyToClipboard}
            clearAllFavorites={clearAllFavorites}
            itemName="facts"
            textSize="medium"
        />
    );

    const articleContent = (
        <>
            <p>If you're looking for random facts, you've arrived at the correct webpage. The Random Fact Generator has thousands of facts ready to be revealed with a simple click of a mouse. Even better, all the random fun facts also come with a source link so that you know they're true.</p>

            <p>Random facts can be quite useful for a number of different reasons. While many people believe random facts are simply to entertain, they can be much more useful than most people give them credit for. If you've never thought about the benefits of random facts and whether or not you should take time to familiarize yourself with them, we encourage you to take a moment to read through the below examples to see if any might be applicable to you.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Interesting Facts</h2>

            <p>Random interesting facts are exactly that: facts that are interesting. They can be useful to know for a variety of reasons. The can provide an excellent conversation starter when you meet someone new. They can also be used to diffuse a tense situation and get people to laugh or even be amazed. Random interesting facts are some of the most powerful information you can have on any subject because they often grab people's attention in a way that other information may not.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Back Pocket Information</h2>

            <p>Random facts can be some excellent back pocket information to have. You never know when you may need a random fact or when it can help you in a specific situation. While it may not happen often, there can be times when a random fact you know can actually come to the rescue and help get you out of a difficult situation. In the very least, having a large database of random facts will make you a much more interesting person to have a conversation with.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Impress Others</h2>

            <p>One of the nice things about random facts is they can be used to impress others. Most people don't expect others to have a large number of random facts at their disposal. When you can pull out an interesting random fact in a conversation or situation where the fact is relevant, it often can leave a positive lasting impression on the person you're speaking with. These often leave others impressed with your general knowledge.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Friend Challenge</h2>

            <p>Some people like to challenge their friends with random facts. This could be done by telling them the fact and asking them to confirm whether they believe it to be true or not. It can also be done by telling them the fact while leaving out a part and asking them to fill in the missing information. Both of these ways are excellent methods to help friends learn new random facts and can be a lot of fun in the process.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Social Media</h2>

            <p>Random facts work perfectly for social media posts. This is especially true when they are interesting and somewhat shocking. This type of content often has a high engagement rate on many social media platforms. If you're looking for something to post that's likely to get good engagement, a surprising random fact can often be an excellent option to consider.</p>

            <p>The above examples are only a few of the reasons you may want to learn random facts. There are many other situations where random facts can be beneficial. We hope this random fact generator helps provide interesting and fun facts you can use to impress your friends and family. We're always interested to learn exactly how people use our tools so if you have an interesting way you use this tool, please don't hesitate to contact us to let us know.</p>
        </>
    );

    return (
        <>
            <SEO
                title="Random Facts — 1000+ Fun and Interesting Facts"
                description="The Random Fact Generator has 1000+ random facts including fun facts, interesting facts and amazing facts."
                keywords={['random facts', 'fun facts', 'interesting facts', 'amazing facts', 'trivia', 'knowledge']}
                ogImage="https://randomwordgenerator.com/img/random-facts.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Random Facts Generator - Generate Random Facts"
                currentPage="/fact.php"
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