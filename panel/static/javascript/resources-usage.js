Vue.component('resources-usage', {
  props: ['cpu', 'memory'],
  template: `
  <div class="resources-usage">
    <div class="d-flex justify-content-between align-items-center" style="font-size: .694rem;">
      <p class="mb-1">Memory</p>
      <div>{{ memory }}</div>
    </div>
    <div class="progress" style="height: 1px;">
      <div class="progress-bar" role="progressbar" :style="\`width: \${memory}%\`"></div>
    </div>
    <div class="d-flex justify-content-between align-items-center" style="font-size: .694rem;">
      <p class="mb-1">CPU</p>
      <div>{{ cpu }}</div>
    </div>
    <div class="progress" style="height: 1px;">
      <div class="progress-bar" role="progressbar" :style="\`width: \${cpu}%\`"></div>
    </div>
  </div>
  `
})
