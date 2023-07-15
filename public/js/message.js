'use strict' 
const message_id = document.getElementById("message_id").value;
 
function reply() {
    const replyButton = document.getElementById("reply");
    replyButton.addEventListener("click", function () {
        const actionURL = "/message/reply/" + message_id
        fetch(actionURL)
    })
}

function markRead() {
    const markReadButton = document.getElementById("mark_read");
    markReadButton.addEventListener("click", function () {
        const actionURL = "/message/markread/"
        fetch(actionURL,{
                method: "post",
                body: message_id
            }
        )
        .then(function(response) {
            if (response.ok) {
                return;
            } else {
                throw new Error("Network Response was not OK")
            }
        })
    })
}


function archive() {
    const archiveMessageButton = document.getElementById("archive_message");
    archiveMessageButton.addEventListener("click", function () {
        const actionURL = "/message/archive/"
        fetch(actionURL,{
                method: "post",
                body: message_id
            }
        )
        .then(function(response) {
            if (response.ok) {
                return;
            } else {
                throw new Error("Network Response was not OK")
            }
        })
    })
}


function remove() {
    const deleteButton = document.getElementById("remove_message");
    deleteButton.addEventListener("click", function () {
        const actionURL = "/message/delete/"
        fetch(actionURL,{
                method: "post",
                body: message_id
            }
        )
        .then(function(response) {
            if (response.ok) {
                // intentionally left blank
            } else {
                throw new Error("Network Response was not OK")
            }
        })
    })
}

function main() {
    reply(),
    markRead(),
    archive(),
    remove()
}

main()