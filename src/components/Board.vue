<template>
  <div :data-id=board.id id="board">
    <board-header :board="board" :store="store" class="board-header"></board-header>
          
    <section class="categories">
      <div class="scroll-container" :style=frameWidth >
        <div v-for="category in categories" :data-id=category.id class="column">
          
          <category-header :cards="cards" :category="category" :categories="categories" class="category-header"></category-header>
          
          <ul class="card-list" :data-category="category.id" v-dragula="na" drake="columns">
            <!--<single-card :card=card v-for="card in groupCardsBy(cards, category.id)"></single-card>-->
            
            <li v-for="card in groupCardsBy(cards, category.id)"
              :class="{ completed: card.completed, editing: card == editedCard }" 
              :key="card.id"
              :data-card=card.id
              title="Double-click to edit"
              class="card"
            >
              <div class="view">
                <input class="toggle" type="checkbox" v-model="card.completed">
                <v-touch tag="label" v-on:doubletap="editCard(card)">{{ card.title }}</v-touch>
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
          </ul> 
        </div>
        
        <div class="column">
          <h3 :class="{ editing: newCategory != '' }">
            <div class="view">
              <a href="#" @click.prevent="showAddCategory" title="Add a new category to this board">+ Add category</a>
            </div>
            <input class="add-category" type="text"
              v-model="newCategory"
              v-card-focus="newCategory != ''"
              @blur="cancelAddCategory"
              @keyup.enter="addCategory"
              @keyup.esc="cancelAddCategory"
              autocomplete="off"
            >
          </h3>
        </div>
      </div>
    </section>
    
    <new-card :cards="cards"></new-card> 
  </div>
</template>

<script>
// localStorage persistence
const STORAGE_KEY = 'so-card-sort'

// Firebase bindings
/*var VueFire = require('vuefire')
var Firebase = require('firebase')

var db = Firebase.initializeApp({
  apiKey: "AIzaSyBPs8WJJxC4Fw4ZZtu9ZDKmGe1dEQ8eF_U",
  authDomain: "so-card-sort.firebaseapp.com",
  databaseURL: "https://so-card-sort.firebaseio.com"
}).database()

var boardsRef = db.ref('boards')
*/
import Header from './Header.vue'
import Category from './Category.vue'
//import Card from './Card.vue'
import NewCard from './NewCard.vue'

