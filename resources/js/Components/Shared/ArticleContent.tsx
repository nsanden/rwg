import { ReactNode } from 'react';

interface ArticleContentProps {
    children: ReactNode;
}

export default function ArticleContent({ children }: ArticleContentProps) {
    return (
        <div className="space-y-6 text-gray-700 leading-relaxed">
            {children}
        </div>
    );
}