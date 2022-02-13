let client;

let entryComponent = Vue.component('log-entry', {
  props: {
    index: {
      type: Number
    },
    source: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  template: `
  <div>{{ source.message }}</div>
  `
});

Vue.component('server-log-modal', {
  props: {
    modalId: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
        logs: [],
        logEntry: entryComponent,
    }
  },
  methods: {
    onHidden() {
      this.disconnect();
    },
    handleOk(){
      this.disconnect();
    },
    onShow() {
      this.disconnect();

      client = this.$sse.create({
        url: '/server/log',
        format: 'json',
      });

      this.log('Connecting...')
      client.on('message', (data) => {
        if("error" in data) {
          this.log(data.errorMessage);
          this.log("Disconnecting.");
          return client.disconnect();
        }

        this.log(data.log);
      })
      .on('error', (err) => console.error('Failed to parse or lost connection:', err))
      .connect()
      .catch(() => this.log('Failed to connect.'))
    },
    disconnect () {
      if (client) {
        this.log("Disconnecting...")
        client.disconnect();
        client = null;
      }

      this.logs = [];
    },
    log(entry) {
      this.logs.push({ id: new Date().getTime(), message: entry});
      this.$nextTick(() => this.setVirtualListToBottom())
    },
    setVirtualListToBottom () {
      if (this.$refs.vsl) {
        this.$refs.vsl.scrollToBottom()
      }
    },
  },
  beforeDestroy () {
    this.disconnect()
  },
  template: `
  <b-modal
    centered
    :id="modalId"
    ok-only
    ok-title="Close"
    ref="modal"
    size="xl"
    @hidden="onHidden"
    @ok="handleOk"
    @show="onShow"
  >
    <template #modal-title>
      <i class="fa fa-book"></i>
      Server logs
    </template>

    <div
      style="font-size: 13px; font-family: SFMono-Regular,Menlo,Monaco,Consolas,monospace"
    >
      <virtual-list style="height: 360px; overflow-y: auto;" ref="vsl"
        :data-key="'id'"
        :data-sources="logs"
        :data-component="logEntry"
      />
    </div>
  </b-modal>
  `
});
