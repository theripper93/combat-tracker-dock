/*
 * -------------------------------------------------------------
 * Community Maintained
 * -------------------------------------------------------------
 *
 * This file is maintained by the community and is subject to the
 * terms of the MIT License.
 * 
 * For more information, please visit:
 * https://opensource.org/licenses/MIT
 *
 * -------------------------------------------------------------
 */


import {MODULE_ID} from "./main.js";

/**
 * Returns the default attributes configuration for different game systems.
 *
 * @returns {Object} The default attributes configuration.
 */

export function defaultAttributesConfig() {
    return {
        dnd5e: [
            {
                attr: "attributes.hp.value",
                icon: "fas fa-heart",
                units: "HP",
            },
            {
                attr: "attributes.ac.value",
                icon: "fas fa-shield",
                units: "AC",
            },
            {
                attr: "attributes.movement.walk",
                icon: "fas fa-person-running-fast",
                units: "ft.",
            },
            {
                attr: "attributes.spelldc",
                icon: "fas fa-hand-holding-magic",
                units: "Spell DC",
            },
            {
                attr: "resources.legact.value",
                icon: "far fa-bolt-lightning",
                units: "",
            },
            {
                attr: "resources.legres.value",
                icon: "fas fa-shield-cross",
                units: "",
            },
            {
                attr: "resources.lair.value",
                icon: "fa-solid fa-dungeon",
                units: "",
            },
        ],
        "cyberpunk-red-core": [
            {
                attr: "derivedStats.hp.value",
                icon: "fas fa-heart",
                units: "HP",
            },
            {
                attr: "derivedStats.walk.value",
                icon: "fas fa-person-running",
                units: "m/ft",
            },
            {
                attr: "derivedStats.run.value",
                icon: "fas fa-person-running-fast",
                units: "m/ft",
            },
            {
                attr: "externalData.currentArmorHead.value",
                icon: "fas fa-helmet-safety",
                units: "SP",
            },
            {
                attr: "externalData.currentArmorBody.value",
                icon: "fas fa-shirt-tank-top",
                units: "SP",
            },
        ],
        swade: [
            {
                attr: "wounds.value",
                icon: "fas fa-heart",
                units: game.i18n.localize("SWADE.Wounds"),
            },
            {
                attr: "fatigue.value",
                icon: "fas fa-face-hand-yawn",
                units: game.i18n.localize("SWADE.Fatigue"),
            },
            {
                attr: "bennies.value",
                icon: "fas fa-bullseye",
                units: game.i18n.localize("SWADE.Bennies"),
            },
            {
                attr: "stats.speed.value",
                icon: "fas fa-person-running",
                units: game.i18n.localize("SWADE.Pace"),
            },
            {
                attr: "stats.parry.value",
                icon: "fas fa-swords",
                units: game.i18n.localize("SWADE.Parry"),
            },
            {
                attr: "stats.toughness.value",
                icon: "fas fa-shield",
                units: game.i18n.localize("SWADE.Tough"),
            },
            {
                attr: "stats.toughness.armor",
                icon: "fas fa-helmet-battle",
                units: game.i18n.localize("SWADE.Armor"),
            },
        ],
        pirateborg: [
            {
                attr: "attributes.hp.value",
                icon: "fas fa-heart",
                units: "HP",
            },
            {
                attr: "attributes.luck.value",
                icon: "fas fa-clover",
                units: "Devil's Luck",
            },
            {
                attr: "attributes.rituals.value",
                icon: "fas fa-ankh",
                units: "Rituals",
            },
        ],
        cyphersystem: [
            {
                attr: "pools.might.value",
                icon: "fas fa-hand-fist",
                units: "Might",
            },
            {
                attr: "pools.speed.value",
                icon: "fas fa-person-running",
                units: "Speed",
            },
            {
                attr: "pools.intellect.value",
                icon: "fas fa-brain",
                units: "Intellect",
            },
            {
                attr: "combat.damageTrack.state",
                icon: "fas fa-heart",
                units: "",
            },
            {
                attr: "pools.health.value",
                icon: "fas fa-heart",
                units: "Health",
            },
            {
                attr: "combat.armor",
                icon: "fas fa-shield",
                units: "Armor",
            },
            {
                attr: "combat.damage",
                icon: "fas fa-axe-battle",
                units: "Damage",
            },
        ],
        pf2e: [
            {
                attr: "attributes.hp.value",
                icon: "fas fa-heart",
                units: "HP",
            },
            {
                attr: "attributes.ac.value",
                icon: "fas fa-shield",
                units: "AC",
            },
            {
                attr: "attributes.speed.value",
                icon: "systems/pf2e/icons/default-icons/action.svg",
                units: "ft.",
            },
            {
                attr: "attributes.spellDC.value",
                icon: "fas fa-hand-holding-magic",
                units: "Spell DC",
            },
        ],
    };
}

