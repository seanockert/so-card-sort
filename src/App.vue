<template>
  <div id="app">
    <transition :name="transitionName" mode="out-in">
      <router-view :key="key"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      title: 'SO Card Sort',
      transitionName: 'fade'
    };
  },
  computed: {
    // Provide a key for the router so the transition will change
    // between the same view eg. /hello/a and hello/b
    // To transition all pages the same just use :key="$route.fullPath"
    key() {
      if (this.$route.name == 'board') {
        return this.$route.name;
      } else {
        return this.$route.fullPath;
      }
    }
  }
};
</script>

<style lang="scss">
@import "./assets/scss/_reset.scss";
@import "./assets/scss/_variables.scss";
@import "./assets/scss/_skeleton.scss";

*,
*:before,
*:after {
  box-sizing: border-box;
}

html {
  padding: 0;
  background: $color-background-grey;
}

html,
body,
#app {
  height: 100%;
}

#app {
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color-dark-blue;
}

.categories {
  &:before {
    left: 0;
    background: -moz-linear-gradient(
      left,
      rgba(236, 233, 225, 1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    background: -webkit-linear-gradient(
      left,
      rgba(236, 233, 225, 1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    background: linear-gradient(
      to right,
      rgba(236, 233, 225, 1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  &:after {
    right: 0;
    background: -moz-linear-gradient(
      left,
      rgba(255, 255, 255, 0) 0%,
      rgba(236, 233, 225, 0.9) 100%
    );
    background: -webkit-linear-gradient(
      left,
      rgba(255, 255, 255, 0) 0%,
      rgba(236, 233, 225, 0.9) 100%
    );
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(236, 233, 225, 0.9) 100%
    );
  }
}

.theme-green {
  background: $color-dark-green;

  .categories {
    &:before {
      background: -moz-linear-gradient(
        left,
        rgba(66, 185, 131, 0.7) 0%,
        rgba(255, 255, 255, 0) 100%
      );
      background: -webkit-linear-gradient(
        left,
        rgba(66, 185, 131, 0.7) 0%,
        rgba(255, 255, 255, 0) 100%
      );
      background: linear-gradient(
        to right,
        rgba(66, 185, 131, 0.7) 0%,
        rgba(255, 255, 255, 0) 100%
      );
    }
    &:after {
      background: -moz-linear-gradient(
        left,
        rgba(255, 255, 255, 0) 0%,
        rgba(66, 185, 131, 0.7) 100%
      );
      background: -webkit-linear-gradient(
        left,
        rgba(255, 255, 255, 0) 0%,
        rgba(66, 185, 131, 0.7) 100%
      );
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(66, 185, 131, 0.7) 100%
      );
    }
  }
}

.theme-dark {
  background: $color-dark-brown;

  .menu button:after {
    color: rgba(255, 255, 255, 0.2) !important;
  }

  .categories {
    &:before {
      background: -moz-linear-gradient(
        left,
        rgba(36, 28, 24, 0.65) 0%,
        rgba(0, 0, 0, 0) 100%
      );
      background: -webkit-linear-gradient(
        left,
        rgba(36, 28, 24, 0.65) 0%,
        rgba(0, 0, 0, 0) 100%
      );
      background: linear-gradient(
        to right,
        rgba(36, 28, 24, 0.65) 0%,
        rgba(0, 0, 0, 0) 100%
      );
    }
    &:after {
      background: -moz-linear-gradient(
        left,
        rgba(0, 0, 0, 0) 0%,
        rgba(36, 28, 24, 0.65) 100%
      );
      background: -webkit-linear-gradient(
        left,
        rgba(0, 0, 0, 0) 0%,
        rgba(36, 28, 24, 0.65) 100%
      );
      background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0) 0%,
        rgba(36, 28, 24, 0.65) 100%
      );
    }
  }
}

.theme-green,
.theme-dark {
  h1,
  h3 {
    color: rgba(255, 255, 255, 0.9);
  }

  .menu button,
  .categories a {
    color: #fff !important;
  }
}

input[type='text'],
button {
  -webkit-appearance: none;
}

ul {
  list-style-type: none;
  padding: 0;

  li {
    display: inline-block;
    margin: 0 10px;
  }
}

label {
  cursor: pointer;
}

a {
  color: $color-link-blue;

  &:hover {
    color: darken($color-link-blue, 20%);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
