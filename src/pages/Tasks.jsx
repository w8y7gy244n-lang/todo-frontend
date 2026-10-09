import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTasks, createTask, deleteTask } from '../services/api'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await getTasks()
      setTasks(res.data)
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!description.trim()) return
    try {
      await createTask({ descripcion: description })
      setDescription('')
      fetchTasks()
    } catch (err) {
      setError('Error al crear la tarea')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTask(id)
      setTasks(tasks.filter((t) => t.id !== id))
    } catch (err) {
      setError('Error al eliminar la tarea')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Mis Tareas</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          Cerrar sesión
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleCreate} className="flex gap-3 mb-8">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
            placeholder="Nueva tarea..."
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Agregar
          </button>
        </form>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-400 text-sm">Cargando tareas...</p>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No tienes tareas todavía</p>
            <p className="text-gray-300 text-xs mt-1">Agrega una tarea arriba para comenzar</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-white border border-gray-100 rounded-lg px-4 py-3 flex justify-between items-center"
              >
                <span className="text-sm text-gray-700">{task.descripcion}</span>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}