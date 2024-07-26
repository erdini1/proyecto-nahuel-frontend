import { useEffect, useState } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import PaymentMethodsTable from '@/components/component/cashRegisterAdmin/PaymentMethodsTable';
import CashMovementsTable from '@/components/component/cashRegisterAdmin/CashMovementsTable';
import CancellationsTable from '@/components/component/cashRegisterAdmin/CancellationsTable';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'

const CashRegisterRow = ({ cashRegister, cashMovementsFiltered, cancellationsFiltered }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [totalPaymentMethods, setTotalPaymentMethods] = useState(0);
	const [totalWithdrawalCash, setTotalWithdrawalCash] = useState(0);
	const [totalWithdrawalCards, setTotalWithdrawalCards] = useState(0);

	const handleRowClick = () => {
		setIsExpanded(!isExpanded);
	};

	useEffect(() => {
		if (cashRegister) {
			const totalPaymentMethods = Object.keys(cashRegister).filter(key => key.includes('salesWith')).reduce((sum, key) => sum + parseFloat(cashRegister[key] || 0), 0);
			setTotalPaymentMethods(totalPaymentMethods);

			const totalWithdrawalCash = calculateWithdrawal(cashMovementsFiltered(cashRegister.id), cancellationsFiltered(cashRegister.id), 'EFECTIVO');
			setTotalWithdrawalCash(totalWithdrawalCash);

			const totalWithdrawalCards = calculateWithdrawal([], cancellationsFiltered(cashRegister.id), 'CLOVER');
			setTotalWithdrawalCards(totalWithdrawalCards);
		}
	}, [cashRegister, cashMovementsFiltered, cancellationsFiltered]);

	const calculateWithdrawal = (cashMovements, cancellations, method) => {
		return cashMovements.reduce((sum, movement) => sum + parseFloat(movement.amount || 0), 0) +
			(cancellations.filter(cancellation => cancellation.method.includes(method)).reduce((sum, cancellation) => sum + parseFloat(cancellation.amount || 0), 0));
	};

	return (
		<>
			<TableRow onClick={handleRowClick} className={`whitespace-nowrap cursor-pointer ${isExpanded ? 'bg-gray-200 hover:bg-gray-100' : 'hover:bg-gray-50'}`}>
				<TableCell className="py-4 cursor-pointer">
					<ChevronDownIcon className={`h-4 w-4 ${isExpanded ? 'transform rotate-180' : ''}`} />
				</TableCell>
				<TableCell className="2/12 py-4 capitalize">{cashRegister.User.firstName} {cashRegister.User.lastName}</TableCell>
				<TableCell className="2/12 py-4">{format(toZonedTime(cashRegister.date, 'America/Argentina/Ushuaia'), 'dd/MM/yyyy')}</TableCell>
				<TableCell className="1/12 py-4">{cashRegister.CashBox.description}</TableCell>
				<TableCell className="2/12 py-4">$ {totalPaymentMethods}</TableCell>
				<TableCell className="2/12 py-4">$ {totalWithdrawalCards}</TableCell>
				<TableCell className="2/12 py-4">$ {totalWithdrawalCash}</TableCell>
				<TableCell className="1/12 py-4">
					<Badge className={`rounded-2xl p-1 text-xs ${cashRegister.isClosed ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}>
						{cashRegister.isClosed ? 'Cerrada' : 'Abierta'}
					</Badge>
				</TableCell>
			</TableRow>
			{isExpanded && (
				<TableRow>
					<TableCell colSpan="8" className="px-6 py-4 whitespace-nowrap bg-gray-200/40">
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
										<p>{cashRegister?.observations}</p>
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