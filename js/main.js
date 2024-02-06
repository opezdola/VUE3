Vue.component('kanban-desktop', {
    template: `
    <div>
      <header>
          <h1 class="title">Kanban-Board</h1>
          <div class="input-container">
            <input class="input" type="text" v-model="currentNote" placeholder="Название" @keyup.enter="addNote">
            <textarea class="input" v-model="currentDescription" placeholder="Описание"></textarea>
            <input class="input" type="date" v-model="currentDeadline">
            <button class="create-button" @click="addNote">Создать</button>
          </div>
      </header>
      <main>
          <div class="columns-container">
            <planned-tasks  :notes="notes" :move-to-completed="moveToCompleted" :move-to-in-progress="moveToInProgress" :delete-note="deleteNote" :edit-note="editNote" class="planned-column"></planned-tasks>
            <in-progress-tasks :notes="notes" :move-to-completed="moveToCompleted" :move-to-in-progress="moveToInProgress" :delete-note="deleteNote" :edit-note="editNote" class="in-progress-column"></in-progress-tasks>
            <testing-tasks :notes="notes" :move-to-completed="moveToCompleted" :move-to-in-progress="moveToInProgress" :delete-note="deleteNote" :edit-note="editNote" class="testing-column"></testing-tasks>
            <completed-tasks :notes="notes" :move-to-completed="moveToCompleted" :move-to-in-progress="moveToInProgress" :delete-note="deleteNote" :edit-note="editNote" class="completed-column"></completed-tasks>
          </div>
      </main>
    </div>
  `,
    data() {
        return {
            currentNote: "",
            currentDescription: "",
            currentDeadline: "",
            notes: []
        };
    },
    methods: {
        moveToCompleted(index) {
            const currentDate = new Date();
            const deadlineDate = new Date(this.notes[index].deadline);

            this.notes[index].isOverdue = currentDate > deadlineDate;

            this.notes[index].isTested = false;
            this.notes[index].isDone = true;
        },
        moveToInProgress(index) {
            const reason = prompt("Введите причину возврата задачи:");
            if (reason !== null) {
                this.notes[index].returnReason = reason;
                this.notes[index].isProcess = true;
                this.notes[index].isTested = false;
            }
        },
        addNote() {
            this.notes.push({
                text: this.currentNote,
                description: this.currentDescription,
                created_at: new Date(),
                lastEditedAt: null,
                deadline: this.currentDeadline,
                isPlanned: true,
                isProcess: false,
                isTested: false,
                isDone: false,
                isEdit: false
            });
            this.currentNote = "";
            this.currentDescription = "";
            this.currentDeadline = "";
        },
        editNote(index) {
            this.notes[index].lastEditedAt = new Date();
            this.notes[index].isEdit = false;
        },
        deleteNote(noteText) {
            this.notes = this.notes.filter(note => note.text !== noteText);
        }
    },
    created() {
        const savedNotes = localStorage.getItem('kanbanNotes');
        if (savedNotes) {
            this.notes = JSON.parse(savedNotes);
        }
    },
    watch: {
        notes: {
            handler: function() {
                localStorage.setItem('kanbanNotes', JSON.stringify(this.notes));
            },
            deep: true
        }
    }
});
new Vue({
    el: '#app'
});
