<script lang="ts">
	import { Slider} from '$lib/components/ui/slider';
	import { fade } from 'svelte/transition';

	let value = $state(36);
  const dots = $derived(Array.from({ length: Number(value) }));
</script>

<section class="flex flex-col h-full w-full overflow-hidden bg-gray-900 p-4" style="--size: 350px; --dot-size: {dots.length}">
	<div class="m-auto w-full flex justify-center items-center bg-sky-50 p-4">
		<Slider type="single" bind:value max={100} step={1} class="max-w-[70%]" />
	</div>
  <div class="m-auto">
    <div class="relative size-[var(--size)] rounded-full">
      {#each dots as _, i(i)}
        <div
					transition:fade
          class="absolute will-change-transform perspective-[70px] [transform-style:preserve-3d] top-[0] left-[50%] mt-[-10px] ml-[-10px] size-[20px] origin-[50%_calc((var(--size)/2)+10px)] rotate-[calc((360deg/var(--dot-size))*calc(var(--i)-1))]
          before:absolute before:top-[-100%] before:size-[22px] before:rounded-full before:bg-white before:content-[''] before:animate-white before:delay-(--dealy)
          after:absolute after:top-[100%] after:block after:size-[22px] after:rounded-full after:bg-gray-500 after:content-[''] after:animate-black after:delay-(--dealy)"
          style="--i: {i}; --dealy: -{2/36*i*6}s"
        ></div>
      {/each}
    </div>
  </div>
</section>
