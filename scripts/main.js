import {registerSettings} from './config.js';
import {CombatDock} from './App/Tracker.js';

export const MODULE_ID = 'combat-tracker-dock';

Hooks.once('init', function () {
    registerSettings();
    globalThis.CombatDock = CombatDock;
});