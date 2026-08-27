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

interface SameDocumentViewTransition {
	finished: Promise<void>;
	skipTransition(): void;
}

type ViewTransitionDocument = Document & {
	startViewTransition(update: () => void): SameDocumentViewTransition;
};

const STACK_TRANSITION_CLASS = "stack-transitioning";
const STACK_ITEM_TRANSITION_CLASS = "stack-item";
const STACK_ITEM_ENTER_CLASS = "stack-item-enter";
const STACK_ITEM_EXIT_CLASS = "stack-item-exit";

function hasViewTransitions(value: Document): value is ViewTransitionDocument {
	return (
		"startViewTransition" in value &&
		typeof value.startViewTransition === "function"
	);
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
		.forEach((section, sectionIndex) => {
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
			elements.forEach((element, elementIndex) => {
				element.style.setProperty(
					"view-transition-name",
					`stack-${sectionIndex}-item-${elementIndex}`,
				);
				element.style.setProperty(
					"view-transition-class",
					STACK_ITEM_TRANSITION_CLASS,
				);
			});

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
			let activeTransition: SameDocumentViewTransition | undefined;

			function applyVisibilityState(state: StackVisibilityState): void {
				for (const index of visibleIndices) {
					if (!state.visibleIndices.has(index)) {
						elements[index].classList.add("hidden");
					}
				}

				for (const index of state.visibleIndices) {
					if (!visibleIndices.has(index)) {
						elements[index].classList.remove("hidden");
					}
				}

				visibleIndices.clear();
				for (const index of state.visibleIndices) visibleIndices.add(index);

				if (clearBtn) {
					const hasFilter = activeCategories.size > 0;
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

			function resetItemTransitionClasses(): void {
				for (const element of elements) {
					element.style.setProperty(
						"view-transition-class",
						STACK_ITEM_TRANSITION_CLASS,
					);
				}
			}

			function update(): void {
				const state = getStackVisibilityState({
					totalItems,
					initialVisible,
					indicesByCategory,
					activeCategories,
					isExpanded,
				});
				const enteringIndices = [...state.visibleIndices].filter(
					(index) => !visibleIndices.has(index),
				);
				const exitingIndices = [...visibleIndices].filter(
					(index) => !state.visibleIndices.has(index),
				);

				if (
					!hasViewTransitions(document) ||
					(enteringIndices.length === 0 && exitingIndices.length === 0)
				) {
					applyVisibilityState(state);
					return;
				}

				const enteringSet = new Set(enteringIndices);
				const exitingSet = new Set(exitingIndices);
				elements.forEach((element, index) => {
					const transitionClass = enteringSet.has(index)
						? `${STACK_ITEM_TRANSITION_CLASS} ${STACK_ITEM_ENTER_CLASS}`
						: exitingSet.has(index)
							? `${STACK_ITEM_TRANSITION_CLASS} ${STACK_ITEM_EXIT_CLASS}`
							: STACK_ITEM_TRANSITION_CLASS;
					element.style.setProperty("view-transition-class", transitionClass);
				});

				activeTransition?.skipTransition();
				document.documentElement.classList.add(STACK_TRANSITION_CLASS);
				const transition = document.startViewTransition(() => {
					applyVisibilityState(state);
				});
				activeTransition = transition;

				void transition.finished.finally(() => {
					if (activeTransition !== transition) return;
					activeTransition = undefined;
					document.documentElement.classList.remove(STACK_TRANSITION_CLASS);
					resetItemTransitionClasses();
				});
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
