<template>
    <button :class="[colorClass]">
        <component v-if="props.icon" :is="props.icon" class="button-icon" aria-hidden="true" />
        <div v-if="msg" class="button-text">{{ msg }}</div>
    </button>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'

const props = defineProps<{ color?: string; icon?: Component | string; msg?: string }>()

const colorClass = computed(() => {
    return `button button-${props.color ?? 'black'}`
})
</script>

<style scoped>
button {
    all: unset;
    padding: 0.5rem;
    height: 3rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    transition: all .18s ease;
    box-sizing: border-box;
    background: var(--color-surface);
    border-radius: 12px;
    box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.03), inset 0 0 0 rgba(0, 0, 0, 0.6), inset 0 0 0 rgba(255, 255, 255, 0.02);
    transition: box-shadow .10s ease, transform .10s ease;
    color: var(--color-text);
}

button:hover {
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.4), 0 0 0 rgba(255, 255, 255, 0.03), inset 4px 4px 10px rgba(0, 0, 0, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.02);
    transform: translateY(1px);
    transition: box-shadow .10s ease, transform .10s ease;
}

.button-green {
    background: var(--color-success);
}

.button-red {
    background: var(--color-error);
}

.button-blue {
    background: var(--color-primary);
}

.button-icon {
    width: 32px;
    display: inline-block;
    vertical-align: middle;
    fill: var(--color-text)
}

.button-text {
    margin: 0 1rem;
}
</style>