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
    padding: 0.5rem 1rem 0.3rem 1rem;
    border-radius: 0.25rem;
    align-items: flex-start;
    color: var(--color-bg);
}

.tag--blue {
    background-color: var(--color-primary);
}

.tag--red {
    background-color: var(--color-error);
}

.tag--green {
    background-color: var(--color-success);
}

.tag--orange {
    background-color: var(--color-accent);
}
</style>