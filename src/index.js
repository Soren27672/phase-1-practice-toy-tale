let addToy = false;
let toyCollection = null;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  toyCollection = document.getElementById('toy-collection');
  const addForm = document.querySelector('form');


  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  addForm.addEventListener('submit', e => {
    e.preventDefault();
    let toyName = addForm.name.value;
    let toyPic = addForm.image.value;
    console.log(toyName,toyPic);
    fetch('http://localhost:3000/toys',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: toyName,
        image: toyPic,
        likes: 0  
      })
    })
    .then(res => res.json())
    .then(json => {
      createCard(json);
      toyFormContainer.style.display = "none";;
    });
  });

  loadToys();

});

function loadToys() {
  fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then(json => {
  for(toy in json) createCard(json[toy]);
  });
}

function createCard(toyObj) {
  const div = document.createElement('div');
      div.classList.add('card');

      const img = document.createElement('img');
      img.src = toyObj.image;
      img.classList.add('toy-avatar');
      div.append(img);

      const name = document.createElement('h2');
      name.textContent = toyObj.name;
      div.append(name);

      const likes = document.createElement('p');
      likes.textContent = 'Likes: ' + toyObj.likes;
      div.append(likes);

      console.log(toy);
      const likeButton = document.createElement('button');
      likeButton.textContent = "Like!";
      likeButton.classList.add(toyObj.id);
      likeButton.addEventListener('click', e => {
        console.log('click registered');

        fetch(`http://localhost:3000/toys/${e.target.classList[0]}`)
            .then(res => res.json())
            .then(json => {
              const serverSideLikes = json.likes;
              fetch(`http://localhost:3000/toys/${e.target.classList[0]}`,{
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                },
                body: JSON.stringify({likes: serverSideLikes + 1})
              })
              .then(res => {
                console.log('patch went thru');
                return res.json();
              })
              .then(json => likes.textContent = 'Likes: ' + json.likes);
            })
        }),
        
      div.appendChild(likeButton);

      toyCollection.append(div);
}