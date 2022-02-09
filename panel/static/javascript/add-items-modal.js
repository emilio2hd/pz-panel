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

      if(this.options.workshopItems.length <= 0 && this.options.mods.length <= 0){
        this.modalOpt.newWorkshopItemState = false
        this.modalOpt.newModState = false;
        return;
      }

      this.$emit('save-items', {
        workshopItems: this.options.workshopItems,
        mods: this.options.mods,
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
        You need to add at least one either Workshop Item or Mod.
      </b-alert>
      <b-row>
        <b-col>
          <h6>Workshop Items</h6>
          <b-input-group class="form-group">
            <template #append>
              <b-input-group-text>
                <i class="fas fa-info-circle"
                  v-b-tooltip.hover.left
                  title="Press <Enter> to add multiple items"
                ></i>
              </b-input-group-text>
            </template>
            <b-form-input
              v-model="newWorkshopItem"
              :state="modalOpt.newWorkshopItemState"
              @keyup.enter="onNewWorkshopItemEnter()"
              required
            ></b-form-input>
          </b-input-group>
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
        <b-col>
          <h6>Mods</h6>
          <b-input-group class="form-group">
            <template #append>
              <b-input-group-text>
                <i class="fas fa-info-circle"
                  v-b-tooltip.hover.left
                  title="Press <Enter> to add multiple items"
                ></i>
              </b-input-group-text>
            </template>
            <b-form-input
              v-model="newMod"
              :state="modalOpt.newModState"
              @keyup.enter="onNewModEnter()"
              required
            ></b-form-input>
          </b-input-group>
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
