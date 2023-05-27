export class Portrait{
    constructor (combatant) {
        this.combatant = combatant;
        this.element = null;
    }

    async render() { }

    destroy() {
        this.element?.remove();
    }
}