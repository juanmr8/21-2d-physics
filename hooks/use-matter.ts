/**
 * EXPLAINER: The Matter.js Physics Hook
 *
 * This hook manages the entire physics simulation lifecycle:
 * 1. Creates the physics engine
 * 2. Sets up the world (container for all bodies)
 * 3. Creates static boundaries (walls)
 * 4. Adds mouse interaction
 * 5. Runs the simulation loop
 * 6. Cleans up when component unmounts
 *
 * CHALLENGE 1A: After implementing, console.log the engine
 * Inspect: engine.timing, engine.gravity, engine.world
 *
 * The engine is the "heart" of Matter.js - it runs at 60 FPS by default,
 * updating all bodies, checking collisions, and applying forces.
 *
 * Docs: https://brm.io/matter-js/docs/classes/Engine.html
 */

'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { PHYSICS_CONFIG, SLEEPING_CONFIG, CULLING_CONFIG } from '@/lib/matter-config'

const { Engine, World, Bodies, Events } = Matter

/**
 * EXPLAINER: What is an Engine?
 *
 * The Engine is the physics simulation loop. Think of it as a game loop:
 *
 * Every frame (60 times per second):
 * 1. Apply gravity to all bodies
 * 2. Calculate velocities based on forces
 * 3. Update positions based on velocities
 * 4. Check for collisions between bodies
 * 5. Resolve collisions (bounce, friction)
 * 6. Put still bodies to sleep (optimization)
 *
 * Engine.create() - Creates the engine
 * Engine.run() - Starts the simulation loop
 *
 * CHALLENGE 1A: What's the difference between Engine.create() and Engine.run()?
 * - create() initializes the engine but doesn't start it
 * - run() starts the 60 FPS loop that updates physics
 */

/**
 * EXPLAINER: What is a World?
 *
 * The World is a container for all bodies and constraints.
 * Every engine has one world: engine.world
 *
 * World.add() - Add bodies or constraints
 * World.remove() - Remove bodies (important for cleanup!)
 *
 * CHALLENGE 5C: When should you remove bodies from the world?
 * - When they fall off-screen (off-screen culling)
 * - When they're no longer needed
 * - To prevent memory leaks!
 */

export interface UseMatterOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  width: number
  height: number
  onCollision?: (event: Matter.IEventCollision<Matter.Engine>) => void
}

