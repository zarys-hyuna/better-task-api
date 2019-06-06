

var buttons = document.querySelectorAll('buttons')
var title = ""
var description = ""
function submitt(){
    window.scrollTo(0, 0)
    var _id = event.target.parentNode.childNodes[1].textContent
    var title = event.target.parentNode.childNodes[4].textContent
    var description = event.target.parentNode.childNodes[7].textContent
    var status = event.target.parentNode.childNodes[10].textContent
    document.querySelector('#edit').style.display = ""
    
    document.querySelector('._id').value = _id
    document.querySelector('.title').value = title
    document.querySelector('.description').value = description
    document.querySelector('.status').value = status
    document.querySelector('form').style.display = "none"
}


function deleteTask(){
    
    document.querySelector('#delete').style.display = ""
    document.querySelector('#cancel').style.display = ""
    document.querySelector('#descriptionDel').style.display = ""
    document.querySelector('#titleDel').style.display = ""

    window.scrollTo(0, 0)
    var _id = event.target.parentNode.childNodes[1].textContent
    var title = event.target.parentNode.childNodes[4].textContent
    var description = event.target.parentNode.childNodes[7].textContent

    document.querySelector('.deleteID').value = _id
    document.querySelector('#titleDel').value = title
    document.querySelector('#descriptionDel').value = description
    document.querySelector('form').style.display = "none"
}


function cancelDelete(){
    document.querySelector('#delete').style.display = "none"
    document.querySelector('#edit').style.display = "none"
    document.querySelector('#cancel').style.display = "none"
    document.querySelector('#descriptionDel').style.display = "none"
    document.querySelector('#titleDel').style.display = "none"
    document.querySelector('form').style.display = ""
}

function toggleTask(){
    var _id = event.target.parentNode.childNodes[1].textContent
    var title = event.target.parentNode.childNodes[4].textContent
    var description = event.target.parentNode.childNodes[7].textContent
    var status = event.target.parentNode.childNodes[10].textContent
    
    document.querySelector('._id').value = _id
    document.querySelector('.title').value = title
    document.querySelector('.description').value = description
    if(status.includes("To-Do")){
    document.querySelector('.status').value = "Completed"
    }
    if(status.includes("Completed")){
    document.querySelector('.status').value = "To-Do"
    }
    document.querySelector('#edit').submit()
}

