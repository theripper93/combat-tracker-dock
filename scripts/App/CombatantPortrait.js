import { MODULE_ID } from "../main.js";
import { generateDescription, getInitiativeDisplay, getSystemIcons } from "../systems.js";

export class CombatantPortrait {
    constructor(combatant) {
        this.combatant = combatant;
        this.combat = combatant.combat;
        this.element = document.createElement("div");
        this.element.classList.add("combatant-portrait");
        this.element.setAttribute("data-combatant-id", combatant.id);
        this.element.setAttribute("data-tooltip-class", "combat-dock-tooltip");
        this.resolve = null;
        this.ready = new Promise((res) => (this.resolve = res));
        this._hasTakenTurn = this.combat.round ?? 0 <= 1;
        if (!game.settings.get(MODULE_ID, "hideFirstRound")) this._hasTakenTurn = true;
        this.activateCoreListeners();
        this.renderInner();
    }

    get actor() {
        return this.combatant?.actor;
    }

    get token() {
        return this.combatant?.token?.object;
    }

    get img() {
        const useActor = game.settings.get(MODULE_ID, "portraitImage") === "actor";
        return (useActor ? this.combatant.actor?.img : this.combatant.img) ?? this.combatant.img;
    }

    get name() {
        if (this.combatant.isOwner) return this.combatant.name;
        const displayName = game.settings.get(MODULE_ID, "displayName");
        if (displayName === "owner") return this.combatant.isOwner ? this.combatant.name : "???";
        if (displayName === "default") return this.combatant.name;
        return [CONST.TOKEN_DISPLAY_MODES.HOVER, CONST.TOKEN_DISPLAY_MODES.ALWAYS].includes(this.token?.document?.displayName) ? this.combatant.name : "???";
    }

    get firstTurnHidden() {
        const combatant = this.combatant;
        const hasPermission = (combatant.actor?.permission ?? -10) >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER || combatant.isOwner;
        if (!hasPermission && !this._hasTakenTurn) return true;
        return false;
    }

    activateCoreListeners() {
        this.element.addEventListener("mouseenter", this._onHoverIn.bind(this));
        this.element.addEventListener("mouseleave", this._onHoverOut.bind(this));
    }
    activateListeners() {
        this.element.querySelector(".combatant-wrapper").addEventListener("mousedown", this._onCombatantMouseDown.bind(this));

        (this.element.querySelectorAll(".system-icon") ?? []).forEach((iconEl, index) => {
            const systemIcons = this._systemIcons;
            const icon = systemIcons[index];
            if (icon.callback && icon.enabled) {
                iconEl.addEventListener("click", async (event) => {
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    icon.callback(event, this.combatant, index, icon.id);
                });
            }
        });
    }

    async _onCombatantMouseDown(event) {
        event.preventDefault();

        if (event.target.dataset.action === "player-pass") return this.combat.nextTurn();

        if (!event.target.classList.contains("combatant-wrapper")) return;

        if (event.button === 2) return this.combatant.sheet.render(true);

        const combatant = this.combatant;
        const token = combatant.token;
        if (!combatant.actor?.testUserPermission(game.user, "OBSERVER")) return;
        const now = Date.now();

        // Handle double-left click to open sheet
        const dt = now - this._clickTime;
        this._clickTime = now;
        if (dt <= 250) {
            return combatant.actor?.sheet.render(true);
        }

        // Control and pan to Token object
        if (token?.object) {
            token.object?.control({ releaseOthers: true });
            return canvas.animatePan(token.object.center);
        }
    }

    _onHoverIn(event) {
        if (!this.token) return;
        if ( this.token?.isVisible && !this.token.controlled ) this.token._onHoverIn(event);
    }

    _onHoverOut(event) {
        if (!this.token) return;
        if (this.token.hover) this.token._onHoverOut(event);
    }