export function useMatter({ canvasRef, width, height, onCollision }: UseMatterOptions) {
  const engineRef = useRef<Matter.Engine | null>(null)
  const runnerRef = useRef<Matter.Runner | null>(null)
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

	// Use provided dimensions
	if (width === 0 || height === 0) {
		return // Wait for real dimensions
	}

	console.log('✅ Physics initializing:', { width, height })

    /**
     * EXPLAINER: Engine Creation
     *
     * We pass configuration to control physics behavior:
     * - gravity: How strong is the pull downward
     * - enableSleeping: Should bodies at rest stop calculating?
     * - positionIterations: How accurate should collision resolution be?
     *
     * CHALLENGE 1A: Try different gravity values!
     * { x: 0, y: 2 } - double gravity (falls faster)
     * { x: 0.5, y: 1 } - horizontal wind + gravity
     * { x: 0, y: 0 } - zero gravity (space!)
     */
    const engine = Engine.create({
      gravity: { x: 0, y: 0.5 },
      enableSleeping: PHYSICS_CONFIG.enableSleeping,
      positionIterations: PHYSICS_CONFIG.positionIterations,
      velocityIterations: PHYSICS_CONFIG.velocityIterations,
    })

    /**
     * EXPLAINER: Sleeping Configuration
     *
     * When enableSleeping is true, Matter.js automatically manages
     * sleeping bodies based on the engine's default thresholds.
     *
     * Bodies will sleep after being still for about 60 frames (1 second).
     * You can see sleeping bodies with body.isSleeping
     */

    /**
     * EXPLAINER: Runner
     *
     * The Runner is what actually runs the engine loop.
     * It uses requestAnimationFrame internally for smooth 60 FPS.
     *
     * Alternative: You can run the engine manually in your own loop
     * with Engine.update(engine, delta)
     */
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    /**
     * CHALLENGE 1B: Static vs Dynamic Bodies
     *
     * Static bodies don't move. They're like immovable objects.
     * - isStatic: true means infinite mass
     * - They don't respond to gravity or forces
     * - Perfect for walls, floors, platforms
     *
     * Dynamic bodies move and respond to everything.
     * - isStatic: false (default)
     * - Affected by gravity, forces, collisions
     *
     * EXPERIMENT: What happens if you remove isStatic: true from the floor?
     * Answer: The floor will fall due to gravity!
     *
     * Docs: https://brm.io/matter-js/docs/classes/Body.html#property_isStatic
     */

    // Create boundaries (static bodies that don't move)
    const wallThickness = 50

    /**
     * IMPORTANT FIX: Floor Position
     *
     * The floor should be AT the bottom of the screen, not below it!
     * - y: height - wallThickness / 2 puts the TOP of the floor at screen bottom
     * - This lets shapes land visibly before being culled
     */
    const floor = Bodies.rectangle(width / 2, height - wallThickness / 2, width, wallThickness, {
      isStatic: true,
      label: 'floor',
      render: {
        fillStyle: 'transparent',
      },
    })

    // DEBUG: Log floor position
    console.log('🏢 Floor created at y:', height - wallThickness / 2, 'height:', height)

    const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, {
      isStatic: true,
      label: 'leftWall',
      render: {
        fillStyle: 'transparent',
      },
    })

    const rightWall = Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height,
      {
        isStatic: true,
        label: 'rightWall',
        render: {
          fillStyle: 'transparent',
        },
      }
    )

    // Add walls to world
    World.add(engine.world, [floor, leftWall, rightWall])

    /**
     * EXPLAINER: Mouse Constraint
     *
     * MouseConstraint lets you interact with physics bodies!
     * It creates an invisible "spring" between the mouse and clicked bodies.
     *
     * How it works:
     * 1. Click on a body
     * 2. MouseConstraint attaches to it
     * 3. Move your mouse
     * 4. The body follows via spring force
     * 5. Release to let it go
     *
     * CHALLENGE 3A: Test mouse interaction
     * - Can you drag shapes?
     * - What happens if you fling them?
     * - Try adjusting stiffness (0.01 = loose spring, 0.1 = tight spring)
     *
     * Docs: https://brm.io/matter-js/docs/classes/MouseConstraint.html
     */
    const mouse = Matter.Mouse.create(canvas)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.05, // Spring stiffness (0-1)
        render: {
          visible: false, // Hide the constraint line
        },
      },
    })

    World.add(engine.world, mouseConstraint)

    /**
     * CHALLENGE 3B: Click to Bounce
     *
     * We can detect mouse clicks and apply forces to bodies.
     * This creates a "bounce" effect when clicking shapes.
     *
     * Body.applyForce(body, position, force)
     * - body: the body to apply force to
     * - position: where on the body to apply it (affects rotation!)
     * - force: vector { x, y } of force magnitude
     *
     * EXPERIMENT:
     * - Try different force magnitudes: { x: 0, y: -0.01 } vs { x: 0, y: -0.1 }
     * - Apply force at body.position vs a corner
     * - What happens with horizontal force? { x: 0.05, y: 0 }
     *
     * Docs: https://brm.io/matter-js/docs/classes/Body.html#method_applyForce
     */
    const handleMouseClick = () => {
      const body = mouseConstraint.body
      if (body && !body.isStatic) {
        // Apply upward force for bounce effect
        Matter.Body.applyForce(body, body.position, { x: 0, y: -0.05 })
      }
    }

    canvas.addEventListener('click', handleMouseClick)

    /**
     * EXPLAINER: Collision Events
     *
     * Matter.js fires events when bodies collide:
     * - 'collisionStart': First moment of contact
     * - 'collisionActive': While bodies are touching
     * - 'collisionEnd': When bodies separate
     *
     * Each event contains 'pairs' - an array of collision pairs.
     * Each pair has: bodyA, bodyB, collision info (depth, normal, etc.)
     *
     * CHALLENGE 4A: Log all collisions to understand the data
     * console.log(event.pairs) - what do you see?
     *
     * Docs: https://brm.io/matter-js/docs/classes/Events.html
     */
    if (onCollision) {
      Events.on(engine, 'collisionStart', onCollision)
    }

    /**
     * EXPLAINER: Off-screen Culling (Performance Optimization)
     *
     * Bodies that fall below the screen should be removed.
     * Otherwise, they keep simulating forever = memory leak!
     *
     * We check every frame and remove bodies that are too far down.
     *
     * CHALLENGE 5C: Why add a buffer zone?
     * - If we remove at exact screen height, shapes disappear while visible
     * - Buffer lets them smoothly exit before removal
     * - Try removing the buffer and see shapes pop out of existence!
     */
    const cullOffscreenBodies = () => {
      const bodiesToRemove: Matter.Body[] = []

      engine.world.bodies.forEach((body) => {
        // Don't remove static bodies (walls)
        const cullThreshold = height + CULLING_CONFIG.bufferZone
        if (!body.isStatic && body.position.y > cullThreshold) {
          bodiesToRemove.push(body)
        }
      })

      if (bodiesToRemove.length > 0) {
        World.remove(engine.world, bodiesToRemove)
        // DEBUG: Log culling
        console.log(`🗑️ Culled ${bodiesToRemove.length} bodies at threshold:`, height + CULLING_CONFIG.bufferZone)
      }
    }

    // Run culling check every 60 frames (about 1 second)
    let frameCount = 0
    const afterUpdate = () => {
      frameCount++
      if (frameCount >= 60) {
        // TEMPORARILY DISABLED for debugging
        // cullOffscreenBodies()
        frameCount = 0
      }
    }

    Events.on(engine, 'afterUpdate', afterUpdate)

    // Store references for cleanup
    engineRef.current = engine
    runnerRef.current = runner
    mouseConstraintRef.current = mouseConstraint

    /**
     * EXPLAINER: Cleanup (CRITICAL!)
     *
     * When the component unmounts, we MUST clean up:
     * - Stop the runner (stops the physics loop)
     * - Remove all event listeners
     * - Clear the world
     *
     * If you don't clean up:
     * - Physics loop keeps running (CPU drain)
     * - Event listeners pile up (memory leak)
     * - Bodies accumulate in memory
     *
     * CHALLENGE: What happens if you comment out this cleanup?
     * Use Chrome DevTools > Performance to see the CPU usage!
     */
    return () => {
      // Remove event listeners
      canvas.removeEventListener('click', handleMouseClick)
      if (onCollision) {
        Events.off(engine, 'collisionStart', onCollision)
      }
      Events.off(engine, 'afterUpdate', afterUpdate)

      // Stop the runner
      Matter.Runner.stop(runner)

      // Clear the world
      World.clear(engine.world, false)

      // Clear the engine
      Engine.clear(engine)
    }
  }, [canvasRef, width, height, onCollision])

  /**
   * EXPLAINER: Adding Bodies to the World
   *
   * This function lets other components add shapes to the physics world.
   * It's used by the physics canvas when spawning new shapes.
   *
   * World.add() is how you introduce new bodies into the simulation.
   * After adding, they immediately start responding to physics!
   */
  const addBody = (body: Matter.Body) => {
    if (engineRef.current) {
      World.add(engineRef.current.world, body)
    }
  }

  /**
   * EXPLAINER: Accessing the World
   *
   * We expose the world so other components can:
   * - Read all current bodies (for rendering)
   * - Check collision state
   * - Monitor physics state
   *
   * CHALLENGE 5B: Performance Monitoring
   * Access world.bodies and count sleeping vs awake:
   * const sleeping = world.bodies.filter(b => b.isSleeping).length
   * const awake = world.bodies.filter(b => !b.isSleeping).length
   * console.log(`Sleeping: ${sleeping}, Awake: ${awake}`)
   */
  const getWorld = () => engineRef.current?.world

  /**
   * EXPLAINER: Accessing the Engine
   *
   * Expose engine for advanced use cases:
   * - Reading timing information (FPS, delta)
   * - Adjusting gravity dynamically
   * - Debugging physics state
   *
   * CHALLENGE 5B: FPS Counter
   * const fps = 1000 / engine.timing.lastDelta
   * console.log(`FPS: ${Math.round(fps)}`)
   */
  const getEngine = () => engineRef.current

  return {
    addBody,
    getWorld,
    getEngine,
  }
}

