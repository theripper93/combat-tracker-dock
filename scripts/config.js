import {MODULE_ID} from "./main.js";
import {AttributesConfig} from "./attributesConfig.js";

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
                icon: "fa-solid fa-shield",
            },
            {
                attr: "attributes.movement.walk",
                icon: "fa-solid fa-person-running-fast",
                units: "ft.",
            },
        ],
    });

    game.settings.registerMenu(MODULE_ID, "attributesMenu", {
        name: game.i18n.localize(`${MODULE_ID}.settings.attributesMenu.name`),
        label: game.i18n.localize(`${MODULE_ID}.settings.attributesMenu.label`),
        hint: game.i18n.localize(`${MODULE_ID}.settings.attributesMenu.hint`),
        icon: "fas fa-cogs",
        scope: "world",
        restricted: true,
        type: AttributesConfig,
    });    

    game.settings.register(MODULE_ID, "portraitSize", {
        name: "combat-tracker-dock.settings.portraitSize.name",
        hint: "combat-tracker-dock.settings.portraitSize.hint",
        scope: "client",
        config: true,
        type: String,
        choices: {
            "30px": "combat-tracker-dock.settings.portraitSize.choices.30px",
            "50px": "combat-tracker-dock.settings.portraitSize.choices.50px",
            "70px": "combat-tracker-dock.settings.portraitSize.choices.70px",
            "90px": "combat-tracker-dock.settings.portraitSize.choices.90px",
            "110px": "combat-tracker-dock.settings.portraitSize.choices.110px",
        },
        default: "70px",
        onChange: () => setPortraitSize(),
    });

    setPortraitSize();

    game.settings.register(MODULE_ID, "showDispositionColor", {
        name: "combat-tracker-dock.settings.showDispositionColor.name",
        hint: "combat-tracker-dock.settings.showDispositionColor.hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
    });
}

function setPortraitSize() {
    const portraitSize = game.settings.get(MODULE_ID, "portraitSize");
    document.documentElement.style.setProperty(
        "--combatant-portrait-size",
        portraitSize
    );
}