    async renderInner() {
        const data = await this.getData();
        this.element.classList.toggle("hidden", !data);
        if (!data) {
            this.resolve(true);
            this.element.innerHTML = "";
            return;
        }
        const template = await renderTemplate("modules/combat-tracker-dock/templates/combatant-portrait.hbs", { ...data });
        const tooltip = await renderTemplate("modules/combat-tracker-dock/templates/combatant-tooltip.hbs", { ...data });
        this.element.innerHTML = template;
        this.element.setAttribute("data-tooltip", tooltip);
        const direction = game.settings.get(MODULE_ID, "direction");
        if (direction == "column") {
            const alignment = game.settings.get(MODULE_ID, "alignment");
            this.element.setAttribute("data-tooltip-direction", alignment == "left" ? TooltipManager.TOOLTIP_DIRECTIONS.RIGHT : TooltipManager.TOOLTIP_DIRECTIONS.LEFT);
        } else {
            this.element.setAttribute("data-tooltip-direction", "");
        }

        this.element.classList.toggle("active", data.css.includes("active"));
        this.element.classList.toggle("visible", data.css.includes("hidden"));
        this.element.classList.toggle("defeated", data.css.includes("defeated"));
        this.element.style.borderBottomColor = this.getBorderColor(this.token?.document);
        this.element.querySelector(".roll-initiative").addEventListener("click", async (event) => {
            event.preventDefault();
            Hooks.once("renderCombatTracker", () => {
                ui.combatDock.updateOrder();
            });
            await this.combatant.combat.rollInitiative([this.combatant.id],{event});
        });
        this.element.querySelectorAll(".action").forEach((action) => {
            action.addEventListener("click", async (event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();
                const dataAction = action.dataset.action;
                switch (dataAction) {
                    case "toggle-hidden":
                        await this.combatant.update({ hidden: !this.combatant.hidden });
                        break;
                    case "toggle-defeated":
                        await ui.combat._onToggleDefeatedStatus(this.combatant);
                        break;
                    case "ping":
                        await ui.combat._onPingCombatant(this.combatant);
                        break;
                }
            });
        });
        this.activateListeners();
        this.resolve(true);
    }

    getResource(resource = null) {
        if (!this.actor || !this.combat) return null;

        resource = resource ?? this.combat.settings.resource;

        let max, value, percentage;

        if (!resource) return { max, value, percentage };

        max = foundry.utils.getProperty(this.actor.system, resource + ".max") ?? foundry.utils.getProperty(this.actor.system, resource.replace("value", "") + "max");

        value = foundry.utils.getProperty(this.actor.system, resource) ?? foundry.utils.getProperty(this.actor.system, resource + ".value");

        if (max !== undefined && value !== undefined && Number.isNumeric(max) && Number.isNumeric(value)) percentage = Math.round((value / max) * 100);

        value = this.validateValue(value);
        max = this.validateValue(max);

        return { max, value, percentage };
    }

    validateValue(value) {
        if (typeof value === "boolean") value = value ? "✓" : "✗";

        if (Array.isArray(value)) value = value.join(", ");

        if (value === "") value = null;

        if (!Number.isNumeric(value) && Object.prototype.toString.call(value) != "[object String]") value = null;

        return value;
    }

    getBarsOrder(hasEffects, r1, r2) {
        const sett = game.settings.get(MODULE_ID, "barsPlacement");
        r1 = !isNaN(r1?.percentage) ? 0 : 1;
        r2 = !isNaN(r2?.percentage) ? 0 : 1;

        switch (sett) {
            case "left":
                return {bar1: 0, bar2: 1, init: 2, effects: 3, bar1ML: 0, bar2ML: 0, initBars: 2.5 - r1 - r2};
            case "right": 
                return {bar1: 2, bar2: 3, init: 0, effects: 1, bar1ML: hasEffects ? 0 : "auto", bar2ML: 0, initBars: 0.5};
            case "twinned":
                return {bar1: 0, bar2: 3, init: 1, effects: 2, bar1ML: 0, bar2ML: hasEffects ? 0 : "auto", initBars: 1.5 - r1};
        }
    }

