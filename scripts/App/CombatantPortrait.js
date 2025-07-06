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
        this.element.style.backgroundImage = `url("${game.settings.get(MODULE_ID, "portraitImageBackground")}")`;
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
        const isFriendly = combatant.token?.disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY;
        if (!hasPermission && !this._hasTakenTurn && !isFriendly) return true;
        return false;
    }

    get isEvent() {
        return this.combatant.flags[MODULE_ID]?.event ?? false;
    }

    get eventResource() {
        if (!this.isEvent) return null;
        const flags = this.combatant.flags[MODULE_ID];
        const {duration, roundCreated} = flags;
        const currentRound = this.combat.round;
        return {
            max: duration,
            value: duration - (currentRound - roundCreated),
            percentage: Math.round((duration - (currentRound - roundCreated)) / duration * 100),
        };
    }

    get eventRoundsLeft() {
        return this.combatant.getFlag(MODULE_ID, "roundsLeft") ?? 0;
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

        if(!this.actor?.isOwner) return;

        (this.element.querySelectorAll(".portrait-effect") ?? []).forEach((effectEl) => {
            //delete on right click
            effectEl.addEventListener("contextmenu", async (event) => {
                event.preventDefault();
                event.stopPropagation();
                const uuid = effectEl.dataset.uuid;
                const effect = await fromUuid(uuid);
                const statusEffect = CONFIG.statusEffects.find((s) => s.img === effect.img);

                const response = await Dialog.confirm({
                    title: game.i18n.localize(`${MODULE_ID}.deleteEffectTitle`),
                    content: game.i18n.localize(`${MODULE_ID}.deleteEffectContent`) + game.i18n.localize(effect?.label ?? statusEffect?.name ?? "") + "?",
                    yes: () => true,
                    no: () => false,
                    defaultYes: false,
                    close: () => false,
                });
                if(!response) return;
                if (!effect) {
                    this.token?.toggleEffect(uuid);
                    return;
                }
                await effect.delete();
            });
        });
    }

    async _onCombatantMouseDown(event) {
        event.preventDefault();

        if (event.target.dataset.action === "player-pass") return this.combat.nextTurn();

        if (!event.target.classList.contains("combatant-wrapper")) return;

        if (event.button === 2) return game.user.isGM && this.combatant.sheet.render(true);

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
        const template = await foundry.applications.handlebars.renderTemplate("modules/combat-tracker-dock/templates/combatant-portrait.hbs", { ...data });
        const tooltip = await foundry.applications.handlebars.renderTemplate("modules/combat-tracker-dock/templates/combatant-tooltip.hbs", { ...data });
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
        const ib = this.element.querySelector(".image-border");
        if(ib) ib.style.backgroundImage = `url("${game.settings.get(MODULE_ID, "portraitImageBorder")}")`;
        this.activateListeners();
        this.resolve(true);
    }

    getResource(resource = null, primary = false) {

        if (this.isEvent && primary) return this.eventResource;

        if (!this.actor || !this.combat) return null;

        resource = resource ?? this.combat.settings.resource;

        let max, value, percentage;

        if (!resource) return { max, value, percentage };

        max = foundry.utils.getProperty(this.actor.system, resource + ".max") ?? foundry.utils.getProperty(this.actor.system, resource.replace("value", "") + "max");

        value = foundry.utils.getProperty(this.actor.system, resource) ?? foundry.utils.getProperty(this.actor.system, resource + ".value");

        if (max !== undefined && value !== undefined && Number.isNumeric(max) && Number.isNumeric(value)) percentage = Math.min(Math.max( Math.round((value / max) * 100) , 0) , 100);

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
        const resource = hasPermission ? this.getResource(null, true) : null;
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
        turn.hasAttributes = trackedAttributes.length > 0;
        if (combatant.actor) {
            for (const effect of combatant.actor.temporaryEffects) {
                if (effect.statuses.has(CONFIG.specialStatusEffects.DEFEATED)) turn.defeated = true;
                else if (effect.img) {
                    const description = effect.description ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(effect.description) : "";
                    const duration = parseInt(effect.duration?.label ?? "");
                    const percent = effect.duration?.remaining / effect.duration?.duration;
                    const uuid = effect.uuid;
                    turn.effects.add({ uuid, img: effect.img, label: effect.name, description: description, duration: duration, percent: isNaN(percent) ? null : percent*100, hasDuration: !isNaN(duration) });
                }
            }
        }

        turn.hasEffects = turn.effects.size > 0;
        turn.barsOrder = this.getBarsOrder(turn.hasEffects, resource, resource2);
        // Format initiative numeric precision
        const precision = CONFIG.Combat.initiative.decimals;
        if (turn.hasRolled && typeof turn.initiative == "number") turn.initiative = turn.initiative.toFixed(hasDecimals ? precision : 0);
        if (turn.hasRolled && typeof turn.initiativeData.value == "number") turn.initiativeData.value = turn.initiativeData.value.toFixed(hasDecimals ? precision : 0);
        if (!game.user.isGM && !combatant.actor?.isOwner && game.settings.get(MODULE_ID, "hideEnemyInitiative")) {            
            turn.initiative = "?";
            turn.initiativeData.value = "?";
        }
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
        
        function getColor() {
            const colors = CONFIG.Canvas.dispositionColors;
            if ( tokenDocument.isOwner && !game.user.isGM ) return colors.CONTROLLED;
            const D = CONST.TOKEN_DISPOSITIONS;
            switch ( tokenDocument.disposition ) {
              case D.SECRET: return colors.SECRET;
              case D.HOSTILE: return colors.HOSTILE;
              case D.NEUTRAL: return colors.NEUTRAL;
              case D.FRIENDLY: return tokenDocument.actor?.hasPlayerOwner ? colors.PARTY : colors.FRIENDLY;
              default: return colors.NEUTRAL;
            }
        }

        return new Color(getColor()).toString();
    }

    destroy() {
        this.element?.remove();
    }
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);