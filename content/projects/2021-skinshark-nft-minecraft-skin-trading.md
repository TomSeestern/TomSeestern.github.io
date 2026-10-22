---
id: skinshark-nft-minecraft-skin-trading
title: "SkinShark: NFT Marketplace for Minecraft Skin Trading"
articleDate: 2021-01-01
articleContent: I led development of an Ethereum NFT MVP where Minecraft players could upload, claim, and trade skins through a Next.js and TypeScript application.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Lead developer
outcome: Shipped a working Ethereum-mainnet MVP for claiming and trading Minecraft skins.
heroImage: /img/projects/skinshark-dashboard.webp
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

The wallet was easy. The hard part was explaining what ownership meant when the skin lived in Minecraft and the token lived on Ethereum.

## The problem

SkinShark was an exploration of whether Minecraft skins could have verifiable ownership and a marketplace beyond a game's own account system. I led development from 2019 to 2022, building an NFT MVP on Ethereum for users to upload, claim, and trade skins.

The product had to connect a wallet identity, a skin record, and the token representing it. That sounds like a simple chain, but each link had a different source of truth. The game did not recognise the token. The image lived off-chain. The contract could prove ownership without proving that the skin was usable or appropriate.

## The build

The web application used Next.js, React, and TypeScript. MetaMask connected a user wallet to the product, while OpenZeppelin contract components provided standard building blocks for smart-contract work. TypeChain generated typed bindings between the TypeScript application and contract interfaces, which reduced the chance of treating a contract call as an untyped black box. Pinata provided the storage path for NFT-related content.

I designed the user flow around the chain: connect wallet, upload or select a skin, mint a claim, then expose it for trading. The distinction between on-chain ownership and off-chain content was central to explaining the product honestly. The MVP ran on Ethereum mainnet, which made the tradeoffs real: transaction costs, wallet onboarding friction, and the gap between token ownership and game-platform recognition.

I refined the product with feedback from gaming and AI enthusiasts. That feedback was useful because it separated the people who liked the idea of digital ownership from the people who would actually use a marketplace.

The contract layer was intentionally small: a token represented a claim, while the skin image and metadata lived off-chain. That kept the expensive on-chain operation focused, but it also made the product depend on a storage service and a metadata convention. I added typed bindings and explicit failure states so a missing asset or rejected transaction did not leave the user staring at an unchanged screen.

## The result

I shipped a working Ethereum-mainnet MVP for claiming and trading Minecraft skins. It was a production-adjacent web3 exercise, not a claim that the product had solved interoperability with Minecraft.

## What I took from it

If I built it now, I would start with a clearer custody model, explicit content moderation, and a lower-cost chain or L2. SkinShark gave me practical experience in smart-contract integration, typed frontend boundaries, and designing for systems where part of the product state lives outside my own infrastructure. It also made me cautious about treating a token as a product.
