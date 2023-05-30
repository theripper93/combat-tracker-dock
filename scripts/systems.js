export function defaultAttributesConfig() {
    return {
        "dnd5e": [
            {
                attr: "attributes.hp.value",
                icon: "fa-solid fa-heart",
                units: "HP",
            },
            {
                attr: "attributes.ac.value",
                icon: "fa-solid fa-shield",
            },
            {
                attr: "attributes.movement.walk",
                icon: "fa-solid fa-person-running-fast",
                units: "ft.",
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
                attr: "wildcard",
                icon: "fa-solid fa-cards",
            },
            {
                attr: "wounds.value",
                icon: "fa-solid fa-heart",
            },
            {
                attr: "fatigue.value",
                icon: "fa-solid fa-face-hand-yawn",
            },
            {
                attr: "stats.speed.value",
                icon: "fa-solid fa-person-running",
            },
            {
                attr: "stats.toughness.value",
                icon: "fa-solid fa-shield",
            },
            {
                attr: "stats.parry.value",
                icon: "fa-solid fa-swords",
            },
        ],
    }
}

export function generateDescription(actor) {
    switch (game.system.id) {
        case "dnd5e":
            const isNPC = actor.type === "npc";
            const isPC = actor.type === "character";
            if (isNPC) {
                const creatureType = game.i18n.localize(CONFIG.DND5E.creatureTypes[actor.system.details.type.value] ?? actor.system.details.type.custom);
                const cr = actor.system.details.cr >= 1 ? actor.system.details.cr : `1/${1/actor.system.details.cr}`
                return `CR ${cr} ${creatureType}`
            } else if (isPC) {
                const classes = Object.values(actor.classes).map(c => c.name).join(" / ");
                return `Level ${actor.system.details.level} ${classes} (${actor.system.details.race})`
            } else {
                return null;
            }
    }
}

export function getInitiativeDisplay(combatant) {
    switch (game.system.id) {
        case "swade": {
            let suit = "";
            const useImg = true;
            const getCardImage = (cardstr) => {
                if(!useImg) return null;
                return Array.from(game.cards.get(game.settings.get('swade', 'actionDeck')).cards).find(c => c.description === cardstr)?.img;
            }
            const cardString = combatant?.cardString ?? "";
            if (cardString.includes("♥")) suit = "fa-solid fa-heart";
            if (cardString.includes("♦")) suit = "fa-solid fa-diamond";
            if (cardString.includes("♣")) suit = "fa-solid fa-club";
            if (cardString.includes("♠")) suit = "fa-solid fa-spade";

            return {
                value: useImg ? cardString : cardString.replace("♥", "").replace("♦", "").replace("♣", "").replace("♠", ""),
                icon: getCardImage(cardString) ?? suit,
                rollIcon: "fa-regular fa-cards-blank",
            }
        }
        default:
            return {
                value: combatant?.initiative,
                icon: "fa-regular fa-dice-d20",
                rollIcon: "fa-regular fa-dice-d20",
            }
    }
}
