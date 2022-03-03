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
      :value="searchInputValue"
      @input="$emit('input', $event); searchInputValue = $event"
    ></b-form-input>

    <b-input-group-append>
      <b-button
        :disabled="!searchInputValue || $attrs['disabled']"
        @click="emitClearEvent()"
      >
        Clear
      </b-button>
    </b-input-group-append>
  </b-input-group>
  `
});
