import { MODULE_ID } from "../main.js";

export class AddEvent extends FormApplication {
    constructor(combat) {
        super();
        this.combat = combat;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "combat-dock-add-event",
            title: `combat-tracker-dock.add-event.title`,
            template: `modules/combat-tracker-dock/templates/add-event.hbs`,
            width: 400,
            height: "auto",
            closeOnSubmit: true,
        });
    }

    getData() {
        const recentEvents = game.settings.get(MODULE_ID, "events");
        return { recentEvents };
    }

    activateListeners(html) {
        super.activateListeners(html);
        html = html[0];
        html.querySelectorAll(".cct-event").forEach((eventButton) => {
            eventButton.addEventListener("click", (e) => {
                const eventIndex = e.currentTarget.dataset.index;
                const recentEvents = game.settings.get(MODULE_ID, "events");
                const event = recentEvents[eventIndex];
                html.querySelector("[name='name']").value = event.name;
                html.querySelector("[name='img']").value = event.img;
                html.querySelector("[name='initiative']").value = event.initiative;
                html.querySelector("[name='duration']").value = event.duration;
                html.querySelector("[name='hidden']").checked = event.hidden;
            });
        });
    }

    async _updateObject(event, formData) {
        if (!formData.name || !formData.img || (!Number.isNumeric(formData.initiative) && !formData.initiative)) return ui.notifications.error(game.i18n.localize("combat-tracker-dock.add-event.error"));
        this.combat.createEmbeddedDocuments("Combatant", [
            {
                name: formData.name,
                img: formData.img,
                initiative: formData.initiative,
                hidden: formData.hidden || false,
                "flags.combat-tracker-dock": {
                    event: true,
                    duration: formData.duration || false,
                    roundCreated: this.combat.round,
                },
            },
        ]);
        let recentEvents = game.settings.get(MODULE_ID, "events");
        const newRecentEvent = { name: formData.name, img: formData.img, initiative: formData.initiative, duration: formData.duration, hidden: formData.hidden };
        recentEvents = recentEvents.filter((event) => event.name !== newRecentEvent.name && event.img !== newRecentEvent.img);
        recentEvents.unshift(newRecentEvent);
        recentEvents = recentEvents.slice(0, 10);
        await game.settings.set(MODULE_ID, "events", recentEvents);
    }
}
