import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import CashRegisterRow from '@/components/component/cashRegisterAdmin/CashRegisterRow';
import { ChevronDownIcon } from '@radix-ui/react-icons';

export default function CashRegisterAdminTable({ cashRegisters, cashMovements, cancellations }) {

	const cashMovementsFiltered = (cashRegisterId) => {
		return cashMovements.filter((cashMovement) => cashMovement?.cashRegisterId === cashRegisterId);
	}

	const cancellationsFiltered = (cashRegisterId) => {
		return cancellations.filter((cancellation) => cancellation?.cashRegisterId === cashRegisterId);
	}

	const allPaymentMethodsTotals = () => {
		return cashRegisters.reduce((acc, cashRegister) => {
			return acc + cashRegister.totalPaymentMethods;
		}, 0)
	}

	const allDiffTotals = () => {
		return cashRegisters.reduce((acc, cashRegister) => {
			return acc + cashRegister.totalDiff;
		}, 0)
	}

	const cancellationsLength = () => {
		return cashRegisters.reduce((acc, cashRegister) => {
			return acc + cancellationsFiltered(cashRegister.id).length;
		}, 0)
	}

	return (
		<div className="border shadow-sm rounded-lg  overflow-x-auto">
			<Table className="min-w-full divide-y divide-gray-200">
				<TableHeader className="bg-gray-100 text-left">
					<TableRow>
						<TableHead className="px-4">
						</TableHead>
						<TableHead className="w-2/12 py-3">Cajero</TableHead>
						<TableHead className="w-2/12 py-3">Fecha</TableHead>
						<TableHead className="w-1/12 py-3">Caja</TableHead>
						<TableHead className="w-2/12 py-3">Total Medios de pago</TableHead>
						<TableHead className="w-2/12 py-3">Total Diferencias</TableHead>
						<TableHead className="w-2/12 py-3">Total Anulaciones</TableHead>
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
					{cashRegisters.length !== 0 && (
						<TableRow className="bg-yellow-100 hover:bg-yellow-50">
							<TableCell className="py-4"></TableCell>
							<TableCell className="w-2/12 py-4"></TableCell>
							<TableCell className="w-2/12 py-4"></TableCell>
							<TableCell className="w-1/12 py-4 text-sm font-semibold uppercase">{/* Totales: */}</TableCell>
							<TableCell className="w-2/12 py-4 font-semibold">$ {allPaymentMethodsTotals()}</TableCell>
							<TableCell className={`w-2/12 py-4 font-semibold ${allDiffTotals() >= 0 ? "text-green-500" : "text-red-500"}`}>
								$ {allDiffTotals().toFixed(2)}
							</TableCell>
							<TableCell className="w-2/12 py-4 font-semibold">{cancellationsLength()}</TableCell>
							<TableCell className="w-2/12 py-4 font-bold"></TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div >
	);
}