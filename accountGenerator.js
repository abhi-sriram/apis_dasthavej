const StellarSDK = require('stellar-sdk');
const serverTest = new StellarSDK.Server('https://horizon-testnet.stellar.org'); 

export default async function accountGenerator(
 req,res
) {
  try {
    const keypair = StellarSDK.Keypair.random()
    console.log(keypair.publicKey());
    // if(keypair.publicKey() == undefined){
    // res.status(400).json({ error: "PublicKey is required. Resource Error" });

    // }
    const fund = await serverTest.friendbot(keypair.publicKey()).call()

    const seq = await serverTest.loadAccount(keypair.publicKey());

    //    .then(function(account) { console.log(account.sequence) ;
    //     sequenceNumber = account.sequence;})
    console.log(seq.sequence);
    try {
      let account =  new StellarSDK.Account(keypair.publicKey(), seq.sequence);
      console.log(account);
    res.status(200).json({message:"Account Generated",account: account, secret: keypair.secret() });
    } catch (error) {
      console.log(error);
    res.status(400).json({ error: error.message });

    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
