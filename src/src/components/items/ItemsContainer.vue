<script setup lang="ts">
import { computed, reactive } from "vue";
import Item from "./Item.vue"

const maxItemsNumber = 5

const items = reactive(new Map<number, any>())
const isAddButtonVisible = computed(() => items.size < maxItemsNumber)

function getIdForItem()
{
    let i = 0
    for (let [k] of items)
    {
        if (k != i) break

        i++
    }
    return i
}

function addItem()
{
    if (items.size >= maxItemsNumber) return
    
    items.set(getIdForItem(), null)
}

addItem()
</script>

<template>
    <ul class="items-container">
        <TransitionGroup>
            <Item v-for="item in items" :onCloseButton="() => { items.delete(item[0]) }" :key="item[0]"></Item>
        </TransitionGroup>
    </ul>
    <i class="add-new-item mi-filled mi-add-box md-82 el-clr hov-el-clr tr-al" title="Add item" @click="addItem"
        v-show="isAddButtonVisible"></i>
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