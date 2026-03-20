# 🛠️ Assemble-It (v2.0.0)
**The AI-Powered Survival Engineering & Resource Management Platform.**

Assemble-It is a mobile-first application designed to turn "junk" into utility. By leveraging **Gemini 1.5 Flash Vision** and **Material Engineering Logic**, it empowers users to identify scrap materials and generate instant assembly blueprints for essential survival gear.

## 🚀 New in v2.0.0: The Inventory Update
We have moved beyond simple identification. v2.0.0 introduces a persistent data layer and an intelligence engine that bridges the gap between what you *find* and what you *build*.

### 🛰️ Key Features
* **The Inventory (Stockpile):** A local-first inventory system to track scavenged materials (Copper, HDPE Plastic, Circuitry) with zero-latency.
* **Blueprint Archiving:** Save AI-generated technical manuals directly to your device for offline engineering in the field.
* **The Requirement Matcher:** A logic engine that cross-references your current Stockpile against Saved Blueprints to calculate a "Build Readiness" percentage.
* **Substitution Engine (Alpha):** Intelligent suggestions for missing hardware (e.g., "Use high-gauge wire if a bolt is unavailable").
* **Tactical Command Center:** A dynamic User Profile that tracks your "Scavenger Level" and engineering stats based on your real-world progress.

## 🛠️ Tech Stack
* **Frontend:** React Native (Mobile-First)
* **AI:** Google Gemini (Vision & Logic)
* **State Management:** React Context API
* **Persistence:** AsyncStorage (Local-First Architecture)
* **Backend:** Node.js / Express

> "The future belongs to those who can build it from what's left behind."