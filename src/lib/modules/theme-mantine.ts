'use client'
import { createTheme, Text } from '@mantine/core'

const theme = createTheme({
	breakpoints: {
		xs: '375px',
		sm: '600px',
		md: '901px',
		lg: '1200px',
		xl: '1600px',
	},
	fontFamily: 'var(--font-sans)',
	headings: {
		fontFamily: 'var(--font-title)',
		fontWeight: '700',
		sizes: {
			h1: {
				fontSize: 'var(--title-h1)',
				lineHeight: '1.1',
			},
			h2: {
				fontSize: 'var(--title-h2)',
				lineHeight: '1.2',
			},
			h3: {
				fontSize: 'var(--title-h3)',
				lineHeight: '1.2',
			},
			h4: {
				fontSize: 'var(--title-h4)',
				lineHeight: '1.2',
			},
			h5: {
				fontSize: 'var(--title-h5)',
				lineHeight: '1.3',
			},
			h6: {
				fontSize: 'var(--title-h6)',
				lineHeight: '1.3',
			},
		},
	},
	defaultRadius: 'md',
	radius: {
		xs: '2px',
		sm: '4px',
		md: '8px',
		lg: '16px',
		xl: '24px',
		'2xl': '32px',
		'3xl': '56px',
		'4xl': '64px',
		full: '99999px',
	},
	primaryColor: 'primary',
	black: '#09090b',
	colors: {
		primary: [
			'#fffae1',
			'#fff4cb',
			'#ffe89a',
			'#ffdb64',
			'#ffd038',
			'#ffc91c',
			'#ffc60b',
			'#e3ae00',
			'#ca9a00',
			'#af8500',
		],
		secondary: [
			'#eef4fc',
			'#dbe6f2',
			'#b3cbe6',
			'#88aedc',
			'#6596d3',
			'#4f86ce',
			'#437fcd',
			'#356db6',
			'#2c60a3',
			'#102e50',
		],
	},
	components: {
		Text: Text.extend({
			defaultProps: {
				lh: 'xl',
			},
		}),
	},
})

export default theme