/**
 * LEARNING CHECKPOINT: Understanding the Physics Loop
 *
 * At this point, you should understand:
 * ✓ What an Engine is and how it runs
 * ✓ The difference between static and dynamic bodies
 * ✓ How mouse constraints work
 * ✓ Why cleanup is critical
 * ✓ How to add bodies to the world
 *
 * KEY CONCEPTS REVIEW:
 *
 * 1. Engine: The physics simulation loop (60 FPS)
 * 2. World: Container for all bodies
 * 3. Static bodies: Don't move (walls, floors)
 * 4. Dynamic bodies: Move and respond to physics
 * 5. Mouse constraint: Lets you drag bodies
 * 6. Events: Callbacks for collisions and updates
 * 7. Cleanup: Stop loops and remove listeners on unmount
 *
 * NEXT CHALLENGES:
 * - Challenge 1A: Experiment with gravity values
 * - Challenge 1B: Try removing isStatic from walls
 * - Challenge 3A: Test mouse dragging
 * - Challenge 3B: Implement click-to-bounce
 * - Challenge 5C: Add console logs to see culling
 *
 * DEBUGGING TIPS:
 * Add this to your component to inspect the engine:
 * ```
 * useEffect(() => {
 *   const engine = getEngine()
 *   console.log('Engine:', engine)
 *   console.log('Bodies:', engine?.world.bodies)
 * }, [])
 * ```
 */
