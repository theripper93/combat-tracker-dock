import { initConfig } from './config.js';
import {registerSettings} from './settings.js';
import {CombatDock} from './app/CombatDock.js';
import {CombatantPortrait} from './app/CombatantPortrait.js';
import {defaultAttributesConfig, generateDescription} from './systems.js';
import { showWelcome } from './lib/welcome.js';
import "../scss/module.scss";

export const MODULE_ID = 'combat-tracker-dock';

export function getCurrentCombat(){
    return ui.combat.viewed;
}

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

Hooks.on('ready', () => {
    registerSettings();
    initConfig();
    const currentCombat = getCurrentCombat();
    if(currentCombat && !ui.combatDock && game.settings.get("core", "noCanvas")) {
        new CONFIG.combatTrackerDock.CombatDock(currentCombat).render(true);
    }
    showWelcome();
});

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
        const currentCombat = getCurrentCombat();
            if(currentCombat) {
                new CONFIG.combatTrackerDock.CombatDock(currentCombat).render(true);
            } else {
                ui.combatDock?.close();
            }
    })
});


function registerWrappers() {
    if (!game.modules.get("lib-wrapper")?.active) return;

    libWrapper.register(MODULE_ID, "Combatant.prototype.visible", function (wrapped, ...args) {
        const visible = wrapped(...args);
        if (!ui.combatDock?.rendered) return visible;
        const cDVisible = ui.combatDock.portraits.find((p) => p.combatant == this)?.firstTurnHidden;
        return visible && !cDVisible;
    });
}

function registerHotkeys() {
    game.keybindings.register(MODULE_ID, "combatPrev", {
        name: `${MODULE_ID}.hotkeys.combatPrev.name`,
        editable: [{ key: "KeyN", modifiers: [foundry.helpers.interaction.KeyboardManager.MODIFIER_KEYS.SHIFT] }],
        restricted: false,
        onDown: () => {},
        onUp: () => {
            if (!game.combat) return;
            const isOwner = game.combat.combatant?.isOwner;
            if (!isOwner) return;
            game.combat.previousTurn();
        },
    });

    game.keybindings.register(MODULE_ID, "combatNext", {
        name: `${MODULE_ID}.hotkeys.combatNext.name`,
        editable: [{ key: "KeyM", modifiers: [foundry.helpers.interaction.KeyboardManager.MODIFIER_KEYS.SHIFT] }],
        restricted: false,
        onDown: () => {},
        onUp: () => {
            if (!game.combat) return;
            const isOwner = game.combat.combatant?.isOwner;
            if (!isOwner) return;
            game.combat.nextTurn();
        },
    });
}
