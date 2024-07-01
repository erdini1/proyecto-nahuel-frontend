import { ResponsiveBar } from "@nivo/bar";

const TaskChart = ({ data }) => {
	return (
		<ResponsiveBar
			data={data}
			keys={["completadas", "incompletas"]}
			indexBy="date"
			margin={{ top: 10, right: 0, bottom: 40, left: 40 }}
			padding={0.15} // Ajuste del tamaño de las barras
			// groupMode="grouped"
			colors={({ id }) => (id === "completadas" ? "green" : "red")}
			axisBottom={{
				tickSize: 0,
				tickPadding: 16,
				format: (date) => date, // Formato de fecha
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
			height={300} // Altura fija del gráfico
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
