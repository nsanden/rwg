import { useEffect, useRef } from 'react';

interface AdSpaceProps {
    adId: string;
    className?: string;
    style?: React.CSSProperties;
    placeholder?: boolean;
}

declare global {
    interface Window {
        googletag: any;
        adsbygoogle: any[];
    }
}

export default function AdSpace({ adId, className = '', style = {}, placeholder = false }: AdSpaceProps) {
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (placeholder) return;

        // Simple display call that matches the legacy implementation
        const displayAd = () => {
            if (window.googletag && window.googletag.cmd) {
                window.googletag.cmd.push(() => {
                    try {
                        window.googletag.display(adId);
                        console.log(`Ad displayed: ${adId}`);
                    } catch (e) {
                        console.log(`Error displaying ad ${adId}:`, e);
                    }
                });
            } else {
                // Retry if googletag not ready
                setTimeout(() => displayAd(), 100);
            }
        };

        // Call display immediately, just like the legacy implementation
        displayAd();
    }, [adId, placeholder]);

    if (placeholder) {
        // Show placeholder when explicitly requested
        return (
            <div
                className={`bg-gray-100 border-2 border-dashed border-gray-300 text-center text-gray-500 text-sm flex items-center justify-center ${className}`}
                style={style}
            >
                Advertisement Space
                {adId && <><br/>{adId}</>}
            </div>
        );
    }

    return (
        <div className={className} style={style}>
            <div id={adId} ref={adRef}></div>
        </div>
    );
}