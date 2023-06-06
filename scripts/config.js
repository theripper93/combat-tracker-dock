import { MODULE_ID } from "./main.js";
import { AttributesConfig } from "./attributesConfig.js";

export function registerSettings() {
    Hooks.on("renderSettingsConfig", (app, html, data) => {
        colorPicker("attributeColor", html);
        colorPicker("attributeColor2", html);
    });

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
            "150px": "combat-tracker-dock.settings.portraitSize.choices.150px",
            "180px": "combat-tracker-dock.settings.portraitSize.choices.180px",
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
            autofit: "combat-tracker-dock.settings.overflowStyle.choices.autofit",
            hidden: "combat-tracker-dock.settings.overflowStyle.choices.hidden",
            scroll: "combat-tracker-dock.settings.overflowStyle.choices.scroll",
        },
        default: "autofit",
        onChange: () => {
            setOverflowStyle();
            ui.combatDock?.autosize();
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
    });

    game.settings.register(MODULE_ID, "direction", {
        name: "combat-tracker-dock.settings.direction.name",
        hint: "combat-tracker-dock.settings.direction.hint",
        scope: "world",
        config: true,
        type: String,
        choices: {
            row: "combat-tracker-dock.settings.direction.choices.row",
            column: "combat-tracker-dock.settings.direction.choices.column",
        },
        default: "row",
        onChange: () => {
            setDirection();
            setOverflowStyle();
            setFlex();
            ui.combatDock?.autosize();
        },
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
        },
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
        },
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
        },
    });

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
    });

    game.settings.register(MODULE_ID, "hideFirstRound", {
        name: "combat-tracker-dock.settings.hideFirstRound.name",
        hint: "combat-tracker-dock.settings.hideFirstRound.hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
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

    game.settings.register(MODULE_ID, "portraitImageBackground", {
        name: "combat-tracker-dock.settings.portraitImageBackground.name",
        hint: "combat-tracker-dock.settings.portraitImageBackground.hint",
        scope: "world",
        config: true,
        type: String,
        default: "/ui/denim075.png",
        filePicker: "imagevideo",
        onChange: function () {
            setPortraitImageBackground();
        },
    });

    setAllSettings();

    game.settings.register(MODULE_ID, "resource", {
        scope: "world",
        config: false,
        type: String,
        default: "",
    });
}

export function registerWrappers() {
    if (!game.modules.get("lib-wrapper")?.active) return;

    libWrapper.register(MODULE_ID, "Combatant.prototype.visible", function (wrapped, ...args) {
        const visible = wrapped(...args);
        if (!ui.combatDock?.rendered) return visible;
        const cDVisible = ui.combatDock.portraits.find((p) => p.combatant == this)?.firstTurnHidden;
        return visible && !cDVisible;
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
    if (!portraitImageBorder.startsWith("/") && !portraitImageBorder.includes("http")) portraitImageBorder = `/${portraitImageBorder}`;
    document.documentElement.style.setProperty("--combatant-portrait-image-border", `url('${portraitImageBorder}')`);
}

function setPortraitImageBackground() {
    let portraitImageBackground = game.settings.get(MODULE_ID, "portraitImageBackground");
    if (!portraitImageBackground.startsWith("/") && !portraitImageBackground.includes("http")) portraitImageBackground = `/${portraitImageBackground}`;
    document.documentElement.style.setProperty("--combatant-portrait-image-background", `url('${portraitImageBackground}')`);
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
        if (direction === "row") overflowStyle = "visible hidden";
        else overflowStyle = "hidden visible";
    }
    document.documentElement.style.setProperty("--carousel-overflow", overflowStyle);
}

function setDirection() {
    const direction = game.settings.get(MODULE_ID, "direction");
    document.documentElement.style.setProperty("--carousel-direction", direction);
    document.documentElement.style.setProperty("--combatant-portrait-margin", direction === "row" ? "0 calc(var(--combatant-portrait-size) * 0.1)" : "0");
    ui.combatDock?.setControlsOrder();
}

function setFlex() {
    const alignment = game.settings.get(MODULE_ID, "alignment");
    const direction = game.settings.get(MODULE_ID, "direction");
    let flexD = "flex-start";
    if (direction == "column" && alignment == "right") flexD = "flex-end";
    if (direction == "column" && alignment == "center") flexD = "center";

    document.documentElement.style.setProperty("--carousel-align-items", flexD);
}

//Color Picker by kaelad02
//License: MIT
//Documentation: https://github.com/kaelad02/adv-reminder/blob/54207ec1ef0500439e57521f15956c07e4c02af4/src/settings.js#L91-L104

export function colorPicker(settingId, html) {
    const colorPickerElement = document.createElement("input");
    colorPickerElement.setAttribute("type", "color");
    colorPickerElement.setAttribute("data-edit", MODULE_ID + "." + settingId);
    colorPickerElement.value = game.settings.get(MODULE_ID, settingId);

    // Add color picker
    const stringInputElement = html[0].querySelector(`input[name="${MODULE_ID}.${settingId}"]`);
    stringInputElement.classList.add("color");
    stringInputElement.after(colorPickerElement);
}
