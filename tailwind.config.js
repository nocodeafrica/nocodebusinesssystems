/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ncbs-blue': '#007BFF',
        'ncbs-gold': '#FFD700',
        'ncbs-navy': '#1a1a2e',
        'ncbs-dark': '#16213e',
      },
      // Mobile-optimized design system for Location Systems
      spacing: {
        'mobile-padding': '16px',
        'mobile-margin': '12px',
        'touch-target': '44px',
        'bottom-sheet-peek': '40vh',
        'bottom-sheet-full': '90vh',
        'map-min-height': '60vh',
        'safe-area-top': 'env(safe-area-inset-top)',
        'safe-area-bottom': 'env(safe-area-inset-bottom)',
      },
      height: {
        'mobile-header': '56px',
        'mobile-tab': '48px',
        'mobile-filter': '40px',
        'mobile-card': '120px',
        'mobile-popup': '280px',
        'screen-minus-header': 'calc(100vh - 56px)',
        'screen-minus-tabs': 'calc(100vh - 104px)',
      },
      minHeight: {
        'touch-target': '44px',
        'mobile-button': '40px',
      },
      backdropBlur: {
        'mobile': '12px',
      },
      borderRadius: {
        'mobile-card': '12px',
        'mobile-button': '8px',
        'bottom-sheet': '20px 20px 0 0',
      },
      fontSize: {
        'mobile-title': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'mobile-subtitle': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'mobile-body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'mobile-caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'mobile-button': ['14px', { lineHeight: '20px', fontWeight: '500' }],
      },
      zIndex: {
        'mobile-header': '40',
        'mobile-overlay': '45',
        'mobile-bottom-sheet': '50',
        'mobile-modal': '55',
        'mobile-toast': '60',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-up': 'scaleUp 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%': { transform: 'scale(0.9)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      screens: {
        'xs': '375px',
        'mobile-sm': '414px',
        'mobile-lg': '768px',
      },
      boxShadow: {
        'mobile-card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'mobile-bottom-sheet': '0 -4px 20px rgba(0, 0, 0, 0.15)',
        'mobile-floating': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'mobile-pressed': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    // Custom mobile utilities plugin
    function({ addUtilities, theme }) {
      addUtilities({
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        '.touch-none': {
          'touch-action': 'none',
        },
        '.mobile-scroll': {
          'overflow-y': 'auto',
          '-webkit-overflow-scrolling': 'touch',
          'scroll-behavior': 'smooth',
        },
        '.mobile-hidden-scroll': {
          'overflow-y': 'auto',
          '-webkit-overflow-scrolling': 'touch',
          'scroll-behavior': 'smooth',
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.mobile-safe-area': {
          'padding-top': 'env(safe-area-inset-top)',
          'padding-bottom': 'env(safe-area-inset-bottom)',
          'padding-left': 'env(safe-area-inset-left)',
          'padding-right': 'env(safe-area-inset-right)',
        },
        '.mobile-tap-highlight': {
          '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0.1)',
        },
        '.mobile-no-tap-highlight': {
          '-webkit-tap-highlight-color': 'transparent',
        },
        '.mobile-select-none': {
          '-webkit-user-select': 'none',
          '-moz-user-select': 'none',
          '-ms-user-select': 'none',
          'user-select': 'none',
        },
        '.mobile-draggable': {
          'cursor': 'grab',
          '&:active': {
            'cursor': 'grabbing',
          },
        },
      })
    }
  ],
}