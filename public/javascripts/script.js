const cardHoverDivs = document.querySelectorAll(".card-hover");
const displayImageTag = document.querySelector(".display-img");
const displayImageDiv = document.querySelector(".hover-display-image");

function HoverCardAnim() {
  const imagesOnHoverCard = [
    "https://images.unsplash.com/photo-1623093386041-a0915e5a1ca4?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1579567761406-4684ee0c75b6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1678845533836-ce39b50fde49?q=80&w=663&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1668523100231-fc5091c412d5?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  cardHoverDivs.forEach((hoverDiv, index) => {
    hoverDiv.addEventListener("mouseenter", (e) => {
      displayImageDiv.classList.remove("hidden");
      displayImageTag.src = imagesOnHoverCard[index];
      gsap.to(displayImageTag, {
        opacity: 1,
        size: 0,
        duration: 5,
      });
    });
  });
  cardHoverDivs.forEach((hoverDiv, index) => {
    hoverDiv.addEventListener("mouseleave", (e) => {
      displayImageDiv.classList.add("hidden");
      displayImageTag.src = "";
      gsap.to(displayImageTag, {
        opacity: 0,
        size: 0,
        duration: 5,
      });
    });
  });
}
HoverCardAnim();

const driveFolders = document.querySelector(".drive-folders");
const addFolderButton = document.querySelector(".add-folder");

let activeFolderForm = null;
let folderCounter = 0;

function createNewFolderForm() {
  addFolderButton.addEventListener("click", () => {
    if (activeFolderForm) return; // prevent multiple forms

    folderCounter++;
    const formId = `createFolderForm-${folderCounter}`;
    const wrapperId = `folderFormWrapper-${folderCounter}`;

    // Form HTML matches existing folder layout
    const folderFormHTML = `
      <div class="folder w-20 h-20 flex flex-col items-center gap-2" id="${wrapperId}">
          <a href="#" class="w-20 h-20 flex flex-col">
              <img src="/images/folders-yellow.svg" alt="">
          </a>
          <form class="createFolderForm w-full" id="${formId}" action="/drive/createfolder" method="post">
              <input type="text" name="name" placeholder="NewFolder" class="text-[.6vw] w-full text-center bg-zinc-800 border border-zinc-600 rounded-sm" required>
          </form>
      </div>
    `;

    driveFolders.insertAdjacentHTML("beforeend", folderFormHTML);

    const newForm = document.getElementById(formId);
    const input = newForm.querySelector('input[name="name"]');
    activeFolderForm = newForm;
    input.focus();

    let submitted = false;

    const submitForm = async () => {
      if (submitted) return;
      submitted = true;

      // Always read current value directly
      const folderName = input.value.trim() || "NewFolder";

      try {
        const res = await fetch("/drive/createfolder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: folderName }),
        });
        if (res.ok) {
          const data = await res.json();
          document.getElementById(wrapperId).remove();
          activeFolderForm = null;

          const folderHTML = `
        <div class="folder w-20 h-20 flex flex-col items-center gap-2">
          <a href="/folder/${data._id}" class="w-20 h-20 flex flex-col">
            <img src="/images/folders-yellow.svg" alt="">
          </a>
          <a href="/folder/${data._id}" class="text-[.6vw] text-center">${data.name}</a>
        </div>
      `;
          driveFolders.insertAdjacentHTML("beforeend", folderHTML);
        } else {
          alert("Error creating folder");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    };

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitForm();
      } else if (e.key === "Escape") {
        document.getElementById(wrapperId).remove();
        activeFolderForm = null;
      }
    });

    input.addEventListener("blur", () => {
      setTimeout(() => {
        if (!submitted) {
          // Only submit if value is not empty or user typed something
          submitForm();
        }
      }, 100); // slightly longer timeout ensures input.value is registered
    });

    newForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitForm();
    });
  });
}

createNewFolderForm();
