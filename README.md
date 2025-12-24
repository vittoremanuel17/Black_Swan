# Black Swan

Um jogo de aventura Point & Click desenvolvido com Phaser 3 e JavaScript moderno.

## Jogue Agora

Acesse a versão online diretamente pelo navegador:
**[CLIQUE AQUI PARA JOGAR](https://vittoremanuel17.github.io/Black_Swan/)**

---

## Sobre o Projeto

Este projeto foi desenvolvido como parte da disciplina de Prática Profissional Orientada (PPO). O objetivo foi criar uma *engine* de jogo escalável focada em narrativa, exploração e resolução de quebra-cabeças (*puzzles*), aplicando conceitos de Engenharia de Software e Orientação a Objetos.

### Sinopse
Lily e seus amigos chegam a uma antiga chácara para passar as férias, mas descobrem que o local guarda segredos antigos. O jogador deve explorar os cenários, coletar itens e interagir com o ambiente para descobrir passagens secretas e desvendar o mistério.

---

## Destaques Técnicos

No desenvolvimento não foram utilizas ferramentas de "arrastar e soltar". Toda a lógica foi programada do zero utilizando uma arquitetura modular.

### 1. Arquitetura de Cenas Paralelas
Utilização de duas cenas rodando simultaneamente (`GameScene` e `UIScene`). Isso garante que a Interface de Usuário (Inventário e Diálogos) permaneça estática e nítida (Pixel Perfect) independentemente do zoom da câmera ou movimentação do personagem.

### 2. Sistema de Cutscenes (Async/Await)
Implementação de um gerenciador de narrativa (`CutsceneManager`) baseado em **Promises** e JavaScript Assíncrono (`async/await`). Isso permite criar roteiros complexos e sequenciais de forma limpa, evitando o uso excessivo de *timers* e *callbacks*.

### 3. Party System (Movimentação em Grupo)
Implementação de um algoritmo de **Buffer de Histórico de Posições**. O sistema grava as coordenadas do jogador a cada quadro e faz com que os NPCs seguidores percorram o mesmo trajeto com um atraso temporal, criando um efeito orgânico de "fila indiana".

### 4. Persistência de Dados
Uso do **Phaser Registry** para manter o estado do inventário e das variáveis do jogo ao transitar entre diferentes cenas (ex: da Sala para a Biblioteca), garantindo que o progresso não seja perdido.

---

## Tecnologias Utilizadas

*   **Linguagem:** JavaScript (ES6 Modules)
*   **Engine:** [Phaser 3](https://phaser.io/) (Renderização WebGL/Canvas)
*   **Level Design:** [Tiled Map Editor](https://www.mapeditor.org/)
*   **Versionamento:** Git & GitHub

---

## Controles

*   **Setas do Teclado:** Movimentar a personagem (Lily).
*   **Mouse (Clique):** Interagir com objetos, coletar itens e selecionar opções no inventário.
*   **Tecla 'E' ou Botão na Tela:** Abrir/Fechar Inventário.
