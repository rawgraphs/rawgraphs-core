module.exports = {
  title: 'RAWGraphs Core',
  tagline: 'RAWGraphs Core library',
  url: 'https://rawgraphs.github.io/rawgraphs-core',
  baseUrl: '/rawgraphs-core/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'rawgraphs', // Usually your GitHub org/user name.
  projectName: 'rawgraphs-core', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'RAWGraphs core',
      logo: {
        alt: 'RAW logo',
        src: 'img/icon-512x512.png',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/rawgraphs/rawgraphs-core',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Links',
          items: [
            {
              label: 'Main RAWGraphs site',
              to: 'https://rawgraphs.io',
            },
            {
              label: 'Web application',
              to: 'https://rawgraphs.io',
            },
            {
              label: 'Blog',
              href: 'https://rawgraphs.io/blog',
            },
            
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} RAWGraphs.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/rawgraphs/rawgraphs-core/edit/master/website/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
