export function defaultAttributesConfig() {
    return {
        dnd5e: [
            {
                attr: "attributes.hp.value",
                icon: "fa-solid fa-heart",
                units: "HP",
            },
            {
                attr: "attributes.ac.value",
                icon: "fa-solid fa-shield",
                units: "AC",
            },
            {
                attr: "attributes.movement.walk",
                icon: "fa-solid fa-person-running-fast",
                units: "ft.",
            },
            {
                attr: "attributes.spelldc",
                icon: "fa-solid fa-hand-holding-magic",
                units: "Spell DC",
            },
        ],
        "cyberpunk-red-core": [
            {
                attr: "derivedStats.hp.value",
                icon: "fa-solid fa-heart",
                units: "HP",
            },
            {
                attr: "derivedStats.walk.value",
                icon: "fa-solid fa-person-running",
                units: "m/ft",
            },
            {
                attr: "derivedStats.run.value",
                icon: "fa-solid fa-person-running-fast",
                units: "m/ft",
            },
            {
                attr: "externalData.currentArmorHead.value",
                icon: "fa-solid fa-helmet-safety",
                units: "SP",
            },
            {
                attr: "externalData.currentArmorBody.value",
                icon: "fa-solid fa-shirt-tank-top",
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
    };
}

export function generateDescription(actor) {
    switch (game.system.id) {
        case "dnd5e":
            const isNPC = actor.type === "npc";
            const isPC = actor.type === "character";
            if (isNPC) {
                const creatureType = game.i18n.localize(CONFIG.DND5E.creatureTypes[actor.system.details.type.value] ?? actor.system.details.type.custom);
                const cr = actor.system.details.cr >= 1 ? actor.system.details.cr : `1/${1 / actor.system.details.cr}`;
                return `CR ${cr} ${creatureType}`;
            } else if (isPC) {
                const classes = Object.values(actor.classes)
                    .map((c) => c.name)
                    .join(" / ");
                return `Level ${actor.system.details.level} ${classes} (${actor.system.details.race})`;
            } else {
                return null;
            }
        case "swade":
            const { type, system } = actor;
            if (system?.wildcard) {
                return `${game.i18n.localize("SWADE.WildCard")}`;
            } else if (type === "character" || type === "npc") {
                return `${game.i18n.localize("SWADE.Extra")}`;
            } else if (type === "vehicle") {
                return game.i18n.localize("TYPES.Actor.vehicle");
            } else return null;
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
            if (cardString.includes("♥")) suit = "fa-solid fa-heart";
            else if (cardString.includes("♦")) suit = "fa-solid fa-diamond";
            else if (cardString.includes("♣")) suit = "fa-solid fa-club";
            else if (cardString.includes("♠")) suit = "fa-solid fa-spade";
            else if (cardString === "Red J" || cardString === "Blk J") cardString = "JK";

            return {
                value: cardString,
                icon: getCardImage(combatant?.cardString ?? "") ?? suit,
                rollIcon: "fa-regular fa-cards-blank",
            };
        }
        default:
            return {
                value: combatant?.initiative,
                icon: "fa-regular fa-dice-d20",
                rollIcon: "fa-regular fa-dice-d20",
            };
    }
}
