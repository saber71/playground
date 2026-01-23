import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useTokenStore = defineStore("token", () => {
  const token = ref(localStorage.getItem("token") ?? "");

  watch(token, () => {
    if (token.value) localStorage.setItem("token", token.value);
    else localStorage.removeItem("token");
  });

  return { token };
});
