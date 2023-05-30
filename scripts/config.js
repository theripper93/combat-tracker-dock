import {MODULE_ID} from "./main.js";
import {AttributesConfig} from "./attributesConfig.js";

export function registerSettings() {
    game.settings.register(MODULE_ID, "attributes", {
        scope: "world",
        config: false,
        type: Array,
        default: CONFIG.combatTrackerDock.defaultAttributesConfig()[game.system.id] ?? [],
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

    game.settings.register(MODULE_ID, "overflowStyle", {
        name: "combat-tracker-dock.settings.overflowStyle.name",
        hint: "combat-tracker-dock.settings.overflowStyle.hint",
        scope: "client",
        config: true,
        type: String,
        choices: {
            "autofit": "combat-tracker-dock.settings.overflowStyle.choices.autofit",
            "hidden": "combat-tracker-dock.settings.overflowStyle.choices.hidden",
            "scroll": "combat-tracker-dock.settings.overflowStyle.choices.scroll",
        },
        default: "autofit",
        onChange: () => {
            setOverflowStyle();
            ui.combatDock?.autosize();
        },
    });

    setOverflowStyle();

    game.settings.register(MODULE_ID, "carouselStyle", {
        name: "combat-tracker-dock.settings.carouselStyle.name",
        hint: "combat-tracker-dock.settings.carouselStyle.hint",
        scope: "world",
        config: true,
        type: Number,
        choices: {
            0: "combat-tracker-dock.settings.carouselStyle.choices.centerCarousel",
            1: "combat-tracker-dock.settings.carouselStyle.choices.leftCarousel",
            2: "combat-tracker-dock.settings.carouselStyle.choices.basic",
        },
        default: 0,
    });

    game.settings.register(MODULE_ID, "alignment", {
        name: "combat-tracker-dock.settings.alignment.name",
        hint: "combat-tracker-dock.settings.alignment.hint",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "left": "combat-tracker-dock.settings.alignment.choices.left",
            "center": "combat-tracker-dock.settings.alignment.choices.center",
            "right": "combat-tracker-dock.settings.alignment.choices.right",
        },
        default: "center",
        onChange: () => {
            setAlignment();
        },
    });

    setAlignment();

    game.settings.register(MODULE_ID, "portraitAspect", {
        name: "combat-tracker-dock.settings.portraitAspect.name",
        hint: "combat-tracker-dock.settings.portraitAspect.hint",
        scope: "world",
        config: true,
        type: Number,
        choices: {
            1: "combat-tracker-dock.settings.portraitAspect.choices.square",
            1.5: "combat-tracker-dock.settings.portraitAspect.choices.portrait",
            2: "combat-tracker-dock.settings.portraitAspect.choices.long",
        },
        default: 1.5,
        onChange: () => {
            setPortraitAspect();
        },
    });

    setPortraitAspect();

    game.settings.register(MODULE_ID, "roundness", {
        name: "combat-tracker-dock.settings.roundness.name",
        hint: "combat-tracker-dock.settings.roundness.hint",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "0%": "combat-tracker-dock.settings.roundness.choices.sharp",
            "10%": "combat-tracker-dock.settings.roundness.choices.soft",
            "20%": "combat-tracker-dock.settings.roundness.choices.round",
        },
        default: "0%",
        onChange: () => {
            setRoundness();
        },
    });

    setRoundness();



    game.settings.register(MODULE_ID, "attributeColor", {
        name: "combat-tracker-dock.settings.attributeColor.name",
        hint: "combat-tracker-dock.settings.attributeColor.hint",
        scope: "world",
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
        scope: "world",
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

function setPortraitAspect() {
    const portraitAspect = game.settings.get(MODULE_ID, "portraitAspect");
    document.documentElement.style.setProperty(
        "--combatant-portrait-aspect",
        portraitAspect
    );
}

function setAlignment() {
    const alignment = game.settings.get(MODULE_ID, "alignment");
    document.documentElement.style.setProperty(
        "--carousel-alignment",
        alignment
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

function setRoundness() {
    const roundness = game.settings.get(MODULE_ID, "roundness");
    document.documentElement.style.setProperty(
        "--combatant-portrait-border-radius",
        roundness
    );
}

function setAttributeColor() {
    const attributeColor = game.settings.get(MODULE_ID, "attributeColor") || "#41AA7D";
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
    const tooltipColor = game.settings.get(MODULE_ID, "tooltipColor") || "#888888";
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

function setOverflowStyle() {
    let overflowStyle = game.settings.get(MODULE_ID, "overflowStyle");
    if(overflowStyle === "autofit") overflowStyle = "hidden";
    document.documentElement.style.setProperty(
        "--carousel-overflow",
        overflowStyle
    );
}