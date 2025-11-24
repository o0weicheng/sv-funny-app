import { f as attributes, g as clsx, h as bind_props, m as ensure_array_like } from "../../../chunks/index.js";
import { c as cn } from "../../../chunks/utils2.js";
import "clsx";
import { e as escape_html } from "../../../chunks/context.js";
function Card($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    $$renderer2.push(`<div${attributes({
      "data-slot": "card",
      class: clsx(cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { ref });
  });
}
function Card_content($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    $$renderer2.push(`<div${attributes({
      "data-slot": "card-content",
      class: clsx(cn("px-6", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { ref });
  });
}
function Card_header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    $$renderer2.push(`<div${attributes({
      "data-slot": "card-header",
      class: clsx(cn("@container/card-header has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { ref });
  });
}
function Card_title($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      class: className,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    $$renderer2.push(`<div${attributes({
      "data-slot": "card-title",
      class: clsx(cn("font-semibold leading-none", className)),
      ...restProps
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { ref });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const ns = Array.from({ length: 10 }).map((_, i) => i);
    $$renderer2.push(`<div class="grid grid-cols-4 gap-4 p-2"><!--[-->`);
    const each_array = ensure_array_like(ns);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$renderer2.push(`<!---->`);
      Card($$renderer2, {
        class: "cursor-move-pointer",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->`);
          Card_header($$renderer3, {
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->`);
              Card_title($$renderer4, {
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Card Title`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> <!---->`);
          Card_content($$renderer3, {
            children: ($$renderer4) => {
              $$renderer4.push(`<span class="text-2xl">item: ${escape_html(item)}</span>`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!---->`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
