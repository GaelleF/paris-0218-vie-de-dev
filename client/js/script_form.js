document.getElementById('add_post').addEventListener('submit', event => {
  event.preventDefault()

  const content = document.getElementById('new_post').value
  console.log(content)

  window.fetch('http://localhost:3000/post/soumettre', {
    method: 'post',
	body: new URLSearchParams({
	  userID: 8,
	  content: content
	})
  })
  .then(res => console.log(res.status))
})
