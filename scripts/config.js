import { MODULE_ID } from "./main.js";

export function registerSettings() {
    game.settings.register(MODULE_ID, "attributes", {
        scope: "world",
        config: false,
        type: Array,
        default: [
            {
                attr: "attributes.hp.value",
                icon: "fa-solid fa-heart",
                units: "HP",
            },
            {
                attr: "attributes.ac.value",
                icon: "icons/svg/shield.svg",
            },
            {
                attr: "attributes.movement.walk",
                icon: "icons/svg/thrust.svg",
                units: "ft.",
            },
        ],
    });
}