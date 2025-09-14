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

        // Initialize Google AdManager/AdSense ads
        if (window.googletag && window.googletag.cmd) {
            window.googletag.cmd.push(() => {
                window.googletag.display(adId);
            });
        }
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