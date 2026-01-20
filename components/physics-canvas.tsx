/**
 * EXPLAINER: Custom Rendering with Canvas
 *
 * Matter.js has a built-in renderer, but we're implementing our own!
 * Why? Full control over the visual style (neubrutalist aesthetic).
 *
 * Custom rendering gives us:
 * - Complete control over colors, borders, shadows
 * - Ability to style sleeping bodies differently
 * - Better performance (we only draw what we need)
 * - Learning opportunity to understand canvas 2D API!
 *
 * CHALLENGE 6A: Understand the built-in renderer
 * Read: https://brm.io/matter-js/docs/classes/Render.html
 * Compare: How is our custom renderer different?
 *
 * CHALLENGE 6B: Before looking at this code, try implementing your own!
 * Hints:
 * - Use requestAnimationFrame for smooth rendering
 * - Clear canvas each frame
 * - Loop through world.bodies
 * - Use ctx.save()/restore() for transforms
 * - Translate to body position, rotate by body angle
 *
 * Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 */

'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Matter from 'matter-js'
import { useMatter } from '@/hooks/use-matter'
import { createRandomShape } from '@/lib/shape-factory'
import { STYLE_CONFIG } from '@/lib/matter-config'

interface PhysicsCanvasProps {
	onSpawn: () => void
	spawnCount: number
}