export default {
  name: 'board',
  components: {
    'board-header': Header,
    'category-header': Category,
    'new-card': NewCard
  },
  data: function () {
    return {
      board: { 
        id: 0, 
        title: '', 
        slug: this.$route.params.board, 
        created: new Date(), 
        theme: 'theme-grey'
      },
      cards: [],
      categories: [
        { id: 0, title: 'All' },
        { id: 1, title: 'Must have' },
        { id: 2, title: 'Nice to have' },
        { id: 3, title: 'Not important' }
      ],
      newCard: '',
      newCategory: '',
      editedCard: null,
      allDone: true,
      store: [] // Store all the boards data from database
    }  
  },  
  //firebase: {
    //boards: boardsRef.limitToLast(25)
  //},
  created: function () {
    const data = this.fetchData(this.board.slug)
    
    //console.log(this.$firebaseRefs.boards)
    
    if (data) {
      this.board.id = data.id
      this.board.title = data.title
      this.board.slug = data.slug
      this.board.created = data.created
      this.board.theme = data.theme
      this.cards = data.cards 
      
      if (data.categories) this.categories = data.categories
    }
    
    if (!this.board.slug) {
      this.board.slug = 'new-board'
      this.board.title = 'New board'
    }
    
    document.title = this.board.title + ' | UX Card Sort'
    if (this.board.theme) document.documentElement.className = this.board.theme
      
    // Dragula drag and drop events
    const service = this.$dragula.$service
    service.options('drop-service', {
      direction: 'vertical'
    }) 
    service.eventBus.$on('drop', (args) => {
      this.dropped(args) 
    })  
  },
  watch: {
    // Watch cards change for localStorage persistence
    cards: {
      handler: function () {
        this.saveData()
      },
      deep: true
    },
    categories: {
      handler: function () {
        this.saveData()
      },
      deep: true
    },
    board: {
      handler: function () {
        this.saveData()
      },
      deep: true
    }
  },
  computed: {
    frameWidth: function() {
      if (this.categories) {
        return 'width:' + (this.categories.length+1)*260 + 'px'
      }
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
    },
    // Adding a category
    showAddCategory: function() {
      this.newCategory = 'New category'
    },
    addCategory: function() {
      var value = this.newCategory && this.newCategory.trim()
      if (!value) return
      var id = this.categories.length
      this.categories.push({ id: id, title: value });
      this.newCategory = ''
    },   
    cancelAddCategory: function() {
      this.newCategory = ''
    },  
    // Filters
    showActive: function(cards) {
      return cards.filter(function (card) {
        return !card.completed
      })
    },
    showAllCards: function(cards) {
      return cards
    },
    groupCardsBy: function(cards, category) {
      // Return only cards in this category arranged by 'sorted'
      const cardList = cards.filter(function (card) { 
        if (card.category === category) return card
      })
      return cardList.sort(this.sortOrder)
    },
    sortOrder: function(a,b) {
      // Sort cards by their order property (ascending)
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
      return 0;
    },
    dropped: function(args) {
      // Called when a card is dragged then dropped
      const category = args.container.dataset.category
      const id = args.el.dataset.card
      const cards = this.cards
      if (id && category) {
        // If moved to a new category, update the card with its Id
        if (this.cards[id].category != category) {
          cards[id].category = parseInt(category)
        }  
        // If there is more than one card in a category, update the sort order upon drop
        const categoryCards = args.container.children
        const len = categoryCards.length
        if (len > 1) {
          for (var o = 0; o < len; ++o) {
            let sortId = categoryCards[o].dataset.card
            cards[sortId].order = o
          }
        }
      }
    },
    fetchData: function (slug) {
      // Fetch the contents of the current board. Get by slug
      // TODO: change this to use Firebase, ensure slug is unique or use ID
      this.store = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      //boardsRef.child(0).set(newText)
      //console.log(boardsRef.child('boards'));

      if (slug) {
        for (let i = 0, len = this.store.length; i < len; i++) {
          // If this board exists in the array then display that one
          if (this.store[i].slug == slug) {
            return this.store[i]
            break
          }
        }
        // Add a new board with this slug
        this.createBoard(slug)
        return
      }
      // If no slug is passed then use the first board
      return this.store[0]
    },
    saveData: function() {
      // Create an object with the current board to save
      if (this.board.title) {
        const saveData = { 
          id: this.board.id,
          title: this.board.title,
          slug: this.board.slug,
          theme: this.board.theme,
          categories: this.categories, 
          cards: this.cards
        }

        if (this.store[this.board.id]) {
          this.store[this.board.id] = saveData
        } else {
          // A new board so push add it to the store array
          this.store.push(saveData)
        }  
      } else {
        // If no title is set then delete this board
        this.store.splice(this.board.id, 1)
      }
      // Save as stringified array
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.store))
      //boardsRef.set(this.store)
      console.log('Saved data for board: ' + this.board.title)
    },
    createBoard: function(slug) {
      this.board.id = this.store.length
      this.board.slug = slug
      this.board.title = this.$options.filters.prettify(slug)
      console.log('Added new board: ' + this.board.title)
    }
  },
  filters: {
    pluralise: function (n) {
      return n === 1 ? 'card' : 'cards'
    },
    prettify: function(string) {
      if (string) {
        string = string.replace(/-/g,' ')
        return string.charAt(0).toUpperCase() + string.slice(1)
      }
      return string
    },
    timestampToDate: function(timestamp) {
      var d = new Date(timestamp)
      return d.getDate() + '-' + (d.getMonth()+1) + '-' + d.getFullYear()
    }
  },
  // Wait for the DOM to be updated before focusing on the input field
  // TODO: make global instead of replicating in each component?
  directives: {
    'card-focus': function (el, value) {
      if (value) el.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables.scss";

.header {
  width: 80%;
  margin: 0 auto;
  padding: $base-padding*2 0;
  padding-bottom: $base-padding;
}

#board { height: 100% }

.categories {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  -webkit-overflow-scrolling: touch;
  
  height: -webkit-calc(100% - 73px);
  height:    -moz-calc(100% - 73px);
  height:         calc(100% - 73px);
  
  &:before, &:after {
    display: block;
    content: '';
    position: fixed;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 8px;
    pointer-events: none;  
    z-index: 9;
  }
  
  .scroll-container {
    overflow-x: scroll;
    padding: 0 $base-padding;
    height: 100%;
    -webkit-overflow-scrolling: touch;
  }
  
  .column {
    width: 250px;
    float: left;
  }
}

.card-list {
  list-style: none;
  font-size: 18px;
  padding: 0 $base-padding;
  min-height: 500px;
  padding-bottom: 60px;
}


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
    padding: 3px 3px;
    padding-bottom: 7px;
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

@media (max-width: 560px) {
  
  .header {
    
    h1 {
      font-size: 1em;
    }
  }
  
  input.new-card {
    font-size: 16px;
    -webkit-appearance: none !important;
    border-radius: 0 !important;
    margin: 0 !important; 
  }
  
  
  li.card {
    font-size: 16px;
    
    .edit {
      font-size: 16px;
    }
  }
  
  
}
</style>
