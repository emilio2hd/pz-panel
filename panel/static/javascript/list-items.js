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
    <b-skeleton-wrapper :loading="loading" class="row">
      <template #loading>
        <b-skeleton-table
          hide-header
          :rows="10"
          :columns="1"
          :table-props="{ bordered: true, striped: true }"
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
            v-for="item in items"
            :key="item.name"
            :variant="applySelectionIfChecked(item)"
            role="button"
            @click="item.checked = !item.checked"
          >
            <b-td width="3%">
              <input type="checkbox"
                v-model="item.checked"
                :id="'item_' + item.name"
              />
            </b-td>
            <b-td>{{item.name}}</b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-skeleton-wrapper>
  </div>
  `
});
