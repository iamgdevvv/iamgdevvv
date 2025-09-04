'use client'
import { useShallowEffect } from '@mantine/hooks'
import Tsparticles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { useState } from 'react'

import { useThemeColor } from '$hooks/style'

export default function Particles() {
	const [init, setInit] = useState(false)
	const { themeColor } = useThemeColor()

	useShallowEffect(() => {
		initParticlesEngine(async (engine) => {
			await loadSlim(engine)
		}).then(() => {
			setInit(true)
		})
	}, [])

	if (!init) {
		return null
	}

	return (
		<Tsparticles
			options={{
				fpsLimit: 244,
				interactivity: {
					events: {
						onClick: {
							enable: true,
							mode: 'push',
						},
						onHover: {
							enable: true,
							mode: 'repulse',
						},
						resize: {
							enable: true,
						},
					},
					modes: {
						push: {
							quantity: 4,
						},
						repulse: {
							distance: 80,
							duration: 0.4,
						},
					},
				},
				particles: {
					color: {
						value: themeColor === 'light' ? '#8ea0aa' : '#536b79',
					},
					links: {
						color: themeColor === 'light' ? '#8ea0aa' : '#536b79',
						distance: 150,
						enable: true,
						width: 1,
					},
					move: {
						direction: 'none',
						enable: true,
						outModes: {
							default: 'bounce',
						},
						random: false,
						speed: 2,
						straight: false,
					},
					number: {
						value: 80,
					},
					shape: {
						type: 'circle',
					},
				},
				detectRetina: true,
			}}
			className="opacity-20"
		/>
	)
}
