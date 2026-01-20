# Matter.js Physics Playground 🎯

A **formative learning project** for understanding 2D physics simulation with Matter.js. This project features a neubrutalist design with interactive physics shapes that you can spawn, drag, and bounce!

## 🎓 Learning Objectives

This project teaches you:

- **Core Physics Concepts**: Engine, World, Bodies, Forces, Collisions
- **Practical Skills**: Mouse interaction, custom rendering, performance optimization
- **Advanced Techniques**: Sleeping bodies, off-screen culling, collision events
- **Web APIs**: Canvas 2D rendering, requestAnimationFrame, event handling

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser to http://localhost:3000
```

## 🎮 How to Use

1. **Click "SPAWN SHAPES"** - Spawns 30-50 random geometric shapes
2. **Drag shapes** - Click and drag to move them around
3. **Click shapes** - Click on a shape to make it bounce upward
4. **Watch physics** - See gravity, collisions, and sleeping bodies in action!

## 📚 Project Structure

```
21-2d-physics/
├── lib/
│   ├── matter-config.ts      # Physics constants & config (START HERE!)
│   └── shape-factory.ts      # Shape creation functions
├── hooks/
│   └── use-matter.ts         # Physics engine lifecycle
├── components/
│   ├── physics-canvas.tsx    # Custom rendering & interaction
│   └── neubrutalist-toggle.tsx # UI button
└── app/
    └── page.tsx              # Main application
```

## 🎯 Learning Path

### Phase 1: Foundation (1-2 hours)

**Read First:**
- `lib/matter-config.ts` - Understand physics configuration
- [Matter.js Docs - Getting Started](https://brm.io/matter-js/docs/)

**Try:**
- ✅ **Challenge 1A**: Console.log the engine, inspect its properties
- ✅ **Challenge 1B**: Make the floor NOT static - what happens?
- ✅ **Challenge 2A**: Change restitution values, watch bounce behavior

**Experiment:**
```typescript
// In matter-config.ts, try:
gravity: { x: 0.5, y: 1 }  // Wind effect!
gravity: { x: 0, y: 2 }     // Heavy planet
gravity: { x: 0, y: 0 }     // Zero gravity
```

### Phase 2: Shapes & Bodies (2-3 hours)

**Read:**
- `lib/shape-factory.ts` - How shapes are created
- [Bodies Module Docs](https://brm.io/matter-js/docs/classes/Bodies.html)

**Try:**
- ✅ **Challenge 2B**: Create different polygons (triangle, pentagon, hexagon)
- ✅ **Challenge 2C**: Modify the star function to create 8-point stars
- ✅ **Advanced**: Create custom shapes with `Bodies.fromVertices()`

**Experiment:**
```typescript
// Create "balloon" shapes
density: 0.0001

// Create "bowling balls"  
density: 0.01

// Super bouncy
restitution: 1.0

