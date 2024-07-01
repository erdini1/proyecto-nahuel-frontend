const PercentIcon = (props) => (
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
		strokeLinejoin="round">
		<line
			x1="19"
			x2="5"
			y1="5"
			y2="19"
		/>
		<circle
			cx="6.5"
			cy="6.5"
			r="2.5"
		/>
		<circle
			cx="17.5"
			cy="17.5"
			r="2.5"
		/>
	</svg>
);

export default PercentIcon;
