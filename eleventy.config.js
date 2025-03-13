import fs from 'fs';
import path from 'path';
import lunr from 'lunr';
import {JSDOM} from 'jsdom';
import fontAwesomePlugin from '@11ty/font-awesome';
import customFlavourMarkdown from './_utilities/markdown.js';

const assetsDir = 'assets';
let hasBuiltSearchIndex = false;

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
export default function (eleventyConfig)
{
  // -----------------------------------------------------------------
  // Global data
  // -----------------------------------------------------------------
  eleventyConfig.addGlobalData('baseUrl', 'localhost'); // the production URL
  eleventyConfig.addGlobalData('layout', 'default'); // make 'default' the default layout
  eleventyConfig.addGlobalData('toc', true); // enable the table of contents
  eleventyConfig.addGlobalData('meta', {
    title:       'KeystoneDB',
    description: 'A Database'
  });

  // -----------------------------------------------------------------
  // Layout aliases
  // -----------------------------------------------------------------
  eleventyConfig.addLayoutAlias('default', 'default.njk');

  // -----------------------------------------------------------------
  // Copy assets
  // -----------------------------------------------------------------
  eleventyConfig.addPassthroughCopy(assetsDir);
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough'); // emulates passthrough copy during --serve

  // -----------------------------------------------------------------
  // Plugins
  // -----------------------------------------------------------------
  eleventyConfig.addPlugin(fontAwesomePlugin);

  // -----------------------------------------------------------------
  // Functions
  // -----------------------------------------------------------------

  // Generates a URL relative to the site's root
  eleventyConfig.addNunjucksGlobal('rootUrl', (value = '', absolute = false) =>
  {
    value = path.join('/', value);
    return absolute ? new URL(value, eleventyConfig.globalData.baseUrl).toString() : value;
  });

  // Generates a URL relative to the site's asset directory
  eleventyConfig.addNunjucksGlobal('assetUrl', (value = '', absolute = false) =>
  {
    value = path.join(`/${assetsDir}`, value);
    return absolute ? new URL(value, eleventyConfig.globalData.baseUrl).toString() : value;
  });

  // -----------------------------------------------------------------
  // Custom markdown syntaxes
  // -----------------------------------------------------------------
  eleventyConfig.setLibrary('md', customFlavourMarkdown);

  // -----------------------------------------------------------------
  // Build a search index
  // -----------------------------------------------------------------
  eleventyConfig.on('eleventy.after', ({results}) =>
  {
    // We only want to build the search index on the first run so all pages get indexed.
    if(hasBuiltSearchIndex)
    {
      return;
    }
    const map = {};
    const searchIndexFilename = path.join(eleventyConfig.dir.output, assetsDir, 'search.json');
    const lunrInput = path.resolve('./node_modules/lunr/lunr.min.js');
    const lunrOutput = path.join(eleventyConfig.dir.output, assetsDir, 'scripts/lunr.js');
    const searchIndex = lunr(function ()
    {
      // The search index uses these field names extensively, so shortening them can save some serious bytes. The
      // initial index file went from 468 KB => 401 KB by using single-character names!
      this.ref('id'); // id
      this.field('t', {boost: 50}); // title
      this.field('h', {boost: 25}); // headings
      this.field('c'); // content

      results.forEach((result, index) =>
      {
        const url = path
          .join('/', path.relative(eleventyConfig.dir.output, result.outputPath))
          .replace(/\\/g, '/') // convert backslashes to forward slashes
          .replace(/\/index.html$/, '/'); // convert trailing /index.html to /
        const doc = new JSDOM(result.content, {
          // We must set a default URL so links are parsed with a hostname. Let's use a bogus TLD so we can easily
          // identify which ones are internal and which ones are external.
          url: `https://internal/`
        }).window.document;
        const content = doc.querySelector('#content');

        // Get title and headings
        const title = (doc.querySelector('title')?.textContent || path.basename(result.outputPath)).trim();
        const headings = [...content.querySelectorAll('h1, h2, h3, h4')]
          .map(heading => heading.textContent)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        // Remove code blocks and whitespace from content
        [...content.querySelectorAll('code[class|=language]')].forEach(code => code.remove());
        const textContent = content.textContent.replace(/\s+/g, ' ').trim();

        // Update the index and map
        this.add({id: index, t: title, h: headings, c: textContent});
        map[index] = {title, url};
      });
    });

    // Copy the Lunr search client and write the index
    fs.mkdirSync(path.dirname(lunrOutput), {recursive: true});
    fs.copyFileSync(lunrInput, lunrOutput);
    fs.writeFileSync(searchIndexFilename, JSON.stringify({searchIndex, map}), 'utf-8');

    hasBuiltSearchIndex = true;
  });

  // -----------------------------------------------------------------
  // Dev server options (see https://www.11ty.dev/docs/dev-server/#options)
  // -----------------------------------------------------------------
  eleventyConfig.setServerOptions({
    domDiff: false, // disable dom diffing so custom elements don't break on reload,
    port:    4000 // if port 4000 is taken, 11ty will use the next one available
  });

  return {
    // Controls which files eleventy will process
    // e.e.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      'md', 'njk', 'html', 'liquid', '11ty.js'
    ],

    // Preprocess *.md files with: (defaults: liquid)
    markdownTemplateEngine: 'njk',

    // Preprocess *.html files with: (defaults: liquid)
    htmlTemplateEngine: 'njk',

    // These are all optional:
    dir: {
      input:    'pages',     // Default is ./
      includes: '../_includes', // Default is _includes (`input` relative)
      data:     '../_data',     // Default is _data (`input` relative)
      output:   '../_site'
    },

    // -----------------------------------------------------------------
    // Optional items:
    // -----------------------------------------------------------------

    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

    // When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
    // it will transform any absolute URLs in your HTML to include this
    // folder name and does **not** affect where things go in the output folder.

    pathPrefix: '/'
  };

};
