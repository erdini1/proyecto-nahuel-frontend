import { ResponsiveBar } from "@nivo/bar";

const TaskChart = ({ data }) => {
	return (
		<ResponsiveBar
			data={data}
			keys={["completadas_mañana", "incompletas_mañana", "completadas_tarde", "incompletas_tarde", "completadas_noche", "incompletas_noche"]}
			indexBy="date"
			margin={{ top: 10, right: 0, bottom: 40, left: 40 }}
			padding={0.15}
			colors={({ id }) => {
				switch (id) {
					case "completadas_mañana":
						return "#189804";
					case "incompletas_mañana":
						return "#8f0909";
					case "completadas_tarde":
						return "#1daa06";
					case "incompletas_tarde":
						return "#dc2626";
					case "completadas_noche":
						return "#0a7501";
					case "incompletas_noche":
						return "#a20f0f";
					default:
						return "#ccc";
				}
			}}
			axisBottom={{
				tickSize: 0,
				tickPadding: 16,
				format: (date) => date,
			}}
			axisLeft={{
				tickSize: 0,
				tickValues: 4,
				tickPadding: 16,
			}}
			gridYValues={4}
			theme={{
				tooltip: {
					chip: {
						borderRadius: "9999px",
					},
					container: {
						fontSize: "12px",
						textTransform: "capitalize",
						borderRadius: "6px",
					},
				},
				grid: {
					line: {
						stroke: "#f3f4f6",
					},
				},
			}}
			tooltipLabel={({ id }) => `${id}`}
			enableLabel={false}
			role="application"
			ariaLabel="A bar chart showing data"
			height={300}
		/>
	);
};

export default TaskChart;



// TODO: NO BORRAR ESTE CODIGO - 2
// import { ResponsiveBar } from "@nivo/bar";

// const TaskChart = ({ data, height }) => {
// 	return (
// 		<div style={{ height: height || '400px' }}> {/* Altura fija */}
// 			<ResponsiveBar
// 				data={data}
// 				keys={["completed", "incomplete"]}
// 				indexBy="date"
// 				margin={{ top: 10, right: 0, bottom: 40, left: 40 }}
// 				padding={0.15} // Ajuste del tamaño de las barras
// 				groupMode="grouped"
// 				colors={({ id }) => (id === "completed" ? "green" : "red")}
// 				axisBottom={{
// 					tickSize: 0,
// 					tickPadding: 16,
// 				}}
// 				axisLeft={{
// 					tickSize: 0,
// 					tickValues: 4,
// 					tickPadding: 16,
// 				}}
// 				gridYValues={4}
// 				theme={{
// 					tooltip: {
// 						chip: {
// 							borderRadius: "9999px",
// 						},
// 						container: {
// 							fontSize: "12px",
// 							textTransform: "capitalize",
// 							borderRadius: "6px",
// 						},
// 					},
// 					grid: {
// 						line: {
// 							stroke: "#f3f4f6",
// 						},
// 					},
// 				}}
// 				tooltipLabel={({ id }) => `${id}`}
// 				enableLabel={false}
// 				role="application"
// 				ariaLabel="A bar chart showing data"
// 			/>
// 		</div>
// 	);
// };

// export default TaskChart;


// TODO: NO BORRAR ESTE CODIGO - 1
// import { ResponsiveBar } from "@nivo/bar";

// const TaskChart = ({ data }) => {
// 	return (
// 		<ResponsiveBar
// 			data={data}
// 			keys={["completed", "incomplete"]}
// 			indexBy="date"
// 			margin={{ top: 10, right: 0, bottom: 40, left: 40 }}
// 			padding={0.15} // Ajuste del tamaño de las barras
// 			groupMode="grouped"
// 			colors={({ id }) => (id === "completed" ? "green" : "red")}
// 			axisBottom={{
// 				tickSize: 0,
// 				tickPadding: 16,
// 			}}
// 			axisLeft={{
// 				tickSize: 0,
// 				tickValues: 4,
// 				tickPadding: 16,
// 			}}
// 			gridYValues={4}
// 			theme={{
// 				tooltip: {
// 					chip: {
// 						borderRadius: "9999px",
// 					},
// 					container: {
// 						fontSize: "12px",
// 						textTransform: "capitalize",
// 						borderRadius: "6px",
// 					},
// 				},
// 				grid: {
// 					line: {
// 						stroke: "#f3f4f6",
// 					},
// 				},
// 			}}
// 			tooltipLabel={({ id }) => `${id}`}
// 			enableLabel={false}
// 			role="application"
// 			ariaLabel="A bar chart showing data"
// 		/>
// 	);
// };

// export default TaskChart;