    get hasPermission() {
        const combatant = this.combatant;
        const playerPlayerPermission = combatant.actor?.hasPlayerOwner && game.settings.get(MODULE_ID, "playerPlayerPermission");
        const hasPermission = (combatant.actor?.permission ?? -10) >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER || combatant.isOwner || playerPlayerPermission;
        return hasPermission;
    }

    async getData() {
        // Format information about each combatant in the encounter
        let hasDecimals = false;
        const combatant = this.combatant;
        const hideDefeated = game.settings.get(MODULE_ID, "hideDefeated");
        if (hideDefeated && combatant.isDefeated) return null;
        const isActive = this.combat.turns.indexOf(combatant) === this.combat.turn;
        if (isActive && this.combat.started) this._hasTakenTurn = true;
        const hasPermission = this.hasPermission;
        if (!hasPermission && !this._hasTakenTurn) return null;
        if (!combatant.visible && !game.user.isGM) return null;
        const trackedAttributes = game.settings
            .get(MODULE_ID, "attributes")
            .map((a) => {
                const resourceData = this.getResource(a.attr);
                const iconHasExtension = a.icon.includes(".");
                return {
                    ...resourceData,
                    icon: iconHasExtension ? `<img src="${a.icon}" />` : `<i class="${a.icon} icon"></i>`,
                    units: a.units || "",
                };
            })
            .filter((a) => a.value !== null && a.value !== undefined);

        const systemIcons = this.getSystemIcons();
        const systemIconCount = systemIcons.resource?.length ?? 0;

        const attributesVisibility = game.settings.get(MODULE_ID, "attributeVisibility");

        const displayDescriptionsSetting = game.settings.get(MODULE_ID, "displayDescriptions");

        let displayDescriptions = false;

        if (displayDescriptionsSetting === "all") displayDescriptions = true;
        else if (displayDescriptionsSetting === "owner") displayDescriptions = hasPermission;

        // Prepare turn data
        const resource = hasPermission ? this.getResource() : null;
        const resource2 = hasPermission ? this.getResource(game.settings.get(MODULE_ID, "resource")) : null;
        const portraitResourceSetting = game.settings.get(MODULE_ID, "portraitResource");
        const portraitResource = hasPermission && portraitResourceSetting ? this.getResource(portraitResourceSetting) : null;
        const initiativeData = this.getInitiativeDisplay();
        initiativeData.isIconImg = initiativeData.icon.includes(".");
        initiativeData.isRollIconImg = initiativeData.rollIcon.includes(".");
        const turn = {
            id: combatant.id,
            name: this.name,
            img: this.img,
            active: this.combat.turns.indexOf(combatant) === this.combat.turn,
            owner: combatant.isOwner,
            isGM: game.user.isGM,
            showPass: combatant.isOwner && !game.user.isGM,
            defeated: combatant.isDefeated,
            hidden: combatant.hidden,
            initiative: combatant.initiative,
            hasRolled: combatant.initiative !== null && combatant.initiative !== undefined,
            hasResource: resource !== null,
            hasResource2: resource2 !== null,
            hasPortraitResource: portraitResource !== null,
            hasPlayerOwner: combatant.actor?.hasPlayerOwner,
            hasPermission: hasPermission,
            showInitiative: game.settings.get(MODULE_ID, "showInitiativeOnPortrait"),
            isInitiativeNaN: combatant.initiative === null || combatant.initiative === undefined,
            initiativeData: initiativeData,
            resource: resource,
            resource2: resource2,
            portraitResource: portraitResource,
            showBars: attributesVisibility == "bars" || attributesVisibility == "both",
            showText: attributesVisibility == "text" || attributesVisibility == "both",
            canPing: combatant.sceneId === canvas.scene?.id && game.user.hasPermission("PING_CANVAS"),
            attributes: trackedAttributes,
            description: this.getDescription(),
            resSystemIcons: systemIcons.resource,
            tooltipSystemIcons: systemIcons.tooltip,
            systemIconsSizeMulti: clamp(0.03, 1/(systemIconCount * 2) ,0.1),
            barsOrder: null,
            displayDescriptions: displayDescriptions,
        };
        if (turn.initiative !== null && !Number.isInteger(turn.initiative)) hasDecimals = true;
        if (turn.initiativeData.value !== null && !Number.isInteger(turn.initiativeData.value)) hasDecimals = true;
        turn.css = [turn.active ? "active" : "", turn.hidden ? "hidden" : "", turn.defeated ? "defeated" : ""].join(" ").trim();

        // Actor and Token status effects
        turn.effects = new Set();
        if (combatant.token) {
            combatant.token.effects.forEach((e) =>
                turn.effects.add({
                    icon: e,
                    label: CONFIG.statusEffects.find((s) => s.icon === e)?.name ?? "",
                }),
            );
            if (combatant.token.overlayEffect) turn.effects.add(combatant.token.overlayEffect);
        }
        turn.hasAttributes = trackedAttributes.length > 0;
        if (combatant.actor) {
            for (const effect of combatant.actor.temporaryEffects) {
                if (effect.statuses.has(CONFIG.specialStatusEffects.DEFEATED)) turn.defeated = true;
                else if (effect.icon) {
                    const description = effect.description ? await TextEditor.enrichHTML(effect.description) : "";
                    const duration = parseInt(effect.duration?.label ?? "");
                    turn.effects.add({ icon: effect.icon, label: effect.name, description: description, duration: duration, hasDuration: !isNaN(duration) });
                }
            }
        }

        turn.hasEffects = turn.effects.size > 0;
        turn.barsOrder = this.getBarsOrder(turn.hasEffects, resource, resource2);
        // Format initiative numeric precision
        const precision = CONFIG.Combat.initiative.decimals;
        if (turn.hasRolled && typeof turn.initiative == "number") turn.initiative = turn.initiative.toFixed(hasDecimals ? precision : 0);
        if (turn.hasRolled && typeof turn.initiativeData.value == "number") turn.initiativeData.value = turn.initiativeData.value.toFixed(hasDecimals ? precision : 0);

        return turn;
    }

