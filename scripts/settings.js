import { AttributesConfig } from "./attributesConfig.js";
import {registerSystemSettings} from "./systems.js";
import { MODULE_ID } from "./main.js";

export function registerSettings() {
    game.settings.register(MODULE_ID, "attributes", {
        scope: "world",
        config: false,
        type: Array,
        default: CONFIG.combatTrackerDock.defaultAttributesConfig()[game.system.id] ?? [],
        onChange: () => ui.combatDock?.refresh(),
    });

    game.settings.register(MODULE_ID, "events", {
        scope: "world",
        config: false,
        type: Array,
        default: [],
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

    game.settings.register(MODULE_ID, "direction", {
        name: "combat-tracker-dock.settings.direction.name",
        hint: "combat-tracker-dock.settings.direction.hint",
        scope: "world",
        config: true,
        type: String,
        choices: {
            rowDocked: "combat-tracker-dock.settings.direction.choices.rowDocked",
            rowFloat: "combat-tracker-dock.settings.direction.choices.rowFloat",
            columnFloat: "combat-tracker-dock.settings.direction.choices.columnFloat",
        },
        default: "rowDocked",
        onChange: async () => {
            await ui.combatDock?.restart();
            setDirection();
            setOverflowStyle();
            setFlex();
            ui.combatDock?.autosize();
            ui.combatDock?.refresh();
        },
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
            "150px": "combat-tracker-dock.settings.portraitSize.choices.150px",
            "180px": "combat-tracker-dock.settings.portraitSize.choices.180px",
        },
        default: "70px",
        onChange: () => {
            setPortraitSize();
            ui.combatDock?.autosize();
            ui.combatDock?.refresh();
        },
    });

    game.settings.register(MODULE_ID, "overflowStyle", {
        name: "combat-tracker-dock.settings.overflowStyle.name",
        hint: "combat-tracker-dock.settings.overflowStyle.hint",
        scope: "client",
        config: true,
        type: String,
        choices: {
            autofit: "combat-tracker-dock.settings.overflowStyle.choices.autofit",
            hidden: "combat-tracker-dock.settings.overflowStyle.choices.hidden",
            scroll: "combat-tracker-dock.settings.overflowStyle.choices.scroll",
        },
        default: "autofit",
        onChange: () => {
            setOverflowStyle();
            ui.combatDock?.autosize();
            ui.combatDock?.refresh();
        },
    });

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
        onChange: () => ui.combatDock?.refresh(),
    });

    game.settings.register(MODULE_ID, "alignment", {
        name: "combat-tracker-dock.settings.alignment.name",
        hint: "combat-tracker-dock.settings.alignment.hint",
        scope: "world",
        config: true,
        type: String,
        choices: {
            left: "combat-tracker-dock.settings.alignment.choices.left",
            center: "combat-tracker-dock.settings.alignment.choices.center",
            right: "combat-tracker-dock.settings.alignment.choices.right",
        },
        default: "center",
        onChange: () => {
            setAlignment();
            setFlex();
            ui.combatDock?.refresh();
        },
    });

    game.settings.register(MODULE_ID, "floatingSize", {
        name: "combat-tracker-dock.settings.floatingSize.name",
        hint: "combat-tracker-dock.settings.floatingSize.hint",
        scope: "world",
        config: true,
        type: Number,
        default: 60,
        range: {
            min: 30,
            max: 100,
            step: 1,
        },
        onChange: () => {
            setFloatingSize();
            ui.combatDock?.refresh();
        }
    });

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
            ui.combatDock?.refresh();
        },
    });

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
            ui.combatDock?.refresh();
        },
    });

    game.settings.register(MODULE_ID, "attributeColor", {
        name: "combat-tracker-dock.settings.attributeColor.name",
        hint: "combat-tracker-dock.settings.attributeColor.hint",
        scope: "world",
        config: true,
        type: String,
        default: "#41AA7D",
        onChange: () => {
            setAttributeColor();
            ui.combatDock?.refresh();
        },
    });

    game.settings.register(MODULE_ID, "attributeColor2", {
        name: "combat-tracker-dock.settings.attributeColor2.name",
        hint: "combat-tracker-dock.settings.attributeColor2.hint",
        scope: "world",
        config: true,
        type: String,
        default: "#ffcd00",
        onChange: () => {
            setAttributeColor();
            ui.combatDock?.refresh();
        },
    });
    //
    game.settings.register(MODULE_ID, "attributeColorPortrait", {
        name: "combat-tracker-dock.settings.attributeColorPortrait.name",
        hint: "combat-tracker-dock.settings.attributeColorPortrait.hint",
        scope: "world",
        config: true,
        type: String,
        default: "#e62121",
        onChange: () => {
            setAttributeColor();
            ui.combatDock?.refresh();
        },
    });

    game.settings.register(MODULE_ID, "barsPlacement", {
        name: "combat-tracker-dock.settings.barsPlacement.name",
        hint: "combat-tracker-dock.settings.barsPlacement.hint",
        scope: "world",
        config: true,
        type: String,
        choices: {
            left: "combat-tracker-dock.settings.barsPlacement.choices.left",
            right: "combat-tracker-dock.settings.barsPlacement.choices.right",
            twinned: "combat-tracker-dock.settings.barsPlacement.choices.twinned",
        },
        default: "left",
        onChange: () => ui.combatDock?.refresh(),
    });

    game.settings.register(MODULE_ID, "attributeVisibility", {
        name: "combat-tracker-dock.settings.attributeVisibility.name",
        hint: "combat-tracker-dock.settings.attributeVisibility.hint",
        scope: "world",
        config: true,
        type: String,
        choices: {
            text: "combat-tracker-dock.settings.attributeVisibility.choices.text",
            bars: "combat-tracker-dock.settings.attributeVisibility.choices.bars",
            both: "combat-tracker-dock.settings.attributeVisibility.choices.both",
        },
        default: "both",
        onChange: () => ui.combatDock?.refresh(),
    });

    game.settings.register(MODULE_ID, "tooltipColor", {
        name: "combat-tracker-dock.settings.tooltipColor.name",
        hint: "combat-tracker-dock.settings.tooltipColor.hint",
        scope: "world",
        config: true,
        type: String,
        default: "#888888",
        onChange: () => {
            setTooltipColor();
            ui.combatDock?.refresh();
        },
    });

    game.settings.register(MODULE_ID, "displayDescriptions", {
        name: "combat-tracker-dock.settings.displayDescriptions.name",
        hint: "combat-tracker-dock.settings.displayDescriptions.hint",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "none": "combat-tracker-dock.settings.displayDescriptions.choices.none",
            "owner": "combat-tracker-dock.settings.displayDescriptions.choices.owner",
            "all": "combat-tracker-dock.settings.displayDescriptions.choices.all",
        },
        default: "owner",
        onChange: () => ui.combatDock?.refresh(),
    });

    game.settings.register(MODULE_ID, "hideDefeated", {
        name: "combat-tracker-dock.settings.hideDefeated.name",
        hint: "combat-tracker-dock.settings.hideDefeated.hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => ui.combatDock?.refresh(),
    });

    game.settings.register(MODULE_ID, "showDispositionColor", {
        name: "combat-tracker-dock.settings.showDispositionColor.name",
        hint: "combat-tracker-dock.settings.showDispositionColor.hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => ui.combatDock?.refresh(),
    });

    game.settings.register(MODULE_ID, "showInitiativeOnPortrait", {
        name: "combat-tracker-dock.settings.showInitiativeOnPortrait.name",
        hint: "combat-tracker-dock.settings.showInitiativeOnPortrait.hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => ui.combatDock?.refresh(),
    });

    game.settings.register(MODULE_ID, "portraitImage", {
        name: "combat-tracker-dock.settings.portraitImage.name",
        hint: "combat-tracker-dock.settings.portraitImage.hint",
        scope: "world",
        config: true,
        type: String,
        choices: {
            actor: "combat-tracker-dock.settings.portraitImage.choices.actor",
            token: "combat-tracker-dock.settings.portraitImage.choices.token",
        },
        default: "actor",
        onChange: () => ui.combatDock?.refresh(),
    });

    game.settings.register(MODULE_ID, "displayName", {
        name: "combat-tracker-dock.settings.displayName.name",
        hint: "combat-tracker-dock.settings.displayName.hint",
        scope: "world",
        config: true,
        type: String,
        choices: {
            default: "combat-tracker-dock.settings.displayName.choices.default",
            token: "combat-tracker-dock.settings.displayName.choices.token",
            owner: "combat-tracker-dock.settings.displayName.choices.owner",
        },
        default: "default",
        onChange: () => ui.combatDock?.refresh(),
    });

    game.settings.register(MODULE_ID, "playerPlayerPermission", {
        name: "combat-tracker-dock.settings.playerPlayerPermission.name",
        hint: "combat-tracker-dock.settings.playerPlayerPermission.hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => ui.combatDock?.refresh(),
    });

    game.settings.register(MODULE_ID, "hideFirstRound", {
        name: "combat-tracker-dock.settings.hideFirstRound.name",
        hint: "combat-tracker-dock.settings.hideFirstRound.hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => ui.combatDock?.refresh(),
    });

    game.settings.register(MODULE_ID, "hideEnemyInitiative", {
        name: "combat-tracker-dock.settings.hideEnemyInitiative.name",
        hint: "combat-tracker-dock.settings.hideEnemyInitiative.hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => ui.combatDock?.refresh(),
    });

    game.settings.register(MODULE_ID, "portraitImageBorder", {
        name: "combat-tracker-dock.settings.portraitImageBorder.name",
        hint: "combat-tracker-dock.settings.portraitImageBorder.hint",
        scope: "world",
        config: true,
        type: String,
        default: "modules/combat-tracker-dock/assets/border.png",
        filePicker: "imagevideo",
        onChange: function () {
            setPortraitImageBorder();
            ui.combatDock?.refresh();
        },
    });

    game.settings.register(MODULE_ID, "portraitImageBackground", {
        name: "combat-tracker-dock.settings.portraitImageBackground.name",
        hint: "combat-tracker-dock.settings.portraitImageBackground.hint",
        scope: "world",
        config: true,
        type: String,
        default: "ui/denim075.png",
        filePicker: "imagevideo",
        onChange: function () {
            setPortraitImageBackground();
            ui.combatDock?.refresh();
        },
    });

    game.settings.register(MODULE_ID, "showSystemIcons", {
        name: "combat-tracker-dock.settings.showSystemIcons.name",
        hint: "combat-tracker-dock.settings.showSystemIcons.hint",
        scope: "world",
        config: true,
        type: Number,
        choices: {
            0: "combat-tracker-dock.settings.showSystemIcons.choices.none",
            1: "combat-tracker-dock.settings.showSystemIcons.choices.tooltip",
            2: "combat-tracker-dock.settings.showSystemIcons.choices.resource",
            3: "combat-tracker-dock.settings.showSystemIcons.choices.both",
        },
        default: 1,
        onChange: () => ui.combatDock?.refresh(),
    });

    game.settings.register(MODULE_ID, "hideConflictingUIs", {
        name: "combat-tracker-dock.settings.hideConflictingUIs.name",
        hint: "combat-tracker-dock.settings.hideConflictingUIs.hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => setHideConflictingUIs(),
    });

    registerSystemSettings();

    setAllSettings();

    game.settings.register(MODULE_ID, "resource", {
        name: "combat-tracker-dock.settings.resource.name",
        hint: "combat-tracker-dock.settings.resource.hint",
        scope: "world",
        config: true,
        type: String,
        default: "",
        onChange: () => ui.combatDock?.refresh(),
    });

    game.settings.register(MODULE_ID, "portraitResource", {
        name: "combat-tracker-dock.settings.portraitResource.name",
        hint: "combat-tracker-dock.settings.portraitResource.hint",
        scope: "world",
        config: true,
        type: String,
        default: "",
        onChange: () => ui.combatDock?.refresh(),
    });
}

