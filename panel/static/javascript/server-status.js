Vue.component('server-status', {
  props: ['status'],
  computed: {
    isOnline: function () {
      return this.status == 'online';
    }
  },
  template: `
  <div v-if="isOnline">
    <i class="fas fa-circle text-success"></i>
    Online
  </div>
  <div v-else>
    <i class="fas fa-circle text-danger"></i>
    Offline
  </div>
  `
})
