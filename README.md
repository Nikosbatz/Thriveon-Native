
# Thriveon Native

Cross-platform React Native application written in TypeScript — a mobile client for the Thriveon platform. This repository contains the native/mobile portion of the Thriveon project and is implemented with TypeScript for better type-safety and developer experience.

## Table of contents
- [Key features](#key-features)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Getting started](#getting-started)
  - [Clone](#clone)
  - [Install dependencies](#install-dependencies)
  - [Run (development)](#run-development)
- [Project structure](#project-structure)
- [License](#license)
- [Contact](#contact)


## Key features
- TypeScript-first React Native app
- Modular architecture ready for feature-based scaling
- Cross-platform: Android & iOS

## Tech stack
- React Native (TS)
- TypeScript
- Navigation (Expo Router)
- State management ( Zustand / React Context )
- Networking: fetch / axios
- 
## Requirements
- Node.js >= 16 (or your project's required version)
- npm 
- Android Studio + SDKs for Android builds (if targeting Android)
- Xcode (macOS) for iOS builds
- npx 
- Install the Expo CLI

## Getting started

### Clone
```bash
git clone https://github.com/Nikosbatz/Thriveon-Native.git
cd Thriveon-Native
```

### Install dependencies
npm:
```bash
npm install
```

### Run (development)
```bash
npx expo start
# then run on device / emulator via Expo Dev Tools or `expo run:android` / `expo run:ios`
```


## Project structure
Example layout — adjust to reflect actual repository:
```
/src
  /api
  /components
  /app
  /context
  /hooks
  /store      # zustand
  /utilities
  /theme
  /types
/assets
/android
README.md
tsconfig.json
```



## License


## Contact
Maintainer: @Nikosbatz  
Project repository: https://github.com/Nikosbatz/Thriveon-Native
