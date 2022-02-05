Vue.component('server-status', {
  props: ['status'],
  computed: {
    isOnline: function () {
      return this.status == 'online';
    },
    isOffline: function () {
      return this.status == 'offline';
    }
  },
  template: `
  <div class="server-status">
      <div v-if="isOnline">
        <i class="fas fa-circle text-success"></i>
        Online
      </div>
      <div v-else-if="isOffline">
      </div>
      <div v-else>
        <i class="fas fa-circle text-secondary"></i>
        Unknown
      </div>
  </div>
  `
})
