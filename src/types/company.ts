export interface Company {
	/** Company display name. */
	name: string;
	/** Path to company logo SVG file for light theme. */
	logo: `${string}.svg`;
	/** Path to company logo SVG file for dark theme. */
	logoDark: `${string}.svg`;
	/** Company website URL. */
	url: string;
	/** Logo width in pixels for proper sizing. */
	width: number;
}
