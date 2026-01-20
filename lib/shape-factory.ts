/**
 * EXPLAINER: Shape Factory
 *
 * This file creates different geometric bodies using Matter.js.
 * Each function returns a "body" - an object with position, velocity, and shape.
 *
 * Bodies are the core of Matter.js:
 * - They have physical properties (mass, friction, bounciness)
 * - They respond to forces (gravity, collisions, mouse dragging)
 * - They can be static (walls) or dynamic (moving shapes)
 *
 * CHALLENGE 2A: Start by creating just circles
 * - Read Bodies.circle() docs
 * - Create a circle with different restitution values
 * - Drop it and watch how bounce height changes
 *
 * Docs: https://brm.io/matter-js/docs/classes/Bodies.html
 */

import Matter from 'matter-js'
import { BODY_DEFAULTS, COLORS } from './matter-config'

const { Bodies } = Matter

/**
 * EXPLAINER: What is restitution?
 *
 * Restitution (0-1) determines how "bouncy" a collision is:
 * - 0 = no bounce (like clay hitting the ground - all energy lost)
 * - 1 = perfect bounce (like a super ball - no energy lost)
 * - 0.8 = realistic bounce (like a basketball)
 *
 * Physics fact: In real life, restitution < 1 because energy is lost
 * as heat and sound during collisions!
 *
 * CHALLENGE 2A: Create shapes with different restitution values
 * and watch how they bounce differently.
 *
 * Docs: https://brm.io/matter-js/docs/classes/Body.html#property_restitution
 */

/**
 * Get a random color from the neubrutalist palette
 */
function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

/**
 * Get random value in range [min, max]
 */
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * CHALLENGE 2A: Create a Circle
 *
 * Before looking at this implementation, try it yourself:
 * 1. Read Bodies.circle() in the docs
 * 2. Create a circle at position (400, 100) with radius 30
 * 3. Add restitution: 0.8
 * 4. What other properties can you add?
 *
 * Signature: Bodies.circle(x, y, radius, options)
 */
export function createCircle(x: number, y: number): Matter.Body {
  const radius = randomInRange(20, 50)

  return Bodies.circle(x, y, radius, {
    restitution: BODY_DEFAULTS.restitution,
    friction: BODY_DEFAULTS.friction,
    frictionAir: BODY_DEFAULTS.frictionAir,
    density: BODY_DEFAULTS.density,

    // Render properties for custom drawing
    render: {
      fillStyle: getRandomColor(),
      strokeStyle: '#000000',
      lineWidth: 5,
    },
  })
}

/**
 * Create a rectangle with random dimensions
 *
 * EXPLAINER: Rectangles in Matter.js
 * Bodies.rectangle(x, y, width, height, options)
 *
 * Unlike circles, rectangles have rotation (angle property)
 * and can have different aspect ratios for variety.
 */
export function createRectangle(x: number, y: number): Matter.Body {
  const width = randomInRange(30, 80)
  const height = randomInRange(30, 80)

  return Bodies.rectangle(x, y, width, height, {
    restitution: BODY_DEFAULTS.restitution,
    friction: BODY_DEFAULTS.friction,
    frictionAir: BODY_DEFAULTS.frictionAir,
    density: BODY_DEFAULTS.density,

    // Random initial rotation (in radians)
    angle: Math.random() * Math.PI * 2,

    render: {
      fillStyle: getRandomColor(),
      strokeStyle: '#000000',
      lineWidth: 5,
    },
  })
}

/**
 * CHALLENGE 2B: Create Regular Polygons
 *
 * Bodies.polygon(x, y, sides, radius, options)
 *
 * Before looking at the implementation:
 * 1. What's the difference between 'sides' and 'radius'?
 * 2. How do you make a triangle? (Hint: how many sides?)
 * 3. Try creating a pentagon (5 sides) and hexagon (6 sides)
 *
 * Question: Why does a polygon need a radius but rectangle needs width/height?
 * Answer: Polygons are defined by vertices on a circle of that radius!
 *
 * Docs: https://brm.io/matter-js/docs/classes/Bodies.html#method_polygon
 */
export function createPolygon(x: number, y: number, sides: number): Matter.Body {
  const radius = randomInRange(25, 45)

  return Bodies.polygon(x, y, sides, radius, {
    restitution: BODY_DEFAULTS.restitution,
    friction: BODY_DEFAULTS.friction,
    frictionAir: BODY_DEFAULTS.frictionAir,
    density: BODY_DEFAULTS.density,

    angle: Math.random() * Math.PI * 2,

    render: {
      fillStyle: getRandomColor(),
      strokeStyle: '#000000',
      lineWidth: 5,
    },
  })
}

/**
 * Create a triangle (3-sided polygon)
 *
 * CHALLENGE 2B: Why is this just calling createPolygon?
 * Can you make it more interesting? Try:
 * - Isosceles triangles (different base/height)
 * - Right triangles
 * - Using Bodies.fromVertices() for custom shapes
 */
export function createTriangle(x: number, y: number): Matter.Body {
  return createPolygon(x, y, 3)
}

/**
 * Create a pentagon (5-sided polygon)
 */
export function createPentagon(x: number, y: number): Matter.Body {
  return createPolygon(x, y, 5)
}

/**
 * Create a hexagon (6-sided polygon)
 */
export function createHexagon(x: number, y: number): Matter.Body {
  return createPolygon(x, y, 6)
}

/**
 * Create an octagon (8-sided polygon)
 */
export function createOctagon(x: number, y: number): Matter.Body {
  return createPolygon(x, y, 8)
}

