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
      <i class="fas fa-hdd mr-1"></i>
      Disk Usage
    </div>
    <div class="progress">
      <b-progress-bar
        v-b-tooltip.hover
        v-bind:title="\`Used Space: \${usedSpace()}\`"
        v-bind:value="usagePercent()"
        v-bind:variant="variant()"
      ></b-progress-bar>
      <div
        v-b-tooltip.hover
        class="progress-bar bg-transparent"
        role="progressbar"
        v-bind:style="{ width: \`\${availablePercent()}%\` }"
        v-bind:title="\`Available: \${freeSpace()}\`"
      ></div>
    </div>
  </div>
  `
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
      <div class="progress-bar" role="progressbar" v-bind:style="\`width: \${ramUsage()}%\`"></div>
    </div>
    <div class="d-flex justify-content-between align-items-center" style="font-size: .694rem;">
      <p class="mb-1">CPU</p>
      <div>{{ cpuUsage() }}</div>
    </div>
    <div class="progress" style="height: 1px;">
      <div class="progress-bar" role="progressbar" v-bind:style="\`width: \${cpuUsage()}%\`"></div>
    </div>
  </div>
  `
});

Vue.component('resources-usage', {
  props:{
    resources: {
      type: Object
    }
  },
  template: `
  <b-row>
    <b-col cols="7">
      <ram-cpu-usage
        v-bind:resources="resources"
      ></ram-cpu-usage>
    </b-col>
    <b-col cols="5">
      <disk-usage
        v-bind:disk-info="resources.disk"
      ></disk-usage>
    </b-col>
  </b-row>
  `
});
