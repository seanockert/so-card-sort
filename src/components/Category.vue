<template>
  <h3 class="category-title"
  :class="{ editing: category == editedCategory, empty: emptyColumn(category.id) }"
  title="Double-click to edit"
  >
    <v-touch class="view" tag="div" v-on:doubletap="editCategory(category)" role="button" title="Double-click to edit">{{ category.title | capitalise }}</v-touch>
    <input class="edit-category" type="text"
      v-model="category.title"
      v-card-focus="category == editedCategory"
      @blur="doneEditCategory(category)"
      @keyup.enter="doneEditCategory(category)"
      @keyup.esc="cancelEditCategory(category)"
      autocomplete="off"
    >
  </h3>
</template>

<script>

export default {
  name: 'cards',
  props: ['cards', 'category', 'categories'],
  data: function() {
    return {
      editedCategory: null
    };
  },
  methods: {
    removeCategory: function(category) {
      const cards = this.cards;
      const len = cards.length;
      for (var i = 0; i < len; ++i) {
        // Move all cards with this category back to the first column
        if (category.id === cards[i].category) cards[i].category = 0;
      }
      this.categories.splice(this.categories.indexOf(category), 1);
    },
    editCategory: function(category) {
      this.beforeEditCache = category.title;
      this.editedCategory = category;
    },
    doneEditCategory: function(category) {
      if (!this.editedCategory) return;
      this.editedCategory = null;
      category.title = category.title.trim();
      if (!category.title) this.removeCategory(category);
    },
    cancelEditCategory: function(category) {
      this.editedCategory = null;
      category.title = this.beforeEditCache;
    },
    emptyColumn: function(category) {
      // Display a label if the column is empty
      const cards = this.cards;
      const len = cards.length;
      for (var i = 0; i < len; ++i) {
        if (category === cards[i].category) {
          return false;
          break;
        }
      }
      return true;
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
      if (value) el.focus();
    }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/_variables.scss";

.column h3 {
  cursor: pointer;
  .view {
    display: block;
  }

  .add-category,
  .edit-category {
    display: none;
  }

  input {
    border: 1px solid #ddd;
    padding: $base-padding/2;
    margin-top: -7px;
    font-weight: bold;
    color: $color-dark-blue;
    text-align: center;
  }

  &.empty {
    position: relative;

    &:after {
      display: block;
      content: 'Empty';
      color: rgba(0, 0, 0, 0.2);
      font-weight: normal;
      font-size: 16px;
      margin-top: $base-padding*3;
      font-style: italic;
      position: absolute;
      text-align: center;
      width: 100%;
    }
  }

  &.editing {
    margin-bottom: -7px;

    .view {
      display: none;
    }
    .add-category,
    .edit-category {
      display: block;
      width: 100% !important;
      margin-left: 0px !important;
    }

    input {
      background: #fff799;
    }

    &:after {
      margin-top: 29px;
    }
  }
}
</style>
