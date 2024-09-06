import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import WithdrawalRow from "@/components/component/withdrawalAdmin/WithdrawalRow";

export default function WithdrawalTable({ cashMovements, totalOfAllWithdrawals }) {

	const totalWithdrawals = () => {
		return cashMovements.reduce((acc, cashMovement) => {
			return acc + (+cashMovement.amount);
		}, 0)
	}

	return (
		<div className="border shadow-sm rounded-lg  overflow-x-auto">
			<Table className="min-w-full divide-y divide-gray-200">
				<TableHeader className="bg-gray-100 text-left">
					<TableRow>
						<TableHead className="w-1/6 py-3">Pago/Retiro</TableHead>
						<TableHead className="w-1/6 py-3">Cajero</TableHead>
						<TableHead className="w-1/12 py-3">Caja</TableHead>
						<TableHead className="w-1/6 py-3">Fecha</TableHead>
						<TableHead className="w-1/6 py-3">Hora</TableHead>
						<TableHead className="w-3/12 py-3">Monto</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="bg-white divide-y divide-gray-200">
					{cashMovements.length === 0 ? (
						<TableRow>
							<TableCell colSpan="6" className="px-6 py-4 whitespace-nowrap text-center">No hay registros de pagos a proveedores</TableCell>
						</TableRow>
					) : (
						cashMovements.map((cashMovement) => (
							<WithdrawalRow
								key={cashMovement.id}
								cashMovement={cashMovement}
							/>
						))
					)}
					{cashMovements.length !== 0 && (
						<TableRow className="bg-yellow-100 hover:bg-yellow-50">
							<TableCell className="w-1/6  py-4"></TableCell>
							<TableCell className="w-1/6  py-4"></TableCell>
							<TableCell className="w-1/12 py-4 font-semibold"></TableCell>
							<TableCell className="w-1/6  py-4 font-semibold"></TableCell>
							<TableCell className="w-1/6  py-4 font-semibold ">
								<span className="flex flex-col gap-2 text-gray-600 items-end">Subtotal: <span className="text-black">Total:</span></span>

							</TableCell>
							<TableCell className="w-3/12 py-4 font-semibold">
								<span className="flex flex-col gap-2 text-gray-600">$ {totalWithdrawals().toFixed(2)}
									<span className="text-black">
										$ {totalOfAllWithdrawals}
									</span>
								</span>

							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div >
	);
}