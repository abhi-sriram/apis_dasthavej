const StellarSDK = require('stellar-sdk');
export default function generateKeypair(
 req,res
) {
  try {
    const keypair = StellarSDK.Keypair.random()
    res.status(200).json({ publicKey: keypair.publicKey(), secretKey: keypair.secret() });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
