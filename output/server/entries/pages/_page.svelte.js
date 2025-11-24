import { e as derived, p as props_id, f as attributes, h as bind_props, s as spread_props, j as attr, o as attr_class, g as clsx, m as ensure_array_like, T as attr_style, k as stringify } from "../../chunks/index.js";
import { c as cn } from "../../chunks/utils2.js";
import { m as run } from "../../chunks/context.js";
import { C as Context, e as attachRef, G as ARROW_LEFT, H as ARROW_RIGHT, I as ARROW_UP, J as ARROW_DOWN, K as HOME, L as END, w as watch, q as isElementOrSVGElement, a as createBitsAttrs, D as DOMContext, f as boolToEmptyStrOrUndef, N as boolToStr, h as createId, n as noop, b as boxWith, m as mergeProps } from "../../chunks/create-id.js";
function isValidIndex(index, arr) {
  return index >= 0 && index < arr.length;
}
function getRangeStyles(direction, min, max) {
  const styles = {
    position: "absolute"
  };
  if (direction === "lr") {
    styles.left = `${min}%`;
    styles.right = `${max}%`;
  } else if (direction === "rl") {
    styles.right = `${min}%`;
    styles.left = `${max}%`;
  } else if (direction === "bt") {
    styles.bottom = `${min}%`;
    styles.top = `${max}%`;
  } else {
    styles.top = `${min}%`;
    styles.bottom = `${max}%`;
  }
  return styles;
}
function getThumbStyles(direction, thumbPos) {
  const styles = {
    position: "absolute"
  };
  if (direction === "lr") {
    styles.left = `${thumbPos}%`;
    styles.translate = "-50% 0";
  } else if (direction === "rl") {
    styles.right = `${thumbPos}%`;
    styles.translate = "50% 0";
  } else if (direction === "bt") {
    styles.bottom = `${thumbPos}%`;
    styles.translate = "0 50%";
  } else {
    styles.top = `${thumbPos}%`;
    styles.translate = "0 -50%";
  }
  return styles;
}
function getTickStyles(direction, tickPosition, offsetPercentage) {
  const style = {
    position: "absolute"
  };
  if (direction === "lr") {
    style.left = `${tickPosition}%`;
    style.translate = `${offsetPercentage}% 0`;
  } else if (direction === "rl") {
    style.right = `${tickPosition}%`;
    style.translate = `${-offsetPercentage}% 0`;
  } else if (direction === "bt") {
    style.bottom = `${tickPosition}%`;
    style.translate = `0 ${-offsetPercentage}%`;
  } else {
    style.top = `${tickPosition}%`;
    style.translate = `0 ${offsetPercentage}%`;
  }
  return style;
}
function getDecimalPlaces(num) {
  if (Math.floor(num) === num)
    return 0;
  const str = num.toString();
  if (str.indexOf(".") !== -1 && str.indexOf("e-") === -1) {
    return str.split(".")[1].length;
  } else if (str.indexOf("e-") !== -1) {
    const parts = str.split("e-");
    return parseInt(parts[1], 10);
  }
  return 0;
}
function roundToPrecision(num, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}
function normalizeSteps(step, min, max) {
  if (typeof step === "number") {
    const difference = max - min;
    let count = Math.ceil(difference / step);
    const precision = getDecimalPlaces(step);
    const factor = Math.pow(10, precision);
    const intDifference = Math.round(difference * factor);
    const intStep = Math.round(step * factor);
    if (intDifference % intStep === 0) {
      count++;
    }
    const steps = [];
    for (let i = 0; i < count; i++) {
      const value = min + i * step;
      const roundedValue = roundToPrecision(value, precision);
      steps.push(roundedValue);
    }
    return steps;
  }
  return [...new Set(step)].filter((value) => value >= min && value <= max).sort((a, b) => a - b);
}
function snapValueToCustomSteps(value, steps) {
  if (steps.length === 0)
    return value;
  let closest = steps[0];
  let minDistance = Math.abs(value - closest);
  for (const step of steps) {
    const distance = Math.abs(value - step);
    if (distance < minDistance) {
      minDistance = distance;
      closest = step;
    }
  }
  return closest;
}
function getAdjacentStepValue(currentValue, steps, direction) {
  const currentIndex = steps.indexOf(currentValue);
  if (currentIndex === -1) {
    return snapValueToCustomSteps(currentValue, steps);
  }
  if (direction === "next") {
    return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : currentValue;
  } else {
    return currentIndex > 0 ? steps[currentIndex - 1] : currentValue;
  }
}
function linearScale(domain, range, clamp = true) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const slope = (r1 - r0) / (d1 - d0);
  return (x) => {
    const result = r0 + slope * (x - d0);
    if (!clamp)
      return result;
    if (result > Math.max(r0, r1))
      return Math.max(r0, r1);
    if (result < Math.min(r0, r1))
      return Math.min(r0, r1);
    return result;
  };
}
const sliderAttrs = createBitsAttrs({
  component: "slider",
  parts: [
    "root",
    "thumb",
    "range",
    "tick",
    "tick-label",
    "thumb-label"
  ]
});
const SliderRootContext = new Context("Slider.Root");
class SliderBaseRootState {
  opts;
  attachment;
  isActive = false;
  #direction = derived(() => {
    if (this.opts.orientation.current === "horizontal") {
      return this.opts.dir.current === "rtl" ? "rl" : "lr";
    } else {
      return this.opts.dir.current === "rtl" ? "tb" : "bt";
    }
  });
  get direction() {
    return this.#direction();
  }
  set direction($$value) {
    return this.#direction($$value);
  }
  #normalizedSteps = derived(() => {
    return normalizeSteps(this.opts.step.current, this.opts.min.current, this.opts.max.current);
  });
  get normalizedSteps() {
    return this.#normalizedSteps();
  }
  set normalizedSteps($$value) {
    return this.#normalizedSteps($$value);
  }
  domContext;
  constructor(opts) {
    this.opts = opts;
    this.attachment = attachRef(opts.ref);
    this.domContext = new DOMContext(this.opts.ref);
  }
  isThumbActive(_index) {
    return this.isActive;
  }
  #touchAction = derived(() => {
    if (this.opts.disabled.current) return void 0;
    return this.opts.orientation.current === "horizontal" ? "pan-y" : "pan-x";
  });
  getAllThumbs = () => {
    const node = this.opts.ref.current;
    if (!node) return [];
    return Array.from(node.querySelectorAll(sliderAttrs.selector("thumb")));
  };
  getThumbScale = () => {
    const trackPadding = this.opts.trackPadding?.current;
    if (trackPadding !== void 0 && trackPadding > 0) {
      return [trackPadding, 100 - trackPadding];
    }
    if (this.opts.thumbPositioning.current === "exact") {
      return [0, 100];
    }
    const isVertical = this.opts.orientation.current === "vertical";
    const activeThumb = this.getAllThumbs()[0];
    const thumbSize = isVertical ? activeThumb?.offsetHeight : activeThumb?.offsetWidth;
    if (thumbSize === void 0 || Number.isNaN(thumbSize) || thumbSize === 0) return [0, 100];
    const trackSize = isVertical ? this.opts.ref.current?.offsetHeight : this.opts.ref.current?.offsetWidth;
    if (trackSize === void 0 || Number.isNaN(trackSize) || trackSize === 0) return [0, 100];
    const percentPadding = thumbSize / 2 / trackSize * 100;
    const min = percentPadding;
    const max = 100 - percentPadding;
    return [min, max];
  };
  getPositionFromValue = (thumbValue) => {
    const thumbScale = this.getThumbScale();
    const scale = linearScale([this.opts.min.current, this.opts.max.current], thumbScale);
    return scale(thumbValue);
  };
  #props = derived(() => ({
    id: this.opts.id.current,
    "data-orientation": this.opts.orientation.current,
    "data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
    style: { touchAction: this.#touchAction() },
    [sliderAttrs.root]: "",
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class SliderSingleRootState extends SliderBaseRootState {
  opts;
  isMulti = false;
  constructor(opts) {
    super(opts);
    this.opts = opts;
    watch(
      [
        () => this.opts.step.current,
        () => this.opts.min.current,
        () => this.opts.max.current,
        () => this.opts.value.current
      ],
      ([step, min, max, value]) => {
        const steps = normalizeSteps(step, min, max);
        const isValidValue = (v) => {
          return steps.includes(v);
        };
        const gcv = (v) => {
          return snapValueToCustomSteps(v, steps);
        };
        if (!isValidValue(value)) {
          this.opts.value.current = gcv(value);
        }
      }
    );
  }
  isTickValueSelected = (tickValue) => {
    return this.opts.value.current === tickValue;
  };
  applyPosition({ clientXY, start, end }) {
    const min = this.opts.min.current;
    const max = this.opts.max.current;
    const percent = (clientXY - start) / (end - start);
    const val = percent * (max - min) + min;
    if (val < min) {
      this.updateValue(min);
    } else if (val > max) {
      this.updateValue(max);
    } else {
      const steps = this.normalizedSteps;
      const newValue = snapValueToCustomSteps(val, steps);
      this.updateValue(newValue);
    }
  }
  updateValue = (newValue) => {
    this.opts.value.current = snapValueToCustomSteps(newValue, this.normalizedSteps);
  };
  handlePointerMove = (e) => {
    if (!this.isActive || this.opts.disabled.current) return;
    e.preventDefault();
    e.stopPropagation();
    const sliderNode = this.opts.ref.current;
    const activeThumb = this.getAllThumbs()[0];
    if (!sliderNode || !activeThumb) return;
    activeThumb.focus();
    const { left, right, top, bottom } = sliderNode.getBoundingClientRect();
    if (this.direction === "lr") {
      this.applyPosition({ clientXY: e.clientX, start: left, end: right });
    } else if (this.direction === "rl") {
      this.applyPosition({ clientXY: e.clientX, start: right, end: left });
    } else if (this.direction === "bt") {
      this.applyPosition({ clientXY: e.clientY, start: bottom, end: top });
    } else if (this.direction === "tb") {
      this.applyPosition({ clientXY: e.clientY, start: top, end: bottom });
    }
  };
  handlePointerDown = (e) => {
    if (e.button !== 0 || this.opts.disabled.current) return;
    const sliderNode = this.opts.ref.current;
    const closestThumb = this.getAllThumbs()[0];
    if (!closestThumb || !sliderNode) return;
    const target = e.composedPath()[0] ?? e.target;
    if (!isElementOrSVGElement(target) || !sliderNode.contains(target)) return;
    e.preventDefault();
    closestThumb.focus();
    this.isActive = true;
    this.handlePointerMove(e);
  };
  handlePointerUp = () => {
    if (this.opts.disabled.current) return;
    if (this.isActive) {
      this.opts.onValueCommit.current(run(() => this.opts.value.current));
    }
    this.isActive = false;
  };
  #thumbsPropsArr = derived(() => {
    const currValue = this.opts.value.current;
    return Array.from({ length: 1 }, () => {
      const thumbValue = currValue;
      const thumbPosition = this.getPositionFromValue(thumbValue);
      const style = getThumbStyles(this.direction, thumbPosition);
      return {
        role: "slider",
        "aria-valuemin": this.opts.min.current,
        "aria-valuemax": this.opts.max.current,
        "aria-valuenow": thumbValue,
        "aria-disabled": boolToStr(this.opts.disabled.current),
        "aria-orientation": this.opts.orientation.current,
        "data-value": thumbValue,
        "data-orientation": this.opts.orientation.current,
        style,
        [sliderAttrs.thumb]: ""
      };
    });
  });
  get thumbsPropsArr() {
    return this.#thumbsPropsArr();
  }
  set thumbsPropsArr($$value) {
    return this.#thumbsPropsArr($$value);
  }
  #thumbsRenderArr = derived(() => {
    return this.thumbsPropsArr.map((_, i) => i);
  });
  get thumbsRenderArr() {
    return this.#thumbsRenderArr();
  }
  set thumbsRenderArr($$value) {
    return this.#thumbsRenderArr($$value);
  }
  #ticksPropsArr = derived(() => {
    const steps = this.normalizedSteps;
    const currValue = this.opts.value.current;
    return steps.map((tickValue, i) => {
      const tickPosition = this.getPositionFromValue(tickValue);
      const isFirst = i === 0;
      const isLast = i === steps.length - 1;
      const offsetPercentage = isFirst ? 0 : isLast ? -100 : -50;
      const style = getTickStyles(this.direction, tickPosition, offsetPercentage);
      const bounded = tickValue <= currValue;
      return {
        "data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
        "data-orientation": this.opts.orientation.current,
        "data-bounded": bounded ? "" : void 0,
        "data-value": tickValue,
        "data-selected": this.isTickValueSelected(tickValue) ? "" : void 0,
        style,
        [sliderAttrs.tick]: ""
      };
    });
  });
  get ticksPropsArr() {
    return this.#ticksPropsArr();
  }
  set ticksPropsArr($$value) {
    return this.#ticksPropsArr($$value);
  }
  #ticksRenderArr = derived(() => {
    return this.ticksPropsArr.map((_, i) => i);
  });
  get ticksRenderArr() {
    return this.#ticksRenderArr();
  }
  set ticksRenderArr($$value) {
    return this.#ticksRenderArr($$value);
  }
  #tickItemsArr = derived(() => {
    return this.ticksPropsArr.map((tick, i) => ({ value: tick["data-value"], index: i }));
  });
  get tickItemsArr() {
    return this.#tickItemsArr();
  }
  set tickItemsArr($$value) {
    return this.#tickItemsArr($$value);
  }
  #thumbItemsArr = derived(() => {
    const currValue = this.opts.value.current;
    return [{ value: currValue, index: 0 }];
  });
  get thumbItemsArr() {
    return this.#thumbItemsArr();
  }
  set thumbItemsArr($$value) {
    return this.#thumbItemsArr($$value);
  }
  #snippetProps = derived(() => ({
    ticks: this.ticksRenderArr,
    thumbs: this.thumbsRenderArr,
    tickItems: this.tickItemsArr,
    thumbItems: this.thumbItemsArr
  }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
}
class SliderMultiRootState extends SliderBaseRootState {
  opts;
  isMulti = true;
  activeThumb = null;
  currentThumbIdx = 0;
  constructor(opts) {
    super(opts);
    this.opts = opts;
    watch(
      [
        () => this.opts.step.current,
        () => this.opts.min.current,
        () => this.opts.max.current,
        () => this.opts.value.current
      ],
      ([step, min, max, value]) => {
        const steps = normalizeSteps(step, min, max);
        const isValidValue = (v) => {
          return steps.includes(v);
        };
        const gcv = (v) => {
          return snapValueToCustomSteps(v, steps);
        };
        if (value.some((v) => !isValidValue(v))) {
          this.opts.value.current = value.map(gcv);
        }
      }
    );
  }
  isTickValueSelected = (tickValue) => {
    return this.opts.value.current.includes(tickValue);
  };
  isThumbActive(index) {
    return this.isActive && this.activeThumb?.idx === index;
  }
  applyPosition({ clientXY, activeThumbIdx, start, end }) {
    const min = this.opts.min.current;
    const max = this.opts.max.current;
    const percent = (clientXY - start) / (end - start);
    const val = percent * (max - min) + min;
    if (val < min) {
      this.updateValue(min, activeThumbIdx);
    } else if (val > max) {
      this.updateValue(max, activeThumbIdx);
    } else {
      const steps = this.normalizedSteps;
      const newValue = snapValueToCustomSteps(val, steps);
      this.updateValue(newValue, activeThumbIdx);
    }
  }
  #getClosestThumb = (e) => {
    const thumbs = this.getAllThumbs();
    if (!thumbs.length) return;
    for (const thumb of thumbs) {
      thumb.blur();
    }
    const distances = thumbs.map((thumb) => {
      if (this.opts.orientation.current === "horizontal") {
        const { left, right } = thumb.getBoundingClientRect();
        return Math.abs(e.clientX - (left + right) / 2);
      } else {
        const { top, bottom } = thumb.getBoundingClientRect();
        return Math.abs(e.clientY - (top + bottom) / 2);
      }
    });
    const node = thumbs[distances.indexOf(Math.min(...distances))];
    const idx = thumbs.indexOf(node);
    return { node, idx };
  };
  handlePointerMove = (e) => {
    if (!this.isActive || this.opts.disabled.current) return;
    e.preventDefault();
    e.stopPropagation();
    const sliderNode = this.opts.ref.current;
    const activeThumb = this.activeThumb;
    if (!sliderNode || !activeThumb) return;
    activeThumb.node.focus();
    const { left, right, top, bottom } = sliderNode.getBoundingClientRect();
    const direction = this.direction;
    if (direction === "lr") {
      this.applyPosition({
        clientXY: e.clientX,
        activeThumbIdx: activeThumb.idx,
        start: left,
        end: right
      });
    } else if (direction === "rl") {
      this.applyPosition({
        clientXY: e.clientX,
        activeThumbIdx: activeThumb.idx,
        start: right,
        end: left
      });
    } else if (direction === "bt") {
      this.applyPosition({
        clientXY: e.clientY,
        activeThumbIdx: activeThumb.idx,
        start: bottom,
        end: top
      });
    } else if (direction === "tb") {
      this.applyPosition({
        clientXY: e.clientY,
        activeThumbIdx: activeThumb.idx,
        start: top,
        end: bottom
      });
    }
  };
  handlePointerDown = (e) => {
    if (e.button !== 0 || this.opts.disabled.current) return;
    const sliderNode = this.opts.ref.current;
    const closestThumb = this.#getClosestThumb(e);
    if (!closestThumb || !sliderNode) return;
    const target = e.composedPath()[0] ?? e.target;
    if (!isElementOrSVGElement(target) || !sliderNode.contains(target)) return;
    e.preventDefault();
    this.activeThumb = closestThumb;
    closestThumb.node.focus();
    this.isActive = true;
    this.handlePointerMove(e);
  };
  handlePointerUp = () => {
    if (this.opts.disabled.current) return;
    if (this.isActive) {
      this.opts.onValueCommit.current(run(() => this.opts.value.current));
    }
    this.isActive = false;
  };
  getAllThumbs = () => {
    const node = this.opts.ref.current;
    if (!node) return [];
    const thumbs = Array.from(node.querySelectorAll(sliderAttrs.selector("thumb")));
    return thumbs;
  };
  updateValue = (thumbValue, idx) => {
    const currValue = this.opts.value.current;
    if (!currValue.length) {
      this.opts.value.current.push(thumbValue);
      return;
    }
    const valueAtIndex = currValue[idx];
    if (valueAtIndex === thumbValue) return;
    const newValue = [...currValue];
    if (!isValidIndex(idx, newValue)) return;
    const direction = newValue[idx] > thumbValue ? -1 : 1;
    const swap = () => {
      const diffIndex = idx + direction;
      newValue[idx] = newValue[diffIndex];
      newValue[diffIndex] = thumbValue;
      const thumbs = this.getAllThumbs();
      if (!thumbs.length) return;
      thumbs[diffIndex]?.focus();
      this.activeThumb = { node: thumbs[diffIndex], idx: diffIndex };
    };
    if (this.opts.autoSort.current && (direction === -1 && thumbValue < newValue[idx - 1] || direction === 1 && thumbValue > newValue[idx + 1])) {
      swap();
      this.opts.value.current = newValue;
      return;
    }
    const steps = this.normalizedSteps;
    newValue[idx] = snapValueToCustomSteps(thumbValue, steps);
    this.opts.value.current = newValue;
  };
  #thumbsPropsArr = derived(() => {
    const currValue = this.opts.value.current;
    return Array.from({ length: currValue.length || 1 }, (_, i) => {
      const currThumb = run(() => this.currentThumbIdx);
      if (currThumb < currValue.length) {
        run(() => {
          this.currentThumbIdx = currThumb + 1;
        });
      }
      const thumbValue = currValue[i];
      const thumbPosition = this.getPositionFromValue(thumbValue ?? 0);
      const style = getThumbStyles(this.direction, thumbPosition);
      return {
        role: "slider",
        "aria-valuemin": this.opts.min.current,
        "aria-valuemax": this.opts.max.current,
        "aria-valuenow": thumbValue,
        "aria-disabled": boolToStr(this.opts.disabled.current),
        "aria-orientation": this.opts.orientation.current,
        "data-value": thumbValue,
        "data-orientation": this.opts.orientation.current,
        style,
        [sliderAttrs.thumb]: ""
      };
    });
  });
  get thumbsPropsArr() {
    return this.#thumbsPropsArr();
  }
  set thumbsPropsArr($$value) {
    return this.#thumbsPropsArr($$value);
  }
  #thumbsRenderArr = derived(() => {
    return this.thumbsPropsArr.map((_, i) => i);
  });
  get thumbsRenderArr() {
    return this.#thumbsRenderArr();
  }
  set thumbsRenderArr($$value) {
    return this.#thumbsRenderArr($$value);
  }
  #ticksPropsArr = derived(() => {
    const steps = this.normalizedSteps;
    const currValue = this.opts.value.current;
    return steps.map((tickValue, i) => {
      const tickPosition = this.getPositionFromValue(tickValue);
      const isFirst = i === 0;
      const isLast = i === steps.length - 1;
      const offsetPercentage = isFirst ? 0 : isLast ? -100 : -50;
      const style = getTickStyles(this.direction, tickPosition, offsetPercentage);
      const bounded = currValue.length === 1 ? tickValue <= currValue[0] : currValue[0] <= tickValue && tickValue <= currValue[currValue.length - 1];
      return {
        "data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
        "data-orientation": this.opts.orientation.current,
        "data-bounded": bounded ? "" : void 0,
        "data-value": tickValue,
        style,
        [sliderAttrs.tick]: ""
      };
    });
  });
  get ticksPropsArr() {
    return this.#ticksPropsArr();
  }
  set ticksPropsArr($$value) {
    return this.#ticksPropsArr($$value);
  }
  #ticksRenderArr = derived(() => {
    return this.ticksPropsArr.map((_, i) => i);
  });
  get ticksRenderArr() {
    return this.#ticksRenderArr();
  }
  set ticksRenderArr($$value) {
    return this.#ticksRenderArr($$value);
  }
  #tickItemsArr = derived(() => {
    return this.ticksPropsArr.map((tick, i) => ({ value: tick["data-value"], index: i }));
  });
  get tickItemsArr() {
    return this.#tickItemsArr();
  }
  set tickItemsArr($$value) {
    return this.#tickItemsArr($$value);
  }
  #thumbItemsArr = derived(() => {
    const currValue = this.opts.value.current;
    return currValue.map((value, index) => ({ value, index }));
  });
  get thumbItemsArr() {
    return this.#thumbItemsArr();
  }
  set thumbItemsArr($$value) {
    return this.#thumbItemsArr($$value);
  }
  #snippetProps = derived(() => ({
    ticks: this.ticksRenderArr,
    thumbs: this.thumbsRenderArr,
    tickItems: this.tickItemsArr,
    thumbItems: this.thumbItemsArr
  }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
}
class SliderRootState {
  static create(opts) {
    const { type, ...rest } = opts;
    const rootState = type === "single" ? new SliderSingleRootState(rest) : new SliderMultiRootState(rest);
    return SliderRootContext.set(rootState);
  }
}
const VALID_SLIDER_KEYS = [
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  ARROW_DOWN,
  HOME,
  END
];
class SliderRangeState {
  static create(opts) {
    return new SliderRangeState(opts, SliderRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(opts.ref);
  }
  #rangeStyles = derived(() => {
    if (Array.isArray(this.root.opts.value.current)) {
      const min = this.root.opts.value.current.length > 1 ? this.root.getPositionFromValue(Math.min(...this.root.opts.value.current) ?? 0) : 0;
      const max = 100 - this.root.getPositionFromValue(Math.max(...this.root.opts.value.current) ?? 0);
      return {
        position: "absolute",
        ...getRangeStyles(this.root.direction, min, max)
      };
    } else {
      const trackPadding = this.root.opts.trackPadding?.current;
      const currentValue = this.root.opts.value.current;
      const maxValue = this.root.opts.max.current;
      const min = 0;
      const max = trackPadding !== void 0 && trackPadding > 0 && currentValue === maxValue ? 0 : (
        // 100% - 0% = full width
        100 - this.root.getPositionFromValue(currentValue)
      );
      return {
        position: "absolute",
        ...getRangeStyles(this.root.direction, min, max)
      };
    }
  });
  get rangeStyles() {
    return this.#rangeStyles();
  }
  set rangeStyles($$value) {
    return this.#rangeStyles($$value);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    "data-orientation": this.root.opts.orientation.current,
    "data-disabled": boolToEmptyStrOrUndef(this.root.opts.disabled.current),
    style: this.rangeStyles,
    [sliderAttrs.range]: "",
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class SliderThumbState {
  static create(opts) {
    return new SliderThumbState(opts, SliderRootContext.get());
  }
  opts;
  root;
  attachment;
  #isDisabled = derived(() => this.root.opts.disabled.current || this.opts.disabled.current);
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(opts.ref);
    this.onkeydown = this.onkeydown.bind(this);
  }
  #updateValue(newValue) {
    if (this.root.isMulti) {
      this.root.updateValue(newValue, this.opts.index.current);
    } else {
      this.root.updateValue(newValue);
    }
  }
  onkeydown(e) {
    if (this.#isDisabled()) return;
    const currNode = this.opts.ref.current;
    if (!currNode) return;
    const thumbs = this.root.getAllThumbs();
    if (!thumbs.length) return;
    const idx = thumbs.indexOf(currNode);
    if (this.root.isMulti) {
      this.root.currentThumbIdx = idx;
    }
    if (!VALID_SLIDER_KEYS.includes(e.key)) return;
    e.preventDefault();
    const min = this.root.opts.min.current;
    const max = this.root.opts.max.current;
    const value = this.root.opts.value.current;
    const thumbValue = Array.isArray(value) ? value[idx] : value;
    const orientation = this.root.opts.orientation.current;
    const direction = this.root.direction;
    const steps = this.root.normalizedSteps;
    switch (e.key) {
      case HOME:
        this.#updateValue(min);
        break;
      case END:
        this.#updateValue(max);
        break;
      case ARROW_LEFT:
        if (orientation !== "horizontal") break;
        if (e.metaKey) {
          const newValue = direction === "rl" ? max : min;
          this.#updateValue(newValue);
        } else {
          const stepDirection = direction === "rl" ? "next" : "prev";
          const newValue = getAdjacentStepValue(thumbValue, steps, stepDirection);
          this.#updateValue(newValue);
        }
        break;
      case ARROW_RIGHT:
        if (orientation !== "horizontal") break;
        if (e.metaKey) {
          const newValue = direction === "rl" ? min : max;
          this.#updateValue(newValue);
        } else {
          const stepDirection = direction === "rl" ? "prev" : "next";
          const newValue = getAdjacentStepValue(thumbValue, steps, stepDirection);
          this.#updateValue(newValue);
        }
        break;
      case ARROW_UP:
        if (e.metaKey) {
          const newValue = direction === "tb" ? min : max;
          this.#updateValue(newValue);
        } else {
          const stepDirection = direction === "tb" ? "prev" : "next";
          const newValue = getAdjacentStepValue(thumbValue, steps, stepDirection);
          this.#updateValue(newValue);
        }
        break;
      case ARROW_DOWN:
        if (e.metaKey) {
          const newValue = direction === "tb" ? max : min;
          this.#updateValue(newValue);
        } else {
          const stepDirection = direction === "tb" ? "next" : "prev";
          const newValue = getAdjacentStepValue(thumbValue, steps, stepDirection);
          this.#updateValue(newValue);
        }
        break;
    }
    this.root.opts.onValueCommit.current(this.root.opts.value.current);
  }
  #props = derived(() => ({
    ...this.root.thumbsPropsArr[this.opts.index.current],
    id: this.opts.id.current,
    onkeydown: this.onkeydown,
    "data-active": this.root.isThumbActive(this.opts.index.current) ? "" : void 0,
    "data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current || this.root.opts.disabled.current),
    tabindex: this.opts.disabled.current || this.root.opts.disabled.current ? -1 : 0,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
function Slider$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      children,
      child,
      id = createId(uid),
      ref = null,
      value = void 0,
      type,
      onValueChange = noop,
      onValueCommit = noop,
      disabled = false,
      min: minProp,
      max: maxProp,
      step = 1,
      dir = "ltr",
      autoSort = true,
      orientation = "horizontal",
      thumbPositioning = "contain",
      trackPadding,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const min = (() => {
      if (minProp !== void 0) return minProp;
      if (Array.isArray(step)) return Math.min(...step);
      return 0;
    })();
    const max = (() => {
      if (maxProp !== void 0) return maxProp;
      if (Array.isArray(step)) return Math.max(...step);
      return 100;
    })();
    watch.pre(() => value, () => {
    });
    const rootState = SliderRootState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v),
      value: boxWith(() => value, (v) => {
        value = v;
        onValueChange(v);
      }),
      // @ts-expect-error - we know
      onValueCommit: boxWith(() => onValueCommit),
      disabled: boxWith(() => disabled),
      min: boxWith(() => min),
      max: boxWith(() => max),
      step: boxWith(() => step),
      dir: boxWith(() => dir),
      autoSort: boxWith(() => autoSort),
      orientation: boxWith(() => orientation),
      thumbPositioning: boxWith(() => thumbPositioning),
      type,
      trackPadding: boxWith(() => trackPadding)
    });
    const mergedProps = mergeProps(restProps, rootState.props);
    if (child) {
      $$renderer2.push("<!--[-->");
      child($$renderer2, { props: mergedProps, ...rootState.snippetProps });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span${attributes({ ...mergedProps })}>`);
      children?.($$renderer2, rootState.snippetProps);
      $$renderer2.push(`<!----></span>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref, value });
  });
}
function Slider_range($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      children,
      child,
      ref = null,
      id = createId(uid),
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const rangeState = SliderRangeState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v)
    });
    const mergedProps = mergeProps(restProps, rangeState.props);
    if (child) {
      $$renderer2.push("<!--[-->");
      child($$renderer2, { props: mergedProps });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span${attributes({ ...mergedProps })}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></span>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Slider_thumb($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      children,
      child,
      ref = null,
      id = createId(uid),
      index,
      disabled = false,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const thumbState = SliderThumbState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v),
      index: boxWith(() => index),
      disabled: boxWith(() => disabled)
    });
    const mergedProps = mergeProps(restProps, thumbState.props);
    if (child) {
      $$renderer2.push("<!--[-->");
      child($$renderer2, {
        active: thumbState.root.isThumbActive(thumbState.opts.index.current),
        props: mergedProps
      });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span${attributes({ ...mergedProps })}>`);
      children?.($$renderer2, {
        active: thumbState.root.isThumbActive(thumbState.opts.index.current)
      });
      $$renderer2.push(`<!----></span>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Slider($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      value = void 0,
      orientation = "horizontal",
      class: className,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<!---->`);
      {
        let children = function($$renderer4, { thumbs }) {
          $$renderer4.push(`<span${attr("data-orientation", orientation)} data-slot="slider-track"${attr_class(clsx(cn("bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1.5")))}><!---->`);
          Slider_range($$renderer4, {
            "data-slot": "slider-range",
            class: cn("bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full")
          });
          $$renderer4.push(`<!----></span> <!--[-->`);
          const each_array = ensure_array_like(thumbs);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let thumb = each_array[$$index];
            $$renderer4.push(`<!---->`);
            Slider_thumb($$renderer4, {
              "data-slot": "slider-thumb",
              index: thumb,
              class: "border-primary bg-background ring-ring/50 focus-visible:outline-hidden block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50"
            });
            $$renderer4.push(`<!---->`);
          }
          $$renderer4.push(`<!--]-->`);
        };
        Slider$1($$renderer3, spread_props([
          {
            "data-slot": "slider",
            orientation,
            class: cn("relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[disabled]:opacity-50", className)
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            },
            get value() {
              return value;
            },
            set value($$value) {
              value = $$value;
              $$settled = false;
            },
            children,
            $$slots: { default: true }
          }
        ]));
      }
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { ref, value });
  });
}
function _page($$renderer) {
  let value = 36;
  const dots = Array.from({ length: Number(value) });
  let $$settled = true;
  let $$inner_renderer;
  function $$render_inner($$renderer2) {
    $$renderer2.push(`<section class="flex flex-col h-full w-full overflow-hidden bg-gray-900 p-4"${attr_style(`--size: 350px; --dot-size: ${stringify(dots.length)}`)}><div class="m-auto w-full flex justify-center items-center bg-sky-50 p-4">`);
    Slider($$renderer2, {
      type: "single",
      max: 100,
      step: 1,
      class: "max-w-[70%]",
      get value() {
        return value;
      },
      set value($$value) {
        value = $$value;
        $$settled = false;
      }
    });
    $$renderer2.push(`<!----></div> <div class="m-auto"><div class="relative size-[var(--size)] rounded-full"><!--[-->`);
    const each_array = ensure_array_like(dots);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      each_array[i];
      $$renderer2.push(`<div class="absolute will-change-transform perspective-[70px] [transform-style:preserve-3d] top-[0] left-[50%] mt-[-10px] ml-[-10px] size-[20px] origin-[50%_calc((var(--size)/2)+10px)] rotate-[calc((360deg/var(--dot-size))*calc(var(--i)-1))] before:absolute before:top-[-100%] before:size-[22px] before:rounded-full before:bg-white before:content-[''] before:animate-white before:delay-(--dealy) after:absolute after:top-[100%] after:block after:size-[22px] after:rounded-full after:bg-gray-500 after:content-[''] after:animate-black after:delay-(--dealy)"${attr_style(`--i: ${stringify(i)}; --dealy: -${stringify(2 / 36 * i * 6)}s`)}></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></section>`);
  }
  do {
    $$settled = true;
    $$inner_renderer = $$renderer.copy();
    $$render_inner($$inner_renderer);
  } while (!$$settled);
  $$renderer.subsume($$inner_renderer);
}
export {
  _page as default
};
