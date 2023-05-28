import {registerSettings} from './config.js';
import {CombatDock} from './App/Tracker.js';
import { CombatantPortrait } from './App/CombatantPortrait.js';

export const MODULE_ID = 'combat-tracker-dock';

Hooks.once('init', function () {
    registerSettings();
    CONFIG.combatTrackerDock = {
        CombatDock,
        CombatantPortrait,
    }
});

Hooks.on('createCombat', (combat) => {
    if (game.combat === combat) {
        new CONFIG.combatTrackerDock.CombatDock(combat).render(true);
    }
});

Hooks.on('canvasReady', () => {
    if(game.combat) {
        new CONFIG.combatTrackerDock.CombatDock(game.combat).render(true);
    }
});

Hooks.on('ready', () => {
    if(game.combat && !ui.combatDock) {
        new CONFIG.combatTrackerDock.CombatDock(game.combat).render(true);
    }
});