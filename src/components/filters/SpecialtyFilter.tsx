import { motion } from 'framer-motion';

interface SpecialtyOption {
  id: string;
  name: string;
}

interface SpecialtyFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: SpecialtyOption[];
}

export const SpecialtyFilter = ({ value, onChange, options }: SpecialtyFilterProps) => {
  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-lg border-gray-200 bg-white py-2 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm sm:leading-6"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>

      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <motion.svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
          initial={{ rotate: 0 }}
          animate={{ rotate: value ? 180 : 0 }}
        >
          <path d="M19 9l-7 7-7-7" />
        </motion.svg>
      </div>
    </motion.div>
  );
};
