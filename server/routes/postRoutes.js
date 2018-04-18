const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const util = require('util')

const writeFile = util.promisify(fs.writeFile)
const stat = util.promisify(fs.stat)

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.post('/vote/:typeVote', (req, res, next) => {
  console.log('parametre URL POST:' + req.params.typeVote)
  const user = Number(req.body.user)
  const filePath = path.join(__dirname, `../../mocks/post/${req.body.id}.json`)
  // il faut ajouter le user au tableau :typeVote
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).end('post not found')
    }
    const file = JSON.parse(data)
    if (file[`${req.params.typeVote}`].includes(user)) {
      console.log('user already present ' + user)
      res.header('Content-Type', 'application/json;charset=utf-8')
      res.end(JSON.stringify(file))
    } else {
      file[`${req.params.typeVote}`].push(user)
      const data = JSON.stringify(file, null, 2)

      fs.writeFile(filePath, data, (err) => {
        if (err) throw err
        console.log('OK MaJ jsonPost num :' + req.body.id)
        res.header('Content-Type', 'application/json;charset=utf-8')
        res.end(data)
      })
    }
  })
})

// nom fichier aleatoire avec test id unique
const testId = (id) =>
  stat(getPathFromId(id))
    .then(() => testId(getNewId()))
    .catch(err => {
      if (err.code === 'ENOENT') {
        return id
      }
      throw err
    })

const getNewId = () => Math.random().toString(36).slice(2).padEnd(11, '0').slice(0, 5)
const getPathFromId = id => path.join(__dirname, '../../mocks/post/', `${id}.json`)

router.post('/soumettre', (req, res, next) => {
  console.log('post/soumettre', req.body)
  //  write file executé si erreur ENOENT
  testId(getNewId())
    .then(id => {
      const filepath = getPathFromId(id)
      console.log('createJSON : ', filepath)
      const contentPost = {
        id: id,
        userId: req.body.userId,
        content: req.body.content,
        badVotes: [],
        yesVotes: [],
        saltyVotes: [],
        createdAt: Date.now()
      }
      // write (promisify)
      return writeFile(filepath, JSON.stringify(contentPost), 'utf-8')
    })
    .then(() => res.json('OK'))
    .catch(next)
})

module.exports = router
