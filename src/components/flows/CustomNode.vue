<script setup>
import { Handle, Position } from '@vue-flow/core'
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },

  data: {
    type: Object,
    required: true,
  },
})

const isBeginNode = computed(() => props.data.begin)
const isEndNode = computed(() => props.data.end)
const nodeNames = computed(() => props.data.name)

const barColor = computed(() => {
  switch (props.data.status) {
    case 'success':
      return 'green'
    case 'error':
      return 'red'
    case 'pending':
      return 'gray'
    case 'canceled':
      return 'orange'
    default:
      return 'transparent'
  }
})

</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="node-bar" :style="{ backgroundColor: barColor }"></div>
  <Handle v-if="!isBeginNode" type="target" :position="Position.Left" />
  <Handle v-if="!isEndNode" type="source" :position="Position.Right" />
  <div class="node-content">{{ nodeNames }}
  </div>
</template>