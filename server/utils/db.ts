import { JSONFile } from 'lowdb/node'
import { Low } from 'lowdb'
import { join } from 'path'

export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: string
}

export interface DB {
  todos: Todo[]
}

// 获取项目根目录的 db.json 路径
const dbFile = join(process.cwd(), 'db.json')

// 创建数据库实例
const adapter = new JSONFile<DB>(dbFile)
const db = new Low<DB>(adapter)

// 初始化数据库
export const initDb = async () => {
  await db.read()
  if (!db.data) {
    db.data = { todos: [] }
    await db.write()
  }
  return db
}

// 导出单例数据库实例
export { db } 