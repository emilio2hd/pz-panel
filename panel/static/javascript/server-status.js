Vue.component('server-status', {
  props: ['status'],
  computed: {
    isOnline: function () {
      return this.status == 'online';
    },
    isStarting: function () {
      return this.status == 'starting';
    },
    isOffline: function () {
      return this.status == 'offline';
    }
  },
  template: `
  <div class="server-status">
      <template v-if="isOnline">
        <i class="fas fa-circle text-success"></i>
        Online
      </template>
      <template v-else-if="isStarting">
        <b-spinner small type="grow" variant="secondary"></b-spinner>
        Starting
      </template>
      <template v-else-if="isOffline">
        <i class="fas fa-circle text-danger"></i>
        Offline
      </template>
      <template v-else>
        <i class="fas fa-circle text-secondary"></i>
        Unknown
      </template>
  </div>
  `
})
