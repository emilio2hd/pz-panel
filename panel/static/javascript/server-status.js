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
        <i class="fas fa-circle text-success mr-1"></i>
        Online
      </template>
      <template v-else-if="isBooting">
        <b-spinner small type="grow" variant="secondary" class="mr-1"></b-spinner>
        Booting
      </template>
      <template v-else-if="isHalting">
        <b-spinner small type="grow" variant="secondary" class="mr-1"></b-spinner>
        Halting
      </template>
      <template v-else-if="isOffline">
        <i class="fas fa-circle text-danger mr-1"></i>
        Offline
      </template>
      <template v-else>
        <span title="Dunno" v-b-tooltip.hover.left>
          &macr;&#92;_(ツ)_&#47;&macr;
        </span>
      </template>
  </div>
  `
});
