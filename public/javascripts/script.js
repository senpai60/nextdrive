const cardHoverDivs = document.querySelectorAll(".card-hover")
const displayImageTag = document.querySelector(".display-img") 
const displayImageDiv = document.querySelector(".hover-display-image") 
const imagesOnHoverCard =[
    "https://images.unsplash.com/photo-1623093386041-a0915e5a1ca4?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1579567761406-4684ee0c75b6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1678845533836-ce39b50fde49?q=80&w=663&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1668523100231-fc5091c412d5?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
]


cardHoverDivs.forEach((hoverDiv,index) => {
    hoverDiv.addEventListener('mouseenter',(e)=>{
        displayImageDiv.classList.remove("hidden")
        displayImageTag.src=imagesOnHoverCard[index]
        gsap.to(displayImageTag,({
            opacity:1,
            size:0,
            duration: 5
        }))
    })
});
cardHoverDivs.forEach((hoverDiv,index) => {
    hoverDiv.addEventListener('mouseleave',(e)=>{
        displayImageDiv.classList.add("hidden")
        displayImageTag.src=""
        gsap.to(displayImageTag,({
            opacity:0,
            size:0,
            duration:5,
        }))
    })
});