/**
 * Generates a description for the given actor based on its data.
 * This description is shown in the Tooltip under the actor's name.
 *
 * @param {Object} actor - The actor object.
 * @returns {string|null} The generated description or null if no description is available.
 */

export function generateDescription(actor) {
    const { type, system } = actor;
    switch (game.system.id) {
        case "dnd5e":
            const isNPC = type === "npc";
            const isPC = type === "character";
            if (isNPC) {
                const creatureType = game.i18n.localize(CONFIG.DND5E.creatureTypes[actor.system.details.type.value] ?? actor.system.details.type.custom);
                const cr = system.details.cr >= 1 ? system.details.cr : `1/${1 / system.details.cr}`;
                return `CR ${cr} ${creatureType}`;
            } else if (isPC) {
                const classes = Object.values(actor.classes)
                    .map((c) => c.name)
                    .join(" / ");
                return `Level ${system.details.level} ${classes} (${system.details.race})`;
            } else {
                return null;
            }
        case "swade":
            if (system?.wildcard) return `${game.i18n.localize("SWADE.WildCard")}`;
            switch (type) {
                case "character":
                case "npc":
                    return `${game.i18n.localize("SWADE.Extra")}`;
                case "vehicle":
                    return game.i18n.localize("TYPES.Actor.vehicle");
                default:
                    return null;
            }
        case "pirateborg":
            switch (type) {
                case "character":
                    return "Character";
                case "creature":
                    return "Creature";
                case "vehicle":
                case "vehicle_npc":
                    return "Ship";
                default:
                    return null;
            }
        case "cyphersystem":
            switch (type) {
                case "pc":
                    return "Character";
                case "npc":
                    return "Creature";
                case "companion":
                    return "Companion";
                case "community":
                    return "Community";
                case "vehicle":
                    return "Vehicle";
                case "marker":
                    return "Marker";
                default:
                    return null;
            }
        case "pf2e":
            switch (type) {
                case "character":
                    return `Level ${system.details.level.value} ${system.details.class.name} (${system.details.ancestry.name})`;
                default:
                    return null;
            }
    }
}

/**
 * Retrieves the display information for the initiative of a combatant based on the game system.
 * The icon can be both a font-awesome icon or an image.
 *
 * @param {Object} combatant - The combatant object.
 * @returns {Object} The initiative display information, including value, icon, and roll icon.
 */

export function getInitiativeDisplay(combatant) {
    switch (game.system.id) {
        case "swade": {
            let suit = "";
            const getCardImage = (cardstr) => {
                return Array.from(game.cards.get(game.settings.get("swade", "actionDeck")).cards).find((c) => c.description === cardstr)?.img;
            };
            let cardString = combatant?.cardString ?? "";
            if (cardString.includes("♥")) suit = "fas fa-heart";
            else if (cardString.includes("♦")) suit = "fas fa-diamond";
            else if (cardString.includes("♣")) suit = "fas fa-club";
            else if (cardString.includes("♠")) suit = "fas fa-spade";
            else if (cardString === "Red J" || cardString === "Blk J") cardString = "JK";

            return {
                value: cardString,
                icon: getCardImage(combatant?.cardString ?? "") ?? suit,
                rollIcon: "far fa-cards-blank",
            };
        }
        default:
            return {
                value: combatant?.initiative,
                icon: "far fa-dice-d20",
                rollIcon: "far fa-dice-d20",
            };
    }
}

