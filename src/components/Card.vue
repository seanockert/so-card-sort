<template>
  <li class="card"
    :class="{ completed: card.completed, editing: card == editedCard }" 
    :key="card.id"
    :data-card=card.id
    :data-cardcat=card.category
    title="Double-click to edit"
  >
    <div class="view">
      <input class="toggle" type="checkbox" v-model="card.completed">
      <v-touch tag="label" v-on:doubletap="editCard(card)">{{ card.title }} {{ card.order }}</v-touch>
      <button class="close" @click="removeCard(card)">&times;</button>
    </div>
    <textarea class="edit" 
      v-model="card.title"
      v-card-focus="card == editedCard"
      @blur="doneEdit(card)"
      @keyup.enter="doneEdit(card)"
      @keyup.esc="cancelEdit(card)"
      @focus="resize"
      @input="resize"
      autocomplete="off"
      placeholder="Type a task..."
    ></textarea>
  </li>
</template>

<script>
export default {
  name: 'cards',
  props: ['card'],
  data: function () {
    return {
      editedCard: null
    }
  },
  methods: {
    removeCard: function (card) {
      this.cards.splice(this.cards.indexOf(card), 1)
    },
    editCard: function (card) {
      this.beforeEditCache = card.title
      this.editedCard = card
    },
    doneEdit: function (card) {
      if (!this.editedCard) return
      this.editedCard = null
      card.title = card.title.trim()
      if (!card.title) this.removeCard(card)
    },
    cancelEdit: function (card) {
      this.editedCard = null
      card.title = this.beforeEditCache
    },
    resize: function(e) {
      // Resize the textarea to fit the content
      e.target.style.height = '1px';
      e.target.style.height = (e.target.scrollHeight)+'px';
    }
  },
  // Wait for the DOM to be updated before focusing on the input field.
  directives: {
    'card-focus': function (el, value) {
      if (value) el.focus()
    }
  }
}
</script>

<style lang="scss">
@import "../assets/scss/_variables.scss";

li.card,
.gu-mirror {
  list-style: none;
  margin: 0;
  background: #fff;
  box-shadow: 1px 1px 3px rgba(0,0,0,0.1);
  position: relative;
  border: 2px solid transparent;
  line-height: 1.4;
  border-radius: 5px;
  background: #fff;
  transition: all 0.1s ease-out;
  color: $color-dark-blue;
  font-size: 18px;
}

li.card {
  width: 100%;
  text-align: left;
  margin: 0;
  margin-bottom: $base-padding/2;
  
  &:after {
    clear: both;
    content: '';
    width: 100%;
    display: block
  }
  
  &.completed label {
    text-decoration: line-through;
    color: #999;
  }    
  
  &.gu-transit { opacity: 0.4; border: 2px dashed #2C3E50 }   
  
  .view {
    padding: $base-padding;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .edit {
    position: relative;
    margin: 0;
    width: 100%;
    display: none;
    padding: $base-padding;
    font-size: 18px;
    line-height: 24px;
    background: #fff799;
    outline: none;
    border: none;
    line-height: 1.4;
    word-wrap: break-word;
    resize: none;
  }
 
  input[type='checkbox'] {
    padding: 0;
    cursor: pointer;
    position: absolute;
    top: -6px;
    left: -6px;
    opacity: 0;
    outline: none;
  } 
  
  .close {
    background: red;
    color: #fff;
    border: none;
    font-weight: bold;
    cursor: pointer;
    opacity: 0;
    line-height: 0;
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 26px;
    height: 26px;
    width: 26px;
    padding-bottom: 5px;
    border-radius: 20px;
    z-index: 99;
    transition: all 0.15s ease-out;
    
    &:hover {
      background: #AB0000;
    }
  }
  
  &:hover {
    box-shadow: 1px 1px 3px rgba(0,0,0,0.3);
    
    .close, 
    input[type='checkbox'] { opacity: 1 }   
  }   
  
  &.editing {
    .edit {
      display: inline-block;
      margin-left: 0;
    }
    
    .view {
      display: none;
    }
  }
}

/* Drag and drop */
.gu-mirror {
  position: fixed !important;
  margin: 0 !important;
  z-index: 9999 !important;
  opacity: 0.9;
  padding: 0;
  background: #f7f7f7;
  transform: rotate(4deg);
  box-shadow: 1px 1px 3px rgba(0,0,0,0.3);

  .edit, 
  .close, 
  input[type='checkbox'] {
    display: none;
  }
}

.gu-hide { display: none !important }
.gu-unselectable {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important
}
</style>
