let client;

Vue.component('server-log-modal', {
  props: {
    modalId: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
        logEntries: ''
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

      this.logEntries = "";
    },
    log(entry) {
      this.logEntries += `${entry}\n`;
      const el = this.$refs.logsText
      if(el) {
        el.$el.scrollTop = el.$el.scrollHeight
      }
    }
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

    <b-form-textarea
      rows="3"
      id="logsText"
      ref="logsText"
      max-rows="20"
      plaintext
      :value="logEntries"
      style="font-size: 13px; font-family: SFMono-Regular,Menlo,Monaco,Consolas,monospace"
    ></b-form-textarea>

  </b-modal>
  `
});