    getDescription() {
        const actor = this.actor;
        if (!actor) return null;
        let description = null;

        try {
            description = generateDescription(actor);
        } catch (e) {
            console.error(e);
        }

        return description;
    }

    getSystemIcons() {
        try {
            const sett = game.settings.get(MODULE_ID, "showSystemIcons");
            const icons = sett > 0 ? getSystemIcons(this.combatant) : [];
            const hasPermission = this.hasPermission;
            icons.forEach((icon) => {
                if (icon.callback) icon.hasCallback = true;
                icon.visible ??= hasPermission;
            });
            this._systemIcons = icons;
            if (!icons || !icons?.length) return { resource: null, tooltip: null };
            return {
                resource: sett >= 2 ? icons : null,
                tooltip: sett == 1 || sett == 3 ? icons : null,
            };
        } catch (e) {
            console.error(e);
            return { resource: null, tooltip: null };
        }
    }

    getInitiativeDisplay() {
        return getInitiativeDisplay(this.combatant);
    }

    getBorderColor(tokenDocument) {
        if (!game.settings.get(MODULE_ID, "showDispositionColor") || !tokenDocument) return "#000";
        let color;
        const d = tokenDocument.disposition;
        const colors = CONFIG.Canvas.dispositionColors;
        if (!game.user.isGM && this.isOwner) color = colors.CONTROLLED;
        else if (this.actor?.hasPlayerOwner) color = colors.PARTY;
        else if (d === CONST.TOKEN_DISPOSITIONS.FRIENDLY) color = colors.FRIENDLY;
        else if (d === CONST.TOKEN_DISPOSITIONS.NEUTRAL) color = colors.NEUTRAL;
        else if (d === CONST.TOKEN_DISPOSITIONS.HOSTILE) color = colors.HOSTILE;
        else if (d === CONST.TOKEN_DISPOSITIONS.SECRET && this.isOwner) color = colors.SECRET;
        else color = colors.NEUTRAL;
        color = new Color(color).toString();
        return color;
    }

    destroy() {
        this.element?.remove();
    }
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);