import type { InjectionKey, Ref } from "vue";

export const isFlatNotationKey = Symbol() as InjectionKey<Ref<boolean>>
export const themeNameKey = Symbol() as InjectionKey<Ref<string>>
export const inactiveNoteOpacityKey = Symbol() as InjectionKey<Ref<number>>