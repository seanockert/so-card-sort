<template>
  <div>
    <input class="new-card"
      autofocus autocomplete="off"
      placeholder="Add a new card..."
      v-model="newCard"
      @keyup.enter="addCard"
    >
  </div>
</template>

<script>
export default {
  name: 'new-card',
  props: ['cards'],
  data: function() {
    return {
      newCard: ''
    };
  },
  methods: {
    addCard: function() {
      const value = this.newCard && this.newCard.trim();
      if (!value) return;
      const created = new Date();
      const id = this.cards.length;

      this.cards.push({
        id: id,
        title: value,
        created: created,
        category: 0,
        order: 99,
        completed: false
      });
      this.newCard = '';
    }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/_variables.scss";

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
</style>
