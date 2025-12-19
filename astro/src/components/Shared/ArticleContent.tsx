import type { ReactNode } from 'react';

interface ArticleContentProps {
    children: ReactNode;
}

export default function ArticleContent({ children }: ArticleContentProps) {
    return (
        <div className="prose prose-lg max-w-none">
            {/* Video Ad Containers */}
            <div className="google-ad-video not-prose">
                <div id="v-randomwordgenerator"></div>
            </div>
            <div className="google-ad-container-video not-prose">
                <div id="v-randomwordgenerator-v3"></div>
            </div>
            <div className="google-ad-container-video not-prose">
                <div id="v-randomwordgenerator-v10"></div>
            </div>

            {/* Under Video Player Ad */}
            <div id="RWG_Under_Video_Player" className="not-prose text-center" style={{ height: '100px', marginBottom: '10px', overflow: 'hidden' }}>
                <div id="div-gpt-ad-1619013591139-0" style={{ height: '100px', maxWidth: '320px', marginBottom: '10px', overflow: 'hidden', margin: '0 auto' }}>
                    <script dangerouslySetInnerHTML={{ __html: `googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619013591139-0'); });` }} />
                </div>
            </div>

            {children}
        </div>
    );
}
