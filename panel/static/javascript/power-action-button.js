Vue.component('power-button', {
  methods: {
    emitPowerAction(action) {
      this.$emit('power-action', action)
    }
  },
  template: `
  <b-dropdown split
    size="sm"
    split-variant="outline-danger"
    variant="danger"
    @click="emitPowerAction('restart')"
  >
    <template #button-content>
      <i class="fas fa-power-off"></i>
      Restart
    </template>
    <b-dropdown-item href="#" @click="emitPowerAction('stop')">Stop</b-dropdown-item>
    <b-dropdown-item href="#" @click="emitPowerAction('start')">Start</b-dropdown-item>
  </b-dropdown>
  `
})
