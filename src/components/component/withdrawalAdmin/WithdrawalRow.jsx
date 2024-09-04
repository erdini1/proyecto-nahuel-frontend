import { useState } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'

const WithdrawalRow = ({ cashMovement }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const handleRowClick = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<>
			<TableRow onClick={handleRowClick} className={`whitespace-nowrap hover:bg-gray-100`}>
				<TableCell className="w-1/6  py-4 capitalize">{cashMovement.Provider.name.toLowerCase()}</TableCell>
				<TableCell className="w-1/6  py-4">{cashMovement.CashRegister.User.firstName} {cashMovement.CashRegister.User.lastName}</TableCell>
				<TableCell className="w-1/12 py-4">{cashMovement.CashRegister.CashBox.description}</TableCell>
				<TableCell className="w-1/6  py-4">{format(toZonedTime(cashMovement.CashRegister.date, 'America/Argentina/Ushuaia'), 'dd/MM/yyyy')}</TableCell>
				<TableCell className="w-1/6  py-4">{cashMovement.time}</TableCell>
				<TableCell className="w-3/12 py-4">$ {cashMovement.amount}</TableCell>
			</TableRow>
		</>
	);
};

export default WithdrawalRow;