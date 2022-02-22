Vue.component('disk-usage', {
  props:{
    diskInfo: {
      type: Object
    }
  },
  methods: {
    availablePercent() {
      return 100.0 - this.usagePercent();
    },
    usagePercent() {
      return this.diskInfo.usagePercent;
    },
    usedSpace() {
      return this.diskInfo.used;
    },
    freeSpace() {
      return this.diskInfo.free;
    },
    variant() {
      if(this.usagePercent() <= 60) {
        return 'secondary';
      }

      if(this.usagePercent() > 60 && this.usagePercent() < 90) {
        return 'warning';
      }

      if(this.usagePercent() >= 90) {
        return 'danger';
      }
    }
  },
  template: `
  <div class="disk-usage">
    <div style="font-size: 0.694rem;">
      <i class="fas fa-hdd"></i>
      Disk Usage
    </div>
    <div class="progress">
      <b-progress-bar
        v-b-tooltip.hover
        :title="\`Used Space: \${usedSpace()}\`"
        :value="usagePercent()"
        :variant="variant()"
      ></b-progress-bar>
      <div
        v-b-tooltip.hover
        class="progress-bar bg-transparent"
        role="progressbar"
        :style="{ width: \`\${availablePercent()}%\` }"
        :title="\`Available: \${freeSpace()}\`"
      ></div>
    </div>
  </div>
  `,
});

Vue.component('ram-cpu-usage', {
  props:{
    resources: {
      type: Object
    }
  },
  methods: {
    ramUsage() {
      return this.resources.ram;
    },
    cpuUsage() {
      return this.resources.cpu;
    },
  },
  template: `
  <div class="ram-cpu-usage">
    <div class="d-flex justify-content-between align-items-center" style="font-size: .694rem;">
      <p class="mb-1">Memory</p>
      <div>{{ ramUsage() }}</div>
    </div>
    <div class="progress" style="height: 1px;">
      <div class="progress-bar" role="progressbar" :style="\`width: \${ramUsage()}%\`"></div>
    </div>
    <div class="d-flex justify-content-between align-items-center" style="font-size: .694rem;">
      <p class="mb-1">CPU</p>
      <div>{{ cpuUsage() }}</div>
    </div>
    <div class="progress" style="height: 1px;">
      <div class="progress-bar" role="progressbar" :style="\`width: \${cpuUsage()}%\`"></div>
    </div>
  </div>
  `
})
Vue.component('resources-usage', {
  props:{
    resources: {
      type: Object
    }
  },
  template: `
  <b-row>
    <b-col cols="7">
      <ram-cpu-usage :resources="resources"></ram-cpu-usage>
    </b-col>
    <b-col cols="5">
      <disk-usage :disk-info="resources.disk" ></disk-usage>
    </b-col>
  </b-row>
  `
});