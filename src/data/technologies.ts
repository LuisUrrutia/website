import type { Technology } from "@/types/technology";

export const technologies: Technology[] = [
	// Frameworks
	{
		name: "React",
		icon: "/tech/react.svg",
		experience: 8,
		category: "frameworks",
	},
	{
		name: "Next.js",
		icon: "/tech/next.svg",
		experience: 3,
		category: "frameworks",
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
		experience: 1,
		category: "frameworks",
	},
	{
		name: "Tailwind",
		icon: "/tech/tailwind.svg",
		experience: 4,
		category: "frameworks",
	},
	// Languages
	{
		name: "JavaScript",
		icon: "/tech/javascript.svg",
		experience: 10,
		category: "languages",
	},
	{
		name: "TypeScript",
		icon: "/tech/typescript.svg",
		experience: 4,
		category: "languages",
	},
	{
		name: "Go",
		icon: "/tech/go.svg",
		experience: 4,
		category: "languages",
	},
	{
		name: "Python",
		icon: "/tech/python.svg",
		experience: 4,
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
		name: "Solidity",
		icon: "/tech/solidity.svg",
		colorMode: "auto",
		experience: 2,
		category: "languages",
	},
	// Tools
	{
		name: "GitHub",
		icon: "/tech/github.svg",
		colorMode: "auto",
		experience: 6,
		category: "tools",
	},
	{
		name: "Docker",
		icon: "/tech/docker.svg",
		experience: 5,
		category: "tools",
	},
	{
		name: "Kubernetes",
		icon: "/tech/kubernetes.svg",
		experience: 3,
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
	{
		name: "Terraform",
		icon: "/tech/terraform.svg",
		experience: 2,
		category: "tools",
	},
	{
		name: "PostgreSQL",
		icon: "/tech/postgresql.svg",
		experience: 6,
		category: "tools",
	},
	{
		name: "MongoDB",
		icon: "/tech/mongodb.svg",
		experience: 4,
		category: "tools",
	},
	{
		name: "Redis",
		icon: "/tech/redis.svg",
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
		name: "Figma",
		icon: "/tech/figma.svg",
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
		name: "Claude",
		icon: "/tech/claude.svg",
		experience: 1,
		category: "tools",
	},
];
