"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PaymentType from "@/components/component/tabsCashRegisterForm/PaymentType";

export default function Page() {
	return (
		<Card className="w-full max-w-5xl mx-auto mt-7">
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

				<Tabs defaultValue="efectivo">
					<TabsList className="border-b">
						<TabsTrigger value="efectivo">Efectivo</TabsTrigger>
						<TabsTrigger value="cuentaCorriente">Cuenta Corriente</TabsTrigger>
						<TabsTrigger value="tarjetas">Tarjetas</TabsTrigger>
						<TabsTrigger value="mercadoPago">Mercado Pago</TabsTrigger>
						<TabsTrigger value="pointMaxiconsumo">Point Maxiconsumo</TabsTrigger>
						<TabsTrigger value="resumen">Resumen</TabsTrigger>
					</TabsList>
					<TabsContent value="efectivo" className="p-4">
						<PaymentType
							name="efectivo"
							description=""
							details={["Ventas", "Ingresos", "Retiros", "A rendir"]}
						/>
					</TabsContent>
					<TabsContent value="cuentaCorriente" className="p-4">
						<PaymentType
							name="cuenta corriente"
							description=""
							details={["Ventas", "Retiros", "A rendir"]}
						/>
					</TabsContent>
					<TabsContent value="tarjetas" className="p-4">
						<PaymentType
							name="tarjetas"
							description="Clover / QR - TDF - La red"
							details={["Ventas", "Retiros", "A rendir"]}
						/>
					</TabsContent>
					<TabsContent value="mercadoPago" className="p-4">
						<PaymentType
							name="mercado pago"
							description="QR - Link - Tarjeta debito y credito"
							details={["Ventas", "Retiros", "A rendir"]}
						/>
					</TabsContent>
					<TabsContent value="pointMaxiconsumo" className="p-4">
						<PaymentType
							name="point maxiconsumo"
							description="Tarjeta debito y credito"
							details={["Ventas", "Retiros", "A rendir"]}
						/>
					</TabsContent>
					<TabsContent value="resumen" className="p-4">
						<h1>Resumen</h1>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}