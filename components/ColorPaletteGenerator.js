import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ColorPaletteGenerator = () => {
  const COLORS = {
    blue: '#3B82F6',
    pink: '#EC4899',
    yellow: '#EAB308',
    orange: '#F97316',
    darkPurple: '#7E22CE',
    black: '#171717',
    red: '#DC2626'
  };

  const [selectedPalette, setSelectedPalette] = useState('warm');
  const [selectedDistribution, setSelectedDistribution] = useState('random');
  const [generatedColors, setGeneratedColors] = useState([]);

  const CIRCLE_COUNT = 25;

  const distributions = {
    random: (colors) => colors.sort(() => Math.random() - 0.5),
    gradient: (colors) => {
      // Group same colors together and arrange them
      const grouped = {};
      colors.forEach(color => {
        const name = Object.entries(COLORS).find(([_, hex]) => hex === color)[0];
        grouped[name] = grouped[name] || [];
        grouped[name].push(color);
      });
      return Object.values(grouped).flat();
    },
    alternating: (colors) => {
      // Find unique colors and create alternating pattern
      const unique = [...new Set(colors)];
      return Array(CIRCLE_COUNT).fill(null)
        .map((_, i) => unique[i % unique.length]);
    },
    symmetrical: (colors) => {
      // Creates a symmetrical pattern from center
      const unique = [...new Set(colors)];
      const halfLength = Math.floor(CIRCLE_COUNT / 2);
      const firstHalf = Array(halfLength).fill(null)
        .map((_, i) => unique[i % unique.length]);
      return [...firstHalf, ...firstHalf.slice().reverse()];
    },
    waves: (colors) => {
      // Creates a wavelike pattern repeating every 4-5 elements
      const unique = [...new Set(colors)];
      const waveSize = 4;
      return Array(CIRCLE_COUNT).fill(null)
        .map((_, i) => {
          const wavePosition = i % waveSize;
          const colorIndex = Math.floor(wavePosition / (waveSize / unique.length));
          return unique[colorIndex % unique.length];
        });
    }
  };

  const generatePalette = (type, distribution) => {
    let palette = [];

    const repeatColors = (baseColors, count) => {
      const repeated = [];
      while (repeated.length < count) {
        repeated.push(...baseColors);
      }
      return repeated.slice(0, count);
    };

    switch (type) {
      case 'primary':
        palette = repeatColors([COLORS.red, COLORS.yellow, COLORS.blue], CIRCLE_COUNT);
        break;
      case 'warm':
        palette = repeatColors([COLORS.yellow, COLORS.orange, COLORS.red], CIRCLE_COUNT);
        break;
      case 'cool':
        palette = repeatColors([COLORS.blue, COLORS.darkPurple, COLORS.black], CIRCLE_COUNT);
        break;
      case 'monochrome':
        const baseColor = [COLORS.blue, COLORS.pink, COLORS.yellow, COLORS.orange, COLORS.darkPurple, COLORS.black][
          Math.floor(Math.random() * 6)
        ];
        palette = new Array(CIRCLE_COUNT).fill(baseColor);
        break;
      case 'full':
        palette = repeatColors(
          [COLORS.blue, COLORS.pink, COLORS.yellow, COLORS.orange, COLORS.darkPurple, COLORS.black],
          CIRCLE_COUNT
        );
        break;
      case 'light':
        palette = repeatColors([COLORS.yellow, COLORS.orange, COLORS.pink], CIRCLE_COUNT);
        break;
      case 'custom1':
        const mainColors = repeatColors([COLORS.yellow, COLORS.orange, COLORS.pink], Math.floor(CIRCLE_COUNT * 0.8));
        const blackCount = CIRCLE_COUNT - mainColors.length;
        palette = [...mainColors, ...new Array(blackCount).fill(COLORS.black)];
        break;
      case 'oneOff':
        const mainColor = [COLORS.blue, COLORS.pink, COLORS.yellow, COLORS.orange, COLORS.darkPurple, COLORS.black][
          Math.floor(Math.random() * 6)
        ];
        const accentColor = [COLORS.blue, COLORS.pink, COLORS.yellow, COLORS.orange, COLORS.darkPurple, COLORS.black]
          .filter(c => c !== mainColor && c !== COLORS.red)
          [Math.floor(Math.random() * 5)];
        
        const mainColorCount = Math.floor(CIRCLE_COUNT * 0.8);
        palette = [
          ...new Array(mainColorCount).fill(mainColor),
          ...new Array(CIRCLE_COUNT - mainColorCount).fill(accentColor)
        ];
        break;
      case 'sunset':
        palette = repeatColors([COLORS.yellow, COLORS.orange, COLORS.pink, COLORS.darkPurple], CIRCLE_COUNT);
        break;
      case 'dawn':
        const dawnMainColors = repeatColors([COLORS.pink, COLORS.yellow], Math.floor(CIRCLE_COUNT * 0.8));
        const dawnAccents = new Array(CIRCLE_COUNT - dawnMainColors.length).fill(COLORS.black);
        palette = [...dawnMainColors, ...dawnAccents];
        break;
      case 'contrast':
        palette = repeatColors([COLORS.yellow, COLORS.black, COLORS.blue], CIRCLE_COUNT);
        break;
      case 'minimal':
        // Available colors excluding red
        const minimalColors = [COLORS.blue, COLORS.pink, COLORS.yellow, COLORS.orange, COLORS.darkPurple, COLORS.black];
        // Select two random colors
        const shuffled = minimalColors.sort(() => Math.random() - 0.5);
        const [color1, color2] = shuffled.slice(0, 2);
        // Create 50/50 distribution
        const halfCount = Math.floor(CIRCLE_COUNT / 2);
        palette = [
          ...new Array(halfCount).fill(color1),
          ...new Array(CIRCLE_COUNT - halfCount).fill(color2)
        ];
        break;
      case 'burntTip':
        // 90% warm colors (yellow, orange, pink)
        const warmCount = Math.floor(CIRCLE_COUNT * 0.9);
        const warmColors = repeatColors([COLORS.yellow, COLORS.orange, COLORS.pink], warmCount);
        
        // 10% cool colors (blue, black, purple) - randomly selected
        const coolCount = CIRCLE_COUNT - warmCount;
        const coolOptions = [COLORS.blue, COLORS.black, COLORS.darkPurple];
        const coolColors = Array(coolCount).fill(null).map(() => 
          coolOptions[Math.floor(Math.random() * coolOptions.length)]
        );
        
        palette = [...warmColors, ...coolColors];
        break;
      default:
        palette = new Array(CIRCLE_COUNT).fill(COLORS.blue);
    }

    // Apply selected distribution pattern
    palette = distributions[distribution](palette);
    setGeneratedColors(palette);
  };

  const paletteTypes = [
    'primary',
    'warm',
    'cool',
    'monochrome',
    'full',
    'light',
    'custom1',
    'oneOff',
    'sunset',
    'dawn',
    'contrast',
    'minimal',
    'burntTip'
  ];

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Sculpture Color Palette Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Color Palettes</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {paletteTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedPalette(type);
                    generatePalette(type, selectedDistribution);
                  }}
                  className={`px-4 py-2 rounded capitalize ${
                    selectedPalette === type 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Distribution Patterns</h3>
            <div className="flex flex-wrap gap-4">
              {Object.keys(distributions).map((pattern) => (
                <label key={pattern} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="distribution"
                    checked={selectedDistribution === pattern}
                    onChange={() => {
                      setSelectedDistribution(pattern);
                      generatePalette(selectedPalette, pattern);
                    }}
                    className="form-radio"
                  />
                  <span className="capitalize">{pattern}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-4">
            {generatedColors.map((color, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs mt-1">
                  {Object.entries(COLORS).find(([name, hex]) => hex === color)?.[0] || 'unknown'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorPaletteGenerator;
