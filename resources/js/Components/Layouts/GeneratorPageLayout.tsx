import React, { ReactNode } from 'react';
import GeneratorLayout from '@/Layouts/GeneratorLayout';
import ArticleContent from '@/Components/Shared/ArticleContent';
import OtherGenerators from '@/Components/Shared/OtherGenerators';
import ErrorBoundary from '@/Components/ErrorBoundary';

interface GeneratorPageLayoutProps {
    title: string;
    children: {
        formPanel: ReactNode;
        resultsPanel: ReactNode;
        articleContent: ReactNode;
    };
    currentPage: string;
    hideOtherGenerators?: boolean;
}

export default function GeneratorPageLayout({ title, children, currentPage, hideOtherGenerators = false }: GeneratorPageLayoutProps) {
    return (
        <GeneratorLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column - Form */}
                        <ErrorBoundary>
                            {children.formPanel}
                        </ErrorBoundary>

                        {/* Right Column - Results */}
                        <ErrorBoundary>
                            <div className="w-full">
                                {children.resultsPanel}
                            </div>
                        </ErrorBoundary>
                    </div>

                    {/* About Section */}
                    <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                        {hideOtherGenerators ? (
                            <ArticleContent>
                                {children.articleContent}
                            </ArticleContent>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
                                {/* Left Column - Article Content */}
                                <ArticleContent>
                                    {children.articleContent}
                                </ArticleContent>

                                {/* Right Column - Other Random Generators */}
                                <div>
                                    <OtherGenerators currentPage={currentPage} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </GeneratorLayout>
    );
}