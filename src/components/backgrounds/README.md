# Background Animation System

A dynamic background animation system with AI-powered theme management and advanced customization options.

## Features

### 1. Animation Styles
- **Basic Animations**
  - `morph`: Organic shape morphing
  - `pulse`: Breathing effect
  - `wave`: Flowing motion
  - `float`: Gentle floating
  - `bounce`: Playful bouncing
  - `swirl`: Combined rotation and morphing
- **Advanced Animations**
  - `ripple`: Expanding circles
  - `vortex`: Spiral movement
  - `prism`: Geometric transformations
  - `liquid`: Fluid morphing
  - `constellation`: Star-like twinkling
  - `aurora`: Northern lights effect
  - `nebula`: Space-like expansion
  - `spiral`: Rotating scale effect

### 2. Color Schemes
- **Seasonal**
  - Spring: Fresh pastels
  - Summer: Bright and warm
  - Autumn: Rich earth tones
  - Winter: Cool blues and whites
- **Holidays**
  - Christmas: Red and green
  - Halloween: Orange and purple
  - Valentine's: Pink and red
  - New Year: Gold and silver
  - Easter: Soft pastels
  - Thanksgiving: Warm browns
  - St. Patrick's: Shades of green
- **Nature**
  - Tropical: Vibrant island colors
  - Desert: Warm sand tones
  - Rainforest: Rich greens
  - Ocean: Blues and cyans
  - Forest: Natural greens
  - Aurora: Northern lights
  - Galaxy: Deep space
- **Time of Day**
  - Dawn: Soft morning colors
  - Dusk: Sunset purples
  - Midnight: Deep blues
- **Moods**
  - Calm: Soft blues
  - Energetic: Bright oranges
  - Dreamy: Soft purples
  - Pastel: Gentle tones
  - Neon: Vibrant colors

### 3. AI Agent Control
- **Modes**
  - Auto: Fully automated theme selection
  - Assist: AI suggestions with manual approval
  - Manual: Full user control
- **Rules**
  - Time of Day: Adapt to current time
  - Seasonal: Match current season
  - Holiday: Special event themes
  - Mood: Context-aware themes
- **Preferences**
  - Intensity Range
  - Speed Range
  - Transition Effects

### 4. Customization Parameters
- **Basic**
  - Intensity: 0 to 1
  - Blur: 0 to 100px
- **Advanced**
  - Rotation Speed: 0 to 2
  - Scale Amount: 0.5 to 2
  - Move Distance: 0 to 50px

## Usage

### Basic Implementation
```typescript
import { FluidBackground } from './components/backgrounds/FluidBackground';

const App = () => (
  <FluidBackground
    colorScheme="spring"
    animationStyle="morph"
    speed={1}
    intensity={0.6}
  />
);
```

### With AI Control
```typescript
import { BackgroundControls } from './components/admin/BackgroundControls';

const AdminPanel = () => {
  const handlePresetChange = (preset) => {
    // Update background with new preset
  };

  return (
    <BackgroundControls
      onPresetChange={handlePresetChange}
      onExportPreset={() => {}}
      onImportPreset={(preset) => {}}
      currentPreset={currentPreset}
    />
  );
};
```

### Example Presets

1. Calm Morning
```typescript
{
  colorScheme: 'dawn',
  animationStyle: 'float',
  speed: 'slow',
  intensity: 0.4,
  customParams: {
    rotationSpeed: 0.5,
    scaleAmount: 1.1,
    moveDistance: 15
  }
}
```

2. Energetic Party
```typescript
{
  colorScheme: 'neon',
  animationStyle: 'vortex',
  speed: 'fast',
  intensity: 0.8,
  customParams: {
    rotationSpeed: 1.5,
    scaleAmount: 1.3,
    moveDistance: 40
  }
}
```

## Best Practices

1. **Theme Selection**
   - Use time-appropriate themes
   - Consider user context
   - Maintain brand consistency

2. **Performance**
   - Adjust intensity for lower-end devices
   - Use simpler animations for mobile
   - Implement proper cleanup

3. **Accessibility**
   - Maintain sufficient contrast
   - Avoid rapid animations
   - Provide toggle options

4. **Responsive Design**
   - Scale parameters for different screens
   - Adjust complexity for mobile
   - Test on various devices

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
