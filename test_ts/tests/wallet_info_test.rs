use bs58;

#[test]
fn wallet_to_base58() {
    
    let wallet: Vec<u8> = vec![
        34,46,55,124,141,190,24,204,134,91,70,184,161,181,44,122,15,172,63,62,153,150,99,255,202,89,105,77,41,89,253,130,27,195,134,14,66,75,242,7,132,234,160,203,109,195,116,251,144,44,28,56,231,114,50,131,185,168,138,61,35,98,78,53
    ];

    // From Wallet to Base58
    let base58 = bs58::encode(wallet).into_string();
    println!("Converted to Base58 format -> {:?}", base58);
}

#[test]
fn base58_to_wallet() {
    println!("Enter your base58 string:");
    let base58 = "gdtKSTXYULQNx87fdD3YgXkzVeyFeqwtxHm6WdEb5a9YJRnHse7GQr7t5pbepsyvUCk7VvksUGhPt4SZ8JHVSkt";

    // From Base58 to Wallet
    let wallet = bs58::decode(&base58).into_vec().unwrap();
    println!("Converted to Wallet format -> {:?}", wallet);
}