<template>
  <div :data-id=board.id id="board">
    <board-header :board=board :store=store class="board-header"></board-header>
          
    <section class="categories">
      <div class="scroll-container" :style=frameWidth >
        <div v-for="category in categories" :data-id=category.id class="column">
          
          <category-header :cards=cards :category=category :categories=categories class="category-header"></category-header>
          
          <ul class="card-list" :data-category=category.id v-dragula="na" drake="columns">
            <single-card :card=card v-for="card in groupCardsBy(cards, category.id)"></single-card>
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
    
    <input class="new-card"
      autofocus autocomplete="off"
      placeholder="Add a new card..."
      v-model="newCard"
      @keyup.enter="addCard"
    >  
  </div>
</template>

<script>
// localStorage persistence
const STORAGE_KEY = 'so-card-sort'

import Header from './Header.vue'
import Category from './Category.vue'
import Card from './Card.vue'

export default {
  name: 'board',
  components: {
    'board-header': Header,
    'category-header': Category,
    'single-card': Card
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
      allDone: true,
      store: [] // Store all the boards data from database
    }  
  },  
  created: function () {
    const data = this.fetchData(this.board.slug)
    
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
    // Adding a card
    addCard: function () {
      const value = this.newCard && this.newCard.trim()
      if (!value) return
      const created = new Date()
      const id = this.cards.length
      
      this.cards.push({
        id: id,
        title: value,
        created: created,
        category: 0,
        order: 0,
        completed: false
      })
      this.newCard = ''
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
        var c = card.category
        if (c === category) return card
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
      // Get the category ID, then update this card with this new category ID
      const category = args.container.dataset.category
      const id = args.el.dataset.card
      if (category) this.cards[id].category = parseInt(category)
      
      // Change sort order of the cards within a column
      const cards = this.cards
      const listCards = args.container.children
      const len = listCards.length
      if (len > 1) {
        for (var i = 0; i < len; ++i) {
          let sortId = listCards[i].dataset.card
          cards[sortId].order = i
        }
      }
    },
    fetchData: function (slug) {
      // Fetch the contents of the current board. Get by slug
      // TODO: change this to use Firebase, ensure slug is unique or use ID
      this.store = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
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

<style lang="sass" scoped>
@import "../assets/scss/_variables.scss";

.header {
  width: 80%;
  margin: 0 auto;
  padding: $base-padding*2 0;
  padding-bottom: $base-padding;
}

#board { height: 100% }

.new-card {
  padding: $base-padding;
  font-size: 20px;
  width: 100%;
  border: 1px solid #ddd;
  box-shadow: none;
  z-index: 99;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.categories {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  
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
</style>
