import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            screens: {
                'xs': '475px',
                'custom': '875px',
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'brand-teal': {
                    DEFAULT: '#1abc9c',
                    50: '#e8fffe',
                    100: '#d1fffd',
                    200: '#a3fffb',
                    300: '#75fff9',
                    400: '#47fff7',
                    500: '#1abc9c',
                    600: '#16a085',
                    700: '#138d75',
                    800: '#0f7a65',
                    900: '#0c6755',
                },
            },
        },
    },

    plugins: [forms],
};
