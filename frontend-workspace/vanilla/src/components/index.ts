import {
  type SlAlert,
  SlAnimation,
  SlButton,
  SlMenu,
  SlTab,
  SlTabPanel,
  SlTreeItem,
} from "@shoelace-style/shoelace"
import { type ElementExt, type ElementExtArray, HTMLElementExt } from "./HTMLElementExt.ts"

declare global {
  interface HTMLElementTagNameMap {}
}

export * from "./HTMLElementExt.ts"
export * from "./BaseCustomElement.ts"

export function createElExt<K extends keyof HTMLElementTagNameMap>(
  name: K,
  // @ts-ignore
): ElementExt<HTMLElementTagNameMap[K]> {
  // constructor.observedAttributes
  const el = document.createElement(name)
  return HTMLElementExt(el as any)
}

export function querySelector<E extends HTMLElement>(selector: string): ElementExt<E> | null {
  const result = document.querySelector(selector)
  if (!result) return null
  return HTMLElementExt(result as any)
}

export function queryAllSelector<E extends HTMLElement>(select: string): Array<ElementExt<E>> {
  const nodes = document.querySelectorAll(select)
  return Array.from(nodes).map(HTMLElementExt as any)
}

export function getElementById<E extends HTMLElement>(id: string): ElementExt<E> | null {
  const result = document.getElementById(id)
  if (!result) return null
  return HTMLElementExt(result as any)
}

export function getElementByClassName<E extends HTMLElement>(
  className: string,
): Array<ElementExt<E>> {
  const nodes = document.getElementsByClassName("select")
  return Array.from(nodes).map(HTMLElementExt as any)
}

export function div(...children: ElementExtArray) {
  return createElExt("div").addChildren(...children)
}

export function span(str: string = "") {
  return createElExt("span").attr("textContent", str)
}

export function img(src: string = "") {
  const img = document.createElement("img")
  return createElExt("img").attr("src", src)
}

export function button(str: string = "") {
  return createElExt("sl-button").attr("textContent", str)
}

export function splitButton(opts?: {
  variant?: SlButton["variant"]
  str?: string
  menu?: ElementExt<SlMenu>
}) {
  const group = buttonGroup().addChildren(
    button(opts?.str).attr("variant", opts?.variant ?? "primary"),
  )
  const trigger = button()
    .attr("variant", opts?.variant ?? "primary")
    .attr("caret", true)
  if (opts?.menu) {
    group.addChildren(dropdown(trigger, opts.menu))
  } else {
    group.addChildren(trigger)
  }
  return group
}

export function tooltip(content: string, trigger: ElementExt<HTMLElement>) {
  return createElExt("sl-tooltip").attr("content", content).addChildren(trigger)
}

export function dropdown(trigger: ElementExt<HTMLElement>, menu: ElementExt<SlMenu>) {
  return createElExt("sl-dropdown").addChildren(trigger.setSlot("trigger"), menu)
}

export function input(value: string = "") {
  return createElExt("sl-input").attr("value", value)
}

export function icon(name: string) {
  return createElExt("sl-icon").attr("name", name)
}

export function toast(opt?: {
  str?: string
  icon?: string
  variant?: SlAlert["variant"]
  duration?: number
}) {
  return createElExt("sl-alert")
    .attr("variant", opt?.variant || "neutral")
    .attr("duration", opt?.duration ?? 3000)
    .addChildren(icon(opt?.icon ?? "info"), span(opt?.str))
}

export function animatedImage(src: string) {
  return createElExt("sl-animated-image").attr("src", src)
}

export function animation(name: SlAnimation["name"]) {
  return createElExt("sl-animation").attr("name", name)
}

export function avatar(opt?: { src?: string; label?: string }) {
  return createElExt("sl-avatar")
    .attr("image", opt?.src ?? "")
    .attr("initials", opt?.label ?? "")
    .attr("loading", "lazy")
}

export function badge(str: string) {
  return createElExt("sl-badge").attr("textContent", str).attr("pill", true)
}

export function breadcrumbItem(str: string, href: string = "") {
  return createElExt("sl-breadcrumb-item").attr("textContent", str).attr("href", href)
}

export function breadcrumb(...str: string[]) {
  return createElExt("sl-breadcrumb").addChildren(...str.map((i) => breadcrumbItem(i)))
}

export function buttonGroup() {
  return createElExt("sl-button-group")
}

export function card(opts?: {
  header?: ElementExt<HTMLElement>
  content?: ElementExtArray
  footer?: ElementExt<HTMLElement>
}) {
  return createElExt("sl-card").addChildren(
    opts?.header?.setSlot("header"),
    opts?.content,
    opts?.footer?.setSlot("footer"),
  )
}

export function carouselItem(content: string = "") {
  return createElExt("sl-carousel-item").attr("textContent", content)
}

export function carousel() {
  return createElExt("sl-carousel")
}

export function checkbox(opt?: { checked?: boolean; content?: string }) {
  return createElExt("sl-checkbox")
    .attr("checked", opt?.checked ?? true)
    .attr("textContent", opt?.content ?? "")
}

export function colorPicker(opt?: { label?: string; value?: string }) {
  return createElExt("sl-color-picker")
    .attr("value", opt?.value ?? "")
    .attr("label", opt?.label ?? "")
}

export function details(opts?: { summary?: string; content?: ElementExt<HTMLElement> }) {
  return createElExt("sl-details")
    .attr("summary", opts?.summary ?? "")
    .addChildren(opts?.content)
}

