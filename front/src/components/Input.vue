<template>
  <div class="input">
    <label v-if="props.type === 'checkbox'" class="checkbox-label">
      <input class="checkbox-native" type="checkbox" :checked="Boolean(modelValue)" @change="onCheckbox"
        :aria-label="props.label" />
      <span class="checkbox-ui" aria-hidden="true">
        <!-- simple checkmark svg -->
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
      <span class="label-text">{{ props.label }}</span>
    </label>

    <!-- default input (text, number, password, etc.) -->
    <div v-else>
      <label v-if="props.label" style="text-align: left;">{{ props.label }}</label>
      <input :type="props.type" :class="['field-input', props.dark ? '-dark' : '']"
        :value="modelValue as string | number" @input="onInput" :required="props.type !== 'checkbox'"
        :placeholder="props.placeholder" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ type: string, label?: string, placeholder?: string, modelValue: string | number | boolean; dark?: boolean }>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:modelValue', value: number): void
  (e: 'update:modelValue', value: boolean): void
}>()

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
}

function onCheckbox(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  emit('update:modelValue', checked)
}
</script>
<style scoped>
input:not([type="checkbox"]),
input:not([type="checkbox"]):-webkit-autofill,
input:not([type="checkbox"]):-webkit-autofill:hover,
input:not([type="checkbox"]):-webkit-autofill:focus,
textarea:not([type="checkbox"]):-webkit-autofill,
textarea:not([type="checkbox"]):-webkit-autofill:hover,
textarea:not([type="checkbox"]):-webkit-autofill:focus,
select:not([type="checkbox"]):-webkit-autofill,
select:not([type="checkbox"]):-webkit-autofill:hover,
select:not([type="checkbox"]):-webkit-autofill:focus {
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
input.-dark:-webkit-autofill:focus {
  background: var(--color-bg);
  -webkit-box-shadow: 0 0 0 1000px var(--color-bg) inset !important;
  -webkit-text-fill-color: var(--color-text) !important;
}

/* layout */
.input {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* keep label style */
label {
  font-family: 'Roboto', sans-serif;
  color: var(--color-text);
  font-size: 1rem;
  text-align: left;
  margin-bottom: 0.25rem;
}

/* specific class for the actual text input to avoid name clash */
.field-input {
  width: 100%;
  box-sizing: border-box;
}

/* ---------- Checkbox styles ---------- */
.checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

/* hide native checkbox visually but keep it accessible */
.checkbox-native {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

/* visual checkbox UI */
.checkbox-ui {
  width: 1.6rem;
  height: 1.6rem;
  min-width: 1.6rem;
  border-radius: 6px;
  display: inline-grid;
  place-items: center;
  background: var(--color-surface);
  color: transparent;
  box-shadow: -4px -4px 10px rgba(255, 255, 255, 0.03), 6px 6px 14px rgba(0, 0, 0, 0.5);
  transition: background .14s var(--transition-fast, ease), box-shadow .14s var(--transition-fast, ease), transform .08s ease;
  box-sizing: border-box;
}

/* checkmark hidden by default */
.checkbox-ui svg {
  width: 0.9rem;
  height: 0.9rem;
  color: white;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity .12s ease, transform .12s ease;
  stroke: currentColor;
}

/* when native checkbox is checked, style the UI */
.checkbox-native:checked+.checkbox-ui {
  background: var(--color-primary);
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.45);
  color: #fff;
}

.checkbox-native:checked+.checkbox-ui svg {
  opacity: 1;
  transform: scale(1);
}

/* focus styles for accessibility */
.checkbox-native:focus-visible+.checkbox-ui {
  outline: 2px solid rgba(43, 123, 228, 0.18);
  outline-offset: 4px;
}

/* label text */
.label-text {
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.field-input::placeholder {
  color: var(--color-text-secondary);
  font-style: italic;
}

.field-input::-webkit-input-placeholder {
  color: var(--color-text-secondary);
  font-style: italic;
}

.field-input:-ms-input-placeholder {
  color: var(--color-text-secondary);
  font-style: italic;
}

.field-input::-ms-input-placeholder {
  color: var(--color-text-secondary);
  font-style: italic;
}

input.-dark::placeholder {
  color: var(--color-text-secondary);
  font-style: italic;
}

.field-input:focus::placeholder {
  color: var(--color-text-secondary);
  font-style: italic;
}

textarea::placeholder {
  color: var(--color-text-secondary);
  font-style: italic;
}
</style>