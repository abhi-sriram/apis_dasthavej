const StellarSDK = require('stellar-sdk');
const serverTest = new StellarSDK.Server('https://horizon-testnet.stellar.org'); 

export default async function fund(
 req,res
) {
  try {
    console.log(req.body.PublicKey);
    if(req.body.PublicKey == undefined){
    res.status(400).json({ error: "PublicKey is required. Resource Error" });

    }
    await serverTest.friendbot(req.body.PublicKey).call()
    res.status(200).json({ message:"Funded",publicKey: req.body.PublicKey });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
