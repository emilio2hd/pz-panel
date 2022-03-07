from flask_assets import Bundle

VUEJS_DEV = 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js'
VUEJS_PROD = 'https://cdn.jsdelivr.net/npm/vue@2.6.14'

def _register_css_bundles(assets):
  assets.register(
    'base_css',
    'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-vue@2.21.2/dist/bootstrap-vue.min.css',
    Bundle('styles/main.css')
  )

def _register_js_bundles(assets, env: str):
  vuejs = VUEJS_PROD if env is 'production' else VUEJS_DEV

  bundles = {
    'base_js':[
      'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver',
      vuejs,
      'https://cdn.jsdelivr.net/npm/bootstrap-vue@2.21.2/dist/bootstrap-vue.min.js',
      'https://cdn.jsdelivr.net/npm/bootstrap-vue@2.21.2/dist/bootstrap-vue-icons.min.js',
      'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
      'https://cdn.jsdelivr.net/npm/vue-sse@2.5.0/dist/vue-sse.min.js',
      'https://cdn.jsdelivr.net/npm/vue-virtual-scroll-list@2.3.3/dist/index.min.js',
    ],
    'dashboard_js': Bundle(
      'javascript/mixins.js',
      'javascript/power-action-button.js',
      'javascript/server-status.js',
      'javascript/resources-usage.js',
      'javascript/search-field.js',
      'javascript/list-items.js',
      'javascript/add-items-modal.js',
      'javascript/server-log-modal.js',
      filters='jsmin',
      output='dist/js/dashboard.%(version)s.min.js'
    ),
  }

  assets.register(bundles)

def register_bundles(assets, env: str):
  _register_css_bundles(assets)
  _register_js_bundles(assets, env)
