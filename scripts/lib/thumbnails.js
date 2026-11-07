import { MODULE_ID } from "../main.js";

const ACTIVE_PORTRAIT_SCALE = 1.2;
const THUMBNAIL_QUALITY = 0.85;

const cache = new Map();

export function getPortraitThumbnail(src) {
    if (!src || !game.settings.get(MODULE_ID, "portraitThumbnails") || foundry.helpers.media.VideoHelper.hasVideoExtension(src)) return src;
    const width = Math.ceil(parseInt(game.settings.get(MODULE_ID, "portraitSize")) * ACTIVE_PORTRAIT_SCALE * window.devicePixelRatio);
    const aspect = Number(game.settings.get(MODULE_ID, "portraitAspect")) || 1;
    const key = `${src}|${width}|${aspect}`;
    if (!cache.has(key)) cache.set(key, createThumbnail(src, width, width * aspect).catch(() => src));
    return cache.get(key);
}

async function createThumbnail(src, width, height) {
    const response = await fetch(src);
    if (!response.ok) throw new Error(response.statusText);
    const source = await createImageBitmap(await response.blob());
    const scale = Math.max(width / source.width, height / source.height);
    if (scale >= 1) {
        source.close();
        return src;
    }
    const resizeWidth = Math.ceil(source.width * scale);
    const resizeHeight = Math.ceil(source.height * scale);
    const bitmap = await createImageBitmap(source, { resizeWidth, resizeHeight, resizeQuality: "high" });
    source.close();
    const canvas = new OffscreenCanvas(resizeWidth, resizeHeight);
    canvas.getContext("2d").drawImage(bitmap, 0, 0);
    bitmap.close();
    const blob = await canvas.convertToBlob({ type: "image/webp", quality: THUMBNAIL_QUALITY });
    return URL.createObjectURL(blob);
}
