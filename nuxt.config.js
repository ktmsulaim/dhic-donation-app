export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Donation | Darul Hasanath Islamic College',
    title: 'Donation | Darul Hasanath Islamic College',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/scss/main.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    {src: '@/plugins/vue-chart', mode: 'client'},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/device'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/toast'
  ],
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:8000/api',
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.BASE_URL || process.env.NODE_ENV === 'production' ? 'https://api.donation.darulhasanath.com/api' : 'http://localhost:8000/api',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },
  router: {
    middleware: ['auth'],
  },
  auth: {
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/',
    },
    strategies: {
      local: {
        token: {
          property: 'data.token',
          global: true,
          maxAge: 86400,
        },
        user: {
          property: 'data',
        },
        endpoints: {
          login: { url: '/login', method: 'post' },
          logout: { url: '/logout', method: 'post' },
          user: { url: '/user', method: 'get' }
        }
      }
    },
  },
  toast: {
    position: 'bottom-right',
    duration: 3000,
    theme: 'toasted-primary',
    register: [
      {
        name: 'success',
        message: '{{message}}',
        options: {
          type: 'success',
          icon: 'check',
        },
        className: 'toasted',
      },
      {
        name: 'error',
        message: '{{message}}',
        options: {
          type: 'error',
          icon: 'close',
        },
        className: 'toasted',
      },
      {
        name: 'info',
        message: '{{message}}',
        options: {
          type: 'info',
          icon: 'info',
        },
        className: 'toasted',
      },
      {
        name: 'warning',
        message: '{{message}}',
        options: {
          type: 'warning',
          icon: 'warning',
        },
        className: 'toasted',
      },
    ]
  },
}
