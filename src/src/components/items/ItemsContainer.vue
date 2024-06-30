<script setup lang="ts">
import { ref, watch } from "vue";
import Item from "./Item.vue"
import type { IState } from "./guitar/Scales/types/IState";
import { ScalesItemState } from "./guitar/Scales/types/ScalesItemState";
import { decodeQueryParam, encodeQueryParam, getList, getParam, removeParam, setParam } from "@/types/QueryParamsManager";
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPlusBox } from "@mdi/js";
import { OptionStorage } from "@/utils/LocalStorage";

const maxItemsNumber = 5
const isPWA = window.matchMedia('(display-mode: standalone)')?.matches ?? false
const o = new OptionStorage("itemsStates")

const items = ref(new Map<number, IState>())

function getIdForItem()
{
    let i = 0
    for (let [k] of items.value)
    {
        if (k != i) break

        i++
    }
    return i
}

function getState(id: number): IState
{
    const stateStr = getStateString(id)
    const s = new ScalesItemState(id)
    if (stateStr)
    {
        s.deserialize(stateStr)
    } else
    {
        s.loadDefaults()
    }
    return s
}

function addItem()
{
    if (items.value.size >= maxItemsNumber) return
    
    const id = getIdForItem()
    items.value.set(id, getState(id))
}
function removeItem(k: number)
{
    items.value.delete(k)
    removeParam('i' + k)
}

function getStateString(id: number)
{
    const str = getParam('i' + id)
    if (!str) return undefined

    return decodeQueryParam(str)
}

function isCorrectId(id: string)
{
    if ((id[0] !== 'i') || (id.length > 3)) return false

    let result = false
    for(let i = 1; i < id.length; i++)
    {
        const ch = id[i]
        result = !isNaN(parseInt(ch))
        if (!result) break
    }
    return result
}
function addItemsFromQuery()
{
    for(let [key, _] of getList())
    {
        if (items.value.size >= maxItemsNumber) return

        if (!isCorrectId(key)) continue

        let id: number
        id = Number.parseInt(key.substring(1))
        if (isNaN(id)) continue
        
        items.value.set(id, getState(id))
    }
}
function addItemsFromStorage()
{
    const statesStr = o.loadStr()
    if (!statesStr) return

    try 
    {
        const parsed = JSON.parse(statesStr) as Array<[number, Array<any>]>
        for (const pair of parsed)
        {
            if (items.value.size >= maxItemsNumber) return

            const id = pair[0]
            const s = new ScalesItemState(id)
            s.deserializeArr(pair[1])
            items.value.set(pair[0], s)
        }
    } catch (err) {}
}

if (isPWA)
{
    addItemsFromStorage()
} else
{
    addItemsFromQuery()
}
if (items.value.size == 0)
{
    addItem()
}

watch(items, (val) => {
    if (isPWA)
    {
        o.saveStr(JSON.stringify(Array.from(val)))
        return
    }
    
    for (let [id, state] of val)
    {
        setParam('i' + id, encodeQueryParam(JSON.stringify(state)))
    }
}, { deep: true })
</script>

<template>
    <ul class="items-container">
        <TransitionGroup>
            <Item v-for="[k, item] in items" :onCloseButton="() => { removeItem(k) }" :key="k"
                :state="item">
            </Item>
        </TransitionGroup>
    </ul>
    <div class="add-new-item el-clr hov-el-clr tr-al" title="Add item" @click="addItem"
        v-show="items.size < maxItemsNumber">
        <SvgIcon type="mdi" :path="mdiPlusBox" :size="82"></SvgIcon>
</div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: all 0.1s ease;
    transform-origin: top;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: scaleY(0);
}
</style>