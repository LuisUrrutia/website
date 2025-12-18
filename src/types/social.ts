export type SocialLink = { url: string; label?: string } | string;

export type SocialLinksProps = {
	github?: SocialLink;
	linkedin?: SocialLink;
	instagram?: SocialLink;
	x?: SocialLink;
};
