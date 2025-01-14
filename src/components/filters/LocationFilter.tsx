import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const LocationFilter = ({ value, onChange }: LocationFilterProps) => {
  return (
    <div className="relative">
      <motion.div
        className="relative flex items-center rounded-lg border border-gray-200 bg-white shadow-sm"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter location..."
          className="block w-full rounded-lg border-0 py-2 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-600 sm:text-sm sm:leading-6"
        />
      </motion.div>

      {/* Location suggestions dropdown would go here */}
      {value && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-10 mt-1 w-full rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
        >
          {/* Example suggestions */}
          {['New York, NY', 'Los Angeles, CA', 'Chicago, IL'].map((location) => (
            <button
              key={location}
              onClick={() => onChange(location)}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50"
            >
              {location}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};
