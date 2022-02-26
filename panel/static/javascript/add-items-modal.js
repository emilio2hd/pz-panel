const WorkshopItemRegex = /WorkshopItems=(.+)/;
const ModRegex = /Mods=(.+)/;
const ValueSeparator = ";";

Vue.component('import-config-items', {
  data: function () {
    return {
      workshopItems: [],
      mods: []
    }
  },
  methods: {
    $_extractFromRegex(regex, content) {
      let result = regex.exec(content);

      if (!result) {
        return;
      }

      return result[1].split(ValueSeparator);
    },
    $_extractWorkshopItems(configContent) {
      this.workshopItems = this.$_extractFromRegex(WorkshopItemRegex, configContent) || [];
    },
    $_extractMods(configContent) {
      this.mods = this.$_extractFromRegex(ModRegex, configContent) || [];
    },
    $_readConfigFile(file) {
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        this.$_extractWorkshopItems(evt.target.result);
        this.$_extractMods(evt.target.result);

        if(this.mods.length == 0 && this.workshopItems.length == 0) {
          return this.warningToast(`Not items found to be imported from "${file.name}"`, "Import Config");
        }

        this.$emit('import', {
          workshopItems: this.workshopItems,
          mods: this.mods,
        });
      }
      reader.onerror = (evt) => console.error(evt)
    },
    handleFileUpload(event){
      this.workshopItems = [];
      this.mods = [];

      let file = event.target.files[0];
      if (file.type && !file.type.startsWith('text/')) {
        this.errorToast("File is not a valid config file", "Import Config");
        return;
      }

      this.$_readConfigFile(file);
      this.$refs.file.value = null;
    },
    addFiles(){
      this.$refs.file.click();
    },
  },
  template: `
  <div>
    <input type="file" id="file" ref="file" class="d-none" @change="handleFileUpload($event)"/>
    <b-link v-on:click="addFiles()">
      <i class="fas fa-upload"></i>
      Import Config
    </b-link>
    <i
      v-b-tooltip.hover.left
      class="fas fa-info-circle text-muted"
      title="Use this link to import workshop ids and mods from the server .ini file"
    ></i>
  </div>
  `
});

Vue.component('add-items-modal', {
  props: {
    modalId: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      newWorkshopItem: '',
      newMod: '',
      options: {
        workshopItems: [],
        mods: []
      },
      modalOpt: {
        showContent: true,
        newModState: null
      }
    }
  },
  computed: {
    showOverlay() {
      return this.loading;
    }
  },
  methods: {
    onShownModal() {
      this.$refs.newWorkshopItemInput.focus();
    },
    resetModal() {
      this.newWorkshopItem = '';
      this.newMod = '';
      this.options.workshopItems = [];
      this.options.mods = [];
      this.modalOpt = {
        showContent: true,
        newWorkshopItemState: null,
        newModState: null,
      };
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault(); // Prevent modal to close when saving
      this.handleSubmit()
    },
    handleSubmit() {
      this.modalOpt.newWorkshopItemState = null;
      this.modalOpt.newModState = null;

      let newWorkshopItem = this.newWorkshopItem.trim();
      let newMod = this.newMod.trim();

      if(
        (this.options.workshopItems.length <= 0 && this.options.mods.length <= 0) &&
        (newWorkshopItem == '' && newMod == '')
      ){
        this.modalOpt.newWorkshopItemState = false
        this.modalOpt.newModState = false;
        return;
      }

      let workshopItems = [...this.options.workshopItems];
      let mods = [...this.options.mods];

      if(newWorkshopItem.trim() != '') {
        workshopItems.push(newWorkshopItem);
      }

      if(newMod.trim() != '') {
        mods.push(newMod);
      }

      this.$emit('save-items', {
        workshopItems: workshopItems,
        mods: mods,
      });
    },
    onNewWorkshopItemEnter() {
      let newItem = this.newWorkshopItem.trim()
      if(newItem != '') {
        this.options.workshopItems.push(newItem);
        this.newWorkshopItem = ''
      }
    },
    removeNewWorkshopItem(newWorkshopItem) {
      let workshopItems = this.options.workshopItems.filter((item) => item != newWorkshopItem);
      this.options.workshopItems = workshopItems;
    },
    onNewModEnter() {
      let newItem = this.newMod.trim();
      if(newItem != '') {
        this.options.mods.push(newItem);
        this.newMod = ''
      }
    },
    removeNewMod(newMod) {
      let mods = this.options.mods.filter((item) => item != newMod);
      this.options.mods = mods;
    },
    onImportConfig(event) {
      this.options.mods = this.options.mods.concat(event.mods);
      this.options.workshopItems = this.options.workshopItems.concat(event.workshopItems);
    }
  },
  template: `
  <b-modal
    centered
    scrollable
    :id="modalId"
    ok-title="Save"
    ref="modal"
    size="lg"
    title="Add new items"
    :busy="loading"
    @hidden="resetModal"
    @ok="handleOk"
    @show="resetModal"
    @shown="onShownModal"
  >
    <b-overlay :show="showOverlay" rounded="sm">
      <template #overlay>
        <div class="d-flex align-items-center">
          <b-spinner type="grow" variant="dark" class="mr-1"></b-spinner>
          <span>Please wait...</span>
        </div>
      </template>
      <b-alert
        dismissible
        :show="modalOpt.newWorkshopItemState == false || modalOpt.newModState == false"
        variant="danger"
      >
        You need to add at least one of either Workshop id or Mod id.
      </b-alert>
      <b-row>
        <b-col cols="6">
          <h6>Workshop Id</h6>
          <b-input-group class="form-group mb-0">
            <b-form-input
              v-model="newWorkshopItem"
              ref="newWorkshopItemInput"
              :state="modalOpt.newWorkshopItemState"
              @keyup.enter="onNewWorkshopItemEnter()"
              placeholder="Add the workshop id here"
              required
            ></b-form-input>
          </b-input-group>
        </b-col>
        <b-col cols="6">
          <h6>Mod Id</h6>
          <b-input-group class="form-group mb-0">
            <b-form-input
              v-model="newMod"
              :state="modalOpt.newModState"
              @keyup.enter="onNewModEnter()"
              placeholder="Add the mod id here"
              required
            ></b-form-input>
          </b-input-group>
        </b-col>
      </b-row>
      <div class="d-flex">
        <p class="text-muted font-italic mb-1 flex-fill">
          <small>Press &lt;Enter&gt; to add multiple items</small>
        </p>
        <import-config-items
          class="flex-fill text-right"
          @import="onImportConfig"
        ></import-config-items>
      </div>
      <b-row>
      <b-col cols="6">
        <b-list-group>
          <b-list-group-item v-for="item in options.workshopItems" :key="item.value">
          <div class="d-flex">
            <div class="flex-grow-1">{{ item }}</div>
            <b-link @click="removeNewWorkshopItem(item)">
              <i
                class="fas fa-trash"
                v-b-tooltip.hover.left
                title="Remove"
              ></i>
            </b-link>
          </div>
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col cols="6">
        <b-list-group>
          <b-list-group-item v-for="item in options.mods" :key="item.value">
          <div class="d-flex">
            <div class="flex-grow-1">{{ item }}</div>
            <b-link @click="removeNewMod(item)">
              <i
                class="fa fa-trash"
                v-b-tooltip.hover.left
                title="Remove"
              ></i>
            </b-link>
          </div>
          </b-list-group-item>
        </b-list-group>
      </b-col>
      </b-row>
    </b-overlay>
  </b-modal>
  `
});
