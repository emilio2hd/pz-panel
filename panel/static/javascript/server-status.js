Vue.component('server-status', {
  props: ['state'],
  computed: {
    isOnline: function () {
      return this.state == 'on';
    },
    isBooting: function () {
      return this.state == 'booting';
    },
    isHalting: function () {
      return this.state == 'halting';
    },
    isOffline: function () {
      return this.state == 'off';
    }
  },
  template: `
  <div class="server-status">
      <template v-if="isOnline">
        <i class="fas fa-circle text-success"></i>
        Online
      </template>
      <template v-else-if="isBooting">
        <b-spinner small type="grow" variant="secondary"></b-spinner>
        Booting
      </template>
      <template v-else-if="isHalting">
        <b-spinner small type="grow" variant="secondary"></b-spinner>
        Halting
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
