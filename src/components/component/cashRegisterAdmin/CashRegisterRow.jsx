import { useState } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'
import PaymentMethodsTable from '@/components/component/cashRegisterAdmin/PaymentMethodsTable';
import CashMovementsTable from '@/components/component/cashRegisterAdmin/CashMovementsTable';
import CancellationsTable from '@/components/component/cashRegisterAdmin/CancellationsTable';

const CashRegisterRow = ({ cashRegister, cashMovementsFiltered, cancellationsFiltered }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const handleRowClick = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<>
			<TableRow onClick={handleRowClick} className={`whitespace-nowrap cursor-pointer ${isExpanded ? 'bg-gray-200 hover:bg-gray-100' : 'hover:bg-gray-50'}`}>
				<TableCell className="py-4 cursor-pointer">
					<ChevronDownIcon className={`h-4 w-4 ${isExpanded ? 'transform rotate-180' : ''}`} />
				</TableCell>
				<TableCell className="w-2/12 py-4 capitalize">{cashRegister.cashier}</TableCell>
				<TableCell className="w-2/12 py-4">{cashRegister.date}</TableCell>
				<TableCell className="w-1/12 py-4">{cashRegister.cashBoxNumber}</TableCell>
				<TableCell className="w-2/12 py-4">$ {cashRegister.totalPaymentMethods.toFixed(2)}</TableCell>
				<TableCell className={`w-2/12 py-4 ${cashRegister.totalDiff >= 0 ? "text-green-500" : "text-red-500"}`}>$ {cashRegister.totalDiff.toFixed(2)}</TableCell>
				<TableCell className="w-2/12 py-4">{cancellationsFiltered(cashRegister?.id).length}</TableCell>
				<TableCell className="w-1/12 py-4">
					<Badge className={`rounded-2xl p-1 text-xs ${cashRegister.isClosed ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}>
						{cashRegister.isClosed ? 'Cerrada' : 'Abierta'}
					</Badge>
				</TableCell>
			</TableRow>
			{isExpanded && (
				<TableRow>
					<TableCell colSpan="8" className="px-6 py-4 whitespace-nowrap bg-gray-300">
						<Collapsible open>
							<CollapsibleContent className='flex flex-col gap-4'>
								<PaymentMethodsTable
									cashRegister={cashRegister}
									cashMovements={cashMovementsFiltered(cashRegister.id)}
									cancellations={cancellationsFiltered(cashRegister.id)}
								/>
								<div className='flex gap-2'>
									<CashMovementsTable cashMovements={cashMovementsFiltered(cashRegister.id)} />
									<CancellationsTable cancellations={cancellationsFiltered(cashRegister.id)} />
								</div>
								<div className="flex gap-6 border rounded-lg bg-white shadow p-4 text-xs">
									<div className="flex items-center gap-1">
										<span className="font-semibold text-gray-700 uppercase">Observaciones:</span>
										<p>{cashRegister?.observations ? cashRegister.observations : 'Sin observaciones'}</p>
									</div>
								</div>
							</CollapsibleContent>
						</Collapsible>
					</TableCell>
				</TableRow>
			)}
		</>
	);
};

export default CashRegisterRow;