/**
 * Retrieves system icons for the given actor based on the game system.
 * These icons can be shown both at the bottom of the tooltip and
 * in the portrait under the tracked resource.
 *
 * Example Icon Object:
 *
 *  {
 *      icon: "fas fa-times",
 *      color: "#e16de1",
 *      enabled: true,
 *      callback: (event, combatant, iconIndex, iconId) => { },
 *      id: "my-button",
 *      fontSize: "1rem",
 *  }
 *
 * @param {Object} actor - The actor object.
 * @returns {Array} An array of system icons with their respective properties.
 */

export function getSystemIcons(combatant) {
    switch (game.system.id) {
        case "dnd5e": {
            if (game.modules.get("midi-qol")?.active && combatant.actor) {
                const getMidiFlag = (actionType) => {
                    const flag = combatant.actor.getFlag("midi-qol", "actions") ?? {};
                    return flag[actionType] ?? false;
                };
                const toggleMidiFlag = (actionType) => {
                    const flag = combatant.actor.getFlag("midi-qol", "actions") ?? {};
                    flag[actionType] = !(flag[actionType] ?? false);
                    combatant.actor.setFlag("midi-qol", "actions", flag);
                };
                return [
                    {
                        icon: "fas fa-circle",
                        color: getMidiFlag("action") ? "#888888" : "green",
                        enabled: true,
                        callback: combatant.isOwner ? () => toggleMidiFlag("action") : null,
                    },
                    {
                        icon: "fas fa-triangle",
                        color: getMidiFlag("bonus") ? "#888888" : "#ff9f4c",
                        enabled: true,
                        callback: combatant.isOwner ? () => toggleMidiFlag("bonus") : null,
                    },
                    {
                        icon: "fas fa-sparkle",
                        color: getMidiFlag("reaction") ? "#888888" : "#e16de1",
                        enabled: true,
                        callback: combatant.isOwner ? () => toggleMidiFlag("reaction") : null,
                    },
                ];
            }
            return [
                {
                    icon: "fas fa-circle",
                    color: combatant.getFlag(MODULE_ID, "action") ?? true ? "green" : "#888888",
                    enabled: true,
                    callback: combatant.isOwner
                        ? (event, combatant, iconIndex, iconId) => {
                              combatant.setFlag(MODULE_ID, "action", !(combatant.getFlag(MODULE_ID, "action") ?? true));
                          }
                        : null,
                },
                {
                    icon: "fas fa-triangle",
                    color: combatant.getFlag(MODULE_ID, "bonus") ?? true ? "#ff9f4c" : "#888888",
                    enabled: true,
                    callback: combatant.isOwner
                        ? (event, combatant, iconIndex, iconId) => {
                              combatant.setFlag(MODULE_ID, "bonus", !(combatant.getFlag(MODULE_ID, "bonus") ?? true));
                          }
                        : null,
                },
                {
                    icon: "fas fa-sparkle",
                    color: combatant.getFlag(MODULE_ID, "reaction") ?? true ? "#e16de1" : "#888888",
                    enabled: true,
                    callback: combatant.isOwner
                        ? (event, combatant, iconIndex, iconId) => {
                              combatant.setFlag(MODULE_ID, "reaction", !(combatant.getFlag(MODULE_ID, "reaction") ?? true));
                          }
                        : null,
                },
            ];
        }
        default: {
            return [];
        }
    }
}
