import { Transaction, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js"
import wallet from "./dev-wallet.json"

// Import my dev wallet keypair from the wallet file
const from = Keypair.fromSecretKey(new Uint8Array(wallet));
// Define my WBA public key
const to = new PublicKey("8NHMejceXrhRMHQpmLMM5cvveFiFBcB3RDceauVfqz9q");
//Create a Solana devnet connection
const connection = new Connection("https://api.devnet.solana.com");

/* Clean up Dummy Account Balance */
// 1. Get the exact balance of the account
// 2. Calculate the fee of sending the transaction
// 3. Calculate the exact number of lamports we can send whilst satisfying the fee rate
(async () => {
    try {
        // Get balance of dev wallet
        const balance = await connection.getBalance(from.publicKey)
        // Create a test transaction to calculate fees
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance,
        }) );
        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = from.publicKey;

        // Calculate exact fee rate to transfer entire SOL amount out of account minus fees
        const fee = (await connection.getFeeForMessage(transaction.compileMessage(), 'confirmed')).value || 0;
        // Remove the previous transfer instruction to replace it with newly calculated lamports
        transaction.instructions.pop();
        // Now add the instruction back with correct amount of lamports
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance - fee,
        }) );
        // Sign transaction, broadcast, and confirm
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
} })();