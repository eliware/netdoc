import loadInventory from "./inventory-loader.mjs";

export default function tryLoadInventory(target, options) {
  try {
    return { inventory: loadInventory(target, options) };
  } catch (cause) {
    return { error: cause.message };
  }
}
