import { db, initDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await initDb()
  
  const id = Number(event.context.params?.id)
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '无效的 todo ID'
    })
  }
  
  // PUT /api/todos/:id
  if (event.method === 'PUT') {
    const body = await readBody(event)
    const index = db.data!.todos.findIndex(todo => todo.id === id)
    if (index === -1) {
      throw createError({
        statusCode: 404,
        message: '找不到对应的 todo'
      })
    }
    
    const updatedTodo = {
      ...db.data!.todos[index],
      ...body
    }
    
    db.data!.todos[index] = updatedTodo
    await db.write()
    
    return updatedTodo
  }
  
  // DELETE /api/todos/:id
  if (event.method === 'DELETE') {
    const index = db.data!.todos.findIndex(todo => todo.id === id)
    if (index === -1) {
      throw createError({
        statusCode: 404,
        message: '找不到对应的 todo'
      })
    }
    
    db.data!.todos.splice(index, 1)
    await db.write()
    
    return { success: true }
  }
  
  throw createError({
    statusCode: 405,
    message: '不支持的请求方法'
  })
})