import { ResponsiveLine } from "@nivo/line";

const LineChart = ({ data }) => {
	const formattedData = [
		{
			id: "Completadas",
			data: data.map(item => ({ x: item.date, y: item.completadas }))
		},
		{
			id: "Incompletas",
			data: data.map(item => ({ x: item.date, y: item.incompletas }))
		}
	];

	return (
		<div style={{ height: 300 }}>
			<ResponsiveLine
				data={formattedData}
				margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
				xScale={{ type: "point" }}
				yScale={{ type: "linear", min: "auto", max: "auto", stacked: true, reverse: false }}
				axisTop={null}
				axisRight={null}
				axisBottom={{
					tickSize: 0,
					tickPadding: 16,
					format: (date) => date,
				}}
				axisLeft={{
					tickSize: 0,
					tickPadding: 16,
					tickValues: 4
				}}
				colors={["green", "red"]}
				pointSize={6}
				pointColor={{ theme: 'background' }}
				pointBorderWidth={2}
				pointBorderColor={{ from: 'serieColor' }}
				useMesh={true}
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
				role="application"
				ariaLabel="A line chart showing data"
			/>
		</div>
	);
};

export default LineChart;
