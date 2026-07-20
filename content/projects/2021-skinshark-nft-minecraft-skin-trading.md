---
id: skinshark-nft-minecraft-skin-trading
title: "SkinShark: NFT Marketplace for Minecraft Skin Trading"
articleDate: 2021-01-01
articleContent: I led development of an Ethereum NFT MVP where Minecraft players could upload, claim, and trade skins through a Next.js and TypeScript application.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
tags:
  - NFTs
  - EthereumBlockchain
  - MinecraftSkins
  - Web3Development
technologies:
  - NextJS
  - Metamask
  - OpenZeppelin
  - Pinata
  - React
  - TypeScript
  - AWS
---

SkinShark was an exploration of whether Minecraft skins could have verifiable ownership and a marketplace beyond a game's own account system. I led development from 2019 to 2022, building an NFT MVP on Ethereum for users to upload, claim, and trade skins.

The web application used Next.js, React, and TypeScript. MetaMask connected a user wallet to the product, while OpenZeppelin contract components provided standard building blocks for smart-contract work. TypeChain generated typed bindings between the TypeScript application and contract interfaces, which reduced the chance of treating a contract call as an untyped black box. Pinata provided the storage path for NFT-related content.

The hard part was not adding a wallet button. The system needed a clear link between a wallet identity, a skin record, and the token representing it. I designed the user flow around that chain: connect wallet, upload or select a skin, mint a claim, then expose it for trading. The distinction between on-chain ownership and off-chain content was central to explaining the product honestly.

I deployed a working MVP to Ethereum mainnet and refined it with feedback from gaming and AI enthusiasts. The project was useful as a production-adjacent web3 exercise, but it also exposed tradeoffs that product pages often hide: transaction costs, wallet onboarding friction, and the gap between token ownership and game-platform recognition.

If I built it now, I would start with a clearer custody model, explicit content moderation, and a lower-cost chain or L2. SkinShark gave me practical experience in smart-contract integration, typed frontend boundaries, and designing for systems where part of the product state lives outside my own infrastructure.
