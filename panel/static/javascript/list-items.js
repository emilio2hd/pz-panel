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
  template: `
  <div class="list-items">
  <b-skeleton-wrapper :loading="loading" class="row">
    <template #loading>
      <b-skeleton-table
        hide-header
        :rows="10"
        :columns="1"
        :table-props="{ bordered: true, striped: true }"
      ></b-skeleton-table>
    </template>
    <b-table-simple striped hover>
      <b-tbody>
        <b-tr v-for="item in items" :key="item.name">
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
