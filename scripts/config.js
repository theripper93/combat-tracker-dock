import { MODULE_ID } from "./main.js";

export function initConfig() {

    Hooks.on("renderCombatTrackerConfig", (app, html, data) => {
        if (!game.user.isGM) return;
        const attributes = TokenDocument.implementation.getTrackedAttributes();
        attributes.bar.forEach(a => a.push("value"));
        const attributeChoices = TokenDocument.implementation.getTrackedAttributeChoices(attributes)
        attributeChoices.unshift({label: "None", value: ""})
        const attributeBarChoices = TokenDocument.implementation.getTrackedAttributeChoices({bar: attributes.bar, value: []})
        attributeBarChoices.unshift({label: "None", value: ""})
        const compiled = Handlebars.compile(`<select name="flags.${MODULE_ID}.resource">{{selectOptions options selected=value}}</select>`)
        const compiled2 = Handlebars.compile(`<select name="flags.${MODULE_ID}.portraitResource">{{selectOptions options selected=value}}</select>`)
        const selectResourceHtml = compiled({options: attributeChoices, value: game.settings.get(MODULE_ID, "resource")})
        const portraitResource = game.settings.get(MODULE_ID, "portraitResource");
        const selectPortraitResourceHtml = compiled2({options: attributeBarChoices, value: portraitResource})

        const fg = document.createElement("div");
        fg.classList.add("form-group");
        fg.innerHTML = `
        <label>${game.i18n.localize('COMBAT.CONFIG.FIELDS.core.combatTrackerConfig.resource.label')} 2</label>
        ${selectResourceHtml}
        <p class="hint">${game.i18n.localize('COMBAT.CONFIG.FIELDS.core.combatTrackerConfig.resource.hint')}</p>
        `;

        html.querySelector(`select[name="core.combatTrackerConfig.resource"]`).closest(".form-group").appendChild(fg);

        const portraitFg = document.createElement("div");
        portraitFg.classList.add("form-group");
        portraitFg.innerHTML = `
        <label>${game.i18n.localize(`${MODULE_ID}.combatConfig.portraitResource.label`)}</label>
        ${selectPortraitResourceHtml}
        <p class="hint">${game.i18n.localize(`${MODULE_ID}.combatConfig.portraitResource.hint`)}</p>
        `;

        html.querySelector(`select[name="flags.${MODULE_ID}.resource"]`).closest(".form-group").appendChild(portraitFg);

        const button = document.createElement("button");
        button.innerHTML = `<i class="fa-solid fa-gears"></i> ` + game.i18n.localize(`${MODULE_ID}.configureCarousel`);

        button.addEventListener("click", (e) => {
            e.preventDefault();
            new foundry.applications.settings.SettingsConfig().render(true)
            Hooks.once("renderSettingsConfig", (app, html, data) => {
                html.querySelector('button[data-tab="combat-tracker-dock"]').click();
            });
        });

        //find last form group
        const lastFormGroup = html.querySelectorAll(".form-group")[html.querySelectorAll(".form-group").length - 1];
        lastFormGroup.appendChild(button);

        html.querySelector(`select[name="flags.${MODULE_ID}.resource"]`).addEventListener("change", async (event) => {
            await game.settings.set(MODULE_ID, "resource", event.target.value);
        });

        html.querySelector(`select[name="flags.${MODULE_ID}.portraitResource"]`).addEventListener("change", async (event) => {
            await game.settings.set(MODULE_ID, "portraitResource", event.target.value);
        });

        app.setPosition({height: "auto"});
    });

}