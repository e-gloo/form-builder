<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Node, Edge } from '@vue-flow/core'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import SaveRestoreControls from './Controls.vue'
import { useFormBuilder } from '../composables/useFormBuilder'
import { useDragAndDrop } from '../composables/useDnD'

const { addQuestion } = useFormBuilder
const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop

import QuestionNode from './QuestionNode.vue'
import ChoiceNode from './ChoiceNode.vue'

const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([]);

onMounted(() => {
  addQuestion(300, 300, true)
})

</script>

<template>
  <div class="w-full" @drop="onDrop">
    <VueFlow id='vue-flow-project' v-model:nodes="nodes" :connection-radius="30" :edges="edges" @dragover="onDragOver" @dragleave="onDragLeave">
      <!-- bind your custom node type to a component by using slots, slot names are always `node-<type>` -->
      <template #node-question="questionNodeProps">
        <QuestionNode v-bind="questionNodeProps" />
      </template>
      <template #node-choice="choiceNodeProps">
        <ChoiceNode v-bind="choiceNodeProps" />
      </template>
      <SaveRestoreControls />
      <Background variant="lines" />
    </VueFlow>
  </div>
</template>

<style>
.handle-source {
  width: 15px;
  height: 30px;
  border-radius: 0px;
  border-width: 2px;
  border-color: oklch(35.519% 0.032 262.988);
  background-color: oklch(76.662% 0.135 153.45);
}

.handle-target {
  width: 15px;
  height: 30px;
  border-radius: 0px;
  border-width: 2px;
  border-color: oklch(35.519% 0.032 262.988);
  background-color: oklch(61.302% 0.202 261.294);
}

.vue-flow__panel {
    background-color:#2d3748;
    padding:10px;
    border-radius:8px;
    box-shadow:0 0 10px #00000080
}

.vue-flow__panel .buttons {
    display:flex;
    gap:8px
}

.vue-flow__panel button {
    border:none;
    cursor:pointer;
    background-color:#4a5568;
    border-radius:8px;
    color:#fff;
    box-shadow:0 0 10px #0000004d;
    width:40px;
    height:40px;
    font-size:16px;
    display:flex;
    align-items:center;
    justify-content:center
}

.vue-flow__panel button:hover {
    background-color:#2563eb;
    transition:background-color .2s
}

.vue-flow__panel button svg {
    width:100%;
    height:100%
}
</style>
