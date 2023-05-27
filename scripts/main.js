import {registerSettings} from './config.js';

Hooks.once('init', function () {
    registerSettings();
});