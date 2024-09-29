<template>
  <div class="container">
    <div class="content">
      <div v-if="selectedNode">
        <h3>Selected Node Information</h3>
        <p><strong>ID:</strong> {{ selectedNode.id }}</p>
        <p><strong>Name:</strong> {{ selectedNode.data.name }}</p>
        <p><strong>Status:</strong> {{ selectedNode.data.status }}</p>
        <p><strong>Begin:</strong> {{ selectedNode.data.begin }}</p>
        <p><strong>End:</strong> {{ selectedNode.data.end }}</p>
      </div>
      <div v-else>
        <p>No node selected</p>
      </div>
    </div>
    <div class="task-chart">
      <TaskChart @node-selected="updateSelectedNode"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TaskChart from '@/components/flows/TaskChart.vue'

const selectedNode = ref(null)

function updateSelectedNode(node) {
  selectedNode.value = node
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full height of the viewport */
}

.content {
  flex: 3; /* Takes up 1/3 of the space */
  border-bottom: 1px solid #000000; /* Add a border at the bottom */
  background-color: #ffffff;
  padding: 20px;
}

.task-chart {
  flex: 1; /* Takes up 2/3 of the space */
  /* Additional styling for TaskChart if needed */
}
</style>