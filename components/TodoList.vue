<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Todo List</h1>
    
    <!-- 搜索框 -->
    <div class="mb-4">
      <input 
        v-model="searchQuery" 
        placeholder="搜索任务..."
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      >
    </div>

    <!-- 添加任务 -->
    <div class="flex gap-2 mb-6">
      <input 
        v-model="newTodo" 
        @keyup.enter="handleAddTodo"
        placeholder="添加新的任务..."
        class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      >
      <button 
        @click="handleAddTodo" 
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        添加
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="text-center py-8">
      <span class="text-gray-500">加载中...</span>
    </div>

    <!-- Todo列表 -->
    <ul v-else class="space-y-2">
      <li 
        v-for="todo in filteredTodos" 
        :key="todo.id" 
        class="flex items-center gap-2 p-4 bg-white rounded-lg shadow"
      >
        <input 
          type="checkbox" 
          :checked="todo.completed"
          @change="toggleTodo(todo.id)"
          class="w-5 h-5 text-green-500 rounded focus:ring-green-500"
        >
        
        <!-- 显示/编辑模式切换 -->
        <template v-if="editingId === todo.id">
          <input 
            v-model="editingText"
            @keyup.enter="handleSaveEdit(todo.id)"
            @keyup.esc="cancelEdit"
            class="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            ref="editInput"
          >
          <button 
            @click="handleSaveEdit(todo.id)" 
            class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            保存
          </button>
          <button 
            @click="cancelEdit" 
            class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors ml-2"
          >
            取消
          </button>
        </template>
        
        <template v-else>
          <span 
            :class="['flex-1', todo.completed ? 'line-through text-gray-400' : 'text-gray-700']"
            @dblclick="startEdit(todo.id, todo.text)"
          >
            {{ todo.text }}
          </span>
          <button 
            @click="startEdit(todo.id, todo.text)" 
            class="px-3 py-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
          >
            编辑
          </button>
          <button 
            @click="removeTodo(todo.id)" 
            class="px-3 py-1 text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            删除
          </button>
        </template>
      </li>
    </ul>

    <!-- 空状态 -->
    <div 
      v-if="!isLoading && filteredTodos.length === 0" 
      class="text-center py-8 text-gray-500"
    >
      {{ searchQuery ? '没有找到匹配的任务' : '还没有添加任何任务' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodos } from '~/composables/useTodos'

const { todos, isLoading, addTodo, updateTodo, removeTodo, toggleTodo } = useTodos()

const newTodo = ref('')
const searchQuery = ref('')
const editingId = ref<number | null>(null)
const editingText = ref('')
const editInput = ref<HTMLInputElement | null>(null)

// 搜索功能
const filteredTodos = computed(() => {
  if (!searchQuery.value) return todos.value
  const query = searchQuery.value.toLowerCase()
  return todos.value.filter(todo => 
    todo.text.toLowerCase().includes(query)
  )
})

// 添加任务
const handleAddTodo = () => {
  if (newTodo.value.trim()) {
    addTodo(newTodo.value)
    newTodo.value = ''
  }
}

// 编辑功能
const startEdit = (id: number, text: string) => {
  editingId.value = id
  editingText.value = text
  // 在下一个 tick 后聚焦输入框
  setTimeout(() => {
    editInput.value?.focus()
  })
}

const handleSaveEdit = (id: number) => {
  if (editingText.value.trim()) {
    updateTodo(id, { text: editingText.value })
    editingId.value = null
  }
}

const cancelEdit = () => {
  editingId.value = null
}
</script>

<style scoped>
.todo-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
}

.add-todo {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.todo-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-button {
  padding: 0.5rem 1rem;
  background-color: #00dc82;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button:hover {
  background-color: #00b368;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.todo-checkbox {
  width: 1.2rem;
  height: 1.2rem;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

.delete-button {
  margin-left: auto;
  padding: 0.25rem 0.5rem;
  background-color: #ff4757;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #ff6b81;
}
</style> 