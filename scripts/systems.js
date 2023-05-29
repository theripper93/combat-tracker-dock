export const defaultAttributesConfig = {
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