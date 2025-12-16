import type { ReactNode } from 'react';

interface ArticleContentProps {
    children: ReactNode;
}

export default function ArticleContent({ children }: ArticleContentProps) {
    return (
        <div className="prose prose-lg max-w-none">
            {children}
        </div>
    );
}
