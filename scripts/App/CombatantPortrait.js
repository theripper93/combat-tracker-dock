export class CombatantPortrait {
    constructor(combatant) {
        this.combatant = combatant;
        this.actor = combatant.actor;
        this.combat = combatant.combat;
        this.element = document.createElement("div");
        this.element.classList.add("combatant-portrait");
        this.element.setAttribute("data-combatant-id", combatant.id);
        this.renderInner();
    }

    get img() {
        const useActor = true;
        return useActor ? this.combatant.actor.img : this.combatant.img;
    }

    async renderInner() {
        const template = await renderTemplate("modules/combat-tracker-dock/templates/combatant-portrait.hbs", {...this.getData()});
        this.element.innerHTML = template;
    }

    getResource() {
        if (!this.actor || !this.combat) return null;
        
        let max, value, percentage;
        
        max = foundry.utils.getProperty(this.actor.system, this.combat.settings.resource+".max") ?? foundry.utils.getProperty(this.actor.system, this.combat.settings.resource.replace("value", "")+"max")

        value = foundry.utils.getProperty(this.actor.system, this.combat.settings.resource) ?? foundry.utils.getProperty(this.actor.system, this.combat.settings.resource+".value")

        if(max !== undefined && value !== undefined) percentage = Math.round((value / max) * 100);

        return {max, value, percentage};
    }

    getData() {
        // Format information about each combatant in the encounter
        let hasDecimals = false;
        const combatant = this.combatant;
        if (!combatant.visible) return null;

        // Prepare turn data
        const resource = combatant.permission >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER ? this.getResource() : null;
        const turn = {
            id: combatant.id,
            name: combatant.name,
            img: this.img,
            active: this.combat.turns.indexOf(combatant) === this.combat.turn,
            owner: combatant.isOwner,
            defeated: combatant.isDefeated,
            hidden: combatant.hidden,
            initiative: combatant.initiative,
            hasRolled: combatant.initiative !== null,
            hasResource: resource !== null,
            resource: resource,
            canPing: combatant.sceneId === canvas.scene?.id && game.user.hasPermission("PING_CANVAS"),
        };
        if (turn.initiative !== null && !Number.isInteger(turn.initiative)) hasDecimals = true;
        turn.css = [turn.active ? "active" : "", turn.hidden ? "hidden" : "", turn.defeated ? "defeated" : ""].join(" ").trim();

        // Actor and Token status effects
        turn.effects = new Set();
        if (combatant.token) {
            combatant.token.effects.forEach((e) => turn.effects.add(e));
            if (combatant.token.overlayEffect) turn.effects.add(combatant.token.overlayEffect);
        }
        if (combatant.actor) {
            for (const effect of combatant.actor.temporaryEffects) {
                if (effect.statuses.has(CONFIG.specialStatusEffects.DEFEATED)) turn.defeated = true;
                else if (effect.icon) turn.effects.add(effect.icon);
            }
        }

        // Format initiative numeric precision
        const precision = CONFIG.Combat.initiative.decimals;
        turn.initiative = turn.initiative.toFixed(hasDecimals ? precision : 0);

        return turn;
    }

    destroy() {
        this.element?.remove();
    }
}
