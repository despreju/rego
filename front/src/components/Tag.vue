<template>
    <div :class="[colorClass]">
        <component style="width: 20px; margin-right: 0.5rem" v-if="icon" :is="icon" class="tag-icon" />
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ color?: string, icon?: any }>()

const colorClass = computed(() => {
    return `tag tag--${props.color ?? 'green'}`
})
</script>

<style>
.tag {
    display: flex;
    background-color: #1C1B20;
    padding: 0.5rem 1rem 0.3rem 1rem;
    border-radius: 0.25rem;
    align-items: flex-start;
    color: black;
}

.tag--blue {
    background-color: #0174DC;
}

.tag--red {
    background-color: #b10808;
}

.tag--green {
    background-color: #008000;
}

.tag--orange {
    background-color: #DD9239;
}

.tag--yellow {
    background-color: #B1CB2D;
}
</style>