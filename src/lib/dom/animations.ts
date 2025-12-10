/**
 * Animates an element's visibility using CSS class-based animations.
 * Uses appearing/disappearing classes to trigger CSS animations,
 * then adds/removes hidden class after animation completes.
 */
export function animateVisibility(
	element: HTMLElement,
	show: boolean,
	options: {
		hiddenClass?: string;
		appearingClass?: string;
		disappearingClass?: string;
	} = {},
): void {
	const {
		hiddenClass = "hidden",
		appearingClass = "appearing",
		disappearingClass = "disappearing",
	} = options;

	const isHidden = element.classList.contains(hiddenClass);

	if (show && isHidden) {
		element.classList.remove(hiddenClass, disappearingClass);
		element.classList.add(appearingClass);
	} else if (!show && !isHidden) {
		element.classList.remove(appearingClass);
		element.classList.add(disappearingClass);
		element.addEventListener(
			"animationend",
			() => {
				if (element.classList.contains(disappearingClass)) {
					element.classList.add(hiddenClass);
				}
			},
			{ once: true },
		);
	}
}
