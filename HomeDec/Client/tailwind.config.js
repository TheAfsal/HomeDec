/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			roboto: ["Roboto", "sans-serif"],
  			nunito: ["Nunito Sans", "sans-serif"]
  		},
  		colors: {
  			blackLikeBlue: '#313957',
  			inputField: '#f7fbff',
  			splashBlue: '#1e4ae9',
  			errorRed: '#d93322',
  			purple: '#6226ef',
  			green_50: '#eef3f2',
  			green_100: '#c9d9d8',
  			green_200: '#afc7c5',
  			green_300: '#8aadab',
  			green_400: '#749d9a',
  			green_500: '#518581',
  			green_600: '#4a7975',
  			green_700: '#3a5e5c',
  			green_800: '#2d4947',
  			green_900: '#223836',
  			pure_white: '#ffffff',
  			background_grey: '#fbfbfb',
  			border_stroke_grey: '#D5D5D5',
  			table_header_grey: '#fcfdfd',
  			status_succes_background_green: '#ccf0eb',
  			status_succes_text_green: '#00b69b',
  			status_failed_background_red: '#ef3826',
  			status_failed_text_red: '#fcd7d4',
  			form_label_grey: '#ADADAD',
  			form_inputFeild_background_grey: '#F5F6FA',
  			form_inputFeild_stroke_grey: '#D5D5D5',
  			order_card_background: '#f5f7fa',
  			count_orange_background: '#f6973f',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
