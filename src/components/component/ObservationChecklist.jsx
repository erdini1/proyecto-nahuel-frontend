import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ObservationChecklist({ observations }) {

	return (
		<div className="right-4">
			<Card className="w-full max-w-md shadow ring-1 ring-gray-300">
				<CardHeader>
					<CardTitle>Observación</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-6">
					<div className="flex items-center justify-between">
						<div className="text-sm">
							{observations ? observations : "Sin observaciones"}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}