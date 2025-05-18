import { db, initDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await initDb()
  
  // GET /api/todos
  if (event.method === 'GET') {
    return db.data!.todos
  }
  
  // POST /api/todos
  if (event.method === 'POST') {
    const body = await readBody(event)
    const newTodo = {
      id: Date.now(),
      text: body.text,
      completed: false,
      createdAt: new Date().toISOString()
    }
    
    db.data!.todos.push(newTodo)
    await db.write()
    
    return newTodo
  }
  
  throw createError({
    statusCode: 405,
    message: '不支持的请求方法'
  })
})