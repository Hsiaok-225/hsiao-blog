// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: `Hsiao's Website`,
  tagline: "Hsiao is cool",
  url: "https://github.com", //
  baseUrl: "/", //
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  projectName: "my-blog", //

  // GitHub pages deployment config.
  organizationName: "Hsiaok-225", // Usually your GitHub org/user name.
  deploymentBranch: "gh-pages", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          showLastUpdateTime: true,
          routeBasePath: "/", // Serve the docs at the site's root
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
        },
        blog: {
          // For disable blog
          // blog: false,

          // Remove this to remove the "edit this page" links.
          // editUrl:

          // set 0 disable sidebar, set "All" show all posts
          // blogSidebarCount: 0,
          blogSidebarCount: "ALL",
          blogSidebarTitle: "recent posts",
          // When set to false, the "x min read" won't be shown
          showReadingTime: true, 
          readingTime: ({content, frontMatter, defaultReadingTime}) =>
            defaultReadingTime({content, options: {wordsPerMinute: 180}}),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Navigation bar
      navbar: {
        title: "Hsiao",
        logo: {
          alt: "My Site Logo",
          src: "img/logo.svg",
        },
        items: [
          // Docs link
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Docs",
          },
          // Blog link
          { to: "blog", label: "Blog", position: "left" }, 
          // Github link
          {
            href: "https://github.com/Hsiaok-225",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      // footer: {
      //   style: "dark",
      //   links: [
      //     {
      //       items: [
      //         {
      //           label: "Stack Overflow",
      //           href: "https://stackoverflow.com/questions/tagged/docusaurus",
      //         },
      //       ],
      //     },
      //     {
      //       items: [
      //         {
      //           label: "Blog",
      //           to: "/blog",
      //         },
      //       ],
      //     },
      //   ],
      //   copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      // },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
