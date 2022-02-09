Vue.mixin({
  methods: {
    $_basicToast: function (message, title, type) {
      this.$bvToast.toast(message, {
        title: title,
        variant: type || 'default',
        solid: true
      });
    },
    successToast: function (message, title) {
      this.$_basicToast(message, title, 'success');
    },
    errorToast: function (message, title) {
      this.$_basicToast(message, title, 'danger');
    },
    confirmation: function(message, okAction) {
      let defaultOkAction = () => {};
      let defaultMessage = "Are you sure?";

      this.$bvModal.msgBoxConfirm(message || defaultMessage, {
        title: 'Remove workshop items',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Ok',
        cancelTitle: 'Cancel',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true,
        autoFocusButton: 'ok',
        noCloseOnBackdrop: true,
      })
      .then(okAction || defaultOkAction)
      .catch(err => console.log('Modal error: ', err))
    }
  }
})