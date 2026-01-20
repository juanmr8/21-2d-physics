/**
 * EXPLAINER: Physics Configuration
 *
 * These constants control how the physics world behaves in Matter.js.
 * Matter.js is a 2D rigid body physics engine - it simulates realistic
 * movement, collisions, and forces.
 *
 * CHALLENGE: After reading the docs, try changing these values:
 * - What happens with gravity.y = 2? (double gravity - things fall faster!)
 * - What about gravity.x = 0.5? (horizontal wind effect pushing everything right)
 * - Try enableSleeping: false - notice the performance impact in DevTools
 *
 * Docs: https://brm.io/matter-js/docs/classes/Engine.html
 */

/**
 * Core physics engine configuration
 *
 * These settings are passed to Engine.create() to control the simulation.
 */
export const PHYSICS_CONFIG = {
  /**
   * Gravity vector (x, y)
   * - x: horizontal gravity (0 = none, negative = left, positive = right)
   * - y: vertical gravity (1 = Earth-like, 0 = space, 2 = heavy planet)
   *
   * CHALLENGE 1A: Try { x: 0.5, y: 1 } for a wind effect!
   */
  gravity: { x: 0, y: 1 },

  /**
   * Enable sleeping bodies optimization
   * When true, bodies at rest stop being calculated (huge performance boost!)
   * They wake up automatically when hit by other bodies.
   *
   * CHALLENGE 5A: Toggle this and compare FPS with 100+ shapes
   */
  enableSleeping: true,

  /**
   * Position solver iterations
   * Higher = more accurate but slower
   * Lower = faster but bodies might overlap slightly
   *
   * Range: 4-10 typical
   * CHALLENGE 7D: Try 2 (fast), then 10 (accurate) and see the difference
   */
  positionIterations: 6,

  /**
   * Velocity solver iterations
   * Controls accuracy of velocity calculations after collisions
   *
   * Range: 2-8 typical
   */
  velocityIterations: 4,
} as const

/**
 * EXPLAINER: Sleeping Bodies
 *
 * "Sleeping" is an optimization where bodies that haven't moved for a while
 * are removed from physics calculations. They're like "paused" objects.
 *
 * Benefits:
 * - 50-70% less CPU usage with many objects
 * - Shapes at rest don't jitter (more stable)
 *
 * When do bodies sleep?
 * - After being still for `sleepThreshold` frames (usually 60 frames = 1 second)
 *
 * When do they wake up?
 * - When hit by another body
 * - When you drag them with the mouse
 * - When force is applied to them
 *
 * CHALLENGE 5A: Watch sleeping bodies in action!
 * Add this to your render loop to visualize sleeping:
 * if (body.isSleeping) ctx.fillStyle = 'gray'
 *
 * Docs: https://brm.io/matter-js/docs/classes/Sleeping.html
 */
export const SLEEPING_CONFIG = {
  /**
   * Number of frames a body must be still before sleeping
   * 60 frames = 1 second at 60 FPS
   */
  sleepThreshold: 60,
} as const

/**
 * EXPLAINER: Render Configuration
 *
 * These control how Matter.js draws bodies on the canvas.
 * We'll use custom rendering for neubrutalist style, so we disable wireframes.
 */
export const RENDER_CONFIG = {
  /**
   * Wireframe mode shows physics shapes as outlines
   * We want custom rendering, so this is false
   */
  wireframes: false,

  /**
   * Canvas background color
   * Transparent lets us control it with CSS
   */
  background: 'transparent',

  /**
   * Show collision debug info
   * Useful for learning! Set to true to see collision points
   */
  showDebug: false,
} as const

/**
 * EXPLAINER: Timing Configuration
 *
 * Controls the speed of the simulation.
 * Useful for debugging or creating slow-motion effects!
 */
export const TIMING_CONFIG = {
  /**
   * Time scale multiplier
   * 1.0 = normal speed
   * 0.5 = slow motion (half speed)
   * 2.0 = fast forward (double speed)
   *
   * CHALLENGE: Set to 0.1 to watch physics in slow-motion!
   * Great for understanding collisions.
   */
  timeScale: 1,
} as const

/**
 * EXPLAINER: Physical Properties for Bodies
 *
 * These define how shapes behave when they collide and move.
 *
 * CHALLENGE 2A: Create shapes with different values and observe:
 * - High restitution (0.9) = super bouncy
 * - Low restitution (0.1) = barely bounces
 * - High friction (0.8) = slides slowly
 * - Low friction (0.01) = ice skating!
 */
export const BODY_DEFAULTS = {
  /**
   * Restitution (bounciness) - range: 0 to 1
   * 0 = clay (no bounce)
   * 0.5 = tennis ball
   * 0.8 = basketball
   * 1 = perfect elastic collision (bounces forever)
   *
   * Docs: https://brm.io/matter-js/docs/classes/Body.html#property_restitution
   */
  restitution: 0.8,

  /**
   * Friction - range: 0 to 1
   * 0 = ice (no friction, slides forever)
   * 0.1 = smooth surface
   * 0.5 = normal surface
   * 1 = sandpaper (stops quickly)
   */
  friction: 0.1,

  /**
   * Air friction (drag)
   * 0 = no air resistance
   * 0.01 = minimal air resistance
   * 0.1 = strong air resistance
   */
  frictionAir: 0.01,

  /**
   * Density (kg/m²)
   * Higher density = heavier object
   * Affects how much force is needed to move it
   *
   * CHALLENGE: Make some shapes 0.001 density (balloons!)
   * and others 0.01 density (bowling balls!)
   */
  density: 0.001,
} as const

/**
 * Neubrutalist color palette
 * Bright, high-contrast colors with thick black borders
 */
export const COLORS = [
  '#FF00FF', // Magenta
  '#00FF00', // Lime green
  '#FFFF00', // Yellow
  '#00FFFF', // Cyan
  '#FF6B00', // Orange
  '#FF0080', // Hot pink
  '#80FF00', // Chartreuse
  '#0080FF', // Blue
] as const

/**
 * Visual styling constants for neubrutalist aesthetic
 */
export const STYLE_CONFIG = {
  /**
   * Border width for all shapes
   * Neubrutalism = thick, bold borders!
   */
  lineWidth: 1,

  /**
   * Hard drop shadow offset (no blur!)
   * Neubrutalism = hard shadows, never soft/blurred
   */
  shadowOffset: 8,

  /**
   * Shadow color (always black in neubrutalism)
   */
  shadowColor: '#000000',

  /**
   * Border color (always black in neubrutalism)
   */
  strokeColor: '#000000',
} as const

/**
 * Performance: Off-screen culling
 * Remove bodies that fall below the screen to prevent memory leaks
 *
 * CHALLENGE 5C: Why add a buffer?
 * If we remove exactly at window height, shapes might pop in/out of view.
 * The buffer keeps them alive a bit longer for smooth exit.
 */
export const CULLING_CONFIG = {
  /**
   * Extra pixels below screen before removing
   * Prevents shapes from disappearing while partially visible
   *
   * Increased to 500px to ensure shapes stack at bottom before culling
   */
  bufferZone: 500,
} as const