// Ice skating (no friction)
friction: 0.01
```

### Phase 3: Interaction (2-3 hours)

**Read:**
- `hooks/use-matter.ts` - Engine setup and mouse interaction
- [MouseConstraint Docs](https://brm.io/matter-js/docs/classes/MouseConstraint.html)

**Try:**
- ✅ **Challenge 3A**: Test mouse dragging, observe behavior
- ✅ **Challenge 3B**: Modify click-to-bounce force magnitude
- ✅ **Challenge 3C**: Change shape color when grabbed

**Experiment:**
```typescript
// In handleMouseClick, try:
Body.applyForce(body, body.position, { x: 0.1, y: 0 })  // Sideways
Body.applyForce(body, body.position, { x: 0, y: -0.2 }) // Super bounce
```

### Phase 4: Collisions (1-2 hours)

**Read:**
- `components/physics-canvas.tsx` - Collision handler
- [Events Module Docs](https://brm.io/matter-js/docs/classes/Events.html)

**Try:**
- ✅ **Challenge 4A**: Uncomment collision logs, inspect the data
- ✅ **Challenge 4B**: Change flash color/duration on collision
- ✅ **Challenge 4C**: Scale flash by collision intensity (depth)

**Experiment:**
```typescript
// In handleCollision, try:
const intensity = Math.min(pair.collision.depth / 10, 1)
const flashColor = `rgba(255, 255, ${255 * (1 - intensity)}, ${intensity})`
```

### Phase 5: Performance (2-3 hours)

**Read:**
- Performance sections in `use-matter.ts` and `matter-config.ts`
- [Sleeping Docs](https://brm.io/matter-js/docs/classes/Sleeping.html)

**Try:**
- ✅ **Challenge 5A**: Visualize sleeping vs awake bodies
- ✅ **Challenge 5B**: Add FPS counter, monitor performance
- ✅ **Challenge 5C**: Watch off-screen culling in action

**Experiment:**
```typescript
// Add to render loop in physics-canvas.tsx:
if (body.isSleeping) {
  ctx.fillStyle = '#999999' // Gray for sleeping
} else {
  ctx.fillStyle = body.render.fillStyle // Normal color
}
```

### Phase 6: Custom Rendering (2-4 hours)

**Read:**
- Rendering section in `components/physics-canvas.tsx`
- [Canvas 2D API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

**Try:**
- ✅ **Challenge 6A**: Read Matter.Render source code
- ✅ **Challenge 6B**: Implement your own render loop from scratch
- ✅ **Challenge 6C**: Experiment with shadows and borders
- ✅ **Challenge 6D**: Add images or gradients to shapes

**Experiment:**
```typescript
// Try different visual effects:
ctx.shadowBlur = 10          // Soft shadow (not neubrutalist!)
ctx.lineWidth = 10           // Extra thick borders
ctx.globalAlpha = 0.8        // Semi-transparent
ctx.shadowColor = '#FF00FF'  // Colored shadow
```

### Phase 7: Advanced (Optional, 3-6 hours)

**Try:**
- ✅ **Challenge 7A**: Create constraint chains (wrecking ball)
- ✅ **Challenge 7B**: Build composite bodies (car with wheels)
- ✅ **Challenge 7C**: Implement mouse-based gravity
- ✅ **Challenge 7D**: Profile with Chrome DevTools

## 🧪 Experiments to Try

### Beginner
1. Change background color in `globals.css`
2. Modify spawn count (30-50 → 5-10 or 100+)
3. Add more colors to the palette
4. Make shapes spawn in a circle pattern

### Intermediate
5. Add FPS counter to the UI
6. Add body count display
7. Create a "Clear All" button
8. Add gravity control buttons (up, down, left, right, zero-G)
9. Show velocity vectors as arrows
10. Different colors for sleeping vs awake bodies

### Advanced
11. Add sound effects on collision (Web Audio API)
12. Implement shape trails that fade out
13. Create explosion effect (push shapes away from click)
14. Build a "shape wand" to spawn specific types
15. Add particle effects on collision
16. Implement shape destruction (remove on click)
17. Create a scoring system based on collisions
18. Save/load world state to localStorage

## 🐛 Debugging Tips

### Physics not working?
```typescript
// Add to useEffect in page.tsx:
useEffect(() => {
  const engine = getEngine()
  console.log('Engine:', engine)
  console.log('Bodies:', engine?.world.bodies)
  console.log('Gravity:', engine?.gravity)
}, [])
```

### Bodies falling through floor?
```typescript
// Check walls in use-matter.ts:
console.log('Floor:', engine.world.bodies.find(b => b.label === 'floor'))
// Should show isStatic: true
```

### Mouse not working?
```typescript
// Add to handleMouseClick:
console.log('Mouse constraint body:', mouseConstraint.body)
// Should show body when dragging
```

### Performance issues?
```typescript
// Add FPS monitoring:
setInterval(() => {
  const engine = getEngine()
  if (engine) {
    const fps = Math.round(1000 / engine.timing.lastDelta)
    const sleeping = engine.world.bodies.filter(b => b.isSleeping).length
    console.log(`FPS: ${fps}, Sleeping: ${sleeping}`)
  }
}, 1000)
```

## 📖 Key Concepts Explained

### Engine
The physics simulation loop that runs at 60 FPS. It calculates forces, updates positions, and detects collisions.

### World
A container for all bodies and constraints. Every engine has one world.

### Bodies
Objects with physics properties (position, velocity, mass). Can be static (walls) or dynamic (shapes).

### Static vs Dynamic
- **Static**: Don't move, infinite mass (walls, floors)
- **Dynamic**: Move and respond to forces (shapes you spawn)

### Restitution
Bounciness (0-1). Higher = more bounce. 1 = perfect elastic collision.

### Friction
Surface resistance (0-1). Higher = slides less. 0 = ice skating!

### Sleeping
Optimization where bodies at rest stop calculating. Saves CPU!

### Constraints
Connections between bodies (springs, ropes, hinges).

### Events
Callbacks for collisions, updates, etc.

## 🎨 Neubrutalist Design

This project uses neubrutalism - a bold, high-contrast design style:

- **Thick borders**: 4-6px solid black
- **Hard shadows**: Offset with no blur
- **Bright colors**: Saturated, vibrant palette
- **High contrast**: Black borders on light backgrounds
- **No subtlety**: Clear, immediate visual hierarchy

## 📚 Resources

### Official Documentation
- [Matter.js Docs](https://brm.io/matter-js/docs/)
- [Matter.js GitHub](https://github.com/liabru/matter-js)
- [Demo Gallery](https://brm.io/matter-js/demo/)

### Web APIs
- [Canvas 2D API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

### Physics Concepts
- [Rigid Body Dynamics](https://en.wikipedia.org/wiki/Rigid_body_dynamics)
- [Collision Detection](https://en.wikipedia.org/wiki/Collision_detection)

## 🎯 Verification Checklist

After completing the project, you should be able to:

### Basic Physics
- [ ] Explain what Engine, World, and Bodies are
- [ ] Understand static vs dynamic bodies
- [ ] Modify gravity and see the effect
- [ ] Create different shape types

### Interaction
- [ ] Drag shapes with mouse
- [ ] Apply forces to bodies
- [ ] Detect collisions
- [ ] Handle mouse events

### Performance
- [ ] Explain what sleeping bodies are
- [ ] Monitor FPS
- [ ] Understand off-screen culling
- [ ] Profile with DevTools

### Rendering
- [ ] Implement custom canvas rendering
- [ ] Use save/restore for transforms
- [ ] Draw circles and polygons
- [ ] Apply visual effects

### Problem Solving
- [ ] Read Matter.js documentation
- [ ] Debug physics issues
- [ ] Experiment with parameters
- [ ] Implement new features

## 🚀 Next Steps

Once you've mastered the basics:

1. **Build a Game**: Angry Birds clone, pinball, physics puzzler
2. **Create Art**: Generative art with physics
3. **Explore 3D**: Try Three.js with Cannon.js or Rapier
4. **Study Advanced Topics**: Soft body physics, fluid simulation

## 💡 Learning Philosophy

> "The goal isn't to finish fast - it's to understand deeply."

Every time you're tempted to copy code:
1. Read the relevant documentation
2. Try implementing it yourself first
3. Compare your solution with the provided code
4. Understand WHY it works that way

Happy physics hacking! 🎉
