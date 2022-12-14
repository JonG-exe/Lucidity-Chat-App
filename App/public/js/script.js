const test = document.querySelector(".test")
const testMessage = document.querySelector(".testMessage")

// https://server-lucidity-chat-app.vercel.app

fetch("/loadmessages")
    .then(data => data.json())
    .then(data => data.forEach(messageObj => {
        console.log(messageObj.message)
    
        appendMessage(messageObj.message)
        test.scrollTo(0, test.scrollHeight);
    }))

/*--------------------------------------------------*/

// Listen for incoming messages from the DB

let prevMessage = undefined

setInterval(() => {

    fetch("/newmessage")
    .then(data => data.json())
    .then(data => {

        if(data.message != prevMessage){
            appendMessage(data.message)
            test.scrollTo(0, test.scrollHeight);
        }

        prevMessage = data.message

    })
    .catch(e => {})

}, 500)


/*--------------------------------------------------*/

// Prevent page refresh on form submission

const form = document.querySelector(".form")

form.addEventListener("submit", (event) => {

    event.preventDefault()

    fetch("/add", {
        method: "POST",

        body: JSON.stringify({
            message: event.target.message.value
        }),

        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .catch(e => {console.log("Errors in script: ", e)})

    event.target.message.value = ""

})

/*--------------------------------------------------*/

// Function appends messages to document

function appendMessage(message) {
    const newDiv = document.createElement("div")
    
    newDiv.classList.add("testMessage")
    newDiv.textContent = message
    test.appendChild(newDiv)
}