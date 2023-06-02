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
        "pf2e": [
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
        "pirateborg": [
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
        ]
    };
}

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
        case "pf2e":
            switch (type) {
                case "character":
                    return `Level ${system.details.level.value} ${system.details.class.name} (${system.details.ancestry.name})`;
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
                    return "Character";
                case "creature":
                    return "Creature";
                case "vehicle":
                case "vehicle_npc":
                    return "Ship";
                default:
                    return null;
            }
    }
}

export function getInitiativeDisplay(combatant) {
    switch (game.system.id) {
        case "swade": {
            let suit = "";
            const getCardImage = (cardstr) => {
                return Array.from(game.cards.get(game.settings.get("swade", "actionDeck")).cards).find(
                    (c) => c.description === cardstr
                )?.img;
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
