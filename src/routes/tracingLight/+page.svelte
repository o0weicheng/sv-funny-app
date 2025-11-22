<script lang="ts">
	const items = Array.from('ABCDEFGHIJKLMNOPQRST');

	let point = $state([9999, 9999])

	const disableTracing = (rect: DOMRect): boolean => {
		const [x, y] = point;
		const {left, top, right, bottom, width, height} = rect

		return (
			(x <= left - width / 2) ||
			(x >= right + width / 2) ||
			(y <= top - height / 2) ||
			(y >= bottom + height / 2)
		)
	}

	const container = (element: HTMLElement) => {
		const handlePointerMove = (event: PointerEvent) => {
			const x = event.clientX;
			const y = event.clientY;
			point = [x, y];
		}
		element.addEventListener('pointermove', handlePointerMove)

		return () => {
			element.removeEventListener('pointermove', handlePointerMove)
		}
	}

	const card = (element: HTMLElement) => {
		const [pointX, pointY] = point;
		const rect = element.getBoundingClientRect();

		if(disableTracing(rect)) return
		const x = pointX - rect.left - (rect.width / 2);
		const y = pointY - rect.top - (rect.height / 2);

		element.style.setProperty('--x', `${x}px`);
		element.style.setProperty('--y', `${y}px`);
	}
</script>

<svelte:head>
	<meta title="追踪光线" />
</svelte:head>

<div {@attach container} class="p-4 w-full bg-black grid grid-flow-row gap-4 grid-cols-3">
	{#each items as item (item)}
		<div
			class="relative rounded h-[300px] bg-gray-500 overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-radial before:from-white before:to-60% before:translate-x-[var(--x)] before:translate-y-[var(--y)]"
			style="--x: -9999px;--y: -9999px"
			{@attach card}
		>
			<div class="absolute rounded text-3xl bg-black text-white flex items-center justify-center inset-2">The word is: {item}</div>
		</div>
	{/each}
</div>