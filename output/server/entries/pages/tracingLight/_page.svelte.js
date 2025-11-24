import { q as head, m as ensure_array_like } from "../../../chunks/index.js";
import { e as escape_html } from "../../../chunks/context.js";
function _page($$renderer) {
  const items = Array.from("ABCDEFGHIJKLMNOPQRST");
  head("jhrt53", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>追踪光线</title>`);
    });
  });
  $$renderer.push(`<div class="p-4 w-full bg-black grid grid-flow-row gap-4 grid-cols-3"><!--[-->`);
  const each_array = ensure_array_like(items);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    $$renderer.push(`<div class="relative rounded h-[300px] bg-gray-500 overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-radial before:from-white before:to-60% before:translate-x-[var(--x)] before:translate-y-[var(--y)]" style="--x: -9999px;--y: -9999px"><div class="absolute rounded text-3xl bg-black text-white flex items-center justify-center inset-2">The word is: ${escape_html(item)}</div></div>`);
  }
  $$renderer.push(`<!--]--></div>`);
}
export {
  _page as default
};
