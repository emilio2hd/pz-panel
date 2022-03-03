Vue.component('power-button', {
  methods: {
    emitPowerAction(action) {
      this.$emit('power-action', action)
    }
  },
  template: `
  <b-dropdown
    size="sm"
    variant="outline-danger"
  >
    <template #button-content>
      <i class="fas fa-power-off"></i>
      Actions
    </template>
    <b-dropdown-item href="#" @click="emitPowerAction('stop')">Stop Server</b-dropdown-item>
    <b-dropdown-item href="#" @click="emitPowerAction('start')">Start Server</b-dropdown-item>
  </b-dropdown>
  `
});
