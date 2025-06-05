
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Swoon Learning Brand Colors
				'swoon-blue': 'rgb(var(--blue) / <alpha-value>)',
				'swoon-bluer': 'rgb(var(--bluer) / <alpha-value>)',
				'swoon-yellow': 'rgb(var(--yellow) / <alpha-value>)',
				'swoon-pink': 'rgb(var(--pink) / <alpha-value>)',
				'swoon-light-pink': 'rgb(var(--light-pink) / <alpha-value>)',
				'swoon-white': 'rgb(var(--white) / <alpha-value>)',
				'swoon-black': 'rgb(var(--black) / <alpha-value>)',
				'swoon-mid-gray': 'rgb(var(--mid-gray) / <alpha-value>)',
				'swoon-dark-gray': 'rgb(var(--dark-gray) / <alpha-value>)',
				'swoon-light-gray': 'rgb(var(--light-gray) / <alpha-value>)',
				'swoon-light-green': 'rgb(var(--light-green) / <alpha-value>)',
				'swoon-light-blue': 'rgb(var(--light-blue) / <alpha-value>)',
				'swoon-light-yellow': 'rgb(var(--light-yellow) / <alpha-value>)',
				'swoon-green': 'rgb(var(--green) / <alpha-value>)',
				'swoon-red': 'rgb(var(--red) / <alpha-value>)',
				
				// shadcn/ui compatibility
				border: 'rgb(var(--border) / <alpha-value>)',
				input: 'rgb(var(--input) / <alpha-value>)',
				ring: 'rgb(var(--ring) / <alpha-value>)',
				background: 'rgb(var(--background) / <alpha-value>)',
				foreground: 'rgb(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
					foreground: 'rgb(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
					foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
					foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
					foreground: 'rgb(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
					foreground: 'rgb(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
					foreground: 'rgb(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'rgb(var(--card) / <alpha-value>)',
					foreground: 'rgb(var(--card-foreground) / <alpha-value>)'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float-in': {
					from: {
						opacity: '0',
						transform: 'translateY(20px) scale(0.95)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					}
				},
				'slide-up': {
					from: {
						opacity: '0',
						transform: 'translateY(100%)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float-in': 'float-in 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;