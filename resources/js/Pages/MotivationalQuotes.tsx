import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

interface MotivationalQuote {
    quote: string;
    author: string;
    source?: string;
}

export default function MotivationalQuotes() {
    const {
        words: quotes,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords: generateQuotes,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'motivationalQuotesFavorites',
        apiEndpoint: '/api/generate/motivational-quotes',
        itemName: 'quotes',
        transformResponse: (data: any) => {
            return data.quotes.map((quote: MotivationalQuote) => quote.quote);
        }
    });

    const formState = useGeneratorForm({
        wordType: 'motivational',
        onGenerate: generateQuotes,
        setShowFavorites,
        setQuantity
    });

    const formPanel = (
        <BaseGeneratorForm
            title="Random Motivational Quotes Generator"
            itemName="Quotes"
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
            words={quotes}
            favorites={favorites}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            quantity={quantity}
            loading={showLoading}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            copyToClipboard={copyToClipboard}
            clearAllFavorites={clearAllFavorites}
            itemName="quotes"
            textSize="medium"
        />
    );

    const articleContent = (
        <>
            <p>
                Are you in search of motivational quotes? Do you need a bit of inspiration to help get your day started on a positive note? Do you want to find a random motivational quote to encourage someone? If you need an inspirational quote for any purpose, this random motivational quote generator is exactly what you need. It has over 1,000 motivational quotes in its database and all you need to do is determine how many you'd like to see each time and then hit the generate button. Then you can take the time to read through each and take in their meaning and let them set the positive tone for your day.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Begin Your Day Right</h2>
            <p>
                One wonderful way to use this tool is to generate a random motivational quote each morning to help begin your day on a positive note. This can serve as a gentle reminder that there are many wonderful things in life and that you should take the time to enjoy them. It can also help give you motivation to accomplish the goals you have set. A single motivational quote in the morning can be a wonderful way to start each day with an optimistic outlook.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Encourage Your Friends</h2>
            <p>
                Another excellent way to use this motivational quote generator is to help encourage friends and loved ones who may be going through a difficult time in their lives. A few thoughtful motivational quotes shared at the right time can often give them exactly what they need to give them the motivation to get through whatever they're dealing with. You can use this tool to easily generate a number of quotes and find the ones that are perfect for encouraging that special someone.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Write On It</h2>
            <p>
                If you're a person who enjoys writing, motivational quotes can be an excellent way to help inspire and get your creative juices flowing. Often these motivational quotes can serve as a writing prompt or give you the inspiration you need to get through writer's block. You can also use these motivational quotes as a way to begin entries in your journal or diary.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Make Your Students Write On It</h2>
            <p>
                If you're a teacher, this motivational quote generator can be an excellent source to help inspire your students to write. Give them a motivational quote and challenge them to write about what it means to them. This can be an excellent way to get them thinking about the important things in life while also giving them practice with their writing skills.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Sleep On It</h2>
            <p>
                Just as this tool can help you start your day on a positive note, it can also be an excellent way to end your day in a positive manner. Reading a motivational quote before you go to bed can help you end the day thinking positive thoughts and can even lead to positive dreams.
            </p>

            <p>
                The above are just a few of the many ways that this random motivational quote generator can help give you the positive motivation and inspiration that we can all use in our daily lives. We hope you find it helpful and that it helps inspire you to live your best life. If you have suggestions on ways we can improve this tool, please feel free to contact us.
            </p>
        </>
    );

    return (
        <>
            <SEO
                title="Motivational Quotes"
                description="A free online tool that will generate random motivational quotes including uplifting quotes, inspirational quotes, and interesting quotes."
                keywords={['motivational quotes', 'inspirational quotes', 'uplifting quotes', 'random quotes', 'motivational quote generator']}
                ogImage="https://randomwordgenerator.com/img/motivational-quotes.jpg"
                ogType="website"
            />

            <GeneratorPageLayout
                title="Random Motivational Quotes Generator"
                currentPage="/motivational-quote.php"
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
