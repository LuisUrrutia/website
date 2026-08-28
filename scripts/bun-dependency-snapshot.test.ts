import { describe, expect, it } from "vitest";
import { createBunDependencySnapshot } from "./bun-dependency-snapshot";

const metadata = {
	sha: "0123456789abcdef0123456789abcdef01234567",
	ref: "refs/heads/main",
	jobId: "123.1",
	jobCorrelator: "Dependency security_inventory",
	jobUrl: "https://github.com/example/site/actions/runs/123",
	detectorUrl:
		"https://github.com/example/site/blob/0123456789abcdef0123456789abcdef01234567/scripts/bun-dependency-snapshot.ts",
	scanned: "2026-08-28T12:00:00.000Z",
};

describe("createBunDependencySnapshot", () => {
	it("preserves direct, transitive, runtime, and development relationships", () => {
		const snapshot = createBunDependencySnapshot(
			{
				lockfileVersion: 1,
				workspaces: {
					"": {
						dependencies: { "@example/app": "1.0.0" },
						devDependencies: { "dev-tool": "1.0.0" },
					},
				},
				packages: {
					"@example/app": [
						"@example/app@1.0.0",
						"",
						{ dependencies: { shared: "^1.0.0" } },
					],
					"dev-tool": [
						"dev-tool@1.0.0",
						"",
						{
							dependencies: {
								shared: "^1.0.0",
								formatter: "^2.0.0",
							},
						},
					],
					shared: ["shared@1.2.0", "", {}],
					formatter: ["formatter@1.0.0", "", {}],
					"dev-tool/formatter": ["formatter@2.1.0", "", {}],
					unused: ["unused@3.0.0", "", {}],
				},
			},
			metadata,
		);
		const resolved = snapshot.manifests["bun.lock"].resolved;

		expect(Object.keys(resolved)).toHaveLength(4);
		expect(resolved["pkg:npm/%40example/app@1.0.0"]).toEqual({
			package_url: "pkg:npm/%40example/app@1.0.0",
			relationship: "direct",
			scope: "runtime",
			dependencies: ["pkg:npm/shared@1.2.0"],
		});
		expect(resolved["pkg:npm/dev-tool@1.0.0"].scope).toBe("development");
		expect(resolved["pkg:npm/shared@1.2.0"].scope).toBe("runtime");
		expect(resolved["pkg:npm/formatter@2.1.0"]).toMatchObject({
			relationship: "indirect",
			scope: "development",
		});
		expect(resolved["pkg:npm/unused@3.0.0"]).toBeUndefined();
	});

	it("rejects incomplete lockfile relationships", () => {
		expect(() =>
			createBunDependencySnapshot(
				{
					workspaces: { "": { dependencies: { app: "1.0.0" } } },
					packages: {
						app: ["app@1.0.0", "", { dependencies: { missing: "1.0.0" } }],
					},
				},
				metadata,
			),
		).toThrow("app depends on missing package missing");
	});
});
