
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

});
new Vue({
    el: '#app'
});