export function PhysicsCanvas({ onSpawn, spawnCount }: PhysicsCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	// Start with 0 for SSR, will be set on client mount
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
	const animationFrameRef = useRef<number | undefined>(undefined)
	const [isMounted, setIsMounted] = useState(false)

	/**
	 * EXPLAINER: Collision Handler with Visual Feedback
	 *
	 * This gets called every time two bodies collide.
	 * We implement a "flash" effect on impact!
	 *
	 * How it works:
	 * 1. Collision event fires
	 * 2. For each collision pair:
	 *    a. Save original color
	 *    b. Change to white (flash)
	 *    c. After 100ms, restore original color
	 *
	 * CHALLENGE 4A: Uncomment console.log to see collision data
	 * CHALLENGE 4B: Try different flash colors or durations
	 * CHALLENGE 4C: Scale flash intensity based on collision.depth
	 */
	const handleCollision = useCallback((event: Matter.IEventCollision<Matter.Engine>) => {
		/**
		 * CHALLENGE 4A: Understanding Collision Data
		 *
		 * Uncomment this to see what's in a collision event:
		 * - pairs: array of collision pairs
		 * - Each pair has: bodyA, bodyB, collision info
		 * - collision.depth: how deep the overlap is
		 * - collision.normal: direction of collision
		 */
		// console.log('Collision!', event.pairs)

		/**
		 * Loop through each collision pair and create flash effect
		 */
		event.pairs.forEach((pair) => {
			const { bodyA, bodyB } = pair

			// Only flash dynamic bodies (not walls)
			const bodiesToFlash = [bodyA, bodyB].filter((body) => !body.isStatic)

			bodiesToFlash.forEach((body) => {
				// Save original color
				const originalColor = body.render.fillStyle

				/**
				 * CHALLENGE 4B: Experiment with flash effects!
				 *
				 * Try these variations:
				 * - White flash: '#FFFFFF'
				 * - Yellow flash: '#FFFF00'
				 * - Scale intensity: Use collision.depth
				 * - Different durations: 50ms vs 200ms
				 * - Pulse effect: flash multiple times
				 */

				// Flash to white
				body.render.fillStyle = '#FFFFFF'

				/**
				 * ADVANCED CHALLENGE 4C: Intensity-based flash
				 *
				 * Collision depth tells us how hard the impact was.
				 * Deeper collision = harder impact = brighter/longer flash
				 *
				 * Try implementing:
				 * const intensity = Math.min(pair.collision.depth / 10, 1)
				 * const flashDuration = 50 + intensity * 150
				 * const flashColor = `rgba(255, 255, 255, ${intensity})`
				 */

				// Restore original color after delay
				setTimeout(() => {
					body.render.fillStyle = originalColor as string
				}, 100)
			})
		})
	}, [])

	const { addBody, getWorld, getEngine } = useMatter({
		canvasRef,
		width: dimensions.width,
		height: dimensions.height,
		onCollision: handleCollision,
	})

	/**
	 * EXPLAINER: Canvas Resize Handling
	 *
	 * Canvas must match viewport size for proper rendering.
	 * We listen for window resize and update canvas dimensions.
	 *
	 * Why both canvas attributes AND CSS?
	 * - Canvas width/height attributes = drawing resolution
	 * - CSS width/height = display size
	 * - They must match for crisp rendering!
	 */
	useEffect(() => {
		// Mark as mounted (client-side only)
		setIsMounted(true)

		let resizeTimeout: NodeJS.Timeout

		const updateDimensions = () => {
		  clearTimeout(resizeTimeout)
		  resizeTimeout = setTimeout(() => {
			setDimensions({
			  width: window.innerWidth,
			  height: window.innerHeight,
			})
		  }, 250) // Wait 250ms after resize stops
		}

		updateDimensions()
		window.addEventListener('resize', updateDimensions)

		return () => {
			window.removeEventListener('resize', updateDimensions)
		}
	}, [])

	/**
	 * CHALLENGE 6B: Custom Render Loop Implementation
	 *
	 * This is the heart of custom rendering!
	 *
	 * How it works:
	 * 1. requestAnimationFrame calls our draw function at 60 FPS
	 * 2. Clear the entire canvas (blank slate)
	 * 3. Loop through all bodies in the world
	 * 4. For each body:
	 *    a. Save canvas state
	 *    b. Translate to body position (move canvas origin)
	 *    c. Rotate by body angle (rotate canvas)
	 *    d. Draw the body shape
	 *    e. Restore canvas state (undo transforms)
	 * 5. Request next frame
	 *
	 * QUESTION: Why save/restore canvas state?
	 * Answer: Transforms (translate, rotate) are cumulative!
	 * Without restore, each body would be positioned relative to the last.
	 */
	useEffect(() => {
		const canvas = canvasRef.current
		const world = getWorld()
		if (!canvas || !world) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		/**
		 * EXPLAINER: The Render Loop
		 *
		 * requestAnimationFrame is how we create smooth animations.
		 * It calls our function before the next repaint (60 FPS on most screens).
		 *
		 * Why not setInterval?
		 * - requestAnimationFrame syncs with monitor refresh rate
		 * - Pauses when tab is inactive (saves CPU/battery)
		 * - Better performance for animations
		 *
		 * Docs: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
		 */
		const render = () => {
			// Clear canvas (entire screen)
			ctx.clearRect(0, 0, canvas.width, canvas.height)

			/**
			 * Draw each body in the world
			 *
			 * CHALLENGE 5A: Visualize sleeping bodies
			 * Check body.isSleeping and use different colors:
			 * - Awake: vibrant colors (from render.fillStyle)
			 * - Sleeping: gray or desaturated colors
			 */
			world.bodies.forEach((body) => {
				// Skip rendering walls (they're transparent)
				if (body.isStatic) return

				/**
				 * EXPLAINER: Canvas Transformations
				 *
				 * Canvas has a transformation matrix. We manipulate it to:
				 * 1. save() - Save current state
				 * 2. translate() - Move origin to body position
				 * 3. rotate() - Rotate canvas by body angle
				 * 4. Draw at (0,0) - Now (0,0) is the body's center!
				 * 5. restore() - Reset to saved state
				 *
				 * This is easier than calculating rotated vertex positions manually!
				 */
				ctx.save()

				// Move origin to body center
				ctx.translate(body.position.x, body.position.y)

				// Rotate canvas by body angle (in radians)
				ctx.rotate(body.angle)

				/**
				 * CHALLENGE 6C: Neubrutalist Styling
				 *
				 * We're applying thick borders and hard shadows.
				 * Key differences from normal rendering:
				 * - lineWidth: 5 (thick borders are essential!)
				 * - shadowBlur: 0 (hard shadows, no blur!)
				 * - shadowOffset: 8 (offset shadow for depth)
				 *
				 * Try changing these values to see the effect!
				 */

				// Apply neubrutalist styling
				// Generate random brutalist color if not set
				if (!body.render.fillStyle) {
					const brutalistColors = ['#FF00FF', '#00FF00', '#FFFF00', '#00FFFF', '#FF6B00', '#FF0080', '#80FF00', '#0080FF']
					body.render.fillStyle = brutalistColors[Math.floor(Math.random() * brutalistColors.length)]
				}
				ctx.fillStyle = body.render.fillStyle
				ctx.strokeStyle = STYLE_CONFIG.strokeColor
				ctx.lineWidth = STYLE_CONFIG.lineWidth

				// Hard shadow (no blur = neubrutalism!)
				ctx.shadowColor = STYLE_CONFIG.shadowColor
				ctx.shadowOffsetX = STYLE_CONFIG.shadowOffset
				ctx.shadowOffsetY = STYLE_CONFIG.shadowOffset
				ctx.shadowBlur = 0 // Zero blur = hard shadow

				/**
				 * EXPLAINER: Drawing Different Shape Types
				 *
				 * Bodies can be circles or polygons (with vertices).
				 * We check the shape type and draw accordingly.
				 *
				 * Circles: Use ctx.arc()
				 * Polygons: Use ctx.beginPath() and draw vertices
				 */
				if (body.circleRadius) {
					// Draw circle
					ctx.beginPath()
					ctx.arc(0, 0, body.circleRadius, 0, Math.PI * 2)
					ctx.fill()
					ctx.stroke()
				} else {
					// Draw polygon from vertices
					const vertices = body.vertices

					ctx.beginPath()
					ctx.moveTo(vertices[0].x - body.position.x, vertices[0].y - body.position.y)

					for (let i = 1; i < vertices.length; i++) {
						ctx.lineTo(vertices[i].x - body.position.x, vertices[i].y - body.position.y)
					}

					ctx.closePath()
					ctx.fill()
					ctx.stroke()
				}

				/**
				 * CHALLENGE 6C: Why translate to body.position first?
				 *
				 * Try removing the translate and see what happens!
				 *
				 * Answer: Without translate, rotation happens around (0,0) canvas origin,
				 * not the body's center. Bodies would orbit the corner instead of
				 * rotating in place!
				 */

				ctx.restore()
			})

			// Request next frame
			animationFrameRef.current = requestAnimationFrame(render)
		}

		// Start render loop
		render()

		// Cleanup: stop render loop on unmount
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}
		}
	}, [getWorld])

	/**
	 * EXPLAINER: Spawning Shapes
	 *
	 * When the toggle is clicked, we spawn 30-50 shapes.
	 * Each shape:
	 * 1. Gets random X position across screen width
	 * 2. Starts at Y = 0 (top of screen)
	 * 3. Is created by shape factory (random type)
	 * 4. Is added to the physics world
	 *
	 * CHALLENGE: Try different spawn patterns!
	 * - Spawn in a circle
	 * - Spawn from sides
	 * - Spawn with initial velocity
	 */
	useEffect(() => {
		if (spawnCount === 0) return

		const canvas = canvasRef.current
		if (!canvas) return

		if (!addBody || dimensions.width === 0 || dimensions.height === 0) {
			return
		}

		// Spawn random number of shapes (30-50)
		const count = Math.floor(Math.random() * 21) + 30

		for (let i = 0; i < count; i++) {
			// Random X position across screen width
			const x = Math.random() * dimensions.width

			// Start at top of screen (slightly above so they're not visible immediately)
			const y = -50

			// Create random shape
			const shape = createRandomShape(x, y)

			/**
			 * ADVANCED: Add random initial velocity
			 * This makes shapes scatter more when spawned!
			 *
			 * CHALLENGE: Try different velocity patterns:
			 * - All to the right: { x: 5, y: 0 }
			 * - Explosion from center: radial velocity
			 * - Downward only: { x: 0, y: 5 }
			 */
			const initialVelocity = {
				x: (Math.random() - 0.5) * 2, // Random horizontal (-1 to 1)
				y: Math.random() * 2, // Random downward (0 to 2)
			}
			Matter.Body.setVelocity(shape, initialVelocity)

			// Add to physics world
			addBody(shape)
		}
	}, [spawnCount, addBody, dimensions.width, dimensions.height])

	/**
	 * CHALLENGE 5B: Performance Monitoring
	 *
	 * Add an FPS counter to learn about performance!
	 *
	 * Try this:
	 * 1. Create state for FPS
	 * 2. In useEffect, read engine.timing.lastDelta
	 * 3. Calculate FPS: 1000 / lastDelta
	 * 4. Update state every 60 frames
	 * 5. Display in UI
	 *
	 * Compare FPS with:
	 * - Sleeping enabled vs disabled
	 * - 50 shapes vs 200 shapes
	 * - Custom rendering vs Matter.Render
	 */

	// Don't render canvas until mounted (prevents hydration mismatch)
	if (!isMounted) {
		return (
			<div className="fixed inset-0 bg-[#F5F5DC] flex items-center justify-center">
				<p className="text-black font-bold">Loading physics engine...</p>
			</div>
		)
	}

	return (
		<canvas
			ref={canvasRef}
			width={dimensions.width}
			height={dimensions.height}
			className="fixed inset-0 bg-[#F5F5DC]"
			style={{ touchAction: 'none' }} // Prevent scrolling on touch devices
		/>
	)
}

