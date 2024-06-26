import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ProgressChecklist({ tasksCompleted, totalTasks }) {

	const calculatePercentage = () => {
		if (totalTasks === 0) {
			return 0
		}
		return Math.round((tasksCompleted / totalTasks) * 100)
	}

	return (
		<div className="fixed right-4">
			<Card className="w-full max-w-md ">
				<CardHeader>
					<CardTitle>Tareas Completadas</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-6">
					<div className="flex items-center justify-between">
						<div className="text-4xl font-bold">
							{calculatePercentage() > 0 ? `${calculatePercentage()}%` : "0%"}
						</div>
						<Progress value={calculatePercentage()} className="flex-1 ml-6 border" />
					</div>
				</CardContent>
			</Card>
		</div>
	)
}