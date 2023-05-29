import {MODULE_ID} from "./main.js";
import {AttributesConfig} from "./attributesConfig.js";
import { defaultAttributesConfig } from "./systems.js";

export function registerSettings() {
    game.settings.register(MODULE_ID, "attributes", {
        scope: "world",
        config: false,
        type: Array,
        default: defaultAttributesConfig[game.system.id] ?? [],
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
        onChange: () => {
            setPortraitSize();
            ui.combatDock?.autosize();
        },
    });

    game.settings.register(MODULE_ID, "attributeColor", {
        name: "combat-tracker-dock.settings.attributeColor.name",
        hint: "combat-tracker-dock.settings.attributeColor.hint",
        scope: "client",
        config: true,
        type: String,
        default: "#41AA7D",
        onChange: () => {
            setAttributeColor();
        },
    });

    setAttributeColor();

    game.settings.register(MODULE_ID, "tooltipColor", {
        name: "combat-tracker-dock.settings.tooltipColor.name",
        hint: "combat-tracker-dock.settings.tooltipColor.hint",
        scope: "client",
        config: true,
        type: String,
        default: "#888888",
        onChange: () => {
            setTooltipColor();
        },
    });

    setTooltipColor();

    game.settings.register(MODULE_ID, "showDispositionColor", {
        name: "combat-tracker-dock.settings.showDispositionColor.name",
        hint: "combat-tracker-dock.settings.showDispositionColor.hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
    });

    game.settings.register(MODULE_ID, "showInitiativeOnPortrait", {
        name: "combat-tracker-dock.settings.showInitiativeOnPortrait.name",
        hint: "combat-tracker-dock.settings.showInitiativeOnPortrait.hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
    });

    game.settings.register(MODULE_ID, "portraitImage", {
        name: "combat-tracker-dock.settings.portraitImage.name",
        hint: "combat-tracker-dock.settings.portraitImage.hint",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "actor": "combat-tracker-dock.settings.portraitImage.choices.actor",
            "token": "combat-tracker-dock.settings.portraitImage.choices.token",
        },
        default: "actor",
    });

    game.settings.register(MODULE_ID, "portraitImageBorder", {
        name: "combat-tracker-dock.settings.portraitImageBorder.name",
        hint: "combat-tracker-dock.settings.portraitImageBorder.hint",
        scope: "world",
        config: true,
        type: String,
        default: "/modules/combat-tracker-dock/assets/border.png",
        filePicker: "imagevideo",
        onChange: function () {
            setPortraitImageBorder();
        },
    });
    
    setPortraitImageBorder();
}

function setPortraitSize() {
    const portraitSize = game.settings.get(MODULE_ID, "portraitSize");
    document.documentElement.style.setProperty(
        "--combatant-portrait-size",
        portraitSize
    );
}

function setPortraitImageBorder() {
    let portraitImageBorder = game.settings.get(MODULE_ID, "portraitImageBorder");
    if(!portraitImageBorder.startsWith("/")) portraitImageBorder = `/${portraitImageBorder}`;
    document.documentElement.style.setProperty(
        "--combatant-portrait-image-border",
        `url('${portraitImageBorder}')`
    );
}

function setAttributeColor() {
    const attributeColor = game.settings.get(MODULE_ID, "attributeColor");
    document.documentElement.style.setProperty(
        "--attribute-bar-primary-color",
        attributeColor
    );

    const color = Color.from(attributeColor);
    const darkened = color.mix(Color.from("#000"), 0.5);

    document.documentElement.style.setProperty(
        "--attribute-bar-secondary-color",
        darkened.toString()
    );
}

function setTooltipColor() {
    const tooltipColor = game.settings.get(MODULE_ID, "tooltipColor");
    document.documentElement.style.setProperty(
        "--carousel-tooltip-color",
        tooltipColor
    );

    const color = Color.from(tooltipColor);
    const darkened = color.mix(Color.from("#000"), 0.65);

    document.documentElement.style.setProperty(
        "--carousel-tooltip-bg-color",
        darkened.toString()
    );
}