export function dialog(opts?: { content?: ElementExtArray; footer?: ElementExt<HTMLElement> }) {
  return createElExt("sl-dialog").addChildren(opts?.content, opts?.footer?.setSlot("footer"))
}

export function divide(spacing?: string) {
  return createElExt("sl-divider").styleProperties({ "--spacing": spacing })
}

export function drawer(opt?: {
  content?: ElementExtArray
  label?: string
  footer?: ElementExt<HTMLElement>
}) {
  return createElExt("sl-drawer")
    .attr("label", opt?.label ?? "")
    .addChildren(opt?.content, opt?.footer?.setSlot("footer"))
}

export function formatByte(value: number) {
  return createElExt("sl-format-bytes").attr("value", value)
}

export function formatNumber(value: number) {
  return createElExt("sl-format-number").attr("value", value)
}

export function formatDate(value: Date | string) {
  return createElExt("sl-format-date").attr("date", value)
}

export function relativeTime(value: Date | string) {
  return createElExt("sl-relative-time").attr("date", value)
}

export function iconButton(name: string, label: string = "") {
  return createElExt("sl-icon").attr("name", name).attr("label", label)
}

export function imageComparer(
  before: ElementExt<HTMLImageElement>,
  after: ElementExt<HTMLImageElement>,
  position: number = 50,
) {
  return createElExt("sl-image-comparer").attr("position", position).addChildren(before, after)
}

export function menuLabel(content: string) {
  return createElExt("sl-menu-label").attr("textContent", content)
}

export function menuItem(content: string, sub?: ElementExt<SlMenu>) {
  return createElExt("sl-menu-item")
    .attr("textContent", content)
    .addChildren(sub?.setSlot("submenu"))
}

export function menu(
  ...items: Array<{
    label: string
    callback?: () => void
    key?: string
    disabled?: boolean
    sub?: ElementExt<SlMenu>
  }>
) {
  return createElExt("sl-menu").addChildren(
    items.map((i, index) =>
      menuItem(i.label, i.sub)
        .attr("disabled", i.disabled ?? !i.callback)
        .attr("value", i.key ?? index + ""),
    ),
  )
}

interface SelectOption {
  label?: string
  value?: string
}

export function selectOption(opt?: SelectOption) {
  return createElExt("sl-option")
    .attr("textContent", opt?.label ?? opt?.value ?? "")
    .attr("value", opt?.value ?? opt?.label ?? "")
}

export function select(...options: SelectOption[]) {
  return createElExt("sl-select").addChildren(options.map(selectOption))
}

export function popup(anchor: ElementExt<HTMLElement>, content: ElementExt<HTMLElement>) {
  return createElExt("sl-popup").addChildren(anchor.setSlot("anchor"), content)
}

export function progressBar(value: number) {
  return createElExt("sl-progress-bar").attr("value", value)
}

export function progressRing(value: number) {
  return createElExt("sl-progress-ring").attr("value", value)
}

interface RadioOption {
  label?: string
  value?: string
  button?: boolean
}

export function radio(opt: RadioOption) {
  return createElExt(opt.button ? "sl-radio-button" : "sl-radio")
    .attr("value", opt.value ?? opt.label ?? "")
    .attr("textContent", opt.label ?? opt.value ?? "")
}

export function radioGroup(...options: RadioOption[]) {
  return createElExt("sl-radio-group").addChildren(options.map(radio))
}

export function range(opt?: { min?: number; max?: number; step?: number }) {
  return createElExt("sl-range")
    .attr("min", opt?.min ?? 0)
    .attr("max", opt?.max ?? 100)
    .attr("step", opt?.step ?? 1)
}

export function rating(value?: number) {
  return createElExt("sl-rating").attr("value", value ?? 0)
}

export function spinner() {
  return createElExt("sl-spinner")
}

export function splitPanel(
  start: ElementExt<HTMLElement>,
  end: ElementExt<HTMLElement>,
  position: number = 50,
) {
  return createElExt("sl-split-panel")
    .addChildren(start.setSlot("start"), end.setSlot("end"))
    .attr("position", position)
}

export function switches(opts?: { label?: string; value?: boolean }) {
  return createElExt("sl-switch")
    .attr("checked", opts?.value ?? false)
    .attr("textContent", opts?.label ?? "")
}

export function tab(content: string, panel?: string) {
  return createElExt("sl-tab")
    .attr("textContent", content)
    .attr("panel", panel ?? content)
}

export function tabPanel(name: string, ...content: ElementExtArray) {
  return createElExt("sl-tab-panel").attr("name", name).addChildren(content)
}

export function tabGroup(opt: { nav: ElementExt<SlTab>[]; panels: ElementExt<SlTabPanel>[] }) {
  opt.nav.forEach((i) => i.setSlot("nav"))
  return createElExt("sl-tab-group").addChildren(opt.nav, opt.panels)
}

export function tag(content: string) {
  return createElExt("sl-tag").attr("textContent", content)
}

export function textarea(value: string = "") {
  return createElExt("sl-textarea").attr("value", value)
}

interface TreeItemOption {
  label: string
  children?: TreeItemOption[]
}

export function treeItem(option: TreeItemOption): ElementExt<SlTreeItem> {
  return createElExt("sl-tree-item")
    .attr("textContent", option.label)
    .addChildren(option.children?.map(treeItem))
}

export function tree(...options: TreeItemOption[]) {
  return createElExt("sl-tree").addChildren(options.map(treeItem))
}
