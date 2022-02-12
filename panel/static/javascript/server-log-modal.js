let client;

Vue.component('server-log-modal', {
  props: {
    modalId: {
      type: String,
      required: true,
    },
  },
  watch: {
    logs () {
      this.$nextTick(() => {
        const el = this.$refs.logs
        if(el) {
          el.scrollTop = el.scrollHeight
        }
      })
    }
  },
  data: function () {
    return {
        logs: []
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

      this.logs.push('Connecting...')
      client.on('message', (data) => {
        if("error" in data) {
          this.logs.push(data.errorMessage);
          this.logs.push("Disconnecting.");
          return client.disconnect();
        }

        this.logs.push(data.log)
      })
      .on('error', (err) => console.error('Failed to parse or lost connection:', err))
      .connect()
      .catch(() => this.logs.push('Failed to connect.'))
    },
    disconnect () {
      if (client) {
        this.logs.push("Disconnecting...")
        client.disconnect();
        client = null;
      }

      this.logs = [];
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
    <div id="logs" ref="logs" style="height: 350px; overflow-y: scroll; font-size: 13px; font-family: SFMono-Regular,Menlo,Monaco,Consolas,monospace">
      <div v-for="(log, i) in logs" :key="i" v-text="log"></div>
    </div>

  </b-modal>
  `
});
