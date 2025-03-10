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

import { MODULE_ID } from "./main.js";
import { registerSystemSetting, getSystemSetting } from "./config.js";

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
                attr: "attributes.spell.dc",
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
        "dnd4e": [
            {
                attr: "defences.ac.value",
                icon: "fas fa-shield",
                units: game.i18n.localize("DND4E.DefAC"),
            },
            {
                attr: "defences.fort.value",
                icon: "fas fa-heart-pulse",
                units: game.i18n.localize("DND4E.DefFort"),
            },
            {
                attr: "defences.ref.value",
                icon: "fas fa-rabbit-running",
                units: game.i18n.localize("DND4E.DefRef"),
            },
            {
                attr: "defences.wil.value",
                icon: "fas fa-brain",
                units: game.i18n.localize("DND4E.DefWil"),
            },
            {
                attr: "attributes.init.value",
                icon: "fas fa-traffic-light-go",
                units: game.i18n.localize("DND4E.Init"),
            },
            {
                attr: "movement.walk.value",
                icon: "fas fa-person-running",
                units: game.i18n.localize("DND4E.Speed"),
            },
            {
                attr: "attributes.hp.max",
                icon: "fas fa-heart",
                units: game.i18n.localize("DND4E.HPShort"),
            },
            {
                attr: "details.bloodied",
                icon: "fas fa-heart-half-stroke",
                units: null,
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
            {
                attr: "attributes.shield.hp.value",
                icon: "fas fa-shield",
                units: "Shield HP",
            },
        ],
        pf1: [
            {
                attr: "attributes.hp.value",
                icon: "fas fa-heart",
                units: "HP",
            },
            {
                attr: "attributes.ac.normal.total",
                icon: "fas fa-shield",
                units: "AC",
            },
            {
                attr: "attributes.ac.touch.total",
                icon: "fas fa-shield-slash",
                units: "Touch AC",
            },
            {
                attr: "attributes.ac.flatFooted.total",
                icon: "fas fa-circle-exclamation",
                units: "Flat Footed AC",
            },
            {
                attr: "attributes.cmd.total",
                icon: "fas fa-hand-fist",
                units: "CMD",
            },
            {
                attr: "attributes.cmd.flatFootedTotal",
                icon: "fas fa-person-circle-exclamation",
                units: "Flat Footed CMD",
            },
            {
                attr: "attributes.sr.total",
                icon: "fas fa-hand-holding-magic",
                units: "Spell Resistance",
            },
            {
                attr: "attributes.speed.land.total",
                icon: "fas fa-person-running",
                units: "ft.",
            },
        ],
        crucible: [
            {
                attr: "resources.health.value",
                icon: "fa-solid fa-heart",
                units: "",
            },
            {
                attr: "resources.morale.value",
                icon: "fa-solid fa-brain",
                units: "",
            },
            {
                attr: "resources.action.value",
                icon: "fa-solid fa-hand-fist",
                units: "",
            },
            {
                attr: "resources.focus.value",
                icon: "fa-solid fa-hand-holding-magic",
                units: "",
            },
            {
                attr: "resources.wounds.value",
                icon: "fa-solid fa-droplet",
                units: "",
            },
            {
                attr: "resources.madness.value",
                icon: "fa-solid fa-head-side-brain",
                units: "",
            },
        ],
        wfrp4e: [
            {
                attr: "status.wounds.value",
                icon: "fa-thin fa-heart",
                units: game.i18n.localize("Wounds"),
            },
            {
                attr: "status.advantage.value",
                icon: "fa-thin fa-swords",
                units: game.i18n.localize("Advantage"),
            },
            {
                attr: "status.fortune.value",
                icon: "fa-thin fa-clover",
                units: game.i18n.localize("Fortune"),
            },
            {
                attr: "status.resolve.value",
                icon: "fa-thin fa-face-pouting",
                units: game.i18n.localize("Resolve"),
            },
            {
                attr: "details.move.run",
                icon: "fa-thin fa-person-running",
                units: game.i18n.localize("yds"),
            },
        ],
        alienrpg: [
            {
                attr: "header.health.value",
                icon: "fas fa-heart",
                units: game.i18n.localize("ALIENRPG.Health"),
            },
            {
                attr: "header.stress.value",
                icon: "fas fa-face-scream",
                units: game.i18n.localize("ALIENRPG.Stress"),
            },
            {
                attr: "general.armor.value",
                icon: "fas fa-shield",
                units: game.i18n.localize("ALIENRPG.Armor"),
            },
            {
                attr: "attributes.speed.value",
                icon: "fas fa-person-running",
                units: game.i18n.localize("ALIENRPG.Speed"),
            },
            {
                attr: "general.mobility.value",
                icon: "fas fa-user-ninja",
                units: game.i18n.localize("ALIENRPG.Skillmobility"),
            },
            {
                attr: "general.observation.value",
                icon: "fas fa-eye",
                units: game.i18n.localize("ALIENRPG.Skillobservation"),
            },
            {
                attr: "attributes.armorrating.value",
                icon: "fas fa-shield",
                units: game.i18n.localize("ALIENRPG.ArmorRating"),
            },
            {
                attr: "attributes.hull.value",
                icon: "fas fa-shuttle-space",
                units: game.i18n.localize("ALIENRPG.HULL"),
            },
            {
                attr: "attributes.armor.value",
                icon: "fas fa-shield",
                units: game.i18n.localize("ALIENRPG.SHIP-ARMOR"),
            },
            {
                attr: "attributes.thrusters.value",
                icon: "fas fa-rocket-launch",
                units: game.i18n.localize("ALIENRPG.THRUSTERS"),
            },
            {
                attr: "attributes.signature.value",
                icon: "fas fa-satellite-dish",
                units: game.i18n.localize("ALIENRPG.SIGNATURE"),
            },
        ],
        exaltedthird: [
            {
                attr: "health.value",
                icon: "fas fa-heart",
                units: game.i18n.localize("Ex3.Health"),
            },
            {
                attr: "evasion.value",
                icon: "fas fa-rabbit-running",
                units: game.i18n.localize("Ex3.Evasion"),
            },
            {
                attr: "parry.value",
                icon: "fas fa-swords",
                units: game.i18n.localize("Ex3.Parry"),
            },
            {
                attr: "soak.value",
                icon: "fas fa-shield",
                units: game.i18n.localize("Ex3.Soak"),
            },
            {
                attr: "hardness.value",
                icon: "fas fa-heart",
                units: game.i18n.localize("Ex3.Hardness"),
            },
            {
                attr: "willpower.value",
                icon: "fas fa-hand-fist",
                units: game.i18n.localize("Ex3.Willpower"),
            },
            {
                attr: "anima.value",
                icon: "fas fa-sun",
                units: game.i18n.localize("Ex3.Anima"),
            },
        ],
        exaltedessence: [
            {
                attr: "health.value",
                icon: "fas fa-heart",
                units: game.i18n.localize("ExEss.Health"),
            },
            {
                attr: "evasion.value",
                icon: "fas fa-rabbit-running",
                units: game.i18n.localize("ExEss.Evasion"),
            },
            {
                attr: "parry.value",
                icon: "fas fa-swords",
                units: game.i18n.localize("ExEss.Parry"),
            },
            {
                attr: "soak.value",
                icon: "fas fa-shield",
                units: game.i18n.localize("ExEss.Soak"),
            },
            {
                attr: "hardness.value",
                icon: "fas fa-heart",
                units: game.i18n.localize("ExEss.Hardness"),
            },
            {
                attr: "power.value",
                icon: "fas fa-hand-fist",
                units: game.i18n.localize("ExEss.Power"),
            },
            {
                attr: "will.value",
                icon: "fas fa-hand-sparkles",
                units: game.i18n.localize("ExEss.Will"),
            },
            {
                attr: "anima.value",
                icon: "fas fa-sun",
                units: game.i18n.localize("ExEss.Anima"),
            },
        ],
        swnr: [
            {
                attr: "health.value",
                icon: "fas fa-heart",
                units: game.i18n.localize("swnr.sheet.hp"),
            },
            {
                attr: "ac",
                icon: "fas fa-shield",
                units: game.i18n.localize("swnr.sheet.ac"),
            },
            {
                attr: "speed",
                icon: "fas fa-person-running-fast",
                units: "m",
            },
            {
                attr: "save.physical",
                icon: "fas fa-hand-fist",
                units: game.i18n.localize("swnr.sheet.vs"),
            },
            {
                attr: "save.evasion",
                icon: "fas fa-feather-pointed",
                units: game.i18n.localize("swnr.sheet.vs"),
            },
            {
                attr: "save.mental",
                icon: "fas fa-brain",
                units: game.i18n.localize("swnr.sheet.vs"),
            },
        ],
        wwn: [
            {
                attr: "hp.value",
                icon: "fas fa-heart",
                units: "Hit Points",
            },
            {
                attr: "details.strain.value",
                icon: "fas fa-ankh",
                units: "System Strain",
            },            
            {
                attr: "aac.value",
                icon: "fas fa-shield",
                units: "Armor Class",
            },
            {
                attr: "movement.base",
                icon: "fas fa-person-running",
                units: "ft. Movement",
            },
            {
                attr: "saves.evasion.value",
                icon: "fas fa-bullseye",
                units: "Evasion Save",
            },
            {
                attr: "saves.mental.value",
                icon: "fas fa-brain",
                units: "Mental Save",                
            },
            {
                attr: "saves.physical.value",
                icon: "fas fa-hand-fist",
                units: "Physical Save",
            },
            {
                attr: "saves.luck.value",
                icon: "fas fa-star",
                units: "Luck Save",
            },
        ],        
        ars: [
            {
                attr: "attributes.hp.value",
                icon: "fas fa-heart",
                units: "Hit Points",
            },         
            {
                attr: "attributes.ac.value",
                icon: "fas fa-shield",
                units: "Armor Class",
            },
            {
                attr: "attributes.movement.value",
                icon: "fas fa-person-running",
                units: "Movement",
            },
            {
                attr: "attributes.thaco.value",
                icon: "fas fa-swords",
                units: "THAC0",
            },            
        ],                
        lancer: [
            { attr: "hp.value", icon: "mdi mdi-heart-outline", units: "" },
            { attr: "structure.value", icon: "cci cci-structure", units: "" },
            { attr: "heat.value", icon: "cci cci-heat", units: "" },
            { attr: "stress.value", icon: "cci cci-reactor", units: "" },
        ],
        dc20rpg: [
            {
                attr: "resources.health.value",
                icon: "fas fa-heart",
                units: "HP",
            },
            {
                attr: "resources.mana.value",
                icon: "fas fa-star",
                units: "MP",
            },
            {
                attr: "resources.stamina.value",
                icon: "fas fa-hand-fist",
                units: "SP",
            },
            {
                attr: "defences.physical.value",
                icon: "fas fa-shield",
                units: "PD",
            },
            {
                attr: "defences.mystical.value",
                icon: "fas fa-wand-magic-sparkles",
                units: "MD",
            },
            {
                attr: "movement.ground.value",
                icon: "fas fa-person-walking",
                units: "Spaces",
            },
        ],
        shadowdark: [
            { attr: "attributes.ac.value", icon: "fas fa-shield", units: "AC" },
            { attr: "attributes.hp.value", icon: "fas fa-heart", units: "HP" },
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
                const creatureType = game.i18n.localize(CONFIG.DND5E.creatureTypes[actor.system.details.type.value]?.label ?? actor.system.details.type.custom);
                const cr = system.details.cr >= 1 || system.details.cr <= 0 ? system.details.cr : `1/${1 / system.details.cr}`;
                return `CR ${cr} ${creatureType}`;
            } else if (isPC) {
                const classes = Object.values(actor.classes)
                    .map((c) => c.name)
                    .join(" / ");
                return `Level ${system.details.level} ${classes} (${system.details.race})`;
            } else {
                return null;
            }
        case "dnd4e":
            switch (type) {
                case "Player Character":
					return `${game.i18n.localize("DND4E.Level")} ${system.details.level} ${system.details.race} ${system.details.class} (${system.details.alignment})`;
                case "NPC":
					return `${CONFIG.DND4E.actorSizes[actor.system.details.size]?.label} ${CONFIG.DND4E.creatureOrigin[actor.system.details.origin]?.label} ${CONFIG.DND4E.creatureType[actor.system.details.type]?.label}`;
				default:
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
                    const classes = [actor.characterClass?.name || "Character"];
                    if (actor.characterBaseClass?.name) {
                        classes.push(actor.characterBaseClass.name);
                    }
                    return classes.join(" - ");
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
        case "crucible":
            if (actor.type === "hero") return `${system.details.ancestry.name} ${system.details.background.name} ${system.details.signatureName ? `(${system.details.signatureName})` : ""}`;
            if (actor.type === "adversary") return `${system.details.taxonomy.name} ${system.details.archetype.name} (${game.i18n.localize("ADVANCEMENT.Level")} ${system.details.level} ${game.i18n.localize("ADVERSARY.Threat" + system.details.threat.charAt(0).toUpperCase() + system.details.threat.slice(1))})`;
        case "wfrp4e":
            switch (type) {
                case "character":
                    return `${actor.Species} ${actor.currentCareer.name}`;
                case "npc":
                    const length = actor.itemTypes.career.length - 1;
                    if (length < 0) {
                        return `${actor.Species}`;
                    } else {
                        const careers = Object.values(actor.itemTypes.career).map((c) => c.name);
                        const career = careers[length];
                        return `${actor.Species} ${career}`;
                    }
                case "creature":
                    return `${actor.Species}`;
                default:
                    return null;
            }
        case "alienrpg":
            switch (type) {
                case "character":
                    let career;
                    if (system.general.career.value == 1) career = game.i18n.localize("ALIENRPG.ColonialMarine");
                    else if (system.general.career.value == 2) career = game.i18n.localize("ALIENRPG.ColonialMarshal");
                    else if (system.general.career.value == 3) career = game.i18n.localize("ALIENRPG.CompanyAgent");
                    else if (system.general.career.value == 4) career = game.i18n.localize("ALIENRPG.Kid");
                    else if (system.general.career.value == 5) career = game.i18n.localize("ALIENRPG.Medic");
                    else if (system.general.career.value == 6) career = game.i18n.localize("ALIENRPG.Mercenary");
                    else if (system.general.career.value == 7) career = game.i18n.localize("ALIENRPG.Officer");
                    else if (system.general.career.value == 8) career = game.i18n.localize("ALIENRPG.Pilot");
                    else if (system.general.career.value == 9) career = game.i18n.localize("ALIENRPG.Roughneck");
                    else if (system.general.career.value == 10) career = game.i18n.localize("ALIENRPG.Scientist");
                    else if (system.general.career.value == 11) career = game.i18n.localize("ALIENRPG.Synthetic");
                    else if (system.general.career.value == 12) career = game.i18n.localize("ALIENRPG.Homebrew");
                    if (actor.itemTypes.specialty.length == 0) return `${career}`;
                    else if (actor.itemTypes.specialty.length == 1) {
                        const specialties = Object.values(actor.itemTypes.specialty).map((c) => c.name);
                        const specialty = specialties[0];
                        return `${career}: ${specialty}`;
                    }
                case "synthetic":
                    let careersynth;
                    if (system.general.career.value == 1) careersynth = game.i18n.localize("ALIENRPG.ColonialMarine");
                    else if (system.general.career.value == 2) careersynth = game.i18n.localize("ALIENRPG.ColonialMarshal");
                    else if (system.general.career.value == 3) careersynth = game.i18n.localize("ALIENRPG.CompanyAgent");
                    else if (system.general.career.value == 4) careersynth = game.i18n.localize("ALIENRPG.Kid");
                    else if (system.general.career.value == 5) careersynth = game.i18n.localize("ALIENRPG.Medic");
                    else if (system.general.career.value == 6) careersynth = game.i18n.localize("ALIENRPG.Mercenary");
                    else if (system.general.career.value == 7) careersynth = game.i18n.localize("ALIENRPG.Officer");
                    else if (system.general.career.value == 8) careersynth = game.i18n.localize("ALIENRPG.Pilot");
                    else if (system.general.career.value == 9) careersynth = game.i18n.localize("ALIENRPG.Roughneck");
                    else if (system.general.career.value == 10) careersynth = game.i18n.localize("ALIENRPG.Scientist");
                    else if (system.general.career.value == 11) careersynth = game.i18n.localize("ALIENRPG.Synthetic");
                    else if (system.general.career.value == 12) careersynth = game.i18n.localize("ALIENRPG.Homebrew");
                    if (actor.itemTypes.specialty.length == 0) return `${careersynth}`;
                    else if (actor.itemTypes.specialty.length == 1) {
                        const specialties = Object.values(actor.itemTypes.specialty).map((c) => c.name);
                        const specialty = specialties[0];
                        return `${careersynth}: ${specialty}`;
                    }
                case "spacecraft":
                    return `${game.i18n.localize("ALIENRPG.MODEL")}: ${system.attributes.model}`;
                default:
                    return null;
            }
        case "exaltedthird":
            switch (type) {
                case "character":
                case "npc":
                    return `${game.i18n.localize("Ex3.Essence")} ${system.essence.value}`;
                default:
                    return null;
            }
        case "exaltedessence":
            switch (type) {
                case "character":
                case "npc":
                    return `${game.i18n.localize("ExEss.Essence")} ${system.essence.value}`;
                default:
                    return null;
            }
        case "swnr":
            switch (type) {
                case "character":
                    return `${game.i18n.localize("swnr.sheet.level")} ${system.level.value} ${system.background} ${system.class}`;
                case "npc":
                    return "NPC";
                case "vehicle":
                    return "Vehicle";
                case "ship":
                    return "Ship";
                case "drone":
                    return "Drone";
                case "mech":
                    return "Mech";
                default:
                    return null;
            }
        case "wwn":
            switch (type) {
                case "Character":
                    return `Level ${system.details.level} ${system.details.background} ${system.details.class}`;
                case "Faction":
                    return "Faction";
                case "Monster":
                    return `${system.hp.hd} hit dice Monster`;
                default:
                    return null;
            }
        case "ars":
            switch (type) {
                case "character":
                    return "Player Character";
                case "lootable":
                    return "Loot";
                case "merchant":
                    return "Merchant";                    
                case "npc":
                    return "Non-Player-Character";
                default:
                    return null;
            }            
        case "lancer":
            return game.lancer.combatTrackerDock?.generateDescription(actor);
        case "shadowdark":
            switch (type) {
                case "Player":
                case "NPC":
                    return `Level: ${system.level.value}`;
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
        case "wfrp4e": {
            return {
                value: combatant?.initiative,
                icon: "far fa-dice-d10",
                rollIcon: "far fa-dice-d10",
            };
        }
        case "alienrpg": {
            return {
                value: combatant?.initiative,
                icon: "far fa-cards-blank",
                rollIcon: "fa-solid fa-cards-blank",
            };
        }
        case "exaltedthird": {
            return {
                value: combatant?.initiative,
                icon: "far fa-dice-d10",
                rollIcon: "far fa-dice-d10",
            };
        }
        case "exaltedessence": {
            return {
                value: combatant?.initiative,
                icon: "far fa-dice-d10",
                rollIcon: "far fa-dice-d10",
            };
        }
        case "lancer":
            return (
                game.lancer.combatTrackerDock?.getInitiativeDisplay(combatant) ?? {
                    value: combatant?.initiative,
                    icon: "fas fa-dice-d20",
                    rollIcon: "fas fa-dice-d20",
                }
            );
        case "dnd4e":
            return {
				value: combatant?.initiative ? parseInt(combatant.initiative).toString() : null,
				icon: "fas fa-dice-d20",
				rollIcon: "fas fa-dice-d20",
			};	
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
 * in the portrait under the tracked resource. If a callback is provided, it will be called on click.
 *
 * Example Icon Object:
 *
 *  {
 *      icon: "fas fa-times",
 *      color: "#e16de1",
 *      enabled: true,
 *      visible: true, // If not provided, defaults to combattant permissions.
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
        case "crucible": {
            const systemData = combatant.actor?.system;
            const alwaysShowActions = getSystemSetting("alwaysShowActions") || undefined;
            const actions = {
                value: systemData.resources.action.value,
                max: systemData.resources.action.max,
            };
            const focus = {
                value: systemData.resources.focus.value,
                max: systemData.resources.focus.max,
            };
            const systemIcons = [];
            for (let i = 0; i < actions.max; i++) {
                systemIcons.push({
                    icon: "fas fa-square",
                    color: "#ff6400",
                    enabled: actions.value > 0,
                    visible: alwaysShowActions,
                });
                actions.value--;
            }
            for (let i = 0; i < focus.max; i++) {
                systemIcons.push({
                    icon: "fas fa-sparkle",
                    color: "#00bbff",
                    enabled: focus.value > 0,
                });
                focus.value--;
            }
            return systemIcons;
        }
        case "alienrpg": {
            if (game.modules.get("alien-actions")?.active && combatant.actor && combatant.actor.type !== "spacecraft") {
                return [
                    {
                        icon: "fas fa-play",
                        fontSize: "1rem",
                        enabled: true,
                        callback: combatant.isOwner
                            ? (event, combatant) => {
                                  const token = combatant.actor.getActiveTokens();
                                  token.forEach((t) => t.toggleEffect(CONFIG.statusEffects.find((eff) => eff.id === "slowAction")));
                              }
                            : null,
                    },
                    {
                        icon: "fas fa-forward",
                        fontSize: "1rem",
                        enabled: true,
                        callback: combatant.isOwner
                            ? (event, combatant) => {
                                  const token = combatant.actor.getActiveTokens();
                                  token.forEach((t) => t.toggleEffect(CONFIG.statusEffects.find((eff) => eff.id === "fastAction")));
                              }
                            : null,
                    },
                ];
            }
        }
        case "lancer":
            return game.lancer.combatTrackerDock?.getSystemIcons(combatant) ?? [];
        default: {
            return [];
        }
    }
}

/**
 * Register settings for specific game systems.
 * This function is called once on startup.
 * When you need to get the setting value, use `getSystemSetting(key) helper`.
 */

export function registerSystemSettings() {
    switch (game.system.id) {
        case "crucible":
            registerSystemSetting("alwaysShowActions", {
                scope: "world",
                config: true,
                type: Boolean,
                default: true,
                onChange: () => ui.combatDock?.refresh(),
            });
            break;
        default:
            break;
    }
}
