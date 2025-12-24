export class PartySystem {
    constructor(scene, leader) {
        this.scene = scene;
        this.leader = leader;   
        this.followers = [];    
        this.history = [];      
        
        this.spacing = 15;      
        this.maxHistory = 150;  
        this.active = false;    
    }

    addFollower(sprite) {
        this.followers.push(sprite);
        sprite.setPosition(this.leader.x, this.leader.y);
    }

    start() {
        this.active = true;
        this.history = []; 
        for(let i = 0; i < this.maxHistory; i++) {
            this.history.push({ x: this.leader.x, y: this.leader.y });
        }
    }

    update() {
        if (!this.active) return;

        const isMoving = this.leader.body.velocity.length() > 0;
        
        if (isMoving) {
            this.history.unshift({ x: this.leader.x, y: this.leader.y });
            if (this.history.length > this.maxHistory) this.history.pop();
        }

        this.followers.forEach((npc, index) => {
            const targetIndex = (index + 1) * this.spacing;

            if (this.history[targetIndex]) {
                const point = this.history[targetIndex];

                const oldX = npc.x;
                npc.x += (point.x - npc.x) * 0.15;
                npc.y += (point.y - npc.y) * 0.15;

                const dx = npc.x - oldX;
                const dy = npc.y - point.y;

                if (dx < -0.1) {
                    npc.setFlipX(true);
                } else if (dx > 0.1) {
                    npc.setFlipX(false);
                }
                
                const isNpcMoving = Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5;

                if (isNpcMoving) {
                    if (npc.anims && !npc.anims.isPlaying) {
                        const animKey = npc.walkAnim || 'walk';
                        if (this.scene.anims.exists(animKey)) {
                            npc.play(animKey, true);
                        }
                    }
                } else {
                    if (npc.anims && npc.anims.isPlaying) {
                        npc.stop();
                        npc.setFrame(0); 
                    }
                }
            }
        });
    }
}