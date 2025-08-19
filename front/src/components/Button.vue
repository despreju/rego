<template>
    <button :class="[colorClass]">
        <slot />
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ color?: string }>()

const colorClass = computed(() => {
    return `button button--${props.color ?? 'black'}`
})
</script>

<style scoped>
button {
    all: unset;
    display: inline-block;
    padding: 0.75rem 1.5rem;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.15s ease-in-out;
}

.button:hover {
    transition: background-color 0.15s ease-in-out;
}

.button--blue {
    background-color: #0174DC;
}
.button--blue:hover {
    background-color: #005BB5;
}

.button--black {
    background-color: #1C1B20;
}
.button--black:hover {
    background-color: #121114;
}

.button--red {
    background-color: #b10808;
}
.button--red:hover {
    background-color: #950606;
}

.button--green {
    background-color: #008000;
}
.button--green:hover {
    background-color: #006d00;
}
</style>