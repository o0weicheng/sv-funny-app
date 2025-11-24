<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { SvelteMap } from 'svelte/reactivity';

	interface DroppableParams <T=unknown>{
		items: T[]
		onDropUp?: () => void
	}


	const ns: number[] = $state(Array.from({ length: 10 }).map((_, i) => (i)));
	const droppable = <T=number>({ items}: DroppableParams<T>) => (element: HTMLElement) => {
		let pointerId: number = 0;
		let target: HTMLElement | null = null;
		let initialPointer: [number, number] = [0, 0];
		let childrenRectMap = new SvelteMap<HTMLElement, DOMRect>();
		let childrenMap = new SvelteMap<HTMLElement, number>();
		let targetElement: HTMLElement | null = null;
		let ghostElement: HTMLElement | null = null;
		let placeholderElement: HTMLElement | null = null;
		let initialGhostRect: DOMRect | null = null;
		let animationFrameId: number | null = null;

		let m: number = 0

		let originalIndex: number = -1


		const move = (from: number, to: number) => {
			if (from === to) return
			const item = items[from];
			items.splice(from, 1);
			items.splice(to, 0, item);
		};

		// 重置 DOM 状态
		const cleanup = () => {
			if (target) target.style.display = '';
			if (ghostElement) ghostElement.remove();
			if (placeholderElement) placeholderElement.remove();

			targetElement = null
			ghostElement = null;
			placeholderElement = null;
			childrenRectMap.clear();
			childrenMap.clear()

			if (animationFrameId) cancelAnimationFrame(animationFrameId)
			animationFrameId = null
		};

		const createGhostElement = (t: HTMLElement): HTMLElement => {
			const ghost: HTMLElement = t.cloneNode(true) as HTMLElement;
			const rect = t.getBoundingClientRect();
			const style = getComputedStyle(t);

			ghost.style.width = `${rect.width}px`;
			ghost.style.height = `${rect.height}px`;
			ghost.style.boxSizing = style.boxSizing;

			ghost.style.position = 'fixed';
			ghost.style.zIndex = '99999';
			ghost.style.top = `${rect.top}px`;
			ghost.style.left = `${rect.left}px`;
			ghost.style.margin = '0';
			ghost.style.pointerEvents = 'none';

			ghost.removeAttribute('data-drag');

			return ghost;
		};

		const createPlaceholderElement = (t: HTMLElement): HTMLElement => {
			const placeholder: HTMLElement = t.cloneNode(true) as HTMLElement;

			placeholder.style.opacity = '0.36';
			placeholder.style.visibility = 'visible';
			placeholder.style.borderStyle = 'dotted';
			placeholder.removeAttribute('data-drag');
			placeholder.style.display = 'none';

			return placeholder;
		};

		const isCollision = (point: Record<'x' | 'y', number>, childRect: DOMRect) => {
			return (
				(point.x > childRect.left && point.x < childRect.right && point.y > childRect.top && point.y < childRect.bottom)
			);
		};

		const pointerup = async () => {
			element.releasePointerCapture(pointerId);
			element.removeEventListener('pointerup', pointerup);
			element.removeEventListener('pointermove', pointermove);

			if (!ghostElement || !placeholderElement) {
				cleanup();
				return;
			}

			const placeholderRect = placeholderElement.getBoundingClientRect();

			if (initialGhostRect){
				const x = placeholderRect.left - initialGhostRect.left;
				const y = placeholderRect.top - initialGhostRect.top;
				let raf = requestAnimationFrame(() => {
					ghostElement!.style.transition = 'transform 200ms cubic-bezier(0.2, 0, 0, 1)';
					ghostElement!.style.transform = `translate3D(${x}px,${y}px,0)`;
					cancelAnimationFrame(raf)
				});
			}

			await new Promise(resolve => window.setTimeout(resolve, 200));

			const targetDomIndex = childrenMap.get(targetElement!)!;
			let targetIndex = targetDomIndex

			if (targetDomIndex > originalIndex) {
				targetIndex = targetDomIndex - 1
			}
			if (originalIndex !== targetDomIndex && targetIndex > -1) {
				move(originalIndex, targetIndex)
			}

			cleanup()
		};

		const pointermove = (e: PointerEvent) => {
			e.preventDefault();
			let now = performance.now();

			const [startX, startY] = initialPointer;
			const x = e.clientX - startX;
			const y = e.clientY - startY;

			const point = { x: e.clientX, y: e.clientY };

			animationFrameId = requestAnimationFrame(() => {
				if (!ghostElement || !pointerId) return;
				ghostElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
			});

			if (now - m <= 64) return;
			childrenRectMap.forEach((r, el) => {
				if (targetElement === el) return;
				if (isCollision(point, r)) {
					const childIndex = childrenMap.get(el)!;
					const placeholderIndex = childrenMap.get(placeholderElement!)!;

					if (childIndex < placeholderIndex) {
						el.before(placeholderElement!)
					} else {
						el.after(placeholderElement!)
					}
					targetElement = el;
				}
			});
			m = now;
		};
		const pointerdown = (e: PointerEvent) => {
			if (animationFrameId) return;
			target = (e.target as HTMLElement).closest('[data-drag]');
			pointerId = e.pointerId;
			if (!target || !pointerId) return;

			element.setPointerCapture(pointerId);
			initialPointer = [e.clientX, e.clientY];

			ghostElement = createGhostElement(target);
			placeholderElement = createPlaceholderElement(target);
			target.after(placeholderElement);
			document.body.appendChild(ghostElement);

			const children = Array.from(element.children)

			for (const [index, el] of children.entries()) {
				childrenMap.set(el as HTMLElement, index)
				if (el === target || el === placeholderElement) continue;
				childrenRectMap.set(el as HTMLElement, el.getBoundingClientRect());
			}

			originalIndex = childrenMap.get(target)!;
			placeholderElement.style.display = '';
			target.style.display = 'none';

			initialGhostRect = ghostElement.getBoundingClientRect();

			element.addEventListener('pointerup', pointerup);
			element.addEventListener('pointermove', pointermove);
		};

		for (const [index, children] of Array.from(element.children).entries()) {
			children.setAttribute('data-drag', String(index))
		}


		element.addEventListener('pointerdown', pointerdown);
		return () => {
			element.removeEventListener('pointerdown', pointerdown);
			element.removeEventListener('pointermove', pointermove);
			element.removeEventListener('pointerdown', pointerdown);
		};
	};
</script>

<div {@attach droppable({items: ns})} class="grid grid-cols-4 gap-4 p-2">
	{#each ns as item (item)}
			<Card.Root class="cursor-move-pointer">
				<Card.Header>
					<Card.Title>Card Title</Card.Title>
				</Card.Header>
				<Card.Content>
					<span class="text-2xl">item: {item}</span>
				</Card.Content>
			</Card.Root>
	{/each}
</div>