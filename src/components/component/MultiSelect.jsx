import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "@radix-ui/react-icons";

export default function MultiSelect({ options, selected, onChange, displayValue }) {
	const handleSelect = (optionId) => {
		const updatedSelected = selected.includes(optionId)
			? selected.filter(id => id !== optionId)
			: [...selected, optionId];
		onChange(updatedSelected);
	};

	const renderSelectedItems = () => {
		if (selected.length === 0) {
			return "Seleccionar sectores";
		}

		let displayText = "";
		if (selected.length <= 3) {
			displayText = selected.map((id) => {
				const selectedItem = options.find((item) => item.id === id);
				return selectedItem ? selectedItem[displayValue] : '';
			}).join(", ");
		} else {
			displayText = selected.slice(0, 3).map((id) => {
				const selectedItem = options.find((item) => item.id === id);
				return selectedItem ? selectedItem[displayValue] : '';
			}).join(", ");
			const additionalCount = selected.length - 3;
			displayText += ` (+${additionalCount})`;
		}

		return displayText;
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" className="h-12 shadow text-gray-500 justify-between capitalize">
					{renderSelectedItems()}
					<ChevronDownIcon className="w-4 h-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-72">
				<div className="flex flex-wrap gap-2">
					{options.map((option) => (
						<div
							key={option.id}
							className={`cursor-pointer px-3 py-1 border rounded text-sm capitalize ${selected.includes(option.id) ? "bg-black text-white" : "bg-white text-black"
								}`}
							onClick={() => handleSelect(option.id)}
						>
							{option[displayValue]}
						</div>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}