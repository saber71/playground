import { Injectable } from "injection-js"
import type { Class } from "../types.ts"

export const ServiceClasses: Class<any>[] = []

export function Service() {
  const fn = Injectable()
  return (...args: any[]) => {
    fn(...args)
    ServiceClasses.push(args[0])
  }
}
