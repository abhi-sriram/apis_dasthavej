const StellarSDK = require('stellar-sdk');
const serverTest = new StellarSDK.Server('https://horizon-testnet.stellar.org'); 

export default async function signEvent(
    req,res
   ) {
     try {
      //  if(req.body.publicKey == undefined){
      //  res.status(400).json({ error: "PublicKey is required. Resource Error" });
   
      //  }
       const xdr = req.body.xdr
      //  const eventID = req.body.eventID
       const secret = req.body.secret
       var rootKeypair = StellarSDK.Keypair.fromSecret(secret)
       let pubKey = rootKeypair.publicKey()
      // var rootKeypair = StellarSDK.Keypair.fromPublicKey(pubKey)

       const seq = await serverTest.loadAccount(pubKey);
       console.log(seq.sequence);

         let account =  new StellarSDK.Account(pubKey, seq.sequence);
         console.log(account);
         var transaction = new StellarSDK.TransactionBuilder.fromXDR(xdr, StellarSDK.Networks.TESTNET)
        
        transaction.sign(rootKeypair)
        let resp_xdr = transaction.toEnvelope().toXDR('base64');

        // let op_resp = await serverTest.submitTransaction(transaction)
        // check if all are signed and submit here be checking lenfth of signatures array in transaction

        // console.log(op_resp);
        // console.log(op_resp.extras);

          res.status(200).json({"xdr":resp_xdr});
        }
       catch (error) {
       console.log(error);
       res.status(500).json({ error: error.message });
     }
   }
   