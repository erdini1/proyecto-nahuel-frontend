import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { translateType } from "@/helpers/movement.helper";

const CashMovementsTable = ({ cashMovements }) => {

	return (
		<div className='w-1/2'>
			<div className="bg-white p-2 rounded w-full border ring-1 ring-gray-200">
				<div className="text-center">
					<p className="font-bold text-gray-700 uppercase">Movimientos</p>
				</div>
			</div>
			<Table className="min-w-full divide-y divide-gray-200 mt-2 border">
				<TableHeader className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
					<TableRow>
						<TableHead className="w-1/5 py-3 pl-6">ID</TableHead>
						<TableHead className="w-1/5 py-3 pl-6">Tipo</TableHead>
						<TableHead className="w-1/5 py-3 pl-6">Detalle</TableHead>
						<TableHead className="w-1/5 py-3 pl-6">Hora</TableHead>
						<TableHead className="w-1/5 py-3 pl-6">Monto</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="bg-white divide-y divide-gray-200">
					{cashMovements.length === 0 ? (
						<TableRow>
							<TableCell colSpan="5" className="px-6 py-4 whitespace-nowrap text-center">No se encontraron movimientos</TableCell>
						</TableRow>
					) : (
						cashMovements.map((cashMovement) => (
							<TableRow key={cashMovement.id} className="text-xs whitespace-nowrap">
								<TableCell className="w-1/5 py-4 pl-6">{cashMovement.id}</TableCell>
								<TableCell className="w-1/5 py-4 pl-6">{translateType(cashMovement.type)}</TableCell>
								<TableCell className="w-1/5 py-4 pl-6">{cashMovement.detail}</TableCell>
								<TableCell className="w-1/5 py-4 pl-6">{cashMovement.time}</TableCell>
								<TableCell className="w-1/5 py-4 pl-6">$ {cashMovement.amount.toFixed(2)}</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
};

export default CashMovementsTable;
