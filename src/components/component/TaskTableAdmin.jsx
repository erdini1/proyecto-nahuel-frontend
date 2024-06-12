import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const TaskTableAdmin = ({ tasks }) => (
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Descripción</TableHead>
				<TableHead>Completado</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{tasks.map((task) => (
				<TableRow key={task.id}>
					<TableCell>{task.Task.description}</TableCell>
					<TableCell>
						{task.isCompleted ? (
							<div className="flex items-center gap-2">
								<CheckIcon className="h-4 w-4 text-green-500" />
								<span>Si</span>
							</div>
						) : (
							<div className="flex items-center gap-2">
								<XIcon className="h-4 w-4 text-red-500" />
								<span>No</span>
							</div>
						)}
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	</Table>
);

function CheckIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}

function XIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}


export default TaskTableAdmin;
