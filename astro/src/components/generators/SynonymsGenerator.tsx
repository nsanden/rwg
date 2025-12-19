import { useState } from 'react';
import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import SynonymTypeFilter from '../Forms/SynonymTypeFilter';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface SynonymsGeneratorProps {
    basePath?: string;
}

export default function SynonymsGenerator({ basePath = '' }: SynonymsGeneratorProps) {
    const [synonymType, setSynonymType] = useState('synonym_all');

    const {
        words: synonyms,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords: generateSynonyms,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'synonymsFavorites',
        apiEndpoint: '/api/generate/words',
        itemName: 'synonyms',
        defaultType: 'synonym_all'
    });

    const formState = useGeneratorForm({
        wordType: 'synonym',
        onGenerate: (params) => generateSynonyms(params),
        setShowFavorites,
        setQuantity,
        customParamBuilder: (baseParams, formState) => {
            const params: any = {
                type: synonymType,
            };

            if (formState.firstLetter) params.firstLetter = formState.firstLetter;
            if (formState.lastLetter) params.lastLetter = formState.lastLetter;
            if (formState.sizeType) {
                params.sizeType = formState.sizeType;
                params.comparing = formState.comparing;
                params.count = formState.count;
            }

            return params;
        },
        customState: {
            synonymType: {
                value: synonymType,
                setter: setSynonymType,
                defaultValue: 'synonym_all'
            }
        }
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BaseGeneratorForm
                        title="Random Synonym Generator"
                        itemName="Synonyms"
                        quantity={quantity}
                        setQuantity={setQuantity}
                        loading={loading}
                        sizeFilterLabel="Word size by:"
                        onGenerate={formState.handleGenerate}
                        onReset={formState.resetOptions}
                        customOptions={
                            <SynonymTypeFilter
                                synonymType={synonymType}
                                setSynonymType={setSynonymType}
                            />
                        }
                        {...formState}
                    />

                    <div className="w-full">
                        <ItemsDisplay
                            words={synonyms}
                            favorites={favorites}
                            showFavorites={showFavorites}
                            setShowFavorites={setShowFavorites}
                            quantity={quantity}
                            loading={showLoading}
                            addToFavorites={addToFavorites}
                            removeFromFavorites={removeFromFavorites}
                            copyToClipboard={copyToClipboard}
                            clearAllFavorites={clearAllFavorites}
                            itemName="synonyms"
                            textSize="medium"
                            onReset={formState.resetAndGenerate}
                        />
                    </div>
                </div>

                <div id="RWG_Below_Generator_Mobile_300px" className="md:hidden google-ad-container flex justify-center mt-8" style={{ height: '280px', maxWidth: '336px', margin: '2rem auto' }}>
                    <div id="div-gpt-ad-1578531360465-0" className="text-center"></div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        <ArticleContent>
                            <p>Welcome to the random synonym generator. Since you likely arrived here looking for the different synonyms for the word "random" the first result of the random synonym generator is the word "random" -- yes, we realize this first result isn't random since it's always the same, but if you press the generate button after this first result, you'll get a random word with all its synonyms. You should definitely give it a try and stick around for a while as playing with this tool can help spur your creativity and introduce new and better words for your creative writing.</p>

                            <p>Synonyms are a valuable addition to any vocabulary. For those not familiar with the term, learning English as a second language, or who get a bit mixed up with the meaning of grammatical terms, the first step is to answer the question, "What is a synonym?" A synonym is a word with the same or nearly the same meaning as another.</p>

                            <p>The value of synonyms becomes obvious when considering how a phrase or sentence sounds. If you were to describe every rugby player as big and angry then it would get boring by the 3rd team member. However, using words like "humongous, muscular, and buff" paired with "glowering, growling, and intimidating" wouldn't sound so repetitive and also conveys more information about the player. This is the second value of synonyms. Because some synonyms have slightly different meanings, using them can provide more depth or specificity to the situation. For example, if a person is running, they could be jogging casually or sprinting in fear. Using one of these synonyms to running conveys more information about the type of running without having to use more adverbs.</p>

                            <p>There are a lot of ways synonyms can be used to expand the meaning of your writing. Describing actions can be improved with synonyms like the example above. Another example is descriptive words. In this instance, a descriptive word is subbed for a synonym with a more accurate representation of how something is being described. For example, instead of "telling a story" someone might be "spinning a yarn" or "recounting an epic tale". When writing a literary analysis, the word "show" can be useful when pointing out what part of a sentence emphasizes the point of the writing. However, using the words "highlight, illuminate, exemplify, and demonstrate" can be more effective at conveying the precise nature of the 'show' action and mixes up the words used in a paragraph.</p>

                            <p>Another way synonyms can be very useful is when describing feelings. Happy can be replaced with jubilant for an extremely happy person or pleased for a situation where the person feels small, contained happiness. Feelings are complicated and using synonyms can help convey that complexity. However, it's important to not solely rely on single words for feelings. An author often needs to use visual language and provide metaphors depending on the situation. For example instead of saying "they were happy" you could say "their joy and excitement exploded with tears as their jubilance filled their hearts".</p>

                            <p>In addition to synonyms, don't forget about using antonyms. These are the opposite of synonyms: words with meanings exactly opposite or nearly opposite the definition. Using antonyms can be helpful when trying to compare different objects or situations. An example, when juxtaposing siblings one might be described as quiet and tranquil while the other is boisterous and noisy. By using multiple synonyms to describe one and antonyms of those words to describe the other, the author can successfully highlight the differences.</p>

                            <p>If you're ready to start writing with synonyms but need a good source for finding them, a good first step is to try this random synonym generator. Maybe you have a set of characters you want to describe or a series of situations you want to compare. This is a good starting place. Even better, you're likely to come across words you weren't thinking about and their synonyms which may spark even better descriptions in your writing. Take a bit of time to explore the random synonym generator and you should soon realize if this is a tool that will be helpful to you in your writing.</p>

                            <p>Similarly, this synonym generator can be used as a writing prompt. For a simple warm-up exercise, generate a series of synonyms and use them as a starting place for your new setting, character, or thesis. You can pick a single synonym and weave it into a sentence or paragraph, or you can attempt to use all of the different synonyms given into a short story. This should get your creative writing juices flowing while also expanding your writing vocabulary.</p>

                            <p>If you found the random synonym generator useful, please take a moment to let us know about it. We are always curious about exactly how this generator is being used and by understanding better how different people are using it, we can improve it for others. The ultimate goal is to have the best random synonym generator on the Internet, and with your help and suggestions, we can accomplish that.</p>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/synonym" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
