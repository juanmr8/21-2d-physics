/**
 * EXPLAINER: Neubrutalist Design Principles
 *
 * Neubrutalism is a bold, high-contrast design style with:
 * - Thick black borders (4-6px minimum)
 * - Hard drop shadows (no blur, just offset)
 * - Bright, saturated colors
 * - Clear visual hierarchy
 * - No subtle gradients or soft transitions
 *
 * This toggle switch embodies all these principles!
 *
 * Visual characteristics:
 * - Border: 4px solid black
 * - Shadow: 6px offset, no blur
 * - Colors: Bright accent colors that POP
 * - State changes: Smooth but fast transitions
 *
 * CHALLENGE: Experiment with the styling!
 * - Try different border widths
 * - Change shadow offset
 * - Add more color options
 * - Make it larger or smaller
 */

'use client'

import { useState, useEffect, useRef } from 'react'

interface NeubrutalistToggleProps {
	onSpawn: () => void
}

export function NeubrutalistToggle({ onSpawn }: NeubrutalistToggleProps) {
	const [isActive, setIsActive] = useState(false)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	const handleClick = () => {
		// If already active, clicking again will restart the 3-second timer
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		setIsActive(true)
		onSpawn()

		// Auto-reset after 3 seconds
		timeoutRef.current = setTimeout(() => {
			setIsActive(false)
			timeoutRef.current = null
		}, 300)
	}

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	return (
		<div className="fixed top-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
			{/* Label */}


			{/* Toggle Switch */}
			<button
				onClick={handleClick}
				className={`
          relative
          w-28 h-15
          border-[1px] border-black
          rounded-full
          transition-all duration-200
         bg-white
          ${isActive
						? 'translate-x-[6px] translate-y-[1px] shadow-none'
						: 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
					}
        `}
				aria-label="Toggle spawn mode"
				aria-pressed={isActive}
			>
				{/* Circle (thumb) */}
				<div
					className={`
            absolute top-[5px]
            w-12 h-12
            bg-[#ec571c]
            border-[1px] border-black
            rounded-full
            transition-all duration-300 ease-out
            ${isActive ? 'left-[calc(100%-3.25rem)]' : 'left-1'}
          `}
				/>
			</button>
		</div>
	)
}

/**
 * DESIGN NOTES: Neubrutalist Button Mechanics
 *
 * The "pressed" effect is achieved by:
 * 1. Normal state: shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
 * 2. Active state: translate by shadow amount + remove shadow
 * 3. Result: Looks like button physically pressed into background!
 *
 * This is a classic neubrutalist interaction pattern.
 *
 * CHALLENGE: Can you add more neubrutalist UI elements?
 * Ideas:
 * - FPS counter in top-right corner
 * - Shape count display
 * - Gravity control buttons
 * - Color picker for next spawn
 * - Clear all button
 *
 * Remember: Thick borders, hard shadows, bright colors!
 */