/**
 * LEARNING CHECKPOINT: Custom Rendering
 *
 * At this point, you should understand:
 * ✓ How requestAnimationFrame works for smooth rendering
 * ✓ Why we save/restore canvas state
 * ✓ How translate and rotate work for positioning
 * ✓ The difference between circles and polygon rendering
 * ✓ How to apply neubrutalist styling (thick borders, hard shadows)
 *
 * KEY CONCEPTS:
 *
 * 1. Render loop: 60 FPS with requestAnimationFrame
 * 2. Clear canvas each frame (blank slate)
 * 3. Transform matrix: translate + rotate for positioning
 * 4. Shape detection: circleRadius vs vertices
 * 5. Neubrutalism: thick borders + hard shadows + bright colors
 *
 * NEXT CHALLENGES:
 * - Challenge 6A: Read about Matter.Render in docs
 * - Challenge 6B: Try implementing render from scratch
 * - Challenge 6C: Experiment with shadow offsets
 * - Challenge 6D: Add images or gradients to shapes
 *
 * ADVANCED EXPERIMENTS:
 * - Draw velocity vectors (arrows showing movement direction)
 * - Add trails that fade out over time
 * - Visualize collision points with dots
 * - Show body IDs or labels for debugging
 * - Different styles for sleeping vs awake bodies
 */
