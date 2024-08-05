import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ListTodoIcon, ClockIcon, LockClosedIcon, LockOpenIcon } from "@/components/icons/index";
import Link from "next/link";

const SummaryCard = ({ name, shift, isClosed, completedTasks, totalTasks, linkUrl }) => {
	const completionPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

	return (
		<div className="bg-white rounded-lg shadow-md border p-5 flex flex-col ">
			<div className="flex items-center justify-between mb-4">
				<div>
					<div className="font-semibold text-lg capitalize">{name}</div>
					{shift && (
						<div className="text-gray-500 flex items-center gap-1 text-sm">
							<ClockIcon className="h-3.5 w-3.5" />
							{shift} {isClosed ? (
								<span className="flex items-center gap-1">
									- <LockClosedIcon className="h-3.5 w-3.5" />
									Cerrado
								</span>
							) : (
								<span className="flex items-center gap-1">
									- <LockOpenIcon className="h-3.5 w-3.5" />
									Abierto
								</span>
							)}
						</div>
					)}
				</div>
				<Link href={linkUrl}>
					<Button variant="outline" size="icon">
						<ListTodoIcon className="w-5 h-5" />
					</Button>
				</Link>
			</div>
			<div className="flex items-center justify-between mb-2">
				<div className="text-muted-foreground">
					{completedTasks} / {totalTasks} <span className="text-sm">tareas completadas</span>
				</div>
				<div
					className={`px-2 py-1 rounded-full text-xs font-medium ${completionPercentage === 100
						? "bg-green-500 text-green-50"
						: "bg-yellow-500 text-yellow-50"
						}`}
				>
					{Math.round(completionPercentage)}%
				</div>
			</div>
			<div className="flex-1 flex items-center justify-center">
				<div className="w-full bg-muted rounded-full h-2">
					<Progress
						className="border"
						value={Math.round(completionPercentage)}
					/>
				</div>
			</div>
		</div>
	);
};

export default SummaryCard;