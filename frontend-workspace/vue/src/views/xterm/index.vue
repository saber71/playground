<template>
  <div class="content-container">
    <div ref="el" class="container"></div>
  </div>
</template>

<script setup lang="ts">
import { TerminalExt } from "@/views/xterm/TerminalExt.ts"
import { TerminalText } from "@/views/xterm/TerminalText.ts"
import { onMounted, ref } from "vue"

const el = ref()
onMounted(async () => {
  const termExt = new TerminalExt(el.value)
  termExt.term.write(
    `Hello from ${new TerminalText("xterm.js", { bold: true, italic: true, underline: true, forecolor: "red", backcolor: "white" })} $`,
  )
  console.log(
    await termExt.getCursorPosition(),
    termExt.term.buffer.active.cursorX,
    termExt.term.buffer.active.cursorY,
  )
  // await termExt.hideCursor()
  await termExt.clearHome()
  const input = await termExt.readline()
  termExt.write(new TerminalText(input, { forecolor: "cyan" }))
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
  .container {
    height: 100%;
  }
}
</style>
