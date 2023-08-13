import {registerSettings, registerWrappers, registerHotkeys} from './config.js';
import {CombatDock} from './App/Tracker.js';
import {CombatantPortrait} from './App/CombatantPortrait.js';
import {defaultAttributesConfig} from './systems.js';

export const MODULE_ID = 'combat-tracker-dock';

Hooks.once('init', function () {
    registerWrappers();
    registerHotkeys();
    CONFIG.combatTrackerDock = {
        CombatDock,
        CombatantPortrait,
        defaultAttributesConfig,
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
    if(updates.active) {
        new CONFIG.combatTrackerDock.CombatDock(combat).render(true);
    }
});

Hooks.on('canvasReady', () => {
    let hook;
    hook = Hooks.on("renderSidebarTab", (tab) => {
        if (tab instanceof CombatTracker) {
            Hooks.off("renderSidebarTab", hook);
            if(game.combat?.active) {
                new CONFIG.combatTrackerDock.CombatDock(game.combat).render(true);
            } else {
                ui.combatDock?.close();
            }
        }
    })
});

Hooks.on('ready', () => {
    if(game.combat?.active && !ui.combatDock && game.settings.get("core", "noCanvas")) {
        new CONFIG.combatTrackerDock.CombatDock(game.combat).render(true);
    }
});

Hooks.on("renderCombatTrackerConfig", (app, html, data) => {
    if(!game.user.isGM) return;
    const attributes = TokenDocument.implementation.getTrackedAttributes();
    attributes.bar.forEach(a => a.push("value"));
    const attributeChoices = TokenDocument.implementation.getTrackedAttributeChoices(attributes)
    const resource = game.settings.get(MODULE_ID, "resource");
    const portraitResource = game.settings.get(MODULE_ID, "portraitResource");

    const fg = document.createElement("div");
    fg.classList.add("form-group");
    fg.innerHTML = `
    <label>${game.i18n.localize('COMBAT.Resource')} 2</label>
    <select name="flags.${MODULE_ID}.resource">
    <option value="">${game.i18n.localize("None")}</option>
        ${Object.entries(attributeChoices).map(([key, value]) => `<optgroup label="${key}">` + value.map(v => `<option ${v == resource ? "selected" : ""} value="${v}">${v}</option>`).join("") + "</optgroup>").join("")}
    </select>
    <p class="notes">${game.i18n.localize('COMBAT.ResourceHint')}</p>
    `;

    html[0].querySelector(`select[name="resource"]`).closest(".form-group").appendChild(fg);

    const portraitFg = document.createElement("div");
    portraitFg.classList.add("form-group");
    portraitFg.innerHTML = `
    <label>${game.i18n.localize(`${MODULE_ID}.combatConfig.portraitResource.label`)}</label>
    <select name="flags.${MODULE_ID}.portraitResource">
    <option value="">${game.i18n.localize("None")}</option>
        ${attributes.bar.map(v => `<option ${v == portraitResource ? "selected" : ""} value="${v}">${v}</option>`).join("")}   
    </select>
    <p class="notes">${game.i18n.localize(`${MODULE_ID}.combatConfig.portraitResource.hint`)}</p>
    `;

    html[0].querySelector(`select[name="flags.${MODULE_ID}.resource"]`).closest(".form-group").appendChild(portraitFg);

    const button = document.createElement("button");
    button.innerHTML = `<i class="fa-solid fa-gears"></i> ` + game.i18n.localize(`${MODULE_ID}.configureCarousel`);

    button.addEventListener("click", (e) => {
        e.preventDefault();
        new SettingsConfig().render(true)
        Hooks.once("renderSettingsConfig", (app, html, data) => {
            html[0].querySelector('a[data-tab="combat-tracker-dock"]').click();
        });
    });

    //find last form group
    const lastFormGroup = html[0].querySelectorAll(".form-group")[html[0].querySelectorAll(".form-group").length - 1];
    lastFormGroup.appendChild(button);

    app.setPosition({height: "auto"});
});

Hooks.on("closeCombatTrackerConfig", async (app, html, data) => {
    if (!game.user.isGM) return;
    const resource = html[0].querySelector(`select[name="flags.${MODULE_ID}.resource"]`).value;
    await game.settings.set(MODULE_ID, "resource", resource);
    const portraitResource = html[0].querySelector(`select[name="flags.${MODULE_ID}.portraitResource"]`).value;
    await game.settings.set(MODULE_ID, "portraitResource", portraitResource);
});
