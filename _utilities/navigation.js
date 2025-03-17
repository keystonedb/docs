import fs from 'fs';

// This file is used to generate the navigation for the site. It is used in the _includes/header.html file.
// This file will look through the pages directory and generate a list of links based on the front matter of each page.
// If the front matter includes draft: true, the page will not be included in the navigation.
const getNavigation = () =>
{
  const navigation = [];
  const pagesDirectory = 'pages';

  // loop through the pages directory for any other directories (section titles)
  const subdirectories = fs.readdirSync(pagesDirectory, {withFileTypes: true})
    .filter(dirent => dirent.isDirectory());

  subdirectories.forEach(subdirectory =>
  {
    const humanReadable = subdirectory.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const section = {
      'title': humanReadable,
      'items': []
    };

    // loop through the files in each directory
    const files = fs.readdirSync(`${pagesDirectory}/${subdirectory.name}`, {withFileTypes: true})
      .filter(dirent => dirent.isFile());

    files.forEach(file =>
    {
      const page = fs.readFileSync(`${pagesDirectory}/${subdirectory.name}/${file.name}`, 'utf8');
      const frontMatter = page.split('---')[1];
      const draft = frontMatter.includes('draft: true');
      // title should be humanized filename
      const title = file.name.replace(/-/g, ' ')
        .replace('.md', '')
        .replace(/\b\w/g, l => l.toUpperCase());

      let url = `/${subdirectory.name}/${file.name.replace('.md', '')}`;
      // if filename is the same as the directory name, remove the filename from the url
      if((file.name.replace('.md', '') === subdirectory.name) || (file.name === 'index.md'))
      {
        url = `/${subdirectory.name}`;
      }

      if(!draft)
      {
        section.items.push({
          'name': title,
          'url':  url
        });
      }
    });

    navigation.push(section);
  });

  return navigation;
};

export default getNavigation;
