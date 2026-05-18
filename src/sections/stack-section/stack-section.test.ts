import { describe, expect, it } from "vitest";

import {
	getMatchingStackIndices,
	getStackVisibilityState,
} from "./stack-section";

const indicesByCategory = {
	frameworks: [0, 3, 6],
	languages: [1, 4, 7],
	tools: [2, 5, 8],
};

describe("stack section visibility", () => {
	it("returns the default visible set with no filter", () => {
		const state = getStackVisibilityState({
			totalItems: 9,
			initialVisible: 4,
			indicesByCategory,
			activeCategories: [],
			isExpanded: false,
		});

		expect(state.matchingIndices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
		expect([...state.visibleIndices]).toEqual([0, 1, 2, 3]);
		expect(state.totalMatching).toBe(9);
		expect(state.showing).toBe(4);
		expect(state.shouldHideExpandButton).toBe(false);
	});

	it("returns the visible set for one filter", () => {
		const state = getStackVisibilityState({
			totalItems: 9,
			initialVisible: 2,
			indicesByCategory,
			activeCategories: ["frameworks"],
			isExpanded: false,
		});

		expect(state.matchingIndices).toEqual([0, 3, 6]);
		expect([...state.visibleIndices]).toEqual([0, 3]);
		expect(state.totalMatching).toBe(3);
		expect(state.showing).toBe(2);
		expect(state.shouldHideExpandButton).toBe(false);
	});

	it("returns the sorted visible set for multiple filters", () => {
		expect(
			getMatchingStackIndices({
				totalItems: 9,
				indicesByCategory,
				activeCategories: ["tools", "frameworks"],
			}),
		).toEqual([0, 2, 3, 5, 6, 8]);
	});

	it("shows every matching item when expanded", () => {
		const state = getStackVisibilityState({
			totalItems: 9,
			initialVisible: 2,
			indicesByCategory,
			activeCategories: ["tools", "frameworks"],
			isExpanded: true,
		});

		expect([...state.visibleIndices]).toEqual([0, 2, 3, 5, 6, 8]);
		expect(state.totalMatching).toBe(6);
		expect(state.showing).toBe(6);
		expect(state.shouldHideExpandButton).toBe(false);
	});

	it("collapses the visible set back to the initial limit", () => {
		const state = getStackVisibilityState({
			totalItems: 9,
			initialVisible: 3,
			indicesByCategory,
			activeCategories: ["tools", "frameworks"],
			isExpanded: false,
		});

		expect([...state.visibleIndices]).toEqual([0, 2, 3]);
		expect(state.showing).toBe(3);
	});

	it("returns an empty visible set for a zero-match filter", () => {
		const state = getStackVisibilityState({
			totalItems: 9,
			initialVisible: 4,
			indicesByCategory,
			activeCategories: ["databases"],
			isExpanded: false,
		});

		expect(state.matchingIndices).toEqual([]);
		expect([...state.visibleIndices]).toEqual([]);
		expect(state.totalMatching).toBe(0);
		expect(state.showing).toBe(0);
		expect(state.shouldHideExpandButton).toBe(true);
	});
});
