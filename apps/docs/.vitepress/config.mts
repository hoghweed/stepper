import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Stepper",
  description: "Moleculer action flow sample",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/introduction' },
      // { text: 'Examples', link: '/examples/routing-slip' },
      // { text: 'API', link: '/api/overview' },
      { text: 'GitHub', link: 'https://github.com/hoghweed/stepper' }
    ],

    sidebar: {
      '/guide/': [
        { text: 'Introduction', link: '/guide/introduction' },
        { text: 'Installation', link: '/guide/installation' },
        { text: 'Architecture', link: '/guide/architecture' },
        // { text: 'Implementation', link: '/guide/implementation' },
        // { text: 'Orchestration Flow', link: '/guide/orchestration-flow' }
      ],
      // '/examples/': [
      //   { text: 'Routing Slip Example', link: '/examples/routing-slip' },
      //   { text: 'Activities Example', link: '/examples/activities' },
      //   { text: 'Compensation Logic Example', link: '/examples/compensation' }
      // ],
      // '/api/': [
      //   { text: 'API Overview', link: '/api/overview' },
      //   { text: 'Activity Service', link: '/api/activity' },
      //   { text: 'Routing Service', link: '/api/routing' }
      // ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hoghweed/stepper' }
    ]
  }
})
