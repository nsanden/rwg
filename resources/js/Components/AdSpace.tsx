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

        // Wait for both googletag and the Papaya ads script to be ready
        const attemptDisplay = () => {
            if (window.googletag && window.googletag.cmd) {
                window.googletag.cmd.push(() => {
                    // Check if the slot is defined before attempting to display
                    const slots = window.googletag.pubads().getSlots();
                    const slotExists = slots.some((slot: any) => {
                        const slotId = slot.getSlotElementId();
                        return slotId === adId;
                    });

                    if (slotExists) {
                        window.googletag.display(adId);
                    } else {
                        console.log(`Ad slot ${adId} not yet defined, will retry...`);
                        // Retry after a short delay
                        setTimeout(() => attemptDisplay(), 500);
                    }
                });
            } else {
                // Retry if googletag not ready
                setTimeout(() => attemptDisplay(), 100);
            }
        };

        // Initial delay to allow Papaya script to define slots
        setTimeout(() => attemptDisplay(), 1000);
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