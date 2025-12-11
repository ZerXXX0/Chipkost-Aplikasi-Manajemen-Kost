import React from 'react';
import { designTokens, getColor, getSpacing, getBorderRadius } from '../utils/designTokens';

/**
 * Template komponen berdasarkan design dari Figma
 * Ganti nilai-nilai ini dengan yang di-extract dari design Anda
 */
const DesignSystemExample = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Color Palette - Extract dari Figma */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Color Palette</h2>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(designTokens.colors).map(([name, color]) => (
              <div key={name} className="text-center">
                <div
                  className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-gray-200"
                  style={{ backgroundColor: color }}
                />
                <p className="text-sm font-medium capitalize">{name}</p>
                <p className="text-xs text-gray-500">{color}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Scale */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Typography Scale</h2>
          <div className="space-y-4">
            {Object.entries(designTokens.typography.fontSize).map(([size, value]) => (
              <div key={size} className="border-l-4 border-blue-500 pl-4">
                <p
                  className="font-medium"
                  style={{
                    fontSize: value,
                    fontFamily: designTokens.typography.fontFamily
                  }}
                >
                  Heading {size.toUpperCase()} - The quick brown fox jumps over the lazy dog
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {size}: {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Spacing Scale */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Spacing Scale</h2>
          <div className="space-y-4">
            {Object.entries(designTokens.spacing).map(([size, value]) => (
              <div key={size} className="flex items-center">
                <div
                  className="bg-blue-500 mr-4"
                  style={{ width: value, height: '1rem' }}
                />
                <span className="text-sm font-medium">{size}: {value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius Examples */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Border Radius</h2>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(designTokens.borderRadius).map(([size, value]) => (
              <div key={size} className="text-center">
                <div
                  className="w-16 h-16 bg-blue-500 mx-auto mb-2"
                  style={{ borderRadius: value }}
                />
                <p className="text-sm font-medium capitalize">{size}</p>
                <p className="text-xs text-gray-500">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Component Examples */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Component Examples</h2>

          {/* Button variants dari design Anda */}
          <div className="space-y-4">
            <button
              className="px-6 py-3 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: getColor('primary'),
                borderRadius: getBorderRadius('lg')
              }}
            >
              Primary Button
            </button>

            <button
              className="px-6 py-3 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-shadow ml-4"
              style={{
                backgroundColor: getColor('secondary'),
                borderRadius: getBorderRadius('lg')
              }}
            >
              Secondary Button
            </button>
          </div>

          {/* Card example */}
          <div
            className="mt-8 p-6 shadow-md"
            style={{
              backgroundColor: getColor('surface'),
              borderRadius: getBorderRadius('xl'),
              boxShadow: designTokens.shadows.md
            }}
          >
            <h3 className="text-xl font-semibold mb-2">Card Title</h3>
            <p className="text-gray-600">Card content dengan styling dari design system.</p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DesignSystemExample;