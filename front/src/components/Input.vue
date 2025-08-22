<template>
    <div class="input">
        <label>{{ props.label }}</label>
        <input :type="props.type" :class="['input', props.dark ? '-dark' : '']" :value="modelValue" @input="onInput" required :placeholder="props.placeholder" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{ type: string, label: string, placeholder: string, modelValue: string | number; dark?: boolean }>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
}
</script>
<style scoped>

input,
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
    all: unset;
    display: flex;
    text-align: left;
    flex-direction: column;
    justify-content: center;
    height: 2rem;
    font-family: 'Roboto', sans-serif;
    border-radius: 0.5rem;
    font-size: 1rem;
    padding: 1.5rem 2rem;
    background: var(--color-surface);
    color: var(--color-text);
    box-shadow: 0 0 0 1000px var(--color-surface) inset !important;
    -webkit-box-shadow: 0 0 0 1000px var(--color-surface) inset !important;
    -webkit-text-fill-color: var(--color-text) !important;
    transition: background-color 9999s ease-in-out 0s;
    width: 100%;
    box-sizing: border-box;
}

input.-dark,
input.-dark:-webkit-autofill,
input.-dark:-webkit-autofill:hover,
input.-dark:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
    background: var(--color-bg);
    -webkit-box-shadow: 0 0 0 1000px var(--color-bg) inset !important;
    -webkit-text-fill-color: var(--color-text) !important;
}

.input {
    display: flex;
    flex-direction: column;
    width: 100%;
}

label {
    font-family: 'Roboto', sans-serif;
    color: var(--color-text);
    font-size: 1rem;
    text-align: left;
    margin-bottom: 0.25rem;
    font-size: 1rem;
}
</style>