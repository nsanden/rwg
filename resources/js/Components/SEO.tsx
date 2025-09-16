import { Head } from '@inertiajs/react';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string | string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: string;
    ogUrl?: string;
    twitterCard?: string;
    twitterSite?: string;
    twitterCreator?: string;
    canonical?: string;
    noindex?: boolean;
    nofollow?: boolean;
}

export default function SEO({
    title,
    description,
    keywords = [],
    ogTitle,
    ogDescription,
    ogImage,
    ogType = 'website',
    ogUrl,
    twitterCard = 'summary_large_image',
    twitterSite,
    twitterCreator,
    canonical,
    noindex = false,
    nofollow = false,
}: SEOProps) {
    const robots = [];
    if (noindex) robots.push('noindex');
    if (nofollow) robots.push('nofollow');
    if (robots.length === 0) robots.push('index', 'follow');

    // Ensure keywords is always an array
    const keywordsArray = Array.isArray(keywords) ? keywords : keywords ? [keywords] : [];

    return (
        <Head>
            <title>{title}</title>

            {description && <meta name="description" content={description} />}

            {keywordsArray.length > 0 && (
                <meta name="keywords" content={keywordsArray.join(', ')} />
            )}

            <meta name="robots" content={robots.join(', ')} />

            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph tags */}
            <meta property="og:title" content={ogTitle || title} />
            <meta property="og:type" content={ogType} />

            {(ogDescription || description) && (
                <meta property="og:description" content={ogDescription || description} />
            )}

            {ogImage && <meta property="og:image" content={ogImage} />}
            {ogUrl && <meta property="og:url" content={ogUrl} />}

            {/* Twitter Card tags */}
            <meta name="twitter:card" content={twitterCard} />

            {twitterSite && <meta name="twitter:site" content={twitterSite} />}
            {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}

            <meta name="twitter:title" content={ogTitle || title} />

            {(ogDescription || description) && (
                <meta name="twitter:description" content={ogDescription || description} />
            )}

            {ogImage && <meta name="twitter:image" content={ogImage} />}
        </Head>
    );
}