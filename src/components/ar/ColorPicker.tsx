import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useClickOutside } from '../../hooks/useClickOutside';

interface ColorPickerProps {
    color: string | null;
    onChange: (color: string) => void;
    presetColors?: string[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
    color,
    onChange,
    presetColors = [],
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const popover = useClickOutside(() => setIsOpen(false));

    const handlePresetClick = (presetColor: string) => {
        onChange(presetColor);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <div className="flex flex-wrap gap-2 mb-4">
                {presetColors.map((presetColor) => (
                    <button
                        key={presetColor}
                        className={`w-8 h-8 rounded-full border-2 ${
                            color === presetColor
                                ? 'border-primary-500'
                                : 'border-gray-200'
                        } transition-colors`}
                        style={{ backgroundColor: presetColor }}
                        onClick={() => handlePresetClick(presetColor)}
                        aria-label={`Select color ${presetColor}`}
                    />
                ))}
            </div>

            <div className="relative">
                <button
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => setIsOpen(true)}
                >
                    <div className="flex items-center justify-between">
                        <span>Custom Color</span>
                        <div
                            className="w-6 h-6 rounded-full border border-gray-200"
                            style={{ backgroundColor: color || '#fff' }}
                        />
                    </div>
                </button>

                {isOpen && (
                    <div
                        ref={popover}
                        className="absolute z-10 mt-2 p-3 bg-white rounded-lg shadow-lg"
                    >
                        <HexColorPicker
                            color={color || '#fff'}
                            onChange={onChange}
                        />
                        <div className="mt-3 flex justify-between">
                            <input
                                type="text"
                                value={color || ''}
                                onChange={(e) => onChange(e.target.value)}
                                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                                placeholder="#FFFFFF"
                            />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Accessibility Features */}
            <div className="sr-only" aria-live="polite">
                {color
                    ? `Selected color: ${color}`
                    : 'No color selected'}
            </div>
        </div>
    );
};
