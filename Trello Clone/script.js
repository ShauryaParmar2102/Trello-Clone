// Save the current Kanban board to localStorage
function saveBoard() {
    const boardData = [];

    document.querySelectorAll(".kanban-column").forEach((column) => {
        boardData.push({
            id: column.dataset.id,
            cards: column.querySelector(".kanban-cards").innerHTML
        });
    });

    localStorage.setItem("kanbanBoard", JSON.stringify(boardData));
}

// Load the saved Kanban board from localStorage
function loadBoard() {

    // Get saved board data
    const savedBoard = localStorage.getItem("kanbanBoard");

    // Stop if there is no saved board
    if (!savedBoard) {
        return;
    }

    // Convert saved text back into JavaScript data
    const boardData = JSON.parse(savedBoard);

    // Loop through each saved column
    boardData.forEach((columnData) => {

        // Find the matching Kanban column
        const column = document.querySelector(
            `.kanban-column[data-id="${columnData.id}"] .kanban-cards`
        );

        // Put the saved cards back into the column
        column.innerHTML = columnData.cards;
    });
}
// Load saved cards when the page opens
loadBoard();

// Update empty messages when the page opens
document.querySelectorAll(".kanban-cards").forEach((column) => {
    updateEmptyMessage(column);
});

// Update the "No tasks yet" message
function updateEmptyMessage(column) {

    // Find the empty message in the column
    let message = column.querySelector(".empty-message");

    // Find all task cards in the column
    const cards = column.querySelectorAll(".kanban-card");

    // If there are no cards
    if (cards.length === 0) {

        // Create the message if it does not exist
        if (!message) {
            message = document.createElement("p");
            message.classList.add("empty-message");
            message.textContent = "No tasks yet";

            column.appendChild(message);
        }

        // Show the message
        message.style.display = "block";

    } else {

        // Hide the message if cards exist
        if (message) {
            message.style.display = "none";
        }
    }
}


// Select all Kanban cards and loop through each one
document.querySelectorAll(".kanban-card").forEach((card) => {

    // Run when the user starts dragging a card
    card.addEventListener("dragstart", (e) => {

        // Add the "dragging" class to the card being dragged
        e.currentTarget.classList.add("dragging");
    });

    // Run when the user stops dragging the card
    card.addEventListener("dragend", (e) => {

        // Remove the "dragging" class when dragging finishes
        e.currentTarget.classList.remove("dragging");
    });

});


// Select all Kanban card columns and loop through each one
document.querySelectorAll(".kanban-cards").forEach((column) => {
    // Run when a dragged card moves over the column
    column.addEventListener("dragover", (e) => {

            e.preventDefault(); // Allow cards to be dropped into the column

        // Add hover styling to the column
        e.currentTarget.classList.add("cards-hover");
    });

    // Run when the dragged card leaves the column
    column.addEventListener("dragleave", (e) => {
        e.currentTarget.classList.remove("cards-hover");
    });

    // Select all delete buttons and loop through each one
    document.querySelectorAll(".delete-card").forEach((button) => {

        //Run when a delete button is clicked
            button.addEventListener("click", (e) => {
                
                //Find the card that contains clicked delete buttuon
                const card = e.currentTarget.closest(".kanban-card");

                //Delete Card
                card.remove();

                // Save board after deleting
                saveBoard();

            });
    });

       // Run when the dragged card leaves the column
    column.addEventListener("drop", (e) => {

            // Remove the hover effect from the column
        e.currentTarget.classList.remove("cards-hover");

            // Find the card that is currently being dragged
        const dragCard = document.querySelector(".kanban-card.dragging");

            // Move the dragged card into the column it was dropped on
            if (dragCard) {

            // Remember the column the card came from
            const oldColumn = dragCard.parentElement;

            // Move the dragged card into the new column
            e.currentTarget.appendChild(dragCard);

            // Update empty messages for both columns
            updateEmptyMessage(oldColumn);
            updateEmptyMessage(e.currentTarget);

            // Save board after moving the card
            saveBoard();
        }

    });


});

// Run when the Add Task button is clicked
document.getElementById("addTaskBtn").addEventListener("click", () => {

        // Get the task title entered by the user and remove extra spaces
    const title = document.getElementById("taskTitle").value.trim();

        // Get the ID of the column selected by the user
    const columnId = document.getElementById("taskColumn").value;

    // Get the priority selected by the user
const priority = document.getElementById("taskPriority").value;

    if(!title) {
        alert("Title Required");
        return;
    }

    // Create a new div element for the Kanban card
    const card = document.createElement("div");

        // Add the kanban-card class to the new card
    card.classList.add("kanban-card");

        // Make the new card draggable
    card.setAttribute("draggable", "true");

        //New Card HTML
    card.innerHTML = `
                        <div class="badge ${priority}">
                        <span>${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority</span>
                    </div>

                        <p class="card-title">${title}</p>
                        <div class="card-infos">
                            <div class="card-icons">
                                <p><i class="fa-regular fa-comment"></i> 2</p>
                                <p><i class="fa-solid fa-paperclip"></i> 1</p>
                            </div>

                              <!-- Delete button for the new card -->
                                <button class="delete-card">
                                    <i class="fa-solid fa-trash"></i>
                                </button>


                        </div>
                `;

                // Find the delete button inside the newly created card
                const deleteButton = card.querySelector(".delete-card");

                // Run when the new card's delete button is clicked
                deleteButton.addEventListener("click", () => {

                    // Delete the new card
                    card.remove();

                    // Save board after deleting
                    saveBoard();
                });

        card.addEventListener("dragstart", (e) => {
            // Add the "dragging" class to the card being dragged
            e.currentTarget.classList.add("dragging");
        });

        // Run when the user stops dragging the card
        card.addEventListener("dragend", (e) => {

            // Remove the "dragging" class when dragging finishes
            e.currentTarget.classList.remove("dragging");
        });

        // Find the Kanban column selected by the user
        const targetColumn = document.querySelector(
    `.kanban-column[data-id="${columnId}"] .kanban-cards`);

        // Add the new card into the selected column
        targetColumn.appendChild(card);

        // Hide No tasks yet when a task is added
        updateEmptyMessage(targetColumn);

        // Save board after adding a card
        saveBoard();

        // Clear the task title input after adding the card
        document.getElementById("taskTitle").value = "";
})