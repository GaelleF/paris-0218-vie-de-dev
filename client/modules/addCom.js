import { askComment } from '../modules/askComment.js'

export const addCom = (idPost) => {
  document.getElementById('add_com').addEventListener('submit', event => {
    event.preventDefault()
    const content = document.getElementById('new_com').value
    console.log(content)
    window.fetch('http://localhost:3000/addComments', {
      method: 'post',
      body: new URLSearchParams({
        userId: 4,
        postId: idPost,
        content: content
      })
    })
      .then(askComment(idPost))
  })
}