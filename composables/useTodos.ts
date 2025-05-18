import { ref, onMounted } from 'vue'

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: string
}

export const useTodos = () => {
  const todos = ref<Todo[]>([])
  const isLoading = ref(true)

  // 从API加载数据
  const loadTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      const data = await response.json()
      todos.value = data
    } catch (error) {
      console.error('Error loading todos:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 添加新的 todo
  const addTodo = async (text: string) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      })
      const newTodo = await response.json()
      todos.value.push(newTodo)
      return newTodo
    } catch (error) {
      console.error('Error adding todo:', error)
      return null
    }
  }

  // 更新 todo
  const updateTodo = async (id: number, updates: Partial<Todo>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })
      const updatedTodo = await response.json()
      const index = todos.value.findIndex(todo => todo.id === id)
      if (index !== -1) {
        todos.value[index] = updatedTodo
      }
      return updatedTodo
    } catch (error) {
      console.error('Error updating todo:', error)
      return null
    }
  }

  // 删除 todo
  const removeTodo = async (id: number) => {
    try {
      await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      })
      todos.value = todos.value.filter(todo => todo.id !== id)
    } catch (error) {
      console.error('Error removing todo:', error)
    }
  }

  // 切换完成状态
  const toggleTodo = async (id: number) => {
    const todo = todos.value.find(todo => todo.id === id)
    if (todo) {
      await updateTodo(id, { completed: !todo.completed })
    }
  }

  // 在组件挂载时加载数据
  onMounted(() => {
    loadTodos()
  })

  return {
    todos,
    isLoading,
    addTodo,
    updateTodo,
    removeTodo,
    toggleTodo
  }
}