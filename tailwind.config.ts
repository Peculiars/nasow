import type {Config} from "tailwindcss";

import tailwindcss_animate from "tailwindcss-animate";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/features/**/*.{js,ts,jsx,tsx,mdx}",
	],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		screens: {
  			xs: '250px',
  			sm: '640px',
  			md: '769px',
  			lg: '1024px',
  			xl: '1280px',
  			'2xl': '1536px'
  		},
		colors: {
			primary: {
				100: '#89BFF2',
				400: '#5791C8',
				500: '#4D82B5',
				900: '#051A2E',
			},
			secondary: {
				500: '#E0EFFE',
				900: '#64AFFA'
			},
			Grey: {
				100: '#F0F2F5',
				300: '#D0D5DD',
				500: '#667185',
				700: '#344054',
				900: '#101928'
			},
			Brown: {
				700: '#645D5D'
			}

		},
		fontFamily: {
			inter: ['var(--font-inter)']
  		},
  	}
  },
  plugins: [tailwindcss_animate],
};
export default config;
