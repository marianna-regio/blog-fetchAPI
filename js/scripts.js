//variáveis globais
const url = "https://jsonplaceholder.typicode.com/posts";
const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector("#posts-container");

const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container");

const commentForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");

//get id from URL
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

//renderizar posts
function renderPost(post) {
  const div = document.createElement("div");
  const title = document.createElement("h2");
  const body = document.createElement("p");
  const link = document.createElement("a");

  title.innerText = post.title;
  body.innerText = post.body;
  link.innerText = "Ler Post";
  link.setAttribute("href", `/post.html?id=${post.id}`);

  div.append(title, body, link);
  postsContainer.append(div);
}

//GET nos posts, retornando um json da reposta
async function getAllPosts() {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);

  loadingElement.classList.add("hide");

  data.forEach(renderPost);
}

//GET individual posts
async function getPost(id) {
  const [responsePost, responseComments] = await Promise.all([
    fetch(`${url}/${id}`),
    fetch(`${url}/${id}/comments`),
  ]);

  const dataPost = await responsePost.json();
  const dataComments = await responseComments.json();

  loadingElement.classList.add("hide");
  postPage.classList.remove("hide");

  const title = document.createElement("h2");
  const body = document.createElement("p");

  title.innerText = dataPost.title;
  body.innerText = dataPost.body;

  postContainer.append(title, body);

  console.log(dataComments);
  dataComments.forEach(createComment);
}

function createComment(comment) {
  const div = document.createElement("div");
  const email = document.createElement("h3");
  const commentBody = document.createElement("p");

  email.innerText = comment.email;
  commentBody.innerText = comment.body;

  div.append(email, commentBody);
  commentsContainer.append(div);
}

//POST de um comentário
async function postComment(comment) {
  const response = await fetch(`${url}/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });

  const newComment = await response.json();
  createComment(newComment);
}

//chamar função de acordo com a pagina
if (!postId) {
  getAllPosts();
} else {
  getPost(postId);

  //Add event to comment-form
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let comment = {
      email: emailInput.value,
      body: bodyInput.value,
    };

    console.log(comment);
    postComment(comment);
  });
}
