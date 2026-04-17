class CatalogEntry {
    _name: string;
    _func: Function;

    // cosmetica //
    _anim: animation.PathPreset;
    _animSpeed: number;
    _icon: Image;

    constructor(name: string, func: Function) {
        this._name = name;
        this._func = func;
    }

    get name(): string {
        return this._name;
    }

    get func(): Function {
        return this._func;
    }

    // cosmetica //
    get anim(): animation.PathPreset { return this._anim; }
    set anim(i: animation.PathPreset) { this._anim = i; }
    get animSpeed(): number { return this._animSpeed; }
    set animSpeed(i: number) { this._animSpeed = i; }
    get icon(): Image { return this._icon; }
    set icon(i: Image) { this._icon = i; }
}

class MenuInstance {
    _entries: CatalogEntry[];
    _activeSprites: Sprite[];
    _openState: boolean;

    constructor() {
        this._entries = [];
        this._activeSprites = [];
        this._openState = false;
    }

    private get entries(): CatalogEntry[] { return this._entries; }
    private get activeSprites(): Sprite[] { return this._activeSprites; }
    private get openState(): boolean { return this._openState; }
    private set openState(bl: boolean) { this._openState = bl; }

    createEntry(name: string, func: Function): CatalogEntry {
        const generatedVariable = new CatalogEntry(name, func);
        this.entries.push(generatedVariable);
        return generatedVariable;
    }

    editEntryCosmetics(entry: CatalogEntry, anim: animation.PathPreset, animSpeed: number, icon: Image) {
        entry.anim = anim;
        entry.animSpeed = animSpeed;
        entry.icon = icon;
    }

    private applyCosmetics(entry: CatalogEntry, correspondingSprite: TextSprite) {
        let anim = entry.anim;
        let speed = entry.animSpeed;
        let icon = entry.icon;

        correspondingSprite.setIcon(icon);

        animation.runMovementAnimation(
            correspondingSprite,
            animation.animationPresets(anim),
            speed,
            true
        );
    }

    render() {
        this.openState = true;
        // config
        const buttonSpacing = 1.5;
        const buttonInitialY = 10;
        // end

        const MenuElement = SpriteKind.create();

        let elements: TextSprite[] = [];
        let elementsAsEntries: CatalogEntry[] = [];

        for (let element of this.entries) {
            let hasCosmetics =
                (element.anim != null) &&
                (element.animSpeed != 0) &&
                (element.icon != null);


            let index = this.entries.indexOf(element);

            let text = textsprite.create(element.name);
            text.setPosition(scene.screenWidth() / 2, buttonInitialY + (index * text.height * buttonSpacing));

            if (hasCosmetics) {
                this.applyCosmetics(element, text);
            }

            elements.push(text);
            elementsAsEntries.push(element);
            this.activeSprites.push(text);
        }

        let cursor = sprites.create(img`
            1 1 1 1
            1 1 1 1
            1 1 1 1
            1 1 1 1
        `, MenuElement);
        let cursorPosition = 0;

        this.activeSprites.push(cursor);

        forever(function ctronls() {
            if (this.openState == true) {
                let l = elements.length - 1;

                controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
                    if (this.openState == true) {
                        if (cursorPosition != l) {
                            cursorPosition++;
                        }
                    }
                });

                controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
                    if (this.openState == true) {
                        if (cursorPosition != 0) {
                            cursorPosition--;
                        }
                    }
                });

                controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
                    if (this.openState == true) {
                        let entry: CatalogEntry = elementsAsEntries.get(cursorPosition);
                        console.log(entry.name);

                        let func = entry.func();

                        func();
                        this.close();
                    }
                });
            }
        });

        forever(function () {
            if (this.openState == true) {
                cursor.setPosition(elements.get(cursorPosition).x - 30 - elements.get(cursorPosition).text.length, elements.get(cursorPosition).y);
            }
        });
    }

    close() {
        for (let el of this.activeSprites) {
            sprites.destroy(el);
        }
        this.openState = false;
    }
}

game.consoleOverlay.setVisible(true, 1);
let instance = new MenuInstance();

let entryTest = instance.createEntry("entryTest", function () {

});
let entryTest2 = instance.createEntry("entryTest2", function () {
    
});

instance.render();