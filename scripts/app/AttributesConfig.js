import { MODULE_ID} from "../main.js";
import Sortable from "../sortable.js";
import { HandlebarsApplication, mergeClone } from "../lib/utils.js";

export class AttributesConfig extends HandlebarsApplication {
    constructor () {
        super();
    }

    static get DEFAULT_OPTIONS() {
        return mergeClone(super.DEFAULT_OPTIONS, {
            tag: "form",
            id: "combat-dock-attributes-config",
            window: {
                title: `${MODULE_ID}.settings.attributesMenu.name`,
                contentClasses: ["standard-form"],
            },
            actions: {
                onAdd: this.onAdd,
                onReset: this.onReset,
            },
            form: {
                handler: this.#onSubmit,
                closeOnSubmit: true,
            },
        });
    }

    static get PARTS() {
        return {
            content: {
                template: `modules/combat-tracker-dock/templates/attributes-config.hbs`,
                classes: ["standard-form", "scrollable"],
            },
            footer: {
                template: "templates/generic/form-footer.hbs",
            },
        };
    }

    _prepareContext(options) {
        const attributes = TokenDocument.implementation.getTrackedAttributes();
        attributes.bar.forEach(a => a.push("value"));
        const attributeChoices = (TokenDocument.implementation.getTrackedAttributeChoices(attributes));

        const saveButton = {
            type: "submit",
            action: "submit",
            icon: "fas fa-save",
            label: "combat-tracker-dock.settings.attributesMenu.form.save",
        };
        const resetButton = {
            type: "button",
            action: "onReset",
            icon: "fas fa-undo",
            label: "combat-tracker-dock.settings.attributesMenu.form.reset",
        };
        const addButton = {
            type: "button",
            action: "onAdd",
            icon: "fas fa-plus",
            label: "combat-tracker-dock.settings.attributesMenu.form.add",
        };

        return {attributes: game.settings.get(MODULE_ID, "attributes"), attributeChoices, buttons: [saveButton, resetButton, addButton]};
    }
    
    _onRender(context, options) {
        super._onRender(context, options);
        const html = this.element;
        html.querySelectorAll(".attributePicker").forEach((picker) => {
            picker.addEventListener("change", (event) => {
                const value = event.target.value;
                const attributeInput = event.target.closest(".form-group").querySelector(".attr");
                attributeInput.value = value;
            });
        });
        Sortable.create(html.querySelector("ul"), {
            animation: 200,
            filter: "input",
            preventOnFilter: false,
        });
    }

    static async onAdd(event) {
        event.preventDefault();
        await this._saveData();
        const attributes = game.settings.get(MODULE_ID, "attributes");
        attributes.push({
            attr: "",
            icon: "",
            units: "",
        });
        await game.settings.set(MODULE_ID, "attributes", attributes);
        this.render({ force: true });
    }

    static async onReset(event) {
        event.preventDefault();
        const response = await foundry.applications.api.DialogV2.confirm({
            window: { title: `${MODULE_ID}.settings.attributesMenu.reset` },
            content: game.i18n.localize(`${MODULE_ID}.settings.attributesMenu.resetWarning`),
        });
        if(response) {
            const defaultSett = game.settings.settings.get("combat-tracker-dock.attributes").default;
            await game.settings.set(MODULE_ID, "attributes", defaultSett);
            this.render({ force: true });
        }
    }

    async _saveData() {
        let attributes = this._getSubmitData();
        attributes = attributes.filter((attr) => attr.attr !== "");
        await game.settings.set(MODULE_ID, "attributes", attributes);
    }

    static async #onSubmit(event) {
        event.preventDefault();
        await this._saveData();
        this.close();
    }

    _getSubmitData() {
        let data = [];
        const li = this.element.querySelectorAll("li");
        for (let i = 0; i < li.length; i++) {
            const attr = li[i].querySelector(".attr").value;
            const icon = li[i].querySelector(".icon").value;
            const units = li[i].querySelector(".units").value;
            data.push({attr, icon, units});
        }
        return data;
    }
}