function setAllSettings() {
    setDirection();
    setOverflowStyle();
    setAlignment();
    setFlex();
    setPortraitAspect();
    setRoundness();
    setAttributeColor();
    setTooltipColor();
    setPortraitImageBorder();
    setPortraitImageBackground();
    setHideConflictingUIs();
    setFloatingSize();
}

function setFloatingSize() {
    const floatingSize = game.settings.get(MODULE_ID, "floatingSize");
    document.documentElement.style.setProperty("--carousel-floating-size", floatingSize + "%");
}

function setPortraitSize() {
    const portraitSize = game.settings.get(MODULE_ID, "portraitSize");
    document.documentElement.style.setProperty("--combatant-portrait-size", portraitSize);
}

function setPortraitAspect() {
    const portraitAspect = game.settings.get(MODULE_ID, "portraitAspect");
    document.documentElement.style.setProperty("--combatant-portrait-aspect", portraitAspect);
}

function setAlignment() {
    const alignment = game.settings.get(MODULE_ID, "alignment");
    document.documentElement.style.setProperty("--carousel-alignment", alignment);
    ui.combatDock?.setControlsOrder();
}

function setPortraitImageBorder() {
    let portraitImageBorder = game.settings.get(MODULE_ID, "portraitImageBorder");
    document.documentElement.style.setProperty("--combatant-portrait-image-border", `url('${portraitImageBorder}')`);
}

