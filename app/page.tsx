/**
 * EXPLAINER: Main Application Page
 *
 * This page composes all our components together:
 * 1. PhysicsCanvas: Renders the Matter.js simulation
 * 2. NeubrutalistToggle: UI to spawn shapes
 *
 * The data flow:
 * - User clicks toggle button
 * - Toggle calls onSpawn callback
 * - Page increments spawnCount state
 * - PhysicsCanvas receives new spawnCount
 * - PhysicsCanvas spawns 30-50 shapes
 *
 * This is a simple example of React state management
 * driving physics interactions!
 *
 * CHALLENGE: Add more controls!
 * Ideas:
 * - Gravity slider (change engine.gravity)
 * - Time scale slider (slow motion / fast forward)
 * - Clear all button (remove all bodies)
 * - Shape type selector (spawn only circles, etc.)
 */

'use client'

import { useState } from 'react'
import { PhysicsCanvas } from '@/components/physics-canvas'
import { NeubrutalistToggle } from '@/components/neubrutalist-toggle'

export default function Page() {
	/**
	 * EXPLAINER: State Management Pattern
	 *
	 * We use a simple counter to trigger shape spawning.
	 * Each increment signals PhysicsCanvas to spawn new shapes.
	 *
	 * Why not a boolean?
	 * - Counter lets us spawn multiple times
	 * - useEffect in PhysicsCanvas can trigger on count change
	 * - Works reliably even if clicked rapidly
	 */
	const [spawnCount, setSpawnCount] = useState(0)

	const handleSpawn = () => {
		setSpawnCount((prev) => prev + 1)
	}

	return (
		<main className="relative w-full h-screen overflow-hidden">
			{/**
       * EXPLAINER: Component Composition
       *
       * PhysicsCanvas is the background layer (fullscreen canvas)
       * NeubrutalistToggle is the UI layer (positioned absolutely)
       *
       * The toggle appears "on top" of the canvas via z-index.
       */}
			<PhysicsCanvas onSpawn={handleSpawn} spawnCount={spawnCount} />

			<NeubrutalistToggle onSpawn={handleSpawn} />

			{/**
       */}
		</main>
	)
}

/**
 * LEARNING CHECKPOINT: Application Architecture
 *
 * At this point, you should understand:
 * ✓ How components compose together
 * ✓ State management for triggering actions
 * ✓ Separation of concerns (UI vs Physics)
 * ✓ Layer ordering with z-index
 *
 * KEY CONCEPTS:
 *
 * 1. Component composition: Building complex UIs from simple parts
 * 2. Props: Passing callbacks between components
 * 3. State: Triggering effects in child components
 * 4. Layering: Canvas background + UI overlay
 *
 * NEXT STEPS:
 * - Run the app: pnpm dev
 * - Open DevTools console
 * - Click "SPAWN SHAPES" button
 * - Try dragging shapes
 * - Try clicking shapes to bounce them
 *
 * EXPERIMENTS TO TRY:
 * 1. Add a "Clear All" button
 *    Hint: Call World.clear() from getWorld()
 *
 * 2. Add an FPS counter
 *    Hint: Read engine.timing.lastDelta
 *    Calculate: 1000 / lastDelta
 *
 * 3. Add gravity controls
 *    Hint: engine.gravity.x and engine.gravity.y
 *    Try: { x: 0, y: 0 } for zero-G!
 *
 * 4. Add shape count display
 *    Hint: world.bodies.filter(b => !b.isStatic).length
 *
 * 5. Add sleeping body count
 *    Hint: world.bodies.filter(b => b.isSleeping).length
 */
