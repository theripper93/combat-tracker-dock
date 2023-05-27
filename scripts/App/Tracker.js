import { CombatantPortrait } from "./CombatantPortrait.js";

export class CombatDock extends Application {
    constructor (combat) {
        super();
        this.combat = combat ?? game.combat;
        this.hooks = [];
        this.setHooks();
    }

    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            id: "combat-dock",
            classes: ["combat-dock"],
            template: `modules/combat-tracker-dock/templates/combat-tracker.hbs`,
            resizable: false,
            popOut: false,
        };
    }

    setHooks() {

    }

    removeHooks() { }

    getData() {
        return {};
    }

    setupCombatants() {
        this.portraits = [];
        this.combat.combatants.forEach(combatant => this.portraits.push(new CombatantPortrait(combatant)));
        const combatantsContainer = this.element[0].querySelector("#combatants");
        combatantsContainer.innerHTML = "";
        this.portraits.forEach(p => combatantsContainer.appendChild(p.element));
    }

    updateCombatant(combatant) {
        const portrait = this.portraits.find(p => p.combatant === combatant);
        if (portrait) portrait.renderInner();
    }

    updateCombatants() {
        this.portraits.forEach(p => p.renderInner());
    }

    activateListeners(html) {
        super.activateListeners(html);
        this.setupCombatants();
        document.querySelector("#ui-top").prepend(this.element[0]);
    }

    async close(...args) {
        this.removeHooks();
        return super.close(...args);
    }
}