import type { Technology } from "@/types/technology";

/**
 * Technologies ordered for display (first 9 shown by default).
 * Order is intentional - core skills first, then supporting technologies.
 */
export const technologies: Technology[] = [
	// First 9 visible by default (in this exact order)
	{
		name: "React",
		icon: "/tech/react.svg",
		experience: 9,
		category: "frameworks",
	},
	{
		name: "Next.js",
		icon: "/tech/next.svg",
		experience: 4,
		category: "frameworks",
	},
	{
		name: "TypeScript",
		icon: "/tech/typescript.svg",
		experience: 9,
		category: "languages",
	},
	{
		name: "JavaScript",
		icon: "/tech/javascript.svg",
		experience: 12,
		category: "languages",
	},
	{
		name: "Rust",
		icon: "/tech/rust.svg",
		colorMode: "auto",
		experience: 1,
		category: "languages",
	},
	{
		name: "Go",
		icon: "/tech/go.svg",
		experience: 4,
		category: "languages",
	},
	{
		name: "Tailwind",
		icon: "/tech/tailwind.svg",
		experience: 7,
		category: "frameworks",
	},
	{
		name: "Docker",
		icon: "/tech/docker.svg",
		experience: 9,
		category: "tools",
	},
	{
		name: "AWS",
		icon: {
			light: "/tech/aws-dark.svg",
			dark: "/tech/aws-light.svg",
		},
		experience: 5,
		category: "tools",
	},
	// Remaining technologies
	{
		name: "Kubernetes",
		icon: "/tech/kubernetes.svg",
		experience: 3,
		category: "tools",
	},
	{
		name: "PostgreSQL",
		icon: "/tech/postgresql.svg",
		experience: 11,
		category: "tools",
	},
	{
		name: "Python",
		icon: "/tech/python.svg",
		experience: 9,
		category: "languages",
	},
	{
		name: "Solidity",
		icon: "/tech/solidity.svg",
		colorMode: "auto",
		experience: 2,
		category: "languages",
	},
	{
		name: "Astro",
		icon: {
			light: "/tech/astro-dark.svg",
			dark: "/tech/astro-light.svg",
		},
		experience: 1,
		category: "frameworks",
	},
	{
		name: "Svelte",
		icon: "/tech/svelte.svg",
		experience: 3,
		category: "frameworks",
	},
	{
		name: "Terraform",
		icon: "/tech/terraform.svg",
		experience: 2,
		category: "tools",
	},
	{
		name: "Git",
		icon: "/tech/git.svg",
		experience: 11,
		category: "tools",
	},
	{
		name: "Redis",
		icon: "/tech/redis.svg",
		experience: 4,
		category: "tools",
	},
	{
		name: "MongoDB",
		icon: "/tech/mongodb.svg",
		experience: 4,
		category: "tools",
	},
	{
		name: "DynamoDB",
		icon: "/tech/dynamodb.svg",
		experience: 3,
		category: "tools",
	},
	{
		name: "Claude",
		icon: "/tech/claude.svg",
		experience: 1,
		category: "tools",
	},
	{
		name: "ChatGPT",
		icon: "/tech/chatgpt.svg",
		colorMode: "auto",
		experience: 2,
		category: "tools",
	},
	{
		name: "Figma",
		icon: "/tech/figma.svg",
		experience: 2,
		category: "tools",
	},
];
