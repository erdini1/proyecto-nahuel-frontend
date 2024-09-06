import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const CancellationsTable = ({ cancellations }) => {

	return (
		<div className='w-1/2'>
			<div className="bg-white p-2 rounded w-full border ring-1 ring-gray-200 ">
				<div className="text-center">
					<p className="font-bold text-gray-700 uppercase">Anulaciones</p>
				</div>
			</div>
			<Table className="min-w-full divide-y divide-gray-200 mt-2 border">
				<TableHeader className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
					<TableRow>
						<TableHead className="w-1/5 py-3 pl-6">ID</TableHead>
						<TableHead className="w-1/5 py-3 pl-6">Tipo</TableHead>
						<TableHead className="w-1/5 py-3 pl-6">Metodo</TableHead>
						<TableHead className="w-1/5 py-3 pl-6">Hora</TableHead>
						<TableHead className="w-1/5 py-3 pl-6">Monto</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
					{cancellations.length === 0 ? (
						<TableRow>
							<TableCell colSpan="5" className="px-6 py-4 text-center">No se encontraron anulaciones</TableCell>
						</TableRow>
					) : (
						cancellations.map((cancellation) => (
							<TableRow key={cancellation.id} className="text-xs">
								<TableCell className="w-1/5 py-4 pl-6">{cancellation.id}</TableCell>
								<TableCell className="w-1/5 py-4 pl-6">{cancellation.type}</TableCell>
								<TableCell className="w-1/5 py-4 pl-6">{cancellation.method}</TableCell>
								<TableCell className="w-1/5 py-4 pl-6">{cancellation.time}</TableCell>
								<TableCell className="w-1/5 py-4 pl-6">$ {cancellation.amount.toFixed(2)}</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
};

export default CancellationsTable;
