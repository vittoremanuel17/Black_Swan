// src/systems/Inventory.js
import { INVENTORY_CONFIG } from '../config.js';

export class Inventory extends Phaser.GameObjects.Container {
    constructor(scene, gameSceneSource) {
        super(scene, 0, 0);
        this.scene = scene;
        this.gameScene = gameSceneSource || scene; 
        this.isVisible = false;
        
        this.slots = [];
        this.items = []; 
        this.selectedItem = null; 

        this.initInventoryUI();
        this.setupEventListeners();
        this.setScrollFactor(0);
        this.setDepth(50);

        const savedData = this.scene.registry.get('playerInventory') || [];
        savedData.forEach(savedItem => {
            this.addItemVisualsOnly(savedItem.id, savedItem.data);
        });
    }

    initInventoryUI() {
        const { SLOT_SIZE, SLOT_PADDING, COLUMNS, ROWS, BACKGROUND_SCALE } = INVENTORY_CONFIG;

        this.background = this.scene.add.image(0, 0, 'inventory_background')
            .setScale(BACKGROUND_SCALE)
            .setOrigin(0.5);
        this.add(this.background);

        const inventoryWidth = COLUMNS * (SLOT_SIZE + SLOT_PADDING) - SLOT_PADDING;
        const inventoryHeight = ROWS * (SLOT_SIZE + SLOT_PADDING) - SLOT_PADDING;

        this.background.displayWidth = inventoryWidth + (SLOT_SIZE * 0.5); 
        this.background.displayHeight = inventoryHeight + (SLOT_SIZE * 0.5);

        this.x = this.scene.scale.width / 2;
        this.y = this.scene.scale.height / 2;

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLUMNS; c++) {
                const xOffset = (c - (COLUMNS - 1) / 2) * (SLOT_SIZE + SLOT_PADDING);
                const yOffset = (r - (ROWS - 1) / 2) * (SLOT_SIZE + SLOT_PADDING);

                const slot = this.scene.add.image(xOffset, yOffset, 'slot_background')
                    .setDisplaySize(SLOT_SIZE, SLOT_SIZE)
                    .setOrigin(0.5);
                this.add(slot);
                this.slots.push({ sprite: slot, occupied: false, item: null });
            }
        }

        this.setVisible(false);
        this.scene.add.existing(this);
    }

    setupEventListeners() {
        this.scene.input.keyboard.on('keydown-' + INVENTORY_CONFIG.INVENTORY_KEY, this.toggleInventory, this);
        
        if (this.gameScene) {
            this.gameScene.events.on('itemCollected', this.addItem, this);
        }    
    }

    toggleInventory() {
        this.isVisible = !this.isVisible;
        this.setVisible(this.isVisible);
    }

    addItem(itemId, itemData) {
        const success = this.addItemVisualsOnly(itemId, itemData);

        if (success) {
            this.saveToRegistry();
            console.log(`Item "${itemId}" salvo no inventário global!`);
        }
    }

    addItemVisualsOnly(itemId, itemData) {
        const availableSlot = this.slots.find(slot => !slot.occupied);

        if (availableSlot) {
            const itemIcon = this.scene.add.image(availableSlot.sprite.x, availableSlot.sprite.y, itemId)
                .setDisplaySize(INVENTORY_CONFIG.SLOT_SIZE * 0.8, INVENTORY_CONFIG.SLOT_SIZE * 0.8)
                .setOrigin(0.5)
                .setScrollFactor(0);

            itemIcon.setInteractive({ useHandCursor: true });
            itemIcon.on('pointerdown', () => {
                this.selectItem(itemId, itemIcon);
            });

            this.add(itemIcon);

            availableSlot.occupied = true;
            availableSlot.item = { id: itemId, data: itemData, icon: itemIcon };
            this.items.push(availableSlot.item);
            
            return true;
        } else {
            console.log('Inventário cheio!');
            return false; 
        }
    }

    removeItem(itemId) {
        const itemIndex = this.items.findIndex(item => item.id === itemId);
        
        if (itemIndex > -1) {
            const removedItem = this.items.splice(itemIndex, 1)[0];
            const slot = this.slots.find(s => s.item === removedItem);

            if (slot) {
                slot.occupied = false;
                slot.item = null;
                removedItem.icon.destroy();
                
                this.saveToRegistry();
            }
        }
        
        if (this.selectedItem && this.selectedItem.id === itemId) {
            this.deselectItem();
        }
    }

    selectItem(itemId, iconSprite) {
        if (this.selectedItem && this.selectedItem.id === itemId) {
            this.deselectItem();
            return;
        }

        this.deselectItem();
        this.selectedItem = { id: itemId, icon: iconSprite };
        
        iconSprite.setTint(0x00ff00); 
        console.log(`Item selecionado: ${itemId}`);
    }

    deselectItem() {
        if (this.selectedItem) {
            this.selectedItem.icon.clearTint(); 
            this.selectedItem = null;
        }
    }

    consumeSelectedItem() {
        if (this.selectedItem) {
            this.removeItem(this.selectedItem.id);
            this.selectedItem = null;
        }
    }

    saveToRegistry() {
        const dataToSave = this.items.map(item => ({
            id: item.id,
            data: item.data
        }));

        this.scene.registry.set('playerInventory', dataToSave);
    }
}