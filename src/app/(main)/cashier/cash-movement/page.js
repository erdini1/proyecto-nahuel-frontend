"use client"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Movements from "@/components/component/tabs/Movements";
import Cancellations from "@/components/component/tabs/Cancellation";
import CashRegister from "@/components/component/tabs/CashRegister";

// TODO: cuando se completen los datos iniciales redirigir a la página de movimientos y en cashRegister deshabilitar los campos
export default function Page() {
	return (
		<div className="w-full p-4">
			<div className="flex flex-col gap-6">
				<h1 className="text-2xl font-bold tracking-tight">Gestión de Caja</h1>
				<Tabs defaultValue="cashRegister">
					<TabsList className="border-b">
						<TabsTrigger value="cashRegister">Datos iniciales</TabsTrigger>
						<TabsTrigger value="movements">Movimientos de Caja</TabsTrigger>
						{/* <TabsTrigger value="cancellations">Anulaciones</TabsTrigger> */}
					</TabsList>
					<TabsContent value="cashRegister" className="p-4">
						<CashRegister />
					</TabsContent>
					<TabsContent value="movements" className="p-4 flex gap-2">
						<Movements />
						<Cancellations />
					</TabsContent>
					{/* <TabsContent value="cancellations" className="p-4">
						<Cancellations />
					</TabsContent> */}
				</Tabs>
			</div>
		</div>
	)
}
