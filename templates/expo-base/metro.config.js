const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("metro-cache");

/**
 * Metro keshi loyihaning O'ZIDA saqlanadi.
 *
 * Nega kerak: workspace'lar `node_modules` ni shablondan symlink qiladi va
 * Metro'ning standart keshi tizim temp papkasida — ya'ni barcha loyihalarga
 * umumiy. Natijada mijoz o'zgarish kiritadi, preview "muvaffaqiyatli" yig'iladi,
 * lekin ESKI ilovani ko'rsatadi. Bu mahsulotning eng yomon nosozligi:
 * "AI tuzatdim dedi, hech narsa o'zgarmadi".
 *
 * `__dirname` har workspace uchun boshqa, shuning uchun kesh ham ajralgan.
 */
const config = getDefaultConfig(__dirname);

config.cacheStores = [new FileStore({ root: path.join(__dirname, ".amb-cache") })];

module.exports = config;
