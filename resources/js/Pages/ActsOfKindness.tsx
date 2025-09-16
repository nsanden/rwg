import React from 'react';
import { Head } from '@inertiajs/react';
import GeneratorLayout from '../Layouts/GeneratorLayout';
import BaseGeneratorForm from '../Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '../Components/Shared/ItemsDisplay';
import SEO from '../Components/SEO';
import { useGenerator } from '../hooks/useGenerator';
import { useGeneratorForm } from '../hooks/useGeneratorForm';

interface Act {
    act_of_kindness: string;
}

interface ActsOfKindnessProps {
    auth: any;
}

export default function ActsOfKindness({ auth }: ActsOfKindnessProps) {
    const { items, loading, generateItems, setQuantity, setShowFavorites, favorites, showFavorites, quantity, addToFavorites, removeFromFavorites, copyToClipboard, clearAllFavorites } = useGenerator({
        apiEndpoint: '/api/generate/acts-of-kindness',
        itemName: 'acts',
        transformResponse: (data) => data.data || data.acts || []
    });
    const formProps = useGeneratorForm({
        onGenerate: generateItems,
        wordType: 'act',
        setQuantity,
        setShowFavorites
    });

    const seoData = {
        title: 'Random Act of Kindness Generator - RandomWordGenerator.com',
        description: 'Get a random act of kindness you can use with each click of the button.',
        keywords: 'random acts of kindness, kindness generator, random kindness ideas',
        ogImage: '/img/acts-of-kindness.jpg'
    };

    return (
        <>
            <Head title="Random Act of Kindness Generator" />
            <SEO {...seoData} />

            <GeneratorLayout>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-6">Random Acts of Kindness</h1>

                            <BaseGeneratorForm
                                {...formProps}
                                title="Random Acts of Kindness Generator"
                                itemName="acts"
                                quantity={quantity}
                                setQuantity={setQuantity}
                                loading={loading}
                                onGenerate={() => generateItems()}
                                onReset={() => {}}
                            />
                        </div>

                        <div className="lg:pl-8">
                            <ItemsDisplay
                                items={items}
                                loading={loading}
                                favorites={favorites}
                                showFavorites={showFavorites}
                                setShowFavorites={setShowFavorites}
                                quantity={quantity}
                                addToFavorites={addToFavorites}
                                removeFromFavorites={removeFromFavorites}
                                copyToClipboard={copyToClipboard}
                                clearAllFavorites={clearAllFavorites}
                                itemName="acts"
                            />
                        </div>
                    </div>

                    <div className="mt-16 prose prose-lg max-w-none">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Random Acts of Kindness</h2>

                                <p>
                                    Author Anne Herbert coined the phrase "Random acts of kindness and senseless acts of beauty,"
                                    basing it on the all-too-commonly used "random acts of violence and senseless acts of cruelty."
                                    The idea has caught on, but there are times when you shouldn't be practicing acts of kindness.
                                    So, before we look at why you should practice them, let's be mindful of two reasons why you shouldn't do so:
                                </p>

                                <ul className="list-disc pl-6 mb-6">
                                    <li className="mb-2">
                                        <strong>Self-aggrandisement and publicity</strong>. That's right! No selfies when you give that homeless guy food!
                                    </li>
                                    <li className="mb-2">
                                        <strong>Getting in the way of emergency services (although your intentions are good)</strong>.
                                        In situations where emergency services are already active, ask how you can help instead of just diving in head-first.
                                    </li>
                                </ul>

                                <p>
                                    Lastly, let's not forget that charity begins at home. Unexpectedly helping a friend or family member also counts.
                                    The person you help needn't be a stranger. Now that we've got beyond the caveats,
                                    let's look at some reasons why you should practice random acts of kindness.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">You genuinely get to help, even if it's only in a small way</h3>
                                <p>
                                    This one's a real no-brainer. You aren't being kind if you aren't helping.
                                    By helping someone else, even if it's only holding a door open, smiling at someone or offering
                                    to carry shopping bags, you have genuinely helped. The person you've been kind to feels more valued,
                                    and who knows? There could be a knock-on effect.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Make others feel good</h3>
                                <p>
                                    There are a lot of sad, lonely or depressed people out there.
                                    Even if the person you help wasn't feeling down, you'll make them feel good. If you're truly a kind person,
                                    this will be one of your prime reasons for practicing random acts of kindness.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Feel good yourself</h3>
                                <p>
                                    Although this shouldn't be the reason why you are kind to others, it will be an inevitable consequence.
                                    Psychologists point out that as social creatures, helping others satisfies a very deep need within our psyche.
                                    It's instinctive and inevitable. Your self-esteem will improve because you'll feel like a "good person."
                                    You may even find yourself smiling to yourself when you think about some act of kindness you've carried out or are planning.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Build stronger relationships</h3>
                                <p>
                                    When you practice kindness as a habit, and do things you don't have to do to help people you know,
                                    you'll build stronger relationships. If you are ever in a disagreement or do something silly that isn't
                                    helpful at all, you're far more likely to be forgiven.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Change someone's life for the better</h3>
                                <p>
                                    You never know when something kind that you do will change someone's life for the better.
                                    I recently read a story about a drug addict who lived on the streets and was always treated like filth.
                                    One day, he received a small act of kindness from someone, and it made him realize that he still had worth as a human being.
                                    He went on to quit drugs, and later became a motivational speaker. Even a small act of kindness can have very powerful, even life-changing, effects.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Give, and you never know, you may receive when you need it most</h3>
                                <p>
                                    I'm not sure if we should believe in instant karma, but one thing is certain: when you help others,
                                    they become more willing to help you. Since we all go through difficulties at some point in life,
                                    that help can prove to be more important to you than you would ever believe.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Others will pass it forward</h3>
                                <p>
                                    Kindness is catching. Has someone ever made your day, and you spend the rest of it spreading the sunshine? That's what I'm talking about!
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">You'll become less judgmental</h3>
                                <p>
                                    This is a tough one, but when we start seeing people as human beings and not as "labels" like
                                    "worthless drug addict," a "homeless wastrel" or "sourpuss," we feel a lot better.
                                    Everyone has their own problems, and whether they are to blame for them or not, it's not our place to judge them.
                                    Make a point of helping someone you don't really like. It's good practice.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Life will have more meaning to you</h3>
                                <p>
                                    If you're forever planning acts of kindness, or grabbing opportunities to help those in need,
                                    you'll be eager to see what each new day will bring.
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Make the world a better place</h3>
                                <p>
                                    Imagine if everybody in the world was kind to others. What a wonderful place the world would be!
                                    You can't force others to be kind, but you can do your best, and the kindness contagion will spread.
                                    Whether you can help in large ways or small, do what you can to build the momentum.
                                </p>

                                <p>
                                    We often get asked the question, "When is National Random Acts of Kindness Day?" (<a href="https://hashtagpicker.com/hashtag-view?id=764" target="_blank" rel="nofollow noreferrer" className="text-blue-600 hover:text-blue-700 underline break-words">#RandomActsOfKindnessDay</a>) or "When is World Kindness Day?" (<a href="https://hashtagpicker.com/hashtag-view?id=883" target="_blank" rel="nofollow noreferrer" className="text-blue-600 hover:text-blue-700 underline break-words">#WorldKindnessDay</a>) due to having this generator. Random Acts of Kindness day is celebrated on February 17 each year and World Kindness Day is celebrated on November 13 of each year. As one may imagine, they continue to grow in popularity not only among individuals, but also among community groups, schools, and other organizations. If you plan to participate in the National Random Acts of Kindness Day or World Kindness Day this year, be sure to use our generator to come up with a lot of good ideas to use when celebrating the event!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </GeneratorLayout>
        </>
    );
}