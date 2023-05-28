import { MODULE_ID } from "../main.js";

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
        const data = await this.getData();
        const template = await renderTemplate("modules/combat-tracker-dock/templates/combatant-portrait.hbs", {...data});
        const tooltip = await renderTemplate("modules/combat-tracker-dock/templates/combatant-tooltip.hbs", {...data});
        this.element.innerHTML = template;
        this.element.setAttribute("data-tooltip", tooltip);
    }

    getResource(resource = null) {
        if (!this.actor || !this.combat) return null;
        
        resource = resource ?? this.combat.settings.resource;

        let max, value, percentage;
        
        max = foundry.utils.getProperty(this.actor.system, resource+".max") ?? foundry.utils.getProperty(this.actor.system, resource.replace("value", "")+"max")

        value = foundry.utils.getProperty(this.actor.system, resource) ?? foundry.utils.getProperty(this.actor.system, resource+".value")

        if(max !== undefined && value !== undefined) percentage = Math.round((value / max) * 100);

        return {max, value, percentage};
    }

    getData() {
        // Format information about each combatant in the encounter
        let hasDecimals = false;
        const combatant = this.combatant;
        if (!combatant.visible) return null;
        const trackedAttributes = game.settings.get(MODULE_ID, "attributes").map((a) => {

            const resourceData = this.getResource(a.attr);
            const iconHasExtension = a.icon.includes(".");
            return {
                ...resourceData,
                icon: iconHasExtension ? `<img src="${a.icon}" />` : `<i class="${a.icon}"></i>`,
                units: a.units || "",
            }
        });
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
            attributes: trackedAttributes,
        };
        if (turn.initiative !== null && !Number.isInteger(turn.initiative)) hasDecimals = true;
        turn.css = [turn.active ? "active" : "", turn.hidden ? "hidden" : "", turn.defeated ? "defeated" : ""].join(" ").trim();

        // Actor and Token status effects
        turn.effects = new Set();
        if (combatant.token) {
            combatant.token.effects.forEach((e) => turn.effects.add(
                {
                    icon: e,
                    label: CONFIG.statusEffects.find((s) => s.icon === e)?.label ?? "",
                }));
            if (combatant.token.overlayEffect) turn.effects.add(combatant.token.overlayEffect);
        }
        if (combatant.actor) {
            for (const effect of combatant.actor.temporaryEffects) {
                if (effect.statuses.has(CONFIG.specialStatusEffects.DEFEATED)) turn.defeated = true;
                else if (effect.icon) turn.effects.add({icon: effect.icon, label: effect.label});
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
