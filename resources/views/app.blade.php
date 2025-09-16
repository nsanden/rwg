<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#FF2D20">
        <meta name="google-adsense-account" content="ca-pub-8949118578199171">

        <!-- Google AdSense -->
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8949118578199171" crossorigin="anonymous"></script>

        <!-- PWA -->
        <link rel="manifest" href="/manifest.json">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="{{ config('app.name', 'Laravel') }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Local fonts are loaded via CSS imports -->

        @if(app()->environment('production'))
            <!-- Google Analytics -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-9JP09EK201"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-9JP09EK201');
            </script>

            <!-- Facebook SDK -->
            <script>
                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s); js.id = id;
                    js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.3&appId=420272148007912";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            </script>
        @endif

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead

        <!-- Service Worker Registration -->
        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').then(registration => {
                        console.log('SW registered:', registration);
                    }).catch(error => {
                        console.log('SW registration failed:', error);
                    });
                });
            }
        </script>
    </head>
    <body class="font-sans antialiased">
        @inertia

        <!-- Noscript fallback -->
        <noscript>
            <div style="padding: 20px; text-align: center;">
                <h1>JavaScript Required</h1>
                <p>This application requires JavaScript to be enabled.</p>
            </div>
        </noscript>
    </body>
</html>
