<script setup lang="ts">
import { ref, watch } from "vue";
import Item from "./Item.vue"
import type { IState } from "./guitar/Scales/types/IState";
import { ScalesItemState } from "./guitar/Scales/types/ScalesItemState";
import { decodeQueryParam, encodeQueryParam, getList, getParam, removeParam, setParam } from "@/types/QueryParamsManager";

const maxItemsNumber = 5

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

function addItem()
{
    if (items.value.size >= maxItemsNumber) return
    
    const id = getIdForItem()
    const stateStr = getStateString(id)
    const s = new ScalesItemState(id)
    if (stateStr)
    {
        s.deserialize(stateStr)
    } else
    {
        s.loadDefaults()
    }
    items.value.set(id, s)
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
        if (!isCorrectId(key)) continue

        let id: number
        id = Number.parseInt(key.substring(1))
        if (isNaN(id)) continue
        
        const stateStr = getStateString(id)
        const s = new ScalesItemState(id)
        if (stateStr)
        {
            s.deserialize(stateStr)
        } else
        {
            s.loadDefaults()
        }
        items.value.set(id, s)
    }
}

addItemsFromQuery()

watch(items, (val) => {
    for (let [k, v] of val)
    {
        setParam('i' + k, encodeQueryParam(JSON.stringify(v)))
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
    <i class="add-new-item mi-filled mi-add-box md-82 el-clr hov-el-clr tr-al" title="Add item" @click="addItem"
        v-show="items.size < maxItemsNumber"></i>
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