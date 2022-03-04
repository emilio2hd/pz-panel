Vue.component('search-field', {
  props: {
    value: String
  },
  data: function () {
    return {
        searchInputValue: this.value
    }
  },
  methods: {
    emitClearEvent() {
      this.searchInputValue = '';
      this.$emit('input', '')
    }
  },
  template: `
  <b-input-group size="sm">
    <b-form-input
      placeholder="Type to search"
      type="search"
      ref="searchInput"
      v-bind="$attrs"
      v-bind:value="searchInputValue"
      v-on:input="$emit('input', $event); searchInputValue = $event"
    ></b-form-input>

    <b-input-group-append>
      <b-button
        v-bind:disabled="!searchInputValue || $attrs['disabled']"
        v-on:click="emitClearEvent()"
      >
        Clear
      </b-button>
    </b-input-group-append>
  </b-input-group>
  `
});
