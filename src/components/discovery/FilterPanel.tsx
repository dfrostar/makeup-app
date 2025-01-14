import React, { useState } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Filter {
    id: string;
    name: string;
    options: FilterOption[];
}

interface FilterOption {
    value: string;
    label: string;
    count?: number;
}

interface FilterPanelProps {
    filters: Filter[];
    selectedFilters: Record<string, string[]>;
    onFilterChange: (filterId: string, values: string[]) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
    filters,
    selectedFilters,
    onFilterChange,
}) => {
    const [expanded, setExpanded] = useState<string[]>([]);

    const toggleExpanded = (filterId: string) => {
        setExpanded(prev =>
            prev.includes(filterId)
                ? prev.filter(id => id !== filterId)
                : [...prev, filterId]
        );
    };

    const handleOptionChange = (filterId: string, value: string) => {
        const currentValues = selectedFilters[filterId] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        
        onFilterChange(filterId, newValues);
    };

    return (
        <div className="w-full max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
            </div>

            <div className="p-4 space-y-4">
                {filters.map((filter) => (
                    <Disclosure
                        key={filter.id}
                        as="div"
                        defaultOpen={expanded.includes(filter.id)}
                        onChange={() => toggleExpanded(filter.id)}
                    >
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="flex justify-between w-full py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:text-primary-500 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-50">
                                    <span>{filter.name}</span>
                                    <ChevronDownIcon
                                        className={`${
                                            open ? 'transform rotate-180' : ''
                                        } w-5 h-5 text-gray-500`}
                                    />
                                </Disclosure.Button>

                                <Transition
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                >
                                    <Disclosure.Panel className="pt-2 pb-4">
                                        <div className="space-y-2">
                                            {filter.options.map((option) => (
                                                <label
                                                    key={option.value}
                                                    className="flex items-center space-x-3 text-sm"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-4 w-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
                                                        checked={
                                                            selectedFilters[filter.id]?.includes(
                                                                option.value
                                                            ) || false
                                                        }
                                                        onChange={() =>
                                                            handleOptionChange(
                                                                filter.id,
                                                                option.value
                                                            )
                                                        }
                                                    />
                                                    <span className="text-gray-700 dark:text-gray-300">
                                                        {option.label}
                                                    </span>
                                                    {option.count !== undefined && (
                                                        <span className="text-gray-500 text-xs">
                                                            ({option.count})
                                                        </span>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    </Disclosure.Panel>
                                </Transition>
                            </>
                        )}
                    </Disclosure>
                ))}
            </div>

            {/* Active Filters */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedFilters).map(([filterId, values]) =>
                        values.map((value) => {
                            const filter = filters.find((f) => f.id === filterId);
                            const option = filter?.options.find(
                                (o) => o.value === value
                            );
                            
                            if (!filter || !option) return null;

                            return (
                                <span
                                    key={`${filterId}-${value}`}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                                >
                                    {option.label}
                                    <button
                                        type="button"
                                        className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary-600 hover:bg-primary-200 hover:text-primary-500 focus:outline-none focus:bg-primary-500 focus:text-white"
                                        onClick={() =>
                                            handleOptionChange(filterId, value)
                                        }
                                    >
                                        <span className="sr-only">
                                            Remove filter for {option.label}
                                        </span>
                                        ×
                                    </button>
                                </span>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
