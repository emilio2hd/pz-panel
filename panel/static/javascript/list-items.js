Vue.component('list-items', {
  props: {
    items: {
      type: Array,
      default: []
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    applySelectionIfChecked(item) {
      if(item.checked) {
        return 'warning';
      }
    },
    hasItems() {
      return this.items.length > 0;
    },
  },
  template: `
  <div class="list-items h-100">
    <b-skeleton-wrapper v-bind:loading="loading" class="row">
      <template #loading>
        <b-skeleton-table
          hide-header
          v-bind:rows="10"
          v-bind:columns="1"
          v-bind:table-props="{ bordered: true, striped: true }"
        ></b-skeleton-table>
      </template>
      <div
        v-if="!hasItems()"
        class="d-flex align-items-center justify-content-center h-100"
      >
        <div class="text-muted">No items to display</div>
      </div>
      <b-table-simple striped hover v-else>
        <b-tbody>
          <b-tr
            role="button"
            v-for="item in items"
            v-bind:key="item.name"
            v-bind:variant="applySelectionIfChecked(item)"
            v-on:click="item.checked = !item.checked"
          >
            <b-td width="3%">
              <input type="checkbox"
                v-model="item.checked"
                v-bind:id="'item_' + item.name" />
            </b-td>
            <b-td>{{item.name}}</b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-skeleton-wrapper>
  </div>
  `
});
