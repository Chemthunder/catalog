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
    get anim(): animation.PathPreset {return this._anim;}
    set anim(i: animation.PathPreset) {this._anim = i;}
    get animSpeed(): number { return this._animSpeed; }
    set animSpeed(i: number) { this._animSpeed = i; }
    get icon(): Image { return this._icon; }
    set icon(i: Image) { this._icon = i; }
}

class MenuInstance {
    _entries: CatalogEntry[];

    constructor() {
        this._entries = [];
    }

    private get entries(): CatalogEntry[] {
        return this._entries;
    }

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

    render() {
        // config
        const buttonSpacing = 1.5;
        const buttonInitialY = 10;
        // end

        const MenuElement = SpriteKind.create();

        let elements: TextSprite[] = [];

        for (let element of this.entries) {
            let index = this.entries.indexOf(element);

            let text = textsprite.create(element.name);
            text.setPosition(scene.screenWidth() / 2, buttonInitialY + (index * text.height * buttonSpacing));
            elements.push(text);
        }

        let cursor = sprites.create(img`
            1 1 1 1
            1 1 1 1
            1 1 1 1
            1 1 1 1
        `, MenuElement);
        let cursorPosition = 0;

        forever(function ctronls() {
            let l = elements.length - 1;

            controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
                if (cursorPosition != l) {
                    cursorPosition++;
                }
            });

            controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
                if (cursorPosition != 0) {
                    cursorPosition--;
                }
            });
        });

        forever(function () {
            cursor.setPosition(elements.get(cursorPosition).x - 30 - elements.get(cursorPosition).text.length, elements.get(cursorPosition).y);
        });
    }
}

let instance = new MenuInstance();
function empty() {}

let entryTest = instance.createEntry("entryTest", empty);
let entryTest2 = instance.createEntry("entryTest2", empty);

instance.render();