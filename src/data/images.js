// load all images
const imageModules = import.meta.glob(
  "/src/images/**/*.{jpg,JPG,jpeg,JPEG,png,PNG}",
  {
    eager: true,
  },
);

const imageMap = {};
const allImages = [];
const folderSet = new Set();

for (const [path, mod] of Object.entries(imageModules)) {
  const key = path.replace("/src/images/", "");
  const meta = mod.default;
  imageMap[key] = meta;

  const slashIdx = key.indexOf("/");
  const folder = key.slice(0, slashIdx);
  const file = key.slice(slashIdx + 1);
  const id = folder;
  const fileBase = file.replace(/\.\w+$/, "");

  const folderTitle =
    folder.charAt(0).toUpperCase() + folder.slice(1).replace(/-/g, " ");

  folderSet.add(folder);
  allImages.push({
    id,
    image: meta,
    folder,
    title: folderTitle,
    file: fileBase,
  });
}

// "Sort" folders randomly
const folders = [...folderSet].sort((a, b) => a.localeCompare(b));

// Rebuild allImages in folder order, then by filename within each folder
const folderRank = {};
folders.forEach((f, i) => (folderRank[f] = i));
allImages.sort((a, b) => {
  const diff = folderRank[a.folder] - folderRank[b.folder];
  if (diff !== 0) return diff;
  return a.id.localeCompare(b.id);
});

const coverImages = allImages.filter(
  (img) => img.folder !== "bio" && img.file === "01",
);

export { allImages, coverImages, imageMap };