function setPortraitImageBackground() {
    let portraitImageBackground = game.settings.get(MODULE_ID, "portraitImageBackground");
    document.documentElement.style.setProperty("--combatant-portrait-image-background", `url('${portraitImageBackground}')`);
}

function setHideConflictingUIs() {
    const hideConflictingUIs = game.settings.get(MODULE_ID, "hideConflictingUIs");
    document.querySelector("#ui-top")?.classList.toggle("ctd-hide-conflicting-uis", hideConflictingUIs);
}

function setRoundness() {
    const roundness = game.settings.get(MODULE_ID, "roundness");
    document.documentElement.style.setProperty("--combatant-portrait-border-radius", roundness);
}

function setAttributeColor() {
    const attributeColor = game.settings.get(MODULE_ID, "attributeColor") || "#41AA7D";
    document.documentElement.style.setProperty("--attribute-bar-primary-color", attributeColor);

    const color = Color.from(attributeColor);
    const darkened = color.mix(Color.from("#000"), 0.5);

    document.documentElement.style.setProperty("--attribute-bar-secondary-color", darkened.toString());

    const attributeColor2 = game.settings.get(MODULE_ID, "attributeColor2") || "#ffcd00";
    document.documentElement.style.setProperty("--attribute-bar-primary-color2", attributeColor2);

    const color2 = Color.from(attributeColor2);
    const darkened2 = color2.mix(Color.from("#000"), 0.5);

    document.documentElement.style.setProperty("--attribute-bar-secondary-color2", darkened2.toString());

    const attributeColorPortrait = game.settings.get(MODULE_ID, "attributeColorPortrait") || "#e62121";
    document.documentElement.style.setProperty("--attribute-bar-portrait-color", attributeColorPortrait);

}

