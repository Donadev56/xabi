XABI is a modern smart contract explorer and interaction tool initially built for the BNB Chain ecosystem.

It provides a simple interface for exploring smart contracts, loading ABIs, reading contract functions, executing transactions, and saving frequently used contracts as projects.

## Features

- Smart Contract Explorer
- Read smart contract functions
- Write and execute smart contract functions
- Verified contract support
- Manual ABI input for unverified contracts
- BNB Chain and BNB-compatible networks
- Web3 wallet connection
- Save and manage contract projects
- Search saved projects
- View contract token holdings
- View contract source information
- Dark and light mode
- Modern and simple user interface

## Getting Started

### Requirements

- Node.js
- pnpm, npm, or yarn
- A Web3 wallet such as MetaMask
- A BNB Chain-compatible network

### Installation

\`\`\`bash
git clone https://github.com/Donadev56/xabi.git
cd xabi
pnpm install
\`\`\`

Create your environment file:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Configure the required environment variables and start the development server:

\`\`\`bash
pnpm dev
\`\`\`

Then open:

\`\`\`
http://localhost:3000
\`\`\`

## How It Works

1. Connect your Web3 wallet.
2. Select a supported blockchain network.
3. Enter a smart contract address.
4. XABI retrieves the contract information and ABI when available.
5. Explore the contract's read and write functions.
6. Provide the required parameters.
7. Execute read calls or sign transactions directly from your wallet.
8. Save the contract as a project for quick access later.

For contracts that are not verified, you can manually provide the contract ABI.

## Built With

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Web3.js
- LI.FI SDK
- Reown / WalletConnect

## Vision

XABI started with a simple idea:

> Interacting with a smart contract shouldn't require writing a new script every time.

The goal is to make smart contract interaction faster and more accessible for developers, blockchain users, and anyone who needs to interact with EVM smart contracts.

XABI is initially focused on the BNB Chain ecosystem, with the architecture designed to support additional EVM-compatible networks in the future.

## Status

XABI is actively under development. New features, improvements, and additional blockchain network support are being added over time.

## Contributing

Contributions, ideas, bug reports, and feature requests are welcome.

Feel free to fork the repository, create a branch, and submit a pull request.

## License

See the repository for the current license and usage terms.

---

Built for the BNB ecosystem.

Built to make smart contract interaction simpler.
