// TODO: Ver, creo que no se usa en ningun lado
"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import TextField from '@mui/material/TextField';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomNumberInput from "../ui/CustomNumberInput";
import { ChevronDown } from "@radix-ui/react-icons";

export default function CashRegisterFinishForm() {
	const paymentTypes = [
		{ name: "Efectivo", details: ["Ventas", "Ingresos", "Retiros", "A rendir"], description: "" },
		{ name: "Cuenta corriente", details: ["Ventas", "Retiros", "A rendir"], description: "" },
		{ name: "Tarjetas", details: ["Ventas", "Retiros", "A rendir"], description: "Clover / QR - TDF - La red" },
		{ name: "Mercado Pago", details: ["Ventas", "Retiros", "A rendir"], description: "QR - Link - Tarjeta debito y credito" },
		{ name: "Point Maxiconsumo", details: ["Ventas", "Retiros", "A rendir"], description: "Tarjeta debito y credito" }
	];

	return (
		<Card className="w-full max-w-5xl mx-auto mt-10">
			<CardHeader>
				<div className="flex justify-between">
					<div>
						<CardTitle>Gestión de Caja</CardTitle>
						<CardDescription>Complete los detalles de los diferentes tipos de cobros.</CardDescription>
					</div>
					<Button variant="" className="align-bottom w-32">Cargar</Button>
				</div>
			</CardHeader>
			<CardContent>
				<Table className="w-full">
					<TableHeader>
						<TableRow className="sticky top-0 bg-white">
							<TableHead>Tipo de cobro</TableHead>
							<TableHead>Detalles</TableHead>
							<TableHead>Sistema</TableHead>
							<TableHead>Físico en mano</TableHead>
							<TableHead>Diferencia</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paymentTypes.map((paymentType, index) => (
							<TableRow key={index}>
								<TableCell className="align-top w-full" colSpan="5">
									<Accordion>
										<AccordionSummary
											expandIcon={<ChevronDown />}
											aria-controls="panel1a-content"
											id="panel1a-header"
										>
											<Typography variant="h6" className="p-6">{paymentType.name.toUpperCase()}</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<div className="grid grid-cols-5 gap-4">
												{paymentType.details.map((detail, idx) => (
													<div key={idx}>
														<div className="col-span-1">
															<label htmlFor={detail}>{detail}</label>
														</div>
														<div className="col-span-4">
															<CustomNumberInput
																disabled={detail === "Ingresos" || detail === "Retiros"}
																min={0}
																step={0.01}
																autoFocus
																defaultValue={detail === "Ingresos" || detail === "Retiros" ? 0 : ""}
																required
															/>
														</div>
													</div>
												))}
												<div className="col-span-1">
													<label htmlFor="Diferencia">Diferencia</label>
												</div>
												<div className="col-span-4">
													<CustomNumberInput
														disabled
														min={0}
														step={0.01}
														autoFocus
														required
														defaultValue={0}
													/>
												</div>
											</div>
										</AccordionDetails>
									</Accordion>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}


// -------------------------

// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import TextField from '@mui/material/TextField';

// export default function CashRegisterFinishForm() {

// 	const paymentTypes = [
// 		{ name: "Efectivo", details: ["Ventas", "Ingresos", "Retiros", "A rendir"], description: "" },
// 		{ name: "Cuenta corriente", details: ["Ventas", "Retiros", "A rendir"], description: "" },
// 		{ name: "Tarjetas", details: ["Ventas", "Retiros", "A rendir"], description: "Clover / QR - TDF - La red" },
// 		{ name: "Mercado Pago", details: ["Ventas", "Retiros", "A rendir"], description: "QR - Link - Tarjeta debito y credito" },
// 		{ name: "Point Maxiconsumo", details: ["Ventas", "Retiros", "A rendir"], description: "Tarjeta debito y credito" }
// 	];

// 	return (
// 		<Card className="w-full max-w-5xl mx-auto mt-10">
// 			<CardHeader>
// 				<div className="flex justify-between">
// 					<div>
// 						<CardTitle>Gestión de Caja</CardTitle>
// 						<CardDescription>Complete los detalles de los diferentes tipos de cobros.</CardDescription>
// 					</div>
// 					<Button variant="" className="align-bottom w-32">Cargar</Button>
// 				</div>
// 			</CardHeader>
// 			<CardContent>
// 				<Table className="w-full">
// 					<TableHeader>
// 						<TableRow>
// 							<TableHead>Tipo de cobro</TableHead>
// 							<TableHead>Sistema</TableHead>
// 							<TableHead>Físico en mano</TableHead>
// 							<TableHead>Diferencia</TableHead>
// 							<TableHead>Acciones</TableHead>
// 						</TableRow>
// 					</TableHeader>
// 					<TableBody>
// 						{paymentTypes.map((paymentType, index) => (
// 							<TableRow key={index}>
// 								<TableCell className="align-top" colSpan="1">
// 									<div className="font-bold">{paymentType.name.toUpperCase()}</div>
// 									{paymentType.description && <div className="text-sm text-gray-500">{paymentType.description}</div>}
// 								</TableCell>
// 								<TableCell className="align-top" colSpan="1">
// 									<div className="grid grid-cols-4 gap-4">
// 										{paymentType.details.map((detail, idx) => (
// 											<div key={idx} className="col-span-4 grid grid-cols-4 items-center gap-2">
// 												<TextField
// 													required
// 													type="number"
// 													id="outlined-required"
// 													label={detail}
// 													size="small"
// 													className="col-span-4"
// 													autoFocus
// 													disabled={detail === "Ingresos" || detail === "Retiros"}
// 													defaultValue={detail === "Ingresos" || detail === "Retiros" ? 0 : ""}
// 												/>
// 											</div>
// 										))}
// 									</div>
// 								</TableCell>
// 								<TableCell className="align-bottom" colSpan="1">
// 									<TextField
// 										required
// 										type="number"
// 										id="outlined-required"
// 										label="A rendir"
// 										size="small"
// 										className="col-span-4"
// 									/>
// 								</TableCell>
// 								<TableCell className="align-bottom" colSpan="1">
// 									<TextField
// 										type="number"
// 										id="outlined-required"
// 										label="Diferencia"
// 										size="small"
// 										className="col-span-4"
// 										disabled
// 										value={0}
// 									/>
// 								</TableCell>
// 							</TableRow>
// 						))}
// 					</TableBody>
// 				</Table>
// 			</CardContent>
// 		</Card>
// 	);
// }
