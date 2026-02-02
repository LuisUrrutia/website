import type { Testimonial } from "@/types/testimonial";

import pabloSabaPhoto from "@/assets/testimonials/pablo-saba.jpg";
import douglasMakeyPhoto from "@/assets/testimonials/douglas-makey.jpg";
import sebastianMedinaPhoto from "@/assets/testimonials/sebastian-medina.jpg";

export const testimonials: Testimonial[] = [
	{
		name: "Pablo Saba",
		role: {
			en: "Associate Head Of Catalog at Uber",
			es: "Associate Head Of Catalog en Uber",
		},
		photo: pabloSabaPhoto,
		quote: {
			en: "Luis is responsible and dedicated to his work, he knows how to listen, and is not afraid to propose better solutions. He has extensive technical expertise and an excellent attitude.",
			es: "Luis es responsable y dedicado a su trabajo, sabe escuchar y no tiene miedo de proponer mejores soluciones. Tiene una amplia experiencia técnica y una excelente actitud.",
		},
		linkedin: "https://www.linkedin.com/in/pablosaba",
	},
	{
		name: "Douglas Makey",
		role: {
			en: "Senior Software Engineer at Nvidia",
			es: "Senior Software Engineer en Nvidia",
		},
		photo: douglasMakeyPhoto,
		quote: {
			en: "Luis is a highly skilled professional committed to quality standards. He has an excellent ability to learn and implement new technologies quickly, consistently meeting expectations.",
			es: "Luis es un profesional altamente capacitado y comprometido con los estándares de calidad. Tiene una excelente capacidad para aprender e implementar nuevas tecnologías rápidamente, cumpliendo consistentemente con las expectativas.",
		},
		linkedin: "https://www.linkedin.com/in/douglasmakey",
	},
	{
		name: "Sebastian Medina",
		role: {
			en: "Senior Frontend Developer at Terminal",
			es: "Senior Frontend Developer en Terminal",
		},
		photo: sebastianMedinaPhoto,
		quote: {
			en: "A machine that helped our entire team, he is an excellent developer. One of the best I know, his impressive learning ability combined with his vast experience ensures the success of any project he is involved in.",
			es: "Una máquina que ayudó a todo nuestro equipo, es un excelente desarrollador. Uno de los mejores que conozco, su impresionante capacidad de aprendizaje combinada con su vasta experiencia asegura el éxito de cualquier proyecto en el que participe.",
		},
		linkedin: "https://www.linkedin.com/in/sebastianmedinadonoso",
	},
];
