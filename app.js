const express = require('express')
const server = express()

let REQUESTS_COUNT = 0
let PROJECTS = []

server.use(express.json())

server.use((req, res, next) => {
  REQUESTS_COUNT++
  console.log(REQUESTS_COUNT + ' requests at the moment')
  next()
})

function checkIdExists(req, res, next) {
  const { id } = req.params

  const countProjects = PROJECTS.filter(project => project.id == id)

  countProjects.length > 0 ? next() : res.status(400).json({ error: "Project don't exists"})
}

server.post('/projects', (req, res) => {
  const { id, title } = req.body

  PROJECTS.push({ id, title, tasks: [] })

  return res.json(PROJECTS)
})

server.get('/projects', (req, res) => {
  return res.json(PROJECTS)
})

server.put('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params
  const { title } = req.body

  PROJECTS = PROJECTS.map(project => project.id == id ? { ...project, title } : project)

  return res.json(PROJECTS)
})

server.delete('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params

  PROJECTS = PROJECTS.filter(project => project.id != id)

  return res.json(PROJECTS)
})

server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { id } = req.params
  const { title } = req.body
  
  /* Validation example to be implemented in other routes */
  if (!title) {
    return res.status(400).json({ error: 'Title is required' })
  }

  PROJECTS = PROJECTS.map(project => project.id == id ? { ...project, tasks: [...project.tasks, title] } : project)

  return res.json(PROJECTS)
})


server.listen(3333, () => console.log('Server started at port 3333'))