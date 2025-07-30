<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="callApi()">{{ msg }}{{ count }}</button>
    <p>{{ consoleMsg }}</p>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

defineProps<{ msg: string }>()

const count = ref(0)
const msg = ref("nombre d'appel : ")
const consoleMsg = ref("")

function callApi() {
  axios.get('http://localhost:3002/api/hello').then((res) => {
    consoleMsg.value = res.data
    count.value++;
  }).catch((error) => {
    consoleMsg.value = error.message
  });
}
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
