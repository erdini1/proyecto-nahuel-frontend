import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import CashRegisterRow from '@/components/component/cashRegisterAdmin/CashRegisterRow';
import { ChevronDownIcon } from '@radix-ui/react-icons';

export default function CashRegisterAdminTable({ cashRegisters, cashMovements, cancellations }) {

	const cashMovementsFiltered = (cashRegisterId) => {
		return cashMovements.filter((cashMovement) => cashMovement.CashRegister.id === cashRegisterId);
	}

	const cancellationsFiltered = (cashRegisterId) => {
		return cancellations.filter((cancellation) => cancellation.CashRegister.id === cashRegisterId);
	}

	return (
		<div className="border shadow-sm rounded-lg  overflow-x-auto">
			<Table className="min-w-full divide-y divide-gray-200">
				<TableHeader className="bg-gray-100 text-left">
					<TableRow>
						<TableHead className="px-3 text-center">
							<ChevronDownIcon className={`h-4 w-4 text-transparent`} />
						</TableHead>
						<TableHead className="w-2/12 py-3">Cajero</TableHead>
						<TableHead className="w-2/12 py-3">Fecha</TableHead>
						<TableHead className="w-1/12 py-3">Caja</TableHead>
						<TableHead className="w-2/12 py-3">Total Medios de pago</TableHead>
						<TableHead className="w-2/12 py-3">Total Retiros Tarjetas</TableHead>
						<TableHead className="w-2/12 py-3">Total Retios Efectivo</TableHead>
						<TableHead className="w-1/12 py-3">Estado</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="bg-white divide-y divide-gray-200">
					{cashRegisters.length === 0 ? (
						<TableRow>
							<TableCell colSpan="7" className="px-6 py-4 whitespace-nowrap text-center">No hay registros de caja</TableCell>
						</TableRow>
					) : (
						cashRegisters.map((cashRegister) => (
							<CashRegisterRow
								key={cashRegister.id}
								cashRegister={cashRegister}
								cashMovementsFiltered={cashMovementsFiltered}
								cancellationsFiltered={cancellationsFiltered}
							/>
						))
					)}
				</TableBody>
			</Table>
		</div >
	);
}