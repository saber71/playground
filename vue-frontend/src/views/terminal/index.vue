<template>
  <div class="terminal-container">
    <div ref="terminalRef" class="terminal"></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue"
import { Terminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import "@xterm/xterm/css/xterm.css"

const terminalRef = ref(null)
let terminal = null
let fitAddon = null
let socket = null

// WebSocket 连接地址
const WS_URL = "ws://localhost:8080/ws/terminal"

onMounted(() => {
  initTerminal()
  connectBackend()
})

onBeforeUnmount(() => {
  if (socket) {
    socket.close()
  }
  if (terminal) {
    terminal.dispose()
  }
})

// 初始化终端
const initTerminal = () => {
  terminal = new Terminal({
    fontSize: 14,
    fontFamily: 'Consolas, "Courier New", monospace',
    theme: {
      background: "#1e1e1e",
      foreground: "#ffffff",
      cursor: "#ffffff",
      selection: "rgba(255, 255, 255, 0.3)",
      black: "#000000",
      red: "#cd3131",
      green: "#0dbc79",
      yellow: "#e5e510",
      blue: "#2472c8",
      magenta: "#bc3fbc",
      cyan: "#11a8cd",
      white: "#e5e5e5",
      brightBlack: "#666666",
      brightRed: "#f14c4c",
      brightGreen: "#23d18b",
      brightYellow: "#f5f543",
      brightBlue: "#3b8eea",
      brightMagenta: "#d670d6",
      brightCyan: "#29b8db",
      brightWhite: "#e5e5e5",
    },
    cursorBlink: true,
    scrollback: 1000,
    tabStopWidth: 4,
    convertEol: true,
    lineHeight: 1.2,
  })

  // 添加自适应插件
  fitAddon = new FitAddon()
  terminal.loadAddon(fitAddon)

  // 打开终端
  terminal.open(terminalRef.value)

  // 适配容器大小
  fitAddon.fit()

  // 监听窗口大小变化
  window.addEventListener("resize", handleResize)

  // 监听用户输入
  terminal.onData((data) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "input", data }))
    }
  })
}

// 连接后端 WebSocket
const connectBackend = () => {
  try {
    socket = new WebSocket(WS_URL)

    socket.onopen = () => {
      console.log("WebSocket 连接已建立")
      terminal.writeln("\x1b[32m✓ 已连接到后端服务\x1b[0m\r\n")
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)

      if (message.type === "output") {
        // 接收后端输出
        terminal.write(message.data)
      } else if (message.type === "resize") {
        // 后端请求调整大小
        fitAddon.fit()
      }
    }

    socket.onerror = (error) => {
      console.error("WebSocket 错误:", error)
      terminal.writeln("\x1b[31m✗ 连接错误\x1b[0m\r\n")
    }

    socket.onclose = () => {
      console.log("WebSocket 连接已关闭")
      terminal.writeln("\n\x1b[31m✗ 连接已断开\x1b[0m\r\n")
    }
  } catch (error) {
    console.error("连接失败:", error)
    terminal.writeln(`\x1b[31m连接失败：${error.message}\x1b[0m\r\n`)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  if (fitAddon) {
    fitAddon.fit()

    // 通知后端终端尺寸变化
    if (socket && socket.readyState === WebSocket.OPEN) {
      const dims = {
        cols: terminal.cols,
        rows: terminal.rows,
      }
      socket.send(JSON.stringify({ type: "resize", ...dims }))
    }
  }
}
</script>

<style lang="scss" scoped>
.terminal-container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #1e1e1e;
}

.terminal {
  width: 100%;
  height: 100%;

  :deep(.xterm) {
    height: 100%;
    padding: 8px;
  }

  :deep(.xterm-viewport) {
    overflow-y: auto;
    height: 100%;
  }

  :deep(.xterm-screen) {
    height: 100%;
  }
}
</style>
