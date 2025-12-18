import type { ColorMode, ThemedIcon } from "@/types/icon";

export type TechnologyCategory = "frameworks" | "languages" | "tools";

export interface Technology {
	name: string;
	icon: string | ThemedIcon;
	colorMode?: ColorMode;
	experience: number;
	category: TechnologyCategory;
}
