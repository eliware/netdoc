import path from "node:path";

export function createMemoryFileSystem(files = {}, emptyDirectories = []) {
  const fileMap = new Map(
    Object.entries(files).map(([file, content]) => [path.resolve(file), content]),
  );
  const directories = new Set(emptyDirectories.map((directory) => path.resolve(directory)));
  for (const file of fileMap.keys()) {
    let directory = path.dirname(file);
    while (!directories.has(directory)) {
      directories.add(directory);
      const parent = path.dirname(directory);
      if (parent === directory) break;
      directory = parent;
    }
  }

  return {
    existsSync(target) {
      const resolved = path.resolve(target);
      return fileMap.has(resolved) || directories.has(resolved);
    },
    statSync(target) {
      const resolved = path.resolve(target);
      if (directories.has(resolved)) return { isDirectory: () => true, isFile: () => false };
      if (fileMap.has(resolved)) return { isDirectory: () => false, isFile: () => true };
      throw new Error(`Path does not exist: ${resolved}`);
    },
    readdirSync(target) {
      const resolved = path.resolve(target);
      if (!directories.has(resolved)) throw new Error(`Not a directory: ${resolved}`);
      const names = new Set();
      for (const entry of [...directories, ...fileMap.keys()]) {
        if (entry === resolved || path.dirname(entry) !== resolved) continue;
        names.add(path.basename(entry));
      }
      return [...names].map((name) => {
        const child = path.join(resolved, name);
        return {
          name,
          isDirectory: () => directories.has(child),
          isFile: () => fileMap.has(child),
        };
      });
    },
    readFileSync(target) {
      const resolved = path.resolve(target);
      if (!fileMap.has(resolved)) throw new Error(`File does not exist: ${resolved}`);
      return fileMap.get(resolved);
    },
  };
}
