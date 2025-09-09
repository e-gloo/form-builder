<script setup lang="ts">
import { useVueFlow } from '@vue-flow/core';

import FormBuilder from '../components/FormBuilder.vue';
import { useFormBuilder } from '../composables/useFormBuilder';

const { addQuestion, logInstance } = useFormBuilder();

</script>

<template>
  <div class="w-full h-full flex flex-col gap-4">
    <div class="w-full flex gap-x-4 justify-center p-2">
      <button
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        @click="addQuestion">Add a question</button>
      <button
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        @click="logInstance">Log instance</button>
    </div>
    <FormBuilder />
  </div>
</template>

