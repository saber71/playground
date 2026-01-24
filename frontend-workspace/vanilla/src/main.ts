import "reflect-metadata"
import "./style.css"
import "@shoelace-style/shoelace/dist/themes/light.css"
import "@shoelace-style/shoelace/dist/shoelace.js"
import { ReflectiveInjector } from "injection-js"
import { FrontendService } from "./ui"
import { ServiceClasses, StyledString } from "./utils"

// 可选：设置默认主题（如果需要暗色）
// document.documentElement.classList.add('sl-theme-dark');

const injector = ReflectiveInjector.resolveAndCreate(ServiceClasses)
const root = injector.get(FrontendService) as FrontendService
const data = [
  { prop1: "12大撒大撒3", prop2: "2342432432", prop3: "dsadsadsadsa擦擦的撒" },
  { prop1: "12大撒大撒3", prop2: "2342432432", prop3: "dsadsadsadsa擦擦的撒" },
]
root.table
  .render(
    [
      { label: "属性1", prop: "prop1" },
      { label: "属性2", prop: "prop2" },
      { label: "属性3", prop: "prop3" },
    ],
    data,
  )
  .styles({ width: "300px" })
//
// const messageBox = new MessageBox().style("height", "100px")
// root.addChild(messageBox)
root.messageBox
  .typing([
    `时区逻辑是否合理？
你假设输入字符串是`,
    new StyledString("UTC\n 时间（带 Z），并想将其\n“当", { color: "red", fontWeight: "bold" }),
    `作 UTC 本地时间”存入 LocalDateTime。
异常处理`,
  ])
  .then(() => {
    root.menuList([
      { label: "123", callback: () => alert("123") },
      { label: "12333", callback: () => alert("12333") },
    ])
  })
