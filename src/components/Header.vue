<template>
  <header class="header">
    <h1 :class="{ editing: editedBoard }">
      <v-touch class="view" tag="div" v-on:doubletap="editBoard" role="button" title="Double-click to edit" tabindex="0">{{ board.title | capitalise }}</v-touch>
      <input class="edit-board" type="text"
        v-model="board.title"
        v-card-focus="editedBoard"
        @blur="doneEditBoard"
        @keyup.enter="doneEditBoard"
        autocomplete="off"
      > 
    </h1>
    <div :class="{ open: openMenu, 'menu' : true }" @blur="openMenu = false" v-if="store.length > 1">
      <button @click.prevent="openMenu = !openMenu">Boards</button>
      <ul>
        <li v-for="allBoards in store"><a :href=allBoards.slug :title=allBoards.title >{{ allBoards.title }} <span>({{ allBoards.cards.length }})</span></a>
        <!--<router-link :to=allBoards.slug title="View this board">{{ allBoards.title }}</router-link>-->
        </li>
      </ul>
    </div>
    <div class="theme-select">
      <button @click.prevent="changeTheme('green')" :class="{ active: false, 'theme-select-green' : true }" tabindex="-1" title="Change theme"></button>
      <button @click.prevent="changeTheme('dark')" :class="{ active: false, 'theme-select-dark' : true }" tabindex="-1" title="Change theme"></button>
      <button @click.prevent="changeTheme('grey')" :class="{ active: false, 'theme-select-grey' : true }" tabindex="-1" title="Change theme"></button>
    </div>  
  </header>
</template>

<script>
export default {
  name: 'cards',
  props: ['board', 'store'],
  data: function() {
    return {
      editedBoard: null,
      openMenu: false
    };
  },
  methods: {
    editBoard: function() {
      this.beforeEditCache = this.board.title;
      this.editedBoard = true;
    },
    doneEditBoard: function() {
      if (!this.editedBoard) return;

      this.editedBoard = false;

      if (!this.board.title && this.board.id != 0) {
        if (confirm('Delete this board?')) {
          // Setting a blank title will delete the board in the saveData method
          //this.$router.push('new-board')
          window.location.pathname = '';
        } else {
          this.board.title = this.beforeEditCache;
        }
        return;
      }

      this.board.slug = this.board.title
        .trim()
        .toLowerCase()
        .replace(/ /g, '-');
      window.history.replaceState('', this.board.title, this.board.slug);
      if (!this.board.title) this.board.title = this.beforeEditCache;
    },
    changeTheme: function(theme) {
      this.board.theme = 'theme-' + theme;
      document.documentElement.className = this.board.theme;
    }
  },
  filters: {
    capitalise: function(string) {
      if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      return string;
    }
  },
  directives: {
    'card-focus': function(el, value) {
      if (value) {
        el.focus();
      }
    }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/_variables.scss";

h1 {
  margin-top: 0;
  margin-bottom: 0;
  font-weight: bold;
  position: relative;
  cursor: pointer;
  .view {
    display: block;
  }
  .edit-board {
    display: none;
  }

  &.editing {
    margin-top: -3px;
    margin-bottom: -3px;

    .view {
      display: none;
    }
    .edit-board {
      display: block;
      margin-left: 2px;
      text-align: center;
      margin: 0 auto;
    }

    input {
      background: #fff799;
      font-weight: bold;
    }
  }
}

.menu {
  position: absolute;
  left: $base-padding;
  top: $base-padding;
  width: 150px;
  z-index: 999;

  button {
    background: none;
    border: none;
    color: $color-link-blue;
    text-decoration: underline;
    outline: none;
    text-align: left;
    width: 100%;

    &:after {
      display: inline-block;
      content: '\25BC';
      font-size: 0.7em;
      color: rgba(0, 0, 0, 0.2);
      margin-left: $base-padding/3;
      vertical-align: middle;
      transition: all 0.15s ease-out;
    }

    &:hover {
      color: darken($color-link-blue, 20%);
    }
  }

  ul {
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    text-align: left;
    display: none;
    margin-top: 0;
    border-radius: 5px;
    overflow: hidden;
  }

  li {
    display: block;
    margin: 0;

    a {
      display: block;
      padding: $base-padding;
      text-decoration: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      span {
        display: inline-block;
        font-size: 0.9em;
        color: rgba(0, 0, 0, 0.2);
        vertical-align: middle;
        margin-top: -3px;
      }

      &:hover {
        background: #fff;
      }
    }
  }

  &.open {
    button {
      color: $color-dark-blue;
      text-decoration: none;

      &:after {
        transform: rotate(-180deg) translate3d(0, 2px, 0);
        transform-origin: 50% 50%;
      }
    }

    ul {
      display: block;
    }
  }
}

.theme-select {
  position: absolute;
  top: $base-padding;
  right: $base-padding;

  button {
    border: none;
    height: 22px;
    width: 22px;
    padding: 0;
    background: $color-background-grey;
    border: 2px solid rgba(255, 255, 255, 0.9);
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.15s ease-out;

    &.theme-select-green {
      background: $color-dark-green;
    }
    &.theme-select-dark {
      background: $color-dark-brown;
    }

    &:hover {
      transform: scale(1.15);
      border-color: rgba(0, 0, 0, 0.4);
    }

    &.active {
      margin-top: -2px;
      height: 24px;
      width: 24px;
      border: 2px solid rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
