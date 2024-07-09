import React, { useState, useRef, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const MultiSelect = ({ options, selected, onChange, displayValue }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const toggleOption = (option) => {
		const newSelected = selected.includes(option.id)
			? selected.filter((id) => id !== option.id)
			: [...selected, option.id];
		onChange(newSelected);
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<div
				className="border rounded-lg p-2 cursor-pointer flex items-center justify-between shadow"
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className="flex items-center overflow-hidden space-x-1 h-8 w-32">
					{selected.length > 0 ? (
						selected.map((id) => (
							<span key={id} className="inline-block bg-blue-100 rounded px-2 py-1 text-xs whitespace-nowrap">
								{options.find((option) => option.id === id)[displayValue]}
							</span>
						))
					) : (
						<span className="text-gray-500 text-sm whitespace-nowrap">Seleccionar sector</span>
					)}
				</div>
				<svg
					className={`w-4 h-4 ml-2 transition-transform`}
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</div>
			{isOpen && (
				<div className="absolute z-10 bg-white border rounded-lg mt-1 w-full shadow-lg">
					<ScrollArea className="h-[150px]">
						{options.map((option) => (
							<div
								key={option.id}
								className="p-3 cursor-pointer hover:bg-gray-100 flex items-center text-sm"
								onClick={() => toggleOption(option)}
							>
								<Checkbox
									checked={selected.includes(option.id)}
									readOnly
									className="mr-2"
								/>
								{option[displayValue]}
							</div>
						))}
					</ScrollArea>
				</div>
			)}
		</div>
	);
};

export default MultiSelect;
