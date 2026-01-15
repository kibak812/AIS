# AI Spire Web

A mobile-friendly web implementation of AI Spire, a deck-building roguelike game inspired by Slay the Spire.

## About

This project is based on the AI Spire game introduced in the research paper "Web World Models" (arXiv:2512.23676). It features:

- Deck-building roguelike gameplay
- Turn-based combat system
- Card collection and deck management
- Mobile-optimized touch interface
- Enemy AI with intent system
- Status effects and combat mechanics

## Features

- **Combat System**: Engage in strategic turn-based battles against various enemies
- **Card System**: Build your deck with attack, skill, and power cards
- **Progression**: Defeat enemies, earn rewards, and climb through floors
- **Mobile-Friendly**: Optimized for touch controls and mobile devices
- **Status Effects**: Utilize buffs, debuffs, and tactical advantages

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS3 (Mobile-first design)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The game will be available at `http://localhost:5173`

## Build

```bash
npm run build
```

## How to Play

1. **Select Cards**: Tap a card in your hand to select it
2. **Target Enemies**: Tap an enemy to play the selected card
3. **End Turn**: Complete your turn and watch enemies execute their intents
4. **Collect Rewards**: After victory, choose one card to add to your deck
5. **Progress**: Continue through floors, building your deck and strategy

## Game Mechanics

- **Energy**: Each turn you have energy to spend on playing cards
- **Health**: Keep your HP above zero to survive
- **Block**: Reduces incoming damage
- **Status Effects**: Various buffs and debuffs affect combat
- **Enemy Intent**: See what enemies plan to do next turn

## References

- Based on research paper: [Web World Models (arXiv:2512.23676)](https://arxiv.org/abs/2512.23676)
- Inspired by: Slay the Spire
