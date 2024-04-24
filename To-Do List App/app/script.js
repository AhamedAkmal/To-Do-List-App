const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');

function addTask() {
    if (inputBox.value === '') {
        alert("You Must Write Something!");
    } else {
        fetch('http://127.0.0.1:8000/api/tasks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: inputBox.value }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            return response.json();
        })
        .then(data => {
            // Clear existing tasks
            listContainer.innerHTML = '';
            // Re-render all tasks
            showtask();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add task');
        });
    }
    inputBox.value = '';
}

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        const taskId = e.target.getAttribute('data-task-id');
        fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: !e.target.classList.contains('checked') }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            return response.json();
        })
        .then(data => {
            e.target.classList.toggle("checked");
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to update task');
        });
    } else if (e.target.tagName === "SPAN") {
        const taskId = e.target.parentElement.getAttribute('data-task-id');
        fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete task');
        });
        // Remove the task from the UI even if there's an error in the request
        e.target.parentElement.remove();
    }
}, false);

function showtask() {
    fetch('http://127.0.0.1:8000/api/tasks/')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.length > 0) {
            data.forEach(task => {
                const li = document.createElement("li");
                li.innerHTML = task.title;
                li.setAttribute('data-task-id', task.id);
                if (task.completed) {
                    li.classList.add('checked');
                }
                listContainer.appendChild(li);
                const span = document.createElement("span");
                span.innerHTML = "\u00d7";
                li.appendChild(span);
            });
        } else {
            console.log('No tasks found'); // Log a message if no tasks are returned
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to fetch tasks');
    });
}

showtask();
