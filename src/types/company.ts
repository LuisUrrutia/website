export interface Company {
	/** Company display name. */
	name: string;
	/** Path to company logo SVG file. */
	logo: `${string}.svg`;
	/** Company website URL. */
	url: string;
	/** Logo width in pixels for proper sizing. */
	width: number;
}
