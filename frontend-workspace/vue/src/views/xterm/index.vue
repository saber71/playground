<template>
  <div ref="el" class="content-container"></div>
</template>

<script setup lang="ts">
import { TerminalExt } from "@/views/xterm/index.ts"
import { TerminalText } from "@/views/xterm/TerminalText.ts"
import { onMounted, ref } from "vue"

const el = ref()
onMounted(() => {
  const termExt = new TerminalExt(el.value)
  termExt.term.write(
    `Hello from ${new TerminalText("xterm.js", { bold: true, italic: true, underline: true, forecolor: "red", backcolor: "white" })} $ \n\r可考虑ippo`,
  )
})
const array = TerminalText.wrap(6, new TerminalText("\n看1\n看撒旦"), new TerminalText("旦撒223"))
console.log(
  array.map((i) => i.join(" ")),
  array.map((i) => i.map((t) => t.getWidth()).join(" ")),
)
</script>

<style scoped lang="scss">
.content-container {
  background: black;
}
</style>
