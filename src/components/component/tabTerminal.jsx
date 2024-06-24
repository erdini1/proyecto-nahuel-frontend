import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TERMINALS } from '@/constants/terminals.constant';

export default function TabTerminal() {
	return (
		<Tabs >
			<TabsList value="prueba1" className="border-b">
				{TERMINALS.map((terminal, idx) => (
					<TabsTrigger key={idx} value={terminal.terminalNumber}>{terminal.description}</TabsTrigger>
				))}
			</TabsList>
			{TERMINALS.map((terminal, idx) => (
				<TabsContent key={idx} value={terminal.terminalNumber} className="p-4">

				</TabsContent>
			))}
			{/* <TabsContent value="cashRegister" className="p-4">
			</TabsContent>
			<TabsContent value="movements" >
			</TabsContent> */}
		</Tabs>
	)
}
