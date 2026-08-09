export type StackCategoryIndices = Record<string, number[]>;

export interface StackMatchingInput {
	totalItems: number;
	indicesByCategory: StackCategoryIndices;
	activeCategories: Iterable<string>;
}

export interface StackVisibilityInput extends StackMatchingInput {
	initialVisible: number;
	isExpanded: boolean;
}

export interface StackVisibilityState {
	matchingIndices: number[];
	visibleIndices: Set<number>;
	totalMatching: number;
	showing: number;
	shouldHideExpandButton: boolean;
}

export function getMatchingStackIndices({
	totalItems,
	indicesByCategory,
	activeCategories,
}: StackMatchingInput): number[] {
	const categories = Array.from(activeCategories);

	if (categories.length === 0) {
		return Array.from({ length: totalItems }, (_, index) => index);
	}

	const matchingIndices: number[] = [];

	for (const category of categories) {
		const indices = indicesByCategory[category];
		if (indices) {
			for (const index of indices) matchingIndices.push(index);
		}
	}

	return matchingIndices.sort((first, second) => first - second);
}

export function getStackVisibilityState({
	totalItems,
	initialVisible,
	indicesByCategory,
	activeCategories,
	isExpanded,
}: StackVisibilityInput): StackVisibilityState {
	const matchingIndices = getMatchingStackIndices({
		totalItems,
		indicesByCategory,
		activeCategories,
	});
	const totalMatching = matchingIndices.length;
	const limit = isExpanded
		? totalMatching
		: Math.min(initialVisible, totalMatching);
	const visibleIndices = new Set(matchingIndices.slice(0, limit));

	return {
		matchingIndices,
		visibleIndices,
		totalMatching,
		showing: visibleIndices.size,
		shouldHideExpandButton: totalMatching <= initialVisible,
	};
}

export function initStackSections(): void {
	document
		.querySelectorAll<HTMLElement>(".stack-section")
		.forEach((section) => {
			if (section.dataset.init) return;
			section.dataset.init = "true";

			const filtersContainer =
				section.querySelector<HTMLElement>(".stack-filters");
			const filters =
				section.querySelectorAll<HTMLButtonElement>(".stack-filter");
			const clearBtn = section.querySelector<HTMLButtonElement>(".stack-clear");
			const expandBtn =
				section.querySelector<HTMLButtonElement>(".stack-expand-btn");
			const statusEl = section.querySelector<HTMLElement>(".stack-status");
			const elements = Array.from(
				section.querySelectorAll<HTMLElement>(".stack-item"),
			);

			const initialVisible = Number(section.dataset.initialVisible) || 9;
			const totalItems = elements.length;
			const indicesByCategory: StackCategoryIndices = JSON.parse(
				section.dataset.indices || "{}",
			);
			const statusTemplate = section.dataset.statusTemplate || "";
			const visibleIndices = new Set(
				Array.from(
					{ length: Math.min(initialVisible, totalItems) },
					(_, index) => index,
				),
			);
			const activeCategories = new Set<string>();
			let isExpanded = false;

			function update(): void {
				const hasFilter = activeCategories.size > 0;
				const state = getStackVisibilityState({
					totalItems,
					initialVisible,
					indicesByCategory,
					activeCategories,
					isExpanded,
				});
				const nextVisible = state.visibleIndices;

				for (const index of visibleIndices) {
					if (!nextVisible.has(index)) {
						elements[index].classList.add("hidden");
					}
				}

				for (const index of nextVisible) {
					if (!visibleIndices.has(index)) {
						elements[index].classList.remove("hidden");
					}
				}

				visibleIndices.clear();
				for (const index of nextVisible) visibleIndices.add(index);

				if (clearBtn) {
					clearBtn.setAttribute("aria-hidden", String(!hasFilter));
					clearBtn.setAttribute("tabindex", hasFilter ? "0" : "-1");
				}

				if (expandBtn) {
					expandBtn.classList.toggle("hidden", state.shouldHideExpandButton);
				}

				if (statusEl && statusTemplate) {
					statusEl.textContent = statusTemplate
						.replace("{visible}", String(state.showing))
						.replace("{total}", String(state.totalMatching));
				}
			}

			filtersContainer?.addEventListener("click", (event) => {
				if (!(event.target instanceof Element)) return;
				const filterBtn =
					event.target.closest<HTMLButtonElement>(".stack-filter");
				if (!filterBtn) return;

				const category = filterBtn.dataset.category;
				if (!category) return;

				const isPressed = filterBtn.getAttribute("aria-pressed") === "true";
				filterBtn.setAttribute("aria-pressed", String(!isPressed));

				if (isPressed) {
					activeCategories.delete(category);
				} else {
					activeCategories.add(category);
				}

				update();
			});

			clearBtn?.addEventListener("click", () => {
				activeCategories.clear();
				filters.forEach((filter) =>
					filter.setAttribute("aria-pressed", "false"),
				);
				update();
			});

			expandBtn?.addEventListener("expand-toggle", (event) => {
				isExpanded = event.detail.expanded;
				update();
			});
		});
}
