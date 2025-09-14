<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="High-performance Laravel application with React and SSR">
        <meta name="theme-color" content="#FF2D20">

        <!-- PWA -->
        <link rel="manifest" href="/manifest.json">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="{{ config('app.name', 'Laravel') }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Preconnect and DNS Prefetch -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link rel="dns-prefetch" href="https://fonts.bunny.net">

        <!-- Fonts with display swap for better performance -->
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Preload critical assets are handled by Vite automatically -->

        <!-- jQuery (required for some ad scripts) -->
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

        <!-- BTLoader for ad optimization -->
        <script src="https://btloader.com/tag?o=4905162506764288&upapi=true" async></script>

        <!-- Papaya Ads - Updated to match legacy version -->
        <script src="https://www.papayads.net/clnt/randomwordgenerator/v51/adtags.js" type="text/javascript"></script>

        <!-- Initialize Google AdManager -->
        <script>
            window.googletag = window.googletag || {cmd: []};
        </script>

        <!-- Google AdManager Scripts -->
        <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>

        <!-- VDO.ai with enhanced error handling -->
        <script>
        (function() {
            var script = document.createElement('script');
            script.defer = true;
            script.async = true;
            script.src = '//a.vdo.ai/core/v-randomwordgenerator/vdo.ai.js';
            script.onload = function() {
                console.log('VDO.ai script loaded successfully');
            };
            script.onerror = function() {
                console.log('VDO.ai script unavailable - continuing without video ads');
            };

            // Set a timeout in case the script hangs
            setTimeout(function() {
                if (!script.onload.called && !script.onerror.called) {
                    console.log('VDO.ai script timed out - continuing without video ads');
                }
            }, 5000);

            document.head.appendChild(script);
        })();
        </script>

        @if(app()->environment('production'))
            <!-- Google Analytics -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=UA-33613488-12"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'UA-33613488-12');
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
