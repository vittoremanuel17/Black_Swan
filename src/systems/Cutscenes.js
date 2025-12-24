export class CutsceneManager {
    constructor(scene) {
        this.scene = scene;
    }

    wait(ms) {
        return new Promise(resolve => this.scene.time.delayedCall(ms, resolve));
    }

    async walkTo(sprite, x, y, duration, anim) {
        return new Promise(resolve => {
            if (sprite.anims) sprite.play(anim, true);
            
            if (x < sprite.x) sprite.setFlipX(true);
            else sprite.setFlipX(false);

            this.scene.tweens.add({
                targets: sprite,
                x: x,
                y: y,
                duration: duration,
                onComplete: () => {
                    if (sprite.anims) sprite.stop();
                    resolve();
                }
            });
        });
    }

    async talk(text, portrait) {
        return new Promise(resolve => {
            this.scene.events.emit('showDialogue', text, portrait);
            this.scene.events.once('dialogueFinished', resolve);
        });
    }

    async playIntro() {
        const { kyle, sofia, player, pedro, aberto, shadow } = this.scene;

        this.scene.canMove = false;
        
        await this.wait(2000);

        aberto.setPosition(272, 232);
        await this.wait(700);

        player.setVisible(true);
        shadow.setVisible(true);
        await this.wait(400);

        aberto.destroy();

        await this.walkTo(player, 100, 270, 5000, 'right');
        
        await Promise.all([
            this.walkTo(kyle, 50, 270, 2000, 'right_kyle'),
            this.walkTo(sofia, 25, 270, 2000, 'right_sofia')
        ]);

        await this.talk("Finalmente voces chegaram! Achei que iam desistir da viagem.", "face_lily");

        await Promise.all([
            this.walkTo(kyle, 200, 270, 4000, 'right_kyle'),
            this.walkTo(player, 250, 270, 4000, 'right'),
            this.walkTo(sofia, 175, 270, 4000, 'right_sofia'),
            this.talk("Nao ia perder minhas ferias... Embora eu jurava que a gente ia pra praia, nao pra uma casa velha no meio do nada.", "face_sofia")
        ]);

        this.walkTo(kyle, 200, 270, 0, 'turn_kyle');
        this.walkTo(sofia, 175, 270, 0, 'turn_sofia');

        await this.talk("Cara... tem cheiro de mofo. Isso nao e ferias, isso e um teste psicologico.", "face_kyle");

        await Promise.all([
            this.walkTo(player, 249, 270, 0, 'left'),
            this.walkTo(kyle, 201, 270, 0, 'right_kyle'),
            this.walkTo(sofia, 176, 270, 0, 'right_sofia')
        ]);

        await this.wait(200);

        await this.talk("Voces sao muito dramaticos. E so uma chacara antiga. Minha mae disse que aqui e super aconchegante.", "face_lily");
        await this.talk("Aconchegante pra ela. Porque pra mim isso aqui tem vibracoes de casa mal-assombrada.", "face_sofia");

        const song = this.scene.calm;
        if (song && song.isPlaying) {
            song.stop();
        }

        this.scene.song = this.scene.sound.add('car');
        this.scene.song.play({ volume: 0.2 });
        
        await this.wait(5000);

        await Promise.all([
            this.talk("Deve ser o Pedro chegando.", "face_lily"),
            this.walkTo(player, 100, 270, 2000, 'left'),
            this.walkTo(kyle, 200, 270, 0, 'right_kyle'),
            this.walkTo(sofia, 170, 270, 0, 'right_sofia')        
        ]);
            
        await this.walkTo(pedro, 50, 270, 1500, 'right_pedro');

        await this.talk("Adivinha quem demorou meia hora porque o GPS perdeu o caminho? EU!", "face_pedro");

        this.scene.song = this.scene.sound.add('calm');
        this.scene.song.play({ loop: true });

        await this.wait(500); 
        await this.walkTo(pedro, 49, 270, 0, 'right_pedro');
        await this.wait(500);
        await this.walkTo(pedro, 50, 270, 0, 'right_pedro');
        await this.wait(500);
        await this.walkTo(pedro, 50, 270, 0, 'turn_pedro');
        await this.wait(500);

        await this.talk("Nossa. Que lugar... vintage.", "face_pedro");
        await this.talk("“Vintage” é a palavra educada pra “sinistro”.", "face_kyle");

        await Promise.all([
            this.talk("Voces vao ver, vai ser legal. A gente so precisa... sei la, fazer algo pra passar o tempo.", "face_lily"),
            this.walkTo(player, 100, 270, 0, 'turn')
        ]);
        
        await this.talk("Tipo nao morrer de tedio?", "face_sofia");
        await this.talk("Ou explorar a casa e ver se tem algum quarto que nao esteja caindo aos pedacos.", "face_pedro");

        this.walkTo(pedro, 50, 270, 0, 'right_pedro');

        this.scene.cameras.main.fadeOut(1000, 0, 0, 0);
        await this.wait(1500);

        // --- PREPARAÇÃO DO PARTY SYSTEM ---
        this.scene.partySystem.addFollower(kyle);
        this.scene.partySystem.addFollower(sofia);
        
        if (this.scene.pedro) {
            this.scene.partySystem.addFollower(this.scene.pedro);
            this.scene.pedro.setVisible(true);
            this.scene.pedro.setDepth(player.depth);
        }

        kyle.setVisible(true);
        sofia.setVisible(true);
        kyle.setDepth(player.depth);
        sofia.setDepth(player.depth);

        this.scene.partySystem.start();
        this.scene.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.canMove = true;
    }

    async playLibrarySecret() {
        const { player, kyle, sofia, pedro, paredeSecreta, imagemPassagem } = this.scene;

        console.log("Iniciando descoberta simplificada...");
        this.scene.canMove = false;

        await this.talk("Este aqui nao tem titulo...", "face_lily");

        // if (this.scene.sound) this.scene.sound.play('som_mecanismo');
        this.scene.cameras.main.shake(500, 0.02);
        
        await this.wait(500);

        this.scene.cameras.main.fadeOut(500, 0, 0, 0);
        await this.wait(600); 

        if (paredeSecreta) paredeSecreta.setVisible(false);
        if (imagemPassagem) imagemPassagem.setVisible(true); 

        this.scene.cameras.main.fadeIn(1500, 0, 0, 0);
        await this.wait(1500);

        await this.talk("Uau... igualzinho nos filmes!", "face_sofia");
        
        if (pedro) {
             this.walkTo(pedro, pedro.x + 20, pedro.y - 20, 500);
             await this.talk("Mano, isso e insano... Quem coloca uma passagem secreta numa chacara?", "face_pedro");
        }

        await this.talk("O que sera que tem ai dentro? A gente precisa ver!", "face_lily");
        await this.talk("Ta, mas... isso e inteligente? Porque parece MUITO perigoso.", "face_kyle");
        await this.talk("Relaxa, Kyle. Se tem como entrar, tem como sair. Vem!", "face_lily");

        this.walkTo(player, imagemPassagem.x, imagemPassagem.y, 1000);
        
        this.scene.cameras.main.fadeOut(1500, 0, 0, 0);
        await this.wait(2000);

        console.log("Indo para o próximo cenário...");
        this.scene.scene.start('Level3'); 
    }
}