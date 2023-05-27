import {registerSettings} from './config.js';
import { CombatDock } from './App/Tracker.js';

Hooks.once('init', function () {
    registerSettings();
    globalThis.CombatDock = CombatDock;
});