function setTooltipColor() {
    const tooltipColor = game.settings.get(MODULE_ID, "tooltipColor") || "#888888";
    document.documentElement.style.setProperty("--carousel-tooltip-color", tooltipColor);

    const color = Color.from(tooltipColor);
    const darkened = color.mix(Color.from("#000"), 0.65);

    document.documentElement.style.setProperty("--carousel-tooltip-bg-color", darkened.toString());
}

function setOverflowStyle() {
    let overflowStyle = game.settings.get(MODULE_ID, "overflowStyle");
    if (overflowStyle === "autofit") overflowStyle = "hidden";
    if (overflowStyle === "scroll") {
        const direction = game.settings.get(MODULE_ID, "direction");
        if (direction !== "columnFloat") overflowStyle = "scroll hidden";
        else overflowStyle = "hidden scroll";
    }
    document.documentElement.style.setProperty("--carousel-overflow", overflowStyle);
}

function setDirection() {
    let direction = game.settings.get(MODULE_ID, "direction");
    if(!(direction in game.settings.settings.get(`${MODULE_ID}.direction`))) {
        direction = direction.includes("column") ? "columnFloat" : "rowDocked"; 
        game.settings.set(MODULE_ID, "direction", direction);
    }
    document.documentElement.style.setProperty("--carousel-direction", direction === "columnFloat" ? "column" : "row");
    document.documentElement.style.setProperty("--combatant-portrait-margin", direction !== "columnFloat" ? "0 calc(var(--combatant-portrait-size) * 0.1)" : "0");
    ui.combatDock?.setControlsOrder();
}

function setFlex() {
    const alignment = game.settings.get(MODULE_ID, "alignment");
    const direction = game.settings.get(MODULE_ID, "direction");
    let flexD = "flex-start";
    if (direction == "columnFloat" && alignment == "right") flexD = "flex-end";
    if (direction == "columnFloat" && alignment == "center") flexD = "center";

    document.documentElement.style.setProperty("--carousel-align-items", flexD);
}

function l(key) {
    return game.i18n.localize(key);
}

export function registerSystemSetting(key, data) {
    const rootKey = MODULE_ID + ".settings.systems." + game.system.id;
    game.settings.register(MODULE_ID, game.system.id + "." + key, {
        ...data,
        name: game.system.title + " " + l(MODULE_ID + ".settings.integration") + ": " + l(rootKey+"."+key+".name"),
        hint: l(rootKey+"."+key+".hint"),
    });
}

export function getSystemSetting(key) {
    return game.settings.get(MODULE_ID, game.system.id + "." + key);
}
