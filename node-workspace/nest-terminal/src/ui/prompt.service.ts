import {
  checkbox,
  confirm,
  editor,
  expand,
  input,
  number,
  password,
  rawlist,
  search,
  select,
} from "@inquirer/prompts"
import { Injectable } from "@nestjs/common"
import type { MenuItem } from "../shared/types/class.type"

interface ItemValidator<V> {
  required?: boolean
  validate?: (value: V, form: any) => boolean | string | Promise<boolean | string>
}

interface ItemDefaultValue {
  defaultValue?: any
}

export type Item =
  | ({ type: "input" } & ItemValidator<string> & ItemDefaultValue)
  | ({ type: "inputNumber" } & ItemValidator<number | undefined> & ItemDefaultValue)
  | ({ type: "inputPassword" } & ItemValidator<string>)
  | ({ type: "confirm" } & ItemDefaultValue)
  | ({ type: "editor" } & ItemValidator<string> & ItemDefaultValue)
  | ({
      type: "select"
      choices: Parameters<typeof select<any>>[0]["choices"]
    } & ItemDefaultValue)
  | {
      type: "checkbox"
      choices: Parameters<typeof checkbox<any>>[0]["choices"]
    }
  | ({
      type: "expand"
      choices: Parameters<typeof expand<any>>[0]["choices"]
    } & ItemDefaultValue)
  | ({
      type: "rawList"
      choices: Parameters<typeof rawlist<any>>[0]["choices"]
    } & ItemDefaultValue)

export interface ConsoleFormOption<T extends object> {
  prompt: string
  prop: keyof T
  item: Item
}

@Injectable()
export class PromptService {
  async form<T extends object>(opts: ConsoleFormOption<T>[]): Promise<T> {
    const formData: any = {}
    for (let opt of opts) {
      let value: any
      if (opt.item.type === "input") {
        const callback = opt.item.validate
        value = await this.input(opt.prompt, {
          default: opt.item.defaultValue,
          required: opt.item.required,
          validate: callback ? (value) => callback!(value, formData) : undefined,
        })
      } else if (opt.item.type === "inputNumber") {
        const callback = opt.item.validate
        value = await this.inputNumber(opt.prompt, {
          default: opt.item.defaultValue,
          required: opt.item.required,
          validate: callback ? (value) => callback!(value, formData) : undefined,
        })
      } else if (opt.item.type === "inputPassword") {
        const required = opt.item.required
        const callback = opt.item.validate
        value = await this.inputPassword(opt.prompt, {
          validate: (str: string) => {
            if (required === false) return true
            if (callback) return callback(str, formData)
            return !!str
          },
        })
      } else if (opt.item.type === "editor") {
        const required = opt.item.required
        const callback = opt.item.validate
        value = await this.editor(opt.prompt, {
          default: opt.item.defaultValue,
          validate: (str: string) => {
            if (required === false) return true
            if (callback) return callback(str, formData)
            return !!str
          },
        })
      } else if (opt.item.type === "confirm") {
        value = await this.confirm(opt.prompt, {
          default: opt.item.defaultValue,
        })
      } else if (opt.item.type === "select") {
        value = await this.select(opt.prompt, opt.item.choices, {
          default: opt.item.defaultValue,
        })
      } else if (opt.item.type === "checkbox") {
        value = await this.checkbox(opt.prompt, opt.item.choices, {})
      } else if (opt.item.type === "expand") {
        value = await this.expand(opt.prompt, opt.item.choices, {
          default: opt.item.defaultValue,
        })
      } else if (opt.item.type === "rawList") {
        value = await this.rawList(opt.prompt, opt.item.choices, {
          default: opt.item.defaultValue,
        })
      } else throw new Error("Invalid item type " + (opt.item as any).type)
      formData[opt.prop] = value
    }
    return formData
  }

  async menuList(prompt: string, items: Array<MenuItem>) {
    const index = await this.select<number>(
      prompt,
      items.map((i, index) => {
        if (typeof i === "string")
          return {
            value: index,
            name: i,
            disabled: true,
          }
        else if (typeof i === "function")
          return {
            value: index,
            name: "选项" + (index + 1),
          }
        return {
          value: index,
          name: i.name,
          disabled: typeof i.isDisabled === "function" ? i.isDisabled() : (i.isDisabled ?? false),
        }
      }),
    )
    const item = items[index]
    if (typeof item === "function") return item()
    else if (typeof item === "object") return item.callback()
  }

  input(prompt: string, opt?: Omit<Parameters<typeof input>[0], "message">) {
    return input({ message: prompt, ...(opt ?? {}) })
  }

  inputNumber(prompt: string, opt?: Omit<Parameters<typeof number>[0], "message">) {
    return number({ message: prompt, ...(opt ?? {}) })
  }

  inputPassword(prompt: string, opt?: Omit<Parameters<typeof password>[0], "message">) {
    return password({ message: prompt, ...(opt ?? {}) })
  }

  confirm(prompt: string, opt?: Omit<Parameters<typeof confirm>[0], "message">) {
    return confirm({ message: prompt, ...(opt ?? {}) })
  }

  editor(prompt: string, opt?: Omit<Parameters<typeof editor>[0], "message">) {
    return editor({ message: prompt, ...(opt ?? {}) })
  }

  select<V>(
    prompt: string,
    choices: Parameters<typeof select<V>>[0]["choices"],
    opt?: Omit<Parameters<typeof select<V>>[0], "message" | "choices">,
  ) {
    return select<V>({ message: prompt, choices, ...(opt ?? {}) })
  }

  checkbox<V>(
    prompt: string,
    choices: Parameters<typeof checkbox<V>>[0]["choices"],
    opt?: Omit<Parameters<typeof checkbox<V>>[0], "message" | "choices">,
  ) {
    return checkbox<V>({ message: prompt, choices, ...(opt ?? {}) })
  }

  expand<V>(
    prompt: string,
    choices: Parameters<typeof expand<V>>[0]["choices"],
    opt?: Omit<Parameters<typeof expand<V>>[0], "message" | "choices">,
  ) {
    return expand<V>({ message: prompt, choices, ...(opt ?? {}) })
  }

  rawList<V>(
    prompt: string,
    choices: Parameters<typeof rawlist<V>>[0]["choices"],
    opt?: Omit<Parameters<typeof rawlist<V>>[0], "message" | "choices">,
  ) {
    return rawlist<V>({ message: prompt, choices, ...(opt ?? {}) })
  }

  search<V>(
    prompt: string,
    source: Parameters<typeof search<V>>[0]["source"],
    opt?: Omit<Parameters<typeof search<V>>[0], "message">,
  ) {
    return search<V>({ message: prompt, source, ...(opt ?? {}) })
  }
}
