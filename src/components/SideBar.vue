<script setup>
  import { useDragAndDrop } from '../composables/useDnD'

const { onDragStart } = useDragAndDrop
</script>

<template>
  <aside class="bg-gray-200 flex flex-col items-center p-2">
    <div class="nodes">
      <div class="border-2 border-primary rounded-lg bg-white flex justify-center items-center p-2" :draggable="true"
        @dragstart="onDragStart($event, 'question')">
        Drag me to the pane to add a question
      </div>
    </div>
  </aside>
</template>
