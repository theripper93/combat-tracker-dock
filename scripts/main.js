import {registerSettings, registerWrappers, registerHotkeys} from './config.js';
import {CombatDock} from './App/Tracker.js';
import {CombatantPortrait} from './App/CombatantPortrait.js';
import {defaultAttributesConfig, generateDescription} from './systems.js';
import {showWelcome} from './lib/welcome.js';

export const MODULE_ID = 'combat-tracker-dock';

Hooks.once('init', function () {
    registerWrappers();
    registerHotkeys();
    CONFIG.combatTrackerDock = {
        CombatDock,
        CombatantPortrait,
        defaultAttributesConfig,
        generateDescription,
        INTRO_ANIMATION_DURATION: 1000,
        INTRO_ANIMATION_DELAY: 0.25,
    }

    Hooks.callAll(`${MODULE_ID}-init`, CONFIG.combatTrackerDock);
});

Hooks.once('setup', registerSettings);

Hooks.on('createCombat', (combat) => {
    if (game.combat === combat) {
        new CONFIG.combatTrackerDock.CombatDock(combat).render(true);
    }
});

Hooks.on('updateCombat', (combat, updates) => {
    if(updates.active || updates.scene === null) {
        new CONFIG.combatTrackerDock.CombatDock(combat).render(true);
    }
    if(updates.scene && combat.scene !== game.scenes.viewed && ui.combatDock?.combat === combat) {
        ui.combatDock.close();
    }
});

Hooks.on('canvasReady', () => {
    Hooks.once("renderCombatTracker", (tab) => {
            if(game.combat?.active) {
                new CONFIG.combatTrackerDock.CombatDock(game.combat).render(true);
            } else {
                ui.combatDock?.close();
            }
    })
});

Hooks.on('ready', () => {
    if(game.combat?.active && !ui.combatDock && game.settings.get("core", "noCanvas")) {
        new CONFIG.combatTrackerDock.CombatDock(game.combat).render(true);
    }
    showWelcome();
});

function getCTFormData(app){

}

Hooks.on("renderCombatTrackerConfig", (app, html, data) => {
    if (!game.user.isGM) return;
    const attributes = TokenDocument.implementation.getTrackedAttributes();
    attributes.bar.forEach(a => a.push("value"));
    const attributeChoices = TokenDocument.implementation.getTrackedAttributeChoices(attributes)
    attributeChoices.unshift({label: "None", value: ""})
    const attributeBarChoices = TokenDocument.implementation.getTrackedAttributeChoices({bar: attributes.bar, value: []})
    attributeBarChoices.unshift({label: "None", value: ""})
    const compiled = Handlebars.compile(`<select name="flags.${MODULE_ID}.resource">{{selectOptions options selected=value}}</select>`)
    const compiled2 = Handlebars.compile(`<select name="flags.${MODULE_ID}.portraitResource">{{selectOptions options selected=value}}</select>`)
    const selectResourceHtml = compiled({options: attributeChoices, value: game.settings.get(MODULE_ID, "resource")})
    const portraitResource = game.settings.get(MODULE_ID, "portraitResource");
    const selectPortraitResourceHtml = compiled2({options: attributeBarChoices, value: portraitResource})

    const fg = document.createElement("div");
    fg.classList.add("form-group");
    fg.innerHTML = `
    <label>${game.i18n.localize('COMBAT.CONFIG.FIELDS.core.combatTrackerConfig.resource.label')} 2</label>
    ${selectResourceHtml}
    <p class="hint">${game.i18n.localize('COMBAT.CONFIG.FIELDS.core.combatTrackerConfig.resource.hint')}</p>
    `;

    html.querySelector(`select[name="core.combatTrackerConfig.resource"]`).closest(".form-group").appendChild(fg);

    const portraitFg = document.createElement("div");
    portraitFg.classList.add("form-group");
    portraitFg.innerHTML = `
    <label>${game.i18n.localize(`${MODULE_ID}.combatConfig.portraitResource.label`)}</label>
    ${selectPortraitResourceHtml}
    <p class="hint">${game.i18n.localize(`${MODULE_ID}.combatConfig.portraitResource.hint`)}</p>
    `;

    html.querySelector(`select[name="flags.${MODULE_ID}.resource"]`).closest(".form-group").appendChild(portraitFg);

    const button = document.createElement("button");
    button.innerHTML = `<i class="fa-solid fa-gears"></i> ` + game.i18n.localize(`${MODULE_ID}.configureCarousel`);

    button.addEventListener("click", (e) => {
        e.preventDefault();
        new SettingsConfig().render(true)
        Hooks.once("renderSettingsConfig", (app, html, data) => {
            html.querySelector('button[data-tab="combat-tracker-dock"]').click();
        });
    });

    //find last form group
    const lastFormGroup = html.querySelectorAll(".form-group")[html.querySelectorAll(".form-group").length - 1];
    lastFormGroup.appendChild(button);

    html.querySelector(`select[name="flags.${MODULE_ID}.resource"]`).addEventListener("change", async (event) => {
        await game.settings.set(MODULE_ID, "resource", event.target.value);
    });

    html.querySelector(`select[name="flags.${MODULE_ID}.portraitResource"]`).addEventListener("change", async (event) => {
        await game.settings.set(MODULE_ID, "portraitResource", event.target.value);
    });

    app.setPosition({height: "auto"});
});