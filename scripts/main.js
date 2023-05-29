import {registerSettings} from './config.js';
import {CombatDock} from './App/Tracker.js';
import { CombatantPortrait } from './App/CombatantPortrait.js';

export const MODULE_ID = 'combat-tracker-dock';

Hooks.once('init', function () {
    registerSettings();
    CONFIG.combatTrackerDock = {
        CombatDock,
        CombatantPortrait,
        INTRO_ANIMATION_DURATION: 1000,
        INTRO_ANIMATION_DELAY: 0.25,
    }
});

Hooks.on('createCombat', (combat) => {
    if (game.combat === combat) {
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