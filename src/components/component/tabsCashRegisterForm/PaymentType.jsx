import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";


export default function PaymentType({ name, description }) {

	const details = ["Ventas", "Ingresos", "Retiros", "A rendir"]

	return (
		<Table className="w-full">
			<TableHeader>
				<TableRow>
					<TableHead className="w-1/4">Tipo de cobro</TableHead>
					<TableHead className="w-1/4">Sistema</TableHead>
					<TableHead className="w-1/4">Físico en mano</TableHead>
					<TableHead className="w-1/4">Diferencia</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow >
					<TableCell className="align-top" colSpan="1">
						<div className="font-bold">{name.toUpperCase()}</div>
						{description && <div className="text-sm text-gray-500">{description}</div>}
					</TableCell>
					<TableCell className="align-top" colSpan="1">
						<div className="flex flex-col gap-3">
							{details.map((detail, idx) => (
								<div key={idx} className=" flex flex-col gap-1">
									<label
										className={`text-sm font-medium`}
										htmlFor="amount"
									>{detail}</label>
									<Input
										type="number"
										name="amount"
										id="amount"
										min="0"
										step="0.01"
										autoFocus
										disabled={detail === "Ingresos" || detail === "Retiros"}
										defaultValue={detail === "Ingresos" || detail === "Retiros" ? 0 : ""}
										required
									/>
								</div>
							))}
						</div>
					</TableCell>
					<TableCell className="align-bottom " colSpan="1">
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium" htmlFor="amount">A rendir</label>
							<Input
								type="number"
								name="amount"
								id="amount"
								min="0"
								step="0.01"
								autoFocus
								required
							/>
						</div>
					</TableCell>
					<TableCell className="align-bottom" colSpan="1">
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium" htmlFor="amount">Diferencia</label>
							<p className={`h-10 p-2 ${10 > 0 ? "text-red-500" : "text-green-500"}`}>$0</p>
						</div>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
}
