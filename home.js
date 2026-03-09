let allCardIssues = [];

//  1. Fetch all issues
const issue = () => {
  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then(res => res.json())
    .then(data => {
      allCardIssues = data.data;
      displayIssues(allCardIssues);
      count(allCardIssues); // shob cards er initial count
    });
}

//  2. Display cards
const displayIssues = (issues) => {
  const container = document.getElementById("issue-container");
  container.innerHTML = "";

  issues.forEach(githubIssue => {
    const createGitCard = document.createElement("div");
    
    // let Show the card Top border based on their category(open, closed):

    let borderColor = "";

    if(githubIssue.status === "open"){
      borderColor = "border-t-4 border-green-500"
    }
    else if(githubIssue.status === "closed"){
      borderColor = "border-t-4 border-purple-500"
    }

    else{
      borderColor = "border-t-4 border-gray-500"
    }
    
    createGitCard.innerHTML = `
      <div class="bg-white w-full rounded-xl shadow p-5 ${borderColor} space-y-4 cursor-pointer">
        <div class="flex justify-between items-center">
          <img src="./assets/Aperture.png">
          <span class="bg-red-100 text-red-500 px-3 py-1 rounded-full text-sm">
            ${githubIssue.priority || "HIGH"}
          </span>
        </div>

        <h2 class="text-xl font-bold">${githubIssue.title}</h2>
        <p class="text-gray-500 h-16">${githubIssue.description}</p>

        <div class="rounded-2xl flex justify-between">
          <h2 class="btn btn-soft rounded-lg btn-error text-red-500">${githubIssue.labels?.[0] || "Bug"}</h2>
          <h2 class="btn btn-outline btn-soft rounded-lg btn-warning">${githubIssue.labels?.[1] || "Help wanted"}</h2>
        </div>

        <div class="border-t pt-3 text-gray-400 flex flex-col gap-2">
          <span>#${githubIssue.id}</span>
          <span>${githubIssue.created_by || "john_doe"}</span>
        </div>
      </div>
    `;

    // 🔹 Card click → modal + count update
    createGitCard.addEventListener("click", () => {
      const status = githubIssue.status || "unknown";
      const relatedCards = allCardIssues.filter(card => (card.status || "unknown") === status);
      count(relatedCards); // update count
      showModal(githubIssue.id); // modal open
    });

    container.appendChild(createGitCard);
  });
}

//  3. Filter cards
const filterIssues = (filterCard) => {

  const allBtn=document.getElementById("allTab");
const openBtn=document.getElementById("openTab");
const closeBtn=document.getElementById("closeTab");

allBtn.classList.remove("btn-primary");
openBtn.classList.remove("btn-primary");
closeBtn.classList.remove("btn-primary");

if(filterCard === 'all'){
  allBtn.classList.add("btn-primary")
}
else if(filterCard === "open"){
  openBtn.classList.add("btn-primary")
}
else if(filterCard=== "closed"){
  closeBtn.classList.add("btn-primary")
}
  let cardList = [];

  if(filterCard === "all") {
    cardList = allCardIssues;
  } else {
    cardList = allCardIssues.filter(card => (card.status || "unknown") === filterCard);
  }

  displayIssues(cardList);
  count(cardList); // update count
}

//  4. Search button
document.getElementById("search-btn").addEventListener("click", function() {
  const inputValue = document.getElementById("input").value.toLowerCase().trim();

  if(inputValue === ""){
    alert("Enter some keywords for card details");
    return;
  }

  const searchCards = allCardIssues.filter(data =>
    data.title.toLowerCase().includes(inputValue) ||
    data.description?.toLowerCase().includes(inputValue)
  );

  displayIssues(searchCards);
  count(searchCards); // update count
});

//  5. Count function
const count = (issues) => {
  document.getElementById("all-count").innerText = issues.length;
}

// 6. Fetch single issue & show modal
const showModal = (id) => {
  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    .then(res => res.json())
    .then(data => openModal(data.data));
}

//  7. Create & show modal
const openModal = (issue) => {
  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = "";

  const modalElement = document.createElement("dialog");
  modalElement.className = "modal modal-bottom sm:modal-middle";

  modalElement.innerHTML = `
    <div class="modal-box">
      <h3 class="text-lg font-bold">${issue.title}</h3>
      <div class="flex py-4 gap-6">
        <p class="border bg-green-500 text-white py-2 px-2 rounded-2xl">${issue.status || "unknown"}</p>
        <p class="font-bold text-gray-500">${issue.author}</p>
        <p class="font-bold text-gray-500">${issue.createdAt}</p>
      </div>
      <div class="mx-auto flex gap-4">
        <p class="btn btn-soft rounded-2xl btn-error text-red-500">${issue.labels?.[0] || ""}</p>
        <p class="btn btn-outline btn-soft rounded-2xl btn-warning">${issue.labels?.[1] || ""}</p>
      </div>
      <p class="text-gray-600 font-bold py-3">${issue.description}</p>
      <div class="flex justify-between items-center">
        <div>
          <p class="text-gray-500 font-bold">Assign</p>
          <p class="font-bold text-black">${issue.assignee || ""}</p>
        </div>
        <div>
          <p class="text-gray-500 font-bold">Priority</p>
          <p class="btn-soft btn rounded-2xl btn-error text-red-500">${issue.priority || "High"}</p>
        </div>
      </div>
      <div class="mt-4 text-right">
        <button class="btn btn-primary">Close</button>
      </div>
    </div>
  `;

  modalContainer.appendChild(modalElement);
  modalElement.showModal();

  // Close button
  modalElement.querySelector("button").addEventListener("click", () => modalElement.close());
}

//  8. Call initial function
issue();


// all button color

