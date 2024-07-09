const $addBtn = $('#save-btn')
const $todoOutput = $('.to-do')
const $inProgressOutput = $('.in-progress')
const $doneOutput = $('.done')

function generateRandom15DigitNumber() {
    const min = Math.pow(10, 14); // Minimum 15-digit number
    const max = Math.pow(10, 15) - 1; // Maximum 15-digit number

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomNumber;
}

console.log(generateRandom15DigitNumber());

function getTaskData() {
    const rawTaskData = localStorage.getItem('tasks');
    const tasks = JSON.parse(rawTaskData) || [];
    return tasks;
}

function outputTasks() {
    const tasks = getTaskData();
    tasks.forEach(function (taskObj) {
        const $taskEl = $(`
            <article data-id="${taskObj.id}" class= "bg-white task-card border border-light-subtle p-3">
              <h5>${taskObj.recipient} </h5>
              <p>Due date: ${taskObj.deadline}</p>
              <p>Message: ${taskObj.message}</p>
              <button class="btn bg-danger text-light article">Delete</button>
            </article>
            `);
        if (taskObj.done) {
            $doneOutput.append($taskEl);
            $taskEl.addClass('done');
        } else {
            $todoOutput.append($taskEl);
        }


    })
}





function addTask() {
    const $recipientInput = $('#recipient-input');
    const $messageInput = $('#message-input');
    const $dateInput = $('#deadline-input');

    const recipient = $recipientInput.val().trim();
    const message = $messageInput.val().trim();
    const deadline = $dateInput.val();

    if (!recipient || !message || !deadline) {
        alert("Please fill in all the fields!");
        return;
    }


    const id = generateRandom15DigitNumber();
    
    const task = {
        id: id,
        recipient: $recipientInput.val(),
        message: $messageInput.val(),
        deadline: $dateInput.val(),
        done: false
    }
    if (task.deadline && !task.done){
        const currentTime = dayjs() 
        console.log(currentTime)
    }
    const tasks = getTaskData();

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));

    $recipientInput.val('');
    $messageInput.val('');
    $dateInput.val('');

   
    // $('#taskModal').modal('hide');
    outputTasks();
}


function handleTaskDrop(eventObj, ui) {
    console.log(eventObj.currentTarget, ui)
    const box = $(eventObj.target)
    const article = $(ui.draggable[0])
    const taskId = article.data('id')
    console.log(article)

    const tasks = getTaskData();

    const task = tasks.find(function (taskObj) {
        if (taskObj.id === taskId) return true;
    });
    if (box.hasClass('done')) {
        task.done = true;

    } 
    // else if(box.hasClass('in-progress')) {
    //     task.done = false;
    // } 
    // else{
    //     console.log('Handle task drop if checks failed')
    // }




    localStorage.setItem('tasks', JSON.stringify(tasks))
    box.append(article);

}


function init() {
    $("#deadline-input").datepicker({
        minDate: 0
    });
    outputTasks();



    $('.lane').droppable({
        accept: 'article',
        drop: handleTaskDrop,
    });


    $('article').draggable({
        opacity: 0.75,
        zIndex: 500,
        helper: function (eventObj) {
            const el = $(eventObj.target)
            let clone;

            if (el.is('article')) {
                clone = el.clone();
            } else {
                clone = el.closest('article').clone();
            }
            clone.css('width', el.outerWidth())

            return clone;

        }

    });
    $addBtn.on('click', addTask);
}


init(); 
