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
Vue.component('planned-tasks', {
    template: `
    <div class="column">
      <h4 class="column-title">Запланированные задачи</h4>
    <ul class="list">
        <li class="cart list-item" v-for="(note, index) in notes" v-if="note.isPlanned === true">
            <p>Название : {{ note.text }}</p>
            <p>Описание : {{ note.description }}</p>
            <p>Дата создания : {{ note.created_at }}</p>
            <p v-if="note.lastEditedAt">Изменено : {{ note.lastEditedAt }}</p>
            <p>Крайний срок : {{ note.deadline }}</p>
            <button @click="(note.isEdit = !note.isEdit)">Редактировать</button>
            <button class="arrow-button" @click="(note.isProcess = true) && (note.isPlanned = false)">
                <i class="fas fa-chevron-right"></i>
            </button>
            <button class="delete-button" @click="deleteNote(note.text)">Удалить</button>

            <div v-if="note.isEdit">
                <input v-model="note.text">
                <textarea v-model="note.description"></textarea>
                <input type="date" v-model="note.deadline">
                <button @click="editNote(index)">Сохранить</button>
            </div>
        </li>
    </ul>
    </div>
  `,
    props: ['notes', 'moveToCompleted', 'moveToInProgress', 'deleteNote', 'editNote'],

});
Vue.component('in-progress-tasks', {
    template: `
    <div class="column">
      <h4 class="column-title">Задачи в работе</h4>
    <ul class="list">
        <li class="cart list-item" v-for="(note, index) in notes" v-if="note.isProcess === true">
            <p>Название : {{ note.text }}</p>
            <p>Описание : {{ note.description }}</p>
            <p>Дата создания : {{ note.created_at }}</p>
            <p v-if="note.lastEditedAt">Изменено : {{ note.lastEditedAt }}</p>
            <p>Крайний срок : {{ note.deadline }}</p>
            <p v-if="note.returnReason">Причина отката : {{ note.returnReason }}</p>
            <button class="arrow-button" @click="(note.isTested = true) && (note.isProcess = false)">
                <i class="fas fa-chevron-right"></i>
            </button>
            <button class="delete-button" @click="deleteNote(note.text)">Удалить</button>

        </li>
    </ul>
    </div>
  `,
    props: ['notes', 'moveToCompleted', 'moveToInProgress', 'deleteNote', 'editNote'],
});
Vue.component('testing-tasks', {
    template: `
    <div class="column">
      <h4 class="column-title">Тестирование</h4>
    <ul class="list">
        <li class="cart list-item" v-for="(note, index) in notes" v-if="note.isTested === true">
            <p>Название : {{ note.text }}</p>
            <p>Описание : {{ note.description }}</p>
            <p>Дата создания : {{ note.created_at }}</p>
            <p v-if="note.lastEditedAt">Изменено : {{ note.lastEditedAt }}</p>
            <p>Крайний срок : {{ note.deadline }}</p>
            <button class="arrow-button" @click="moveToInProgress(index)">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="arrow-button" @click="moveToCompleted(index)">
                <i class="fas fa-chevron-right"></i>
            </button>
            <button class="delete-button" @click="deleteNote(note.text)">Удалить</button>

        </li>
    </ul>
    </div>
  `,
    props: ['notes', 'moveToCompleted', 'moveToInProgress', 'deleteNote', 'editNote'],
});
Vue.component('completed-tasks', {
    template: `
    <div class="column">
      <h4 class="column-title">Завершенные задачи</h4>
    <ul class="list">
        <li class="cart list-item" v-for="(note, index) in notes" v-if="note.isDone === true">
            <p>Название : {{ note.text }}</p>
            <p>Описание : {{ note.description }}</p>
            <p>Дата создания : {{ note.created_at }}</p>
            <p v-if="note.lastEditedAt">Изменено : {{ note.lastEditedAt }}</p>
            <p>Крайний срок : {{ note.deadline }}</p>
            <p class="deadline" v-if="note.isOverdue">Статус: Просрочено</p>
            <button class="arrow-button" @click="(note.isTested = true) && (note.isDone = false)">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="delete-button" @click="deleteNote(note.text)">Удалить</button>

        </li>
    </ul>
    </div>
  `,
    props: ['notes', 'moveToCompleted', 'moveToInProgress', 'deleteNote', 'editNote'],
});
new Vue({
    el: '#app'
});