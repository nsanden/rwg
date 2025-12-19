// Mobile ad that appears below the generator on mobile devices
export function MobileBelowGeneratorAd() {
    return (
        <div
            id="RWG_Below_Generator_Mobile_300px"
            className="md:hidden google-ad-container flex justify-center mt-8"
            style={{ height: '280px', maxWidth: '336px', margin: '2rem auto' }}
        >
            <div id="div-gpt-ad-1578531360465-0" className="text-center">
                <script dangerouslySetInnerHTML={{ __html: `googletag.cmd.push(function() { googletag.display('div-gpt-ad-1578531360465-0'); });` }} />
            </div>
        </div>
    );
}
