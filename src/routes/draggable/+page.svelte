<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { SvelteMap } from 'svelte/reactivity';

	const items = $state(Array.from({ length: 10 }).map((_, i) => (i)))

	const droppable = (element: HTMLElement) => {
		let pointerId: number = 0
		let target: HTMLElement | null = null
		let initialPointer: [number, number] = [0, 0]
		let timers = new SvelteMap<HTMLElement, number>()

		const recoverElement = (element: HTMLElement) => {
			const t = timers.get(element)
			if (t) {
				clearTimeout(t)
				timers.delete(element)
			}
			element.style.transition = ''
			element.style.position = ''
			element.style.zIndex = ''
			element.style.transform = ''
		}

		const pointerup = (e: PointerEvent) => {

			requestAnimationFrame(() => {
				if (!target) return

				target.style.transition = 'transform 300ms ease'
				target.style.transform = 'translate3D(0,0,0)'

				const t = window.setTimeout(() => {
					recoverElement(target!)
				}, 300)
				timers.set(target, t)
			})

			element.releasePointerCapture(pointerId)
			element.removeEventListener('pointerup', pointerup);
			element.removeEventListener('pointermove', pointermove);
		}
		const pointermove = (e: PointerEvent) => {
			if (!target || !pointerId) return
			const [startX, startY] = initialPointer
			const x = e.clientX - startX
			const y = e.clientY - startY

			requestAnimationFrame(() => {
				if (!target || !pointerId) return
				target.style.transform = `translate3d(${x}px, ${y}px, 0)`
			})

		}
		const pointerdown = (e: PointerEvent) => {

			Array.from(timers).forEach(([el, ]) => recoverElement(el))

			target = (e.target as HTMLElement).closest("[data-drag]")
			pointerId = e.pointerId
			if (!target || !pointerId) return
			const prevTimer = timers.get(target)
			if (prevTimer) {
				clearTimeout(prevTimer)
				timers.delete(target)
			}

			element.setPointerCapture(pointerId)
			target.style.transition = ''
			target.style.position = 'relative'
			target.style.zIndex = '999'
			initialPointer = [e.clientX, e.clientY]
			element.addEventListener('pointerup', pointerup);
			element.addEventListener('pointermove', pointermove);
		}


		element.addEventListener('pointerdown', pointerdown)
		return () => {
			element.removeEventListener('pointerdown', pointerdown);
			element.removeEventListener('pointermove', pointermove);
			element.removeEventListener('pointerdown', pointerdown);
		}
	}
</script>

<div {@attach droppable} class="grid grid-cols-4 gap-4 p-2">
	{#each items as item (item)}
		<Card.Root data-drag class="cursor-move-pointer">
			<Card.Header>
				<Card.Title>Card Title</Card.Title>
			</Card.Header>
			<Card.Content>
				<span class="text-2xl">item: {item}</span>
			</Card.Content>
		</Card.Root>
		{/each}
</div>