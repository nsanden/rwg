import { useState, useEffect } from 'react';
import { Heart, Copy, RefreshCw, Share2 } from 'lucide-react';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import GeneratorButtons from '../Forms/GeneratorButtons';
import SocialShareBlock from '../Shared/SocialShareBlock';

interface TongueTwisterGeneratorProps {
    basePath?: string;
}

export default function TongueTwisterGenerator({ basePath = '' }: TongueTwisterGeneratorProps) {
    const [tongueTwisters, setTongueTwisters] = useState<string[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [favorites, setFavorites] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('tongueTwisterFavorites');
            try {
                return saved ? JSON.parse(saved) : [];
            } catch {
                return [];
            }
        }
        return [];
    });
    const [showShareModal, setShowShareModal] = useState(false);

    const generateTongueTwisters = async () => {
        setLoading(true);
        setShowFavorites(false);
        try {
            const response = await fetch(`/api/generate/tongue-twisters?quantity=${quantity}`);
            const data = await response.json();

            if (data.tongueTwisters) {
                setTongueTwisters(data.tongueTwisters);
            }
        } catch (error) {
            console.error('Error generating tongue twisters:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateTongueTwisters();
    }, []);

    const addToFavorites = (twister: string) => {
        if (!favorites.includes(twister)) {
            const updated = [...favorites, twister];
            setFavorites(updated);
            localStorage.setItem('tongueTwisterFavorites', JSON.stringify(updated));
        }
    };

    const removeFromFavorites = (twister: string) => {
        const updated = favorites.filter(f => f !== twister);
        setFavorites(updated);
        localStorage.setItem('tongueTwisterFavorites', JSON.stringify(updated));
    };

    const clearAllFavorites = () => {
        setFavorites([]);
        localStorage.setItem('tongueTwisterFavorites', JSON.stringify([]));
        setShowFavorites(false);
    };

    const copyToClipboard = () => {
        const items = showFavorites ? favorites : tongueTwisters;
        const text = items.map(t => t.replace(/<br\s*\/?>/gi, '\n')).join('\n\n');
        navigator.clipboard.writeText(text);
    };

    const resetForm = () => {
        setQuantity(1);
        generateTongueTwisters();
    };

    const TwisterCard = ({ twister }: { twister: string }) => {
        const isFavorite = favorites.includes(twister);

        return (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between gap-2">
                    <p
                        style={{ fontSize: '1.25rem', fontWeight: '500', color: '#1f2937', flex: 1, textAlign: 'center', lineHeight: '1.6' }}
                        dangerouslySetInnerHTML={{ __html: twister }}
                    />
                    <button
                        onClick={() => isFavorite ? removeFromFavorites(twister) : addToFavorites(twister)}
                        className="ml-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer flex-shrink-0"
                    >
                        <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form Panel */}
                    <div className="bg-white rounded-lg shadow-lg p-6" style={{ minWidth: '385px' }}>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Random Tongue Twisters</h1>

                        <div className="mb-4">
                            <label htmlFor="quantity" className="font-medium text-gray-700 mr-3">
                                Number of Tongue Twisters:
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                min="1"
                                max="20"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="inline-block w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <GeneratorButtons
                            onGenerate={generateTongueTwisters}
                            onReset={resetForm}
                            loading={loading}
                            generateLabel="Generate Tongue Twisters"
                        />

                        <div className="mt-4 flex justify-center sm:hidden">
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        </div>

                        <SocialShareBlock
                            url={typeof window !== 'undefined' ? window.location.href : ''}
                            title="Random Tongue Twister Generator - Fun Speech Practice"
                            isExpanded={showShareModal}
                            setIsExpanded={setShowShareModal}
                        />
                    </div>

                    {/* Results Panel */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                            {favorites.length > 0 && (
                                <button
                                    onClick={() => setShowFavorites(!showFavorites)}
                                    className={`group flex items-center gap-1 text-sm px-3 py-2 rounded cursor-pointer ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                                >
                                    {showFavorites ? (
                                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                                    ) : (
                                        <>
                                            <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
                                            ({favorites.length})
                                        </>
                                    )}
                                </button>
                            )}
                            <button
                                onClick={copyToClipboard}
                                className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded cursor-pointer"
                            >
                                <Copy className="w-5 h-5 transition-colors" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">
                                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                                <p className="mt-2 text-gray-600">Finding tongue twisters...</p>
                            </div>
                        ) : (
                            <>
                                {(showFavorites ? favorites : tongueTwisters).length > 0 ? (
                                    <div className="space-y-4">
                                        {(showFavorites ? favorites : tongueTwisters).map((twister, index) => (
                                            <TwisterCard key={`${twister.substring(0, 20)}-${index}`} twister={twister} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        {showFavorites ? 'No favorite tongue twisters yet.' : 'Click "Generate Tongue Twisters" to get started.'}
                                    </div>
                                )}

                                {favorites.length > 0 && showFavorites && (
                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={clearAllFavorites}
                                            className="text-sm px-3 py-1 rounded text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                                        >
                                            Clear All Favorites
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
                        <ArticleContent>
                            <p>If you love tongue twisters, you've come to the correct place. The only thing the random tongue twisters generator does is spit out tongue twisters to challenge your ability to say them. This includes both funny tongue twisters and hard tongue twisters among a variety of others. There are plenty of tongue twisters for adults and kids. All you need to do is to press the generate button and a tongue twister will instantly appear to challenge your English speaking ability.</p>

                            <p>The tongue twisters generator is quite easy to use. All you need to do is choose the number of tongue twisters you want to view each time (the default is set at one) and then click on the generate button. A random tongue twister will instantly appear. That's a lot easier than the tongue twister you receive is bound to be.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">What Is a Tongue Twister?</h2>

                            <p>Tongue twisters are words put together in a specific sequence that makes it difficult to say correctly when done rapidly even for native English speakers. These can either be a single sentence that gets rapidly repeated a number of times (usually 5 or ten times) or can be a short verse with several sentences all of which can be difficult to quickly say. It's the difficulty in saying the words that makes tongue twisters so fun to try and that'll challenge your ability to master them.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Tongue Twisters Practice</h2>

                            <p>Tongue twisters are a wonderful way to practice English pronunciation. If you're a student learning English as a second language (ESL), it can be a great way to get much better at pronouncing English words. If you do any type of public speaking or have a job where speaking clearly is important (voice actor, singer, TV host, etc.), tongue twisters are a good articulation exercise. If you have a need to practice English and you're looking for a fun and entertaining way to do it, trying to master difficult tongue twisters is a wonderful way to do it.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Friendly Challenge</h2>

                            <p>Do you think that you're better than your friends at tongue twisters? Using the random tongue twisters generator is a great way to test your ability with others in an unbiased way. Since neither of you knows exactly what tongue twister will appear when using this tool, it makes the challenge a lot fairer. If you happen to be bored and need some fun entertainment, this is also a tool that can help you and your friend pass the time that's sure to bring lots of laughs along the way.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Teaching English</h2>

                            <p>If you happen to be an English teacher, using the random tongue twister generator can be a fun way to get your students to practice their English speaking. For example, you could make an assignment that everyone in the class will have to try and do a tongue twister and use the random generator to assign the tongue twisters to the students. If you want to make it even more of a challenge, you can tell them to practice tongue twisters and then have them attempt one randomly generated the day of class. Tongue twisters can make a class a lot more fun and entertaining as everyone tries to master the hard tongue twisters they're given.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">The World's Hardest Tongue Twister</h2>

                            <p>If you're into hard tongue twisters, then you might wonder what is the world's hardest tongue twister. As you might imagine, there's actually some debate as to what is the world's hardest tongue twister. The Guinness Book of World Records claims that the most difficult tongue twister is "The sixth sick sheik's sixth sheep's sick". On the other hand, the Massachusetts Institute of Technology (MIT) did a study on different hard tongue twisters and came to the conclusion that "Pad kid poured curd pulled cod" is the toughest tongue twister around. Give each a try by saying them as fast as you can ten times to determine which you feel is the world's hardest tongue twister.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Popular Tongue Twisters</h2>

                            <p>There are a large number of tongue twisters for adults and kids that exist, but there are some general tongue twisters that are well-known. While it's good to practice any and all tongue twisters, learning the most popular ones can go a long way to giving you credibility with friends and family if you manage to master them well. Below you'll find three of the most popular English tongue twisters for adults and kids.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Peter Piper Tongue Twister</h2>

                            <p>One of the most famous tongue twisters in English is the Peter Piper tongue twister. For anyone attempting to get good at tongue twisters, this is a great one to start with. See how you do with it.</p>

                            <p className="italic bg-gray-50 p-4 rounded-lg">Peter Piper picked a peck of pickled peppers.<br />A peck of pickled peppers Peter Piper picked.<br />If Peter Piper picked a peck of pickled peppers,<br />Where's the peck of pickled peppers Peter Piper picked?</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">She Sells Sea Shells Tongue Twister</h2>

                            <p>"She sells seashells by the seashore" is another well-known tongue twister in English. It's another hard tongue twister that you can practice to see and practice your tongue twister ability. Give it a try:</p>

                            <p className="italic bg-gray-50 p-4 rounded-lg">She sells seashells by the seashore,<br />The shells she sells are seashells, I'm sure.<br />So if she sells seashells on the seashore,<br />Then I'm sure she sells seashore shells.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Woodchuck Tongue Twister</h2>

                            <p>Another quite popular tongue twister is the woodchuck tongue twister. Again, getting good at this tongue twister is a great way to cement yourself as being good at tongue twisters.</p>

                            <p className="italic bg-gray-50 p-4 rounded-lg">How much wood would a woodchuck chuck<br />if a woodchuck could chuck wood?<br />He would chuck, he would, as much as he could,<br />and chuck as much wood as a woodchuck would<br />if a woodchuck could chuck wood.</p>

                            <p>It's our hope that you've found the random tongue twisters generator a fun and useful tool. We'd love for you to give us your opinion on this generator. By learning both what people like and dislike about it, we can make adjustments to improve it in the future. Please feel free to contact us to let us know what you think about the random tongue twisters generator so that we can continue to keep it the best one on the Internet.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What makes a good tongue twister?</h3>
                                        <p>Good tongue twisters use similar sounds, alliteration, and rhyming patterns that cause your tongue to trip over itself. The best ones are short enough to remember but challenging enough to require concentration.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">How often should I practice tongue twisters?</h3>
                                        <p>Even just a few minutes of practice each day can improve your articulation. Many speech professionals recommend practicing for 5-10 minutes before any speaking engagement as a warm-up exercise.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can tongue twisters help with speech impediments?</h3>
                                        <p>While tongue twisters can be helpful for general speech practice, those with speech impediments should work with a qualified speech therapist who can provide personalized exercises and guidance.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Are tongue twisters the same in every language?</h3>
                                        <p>No, each language has its own unique tongue twisters based on the sounds and patterns that are difficult in that language. What's challenging in English may be easy in another language and vice versa.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/tongue-twisters" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
