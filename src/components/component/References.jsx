import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function References({references}) {

	return (
		<div className="right-4">
			<Card className="w-full max-w-md shadow ring-1 ring-gray-300">
				<CardHeader>
					<CardTitle className="text-xl">Referencias</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-6 justify-start">
					<div className="flex flex-col gap-2">
						{references.map(reference => (
							<p key={reference.id} className="flex items-center gap-2">
								<reference.icon className="h-4 w-4" />
								<span className="text-sm">{reference.description}</span>
							</p>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}