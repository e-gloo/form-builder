<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Position, Handle } from '@vue-flow/core'
import type { NodeProps } from '@vue-flow/core'
import { NodeToolbar } from '@vue-flow/node-toolbar'
import { useFormBuilder } from '../composables/useFormBuilder'

const props = defineProps<NodeProps>()
const { reorderQuestionChoice, removeQuestionChoice } = useFormBuilder();
const setOrder = ref(false);
const order = ref(props.data.position + 1);

//onMounted(() => {
//  console.log(props.data);
//});

watch(props.data, () => {
  order.value = props.data.position + 1;
});

function setNewOrder() {
  if (order.value != null) {
    reorderQuestionChoice(props.parent, props.id, order.value - 1);
  }
  order.value = null;
  setOrder.value = !setOrder.value;
}

function handleFocusOut() {
  if (order.value == props.data.position + 1) {
    setOrder.value = false;
  }
}

const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <div class="p-2 rounded-xl">
    <div class="flex gap-x-4 justify-start items-center">
      <span>#{{ data.position + 1 }}</span>
      <input type="text" class="form-input">
    </div>

    <NodeToolbar :position="Position.Right" class="flex flex-col gap-y-4 p-2">
      <div class="w-full">
        <button v-if="!setOrder" type="button" class="w-full" @click="setOrder = !setOrder">Reorder</button>
        <div v-if="setOrder" class="w-full flex gap-x-2 justify-between items-center">
          <input v-model="order" v-focus type="number" class="no-drag ease form-input" @focusout="handleFocusOut">
          <button type="button" class="w-full" @click="setNewOrder">Validate</button>
        </div>
      </div>
      <button type="button" class="w-full" @click="removeQuestionChoice(id)">Delete</button>
    </NodeToolbar>
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<style scoped>
.vue-flow__handle {
  height: 24px;
  width: 10px;
  background: #aaa;
  border-radius: 4px
}
</style>
