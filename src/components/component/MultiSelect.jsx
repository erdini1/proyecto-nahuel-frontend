import { Select, SelectTrigger, SelectContent } from "@/components/ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";

export default function MultiSelect({ name, options, selected, onChange, displayValue, displayQuantity }) {
	const [open, setOpen] = useState(false);

	const handleSelect = (optionId) => {
		const updatedSelected = selected.includes(optionId)
			? selected.filter(id => id !== optionId)
			: [...selected, optionId];
		onChange(updatedSelected);
	};

	const renderSelectedItems = () => {
		if (selected.length === 0) {
			return `Seleccione ${name}`;
		}

		let displayText = "";
		if (selected.length <= displayQuantity) {
			displayText = selected.map((id) => {
				const selectedItem = options.find((item) => item.id === id);
				return selectedItem ? selectedItem[displayValue] : '';
			}).join(", ");
		} else {
			displayText = selected.slice(0, displayQuantity).map((id) => {
				const selectedItem = options.find((item) => item.id === id);
				return selectedItem ? selectedItem[displayValue] : '';
			}).join(", ");
			const additionalCount = selected.length - displayQuantity;
			displayText += ` (+${additionalCount})`;
		}

		return displayText;
	};

	return (
		<Select open={open} onOpenChange={setOpen}>
			<SelectTrigger>
				{renderSelectedItems()}
			</SelectTrigger>
			<SelectContent>
				<ScrollArea className="h-52">
					{options.map((option) => (
						<div
							key={option.id}
							className={`flex items-center cursor-pointer px-3 py-2 capitalize text-sm transform transition-all ${selected.includes(option.id) ? 'bg-gray-300 border hover:bg-gray-200' : 'bg-white text-black hover:bg-gray-100'}`}
							onClick={() => handleSelect(option.id)}
						>
							<input
								type="checkbox"
								checked={selected.includes(option.id)}
								onChange={() => handleSelect(option.id)}
								className="mr-2"
							/>
							{option[displayValue]}
						</div>
					))}
				</ScrollArea>
			</SelectContent>
		</Select>
	);
}