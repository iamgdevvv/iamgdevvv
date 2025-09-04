'use client'
import { useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { useMemo } from 'react'

import { useIsMedia } from '$hooks/media-query'
import type { Asset } from '$payload-types'

export const useThemeColor = () => {
	const { colorScheme, setColorScheme } = useMantineColorScheme()
	const computedColorScheme = useComputedColorScheme(
		colorScheme !== 'auto' ? colorScheme : 'light',
		{
			getInitialValueInEffect: true,
		},
	)

	return {
		themeColor: computedColorScheme,
		setThemeColor: setColorScheme,
	}
}

export const useBackgroundImage = (block?: {
	general?: Asset | number
	mobile?: Asset | number
}) => {
	const mediaQuery = useIsMedia()

	const bgImage = useMemo(() => {
		if (mediaQuery.mobile && block?.mobile) {
			return block.mobile
		}

		return block?.general
	}, [block, mediaQuery])

	return bgImage
}
