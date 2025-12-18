import type { Testimonial } from "@/types/testimonial";

import pabloSabaPhoto from "@/assets/testimonials/pablo-saba.jpg";
import douglasMakeyPhoto from "@/assets/testimonials/douglas-makey.jpg";
import sebastianMedinaPhoto from "@/assets/testimonials/sebastian-medina.jpg";

export const testimonials: Testimonial[] = [
	{
		name: "Pablo Saba",
		role: "Associate Head Of Catalog at Uber",
		photo: pabloSabaPhoto,
		quote:
			"Luis is responsible and dedicated to his work, he knows how to listen, and is not afraid to propose better solutions. He has extensive technical expertise and an excellent attitude.",
	},
	{
		name: "Douglas Makey",
		role: "Cloud Consultant at Sourced Group",
		photo: douglasMakeyPhoto,
		quote:
			"Luis Sebastian is a highly skilled professional committed to quality standards. He has an excellent ability to learn and implement new technologies quickly, consistently meeting expectations.",
	},
	{
		name: "Sebastian Medina",
		role: "Senior Frontend Developer at Terminal",
		photo: sebastianMedinaPhoto,
		quote:
			"A machine that helped our entire team, he is an excellent developer. One of the best I know, his impressive learning ability combined with his vast experience ensures the success of any project he is involved in.",
	},
];
