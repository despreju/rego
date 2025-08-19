<template>
    <div class="input">
        <label>{{ props.label }}</label>
        <input :type="props.type" class="input" :value="modelValue" @input="onInput" required :placeholder />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{ type: string, label: string, placeholder: string, modelValue: string | number }>()

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
    height: 2rem;
    font-family: 'Roboto', sans-serif;
    border-radius: 0.5rem;
    font-size: 1rem;
    padding: 0.5rem 2rem;
    background: #32323B;
    color: #c0c0c4;
    box-shadow: 0 0 0 1000px #32323B inset !important;
    -webkit-box-shadow: 0 0 0 1000px #32323B inset !important;
    -webkit-text-fill-color: #c0c0c4 !important;
    transition: background-color 9999s ease-in-out 0s;
}

.input {
    display: flex;
    flex-direction: column;
    margin-bottom: 3rem;
}

label {
    font-family: 'Roboto', sans-serif;
    color: #c0c0c4;
    font-size: 1rem;
    text-align: left;
    margin-bottom: 0.25rem;
    font-size: 1rem;
}
</style>