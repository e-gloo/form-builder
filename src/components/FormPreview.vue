<script setup lang="ts">
import { onMounted } from 'vue';

const flowKey = 'vue-flow-project'
onMounted(() => {
  const flow = JSON.parse(localStorage.getItem(flowKey))
});
</script>


<template>
  <div>
    Form
  </div>
</template>