/**
 * CHALLENGE 2C: Create a Star Shape
 *
 * This is more advanced! Stars aren't a built-in shape.
 * We need to calculate vertex positions manually.
 *
 * How it works:
 * 1. Stars have alternating inner and outer vertices
 * 2. Outer vertices are at 'outerRadius' distance
 * 3. Inner vertices are at 'innerRadius' distance
 * 4. We rotate around the center, placing vertices
 *
 * Math refresher:
 * - x = centerX + radius * cos(angle)
 * - y = centerY + radius * sin(angle)
 * - Angle in radians: (degrees * Math.PI / 180)
 *
 * CHALLENGE: Before looking at the code, try drawing this on paper!
 * - 5 outer points
 * - 5 inner points
 * - Alternating pattern
 *
 * Docs: https://brm.io/matter-js/docs/classes/Bodies.html#method_fromVertices
 */
export function createStar(
  x: number,
  y: number,
  points: number = 5
): Matter.Body {
  const outerRadius = randomInRange(30, 50)
  const innerRadius = outerRadius * 0.4 // Inner points are 40% of outer

  // Calculate vertices by going around the circle
  const vertices: Matter.Vector[] = []
  const angleStep = (Math.PI * 2) / (points * 2) // Total points = outer + inner

  for (let i = 0; i < points * 2; i++) {
    // Alternate between outer and inner radius
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const angle = i * angleStep - Math.PI / 2 // Start at top

    vertices.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    })
  }

  /**
   * EXPLAINER: Bodies.fromVertices()
   *
   * This creates a custom shape from vertex points.
   * Vertices must be in clockwise or counter-clockwise order.
   * Matter.js will calculate the center and physics properties.
   *
   * Note: We pass vertices as relative to (0,0), then position at (x,y)
   */
  const star = Bodies.fromVertices(x, y, [vertices], {
    restitution: BODY_DEFAULTS.restitution,
    friction: BODY_DEFAULTS.friction,
    frictionAir: BODY_DEFAULTS.frictionAir,
    density: BODY_DEFAULTS.density,

    render: {
      fillStyle: getRandomColor(),
      strokeStyle: '#000000',
      lineWidth: 5,
    },
  })

  return star
}

/**
 * Create a 5-point star
 */
export function create5PointStar(x: number, y: number): Matter.Body {
  return createStar(x, y, 5)
}

/**
 * Create a 6-point star
 */
export function create6PointStar(x: number, y: number): Matter.Body {
  return createStar(x, y, 6)
}

/**
 * ADVANCED CHALLENGE: Create irregular polygons
 *
 * These are custom shapes with randomly placed vertices.
 * Great for creating organic, chaotic shapes!
 *
 * CHALLENGE: Can you create:
 * - A blob shape (random radius for each vertex)
 * - An L-shape
 * - A crescent moon
 */
export function createIrregularPolygon(x: number, y: number): Matter.Body {
  const vertexCount = Math.floor(randomInRange(4, 8))
  const baseRadius = randomInRange(25, 45)

  const vertices: Matter.Vector[] = []
  const angleStep = (Math.PI * 2) / vertexCount

  for (let i = 0; i < vertexCount; i++) {
    // Randomly vary the radius for each vertex (0.7 to 1.3 of base)
    const radius = baseRadius * randomInRange(0.7, 1.3)
    const angle = i * angleStep

    vertices.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    })
  }

  const shape = Bodies.fromVertices(x, y, [vertices], {
    restitution: BODY_DEFAULTS.restitution,
    friction: BODY_DEFAULTS.friction,
    frictionAir: BODY_DEFAULTS.frictionAir,
    density: BODY_DEFAULTS.density,

    render: {
      fillStyle: getRandomColor(),
      strokeStyle: '#000000',
      lineWidth: 5,
    },
  })

  return shape
}

/**
 * EXPLAINER: Shape Factory Types
 *
 * We maintain an array of all shape creation functions.
 * This lets us randomly select a shape type when spawning.
 */
type ShapeFactory = (x: number, y: number) => Matter.Body

const SHAPE_FACTORIES: ShapeFactory[] = [
  createCircle,
  createRectangle,
  createTriangle,
  createPentagon,
  createHexagon,
  createOctagon,
  create5PointStar,
  create6PointStar,
  createIrregularPolygon,
]

/**
 * Create a random shape at the given position
 *
 * This is the main function used by the physics canvas
 * to spawn diverse shapes.
 *
 * CHALLENGE: Add weights to make some shapes more common
 * For example, circles 40% of the time, others evenly distributed
 */
export function createRandomShape(x: number, y: number): Matter.Body {
  const factory = SHAPE_FACTORIES[Math.floor(Math.random() * SHAPE_FACTORIES.length)]
  return factory(x, y)
}

/**
 * LEARNING CHECKPOINT: Understanding Bodies
 *
 * At this point, you should understand:
 * ✓ How to create basic shapes (circle, rectangle, polygon)
 * ✓ What physical properties control behavior (restitution, friction, density)
 * ✓ How to create custom shapes with vertices
 * ✓ The difference between built-in shapes and custom vertices
 *
 * NEXT STEPS:
 * 1. Try Challenge 2A - experiment with restitution values
 * 2. Try Challenge 2B - create different polygon shapes
 * 3. Try Challenge 2C - modify the star function to create different patterns
 *
 * EXPERIMENT IDEAS:
 * - Make "heavy" shapes with density: 0.01
 * - Make "balloon" shapes with density: 0.0001
 * - Create shapes with high friction (0.9) vs low friction (0.01)
 * - Make perfectly elastic shapes with restitution: 1.0
 */
