const StellarSDK = require('stellar-sdk');
const serverTest = new StellarSDK.Server('https://horizon-testnet.stellar.org'); 

export default async function multisig(
 req,res
) {
  try {
    // const keypair = StellarSDK.Keypair.random()
    const keypair = StellarSDK.Keypair.fromSecret("SAAU5A6UKWCKIQFPVSGGMGY6NW4ZN6VMWRFYSACN2PS4HUMZYIFNIQ6K")
    //  GB5RSQ4BRDZGNB265JONGEDH7VRAVJ3X34FC5AWXQBQF2JEZ4EDCUJUN PUB Key of event Type

    console.log(keypair.publicKey());
    console.log(keypair.secret());
    // if(keypair.publicKey() == undefined){
    // res.status(400).json({ error: "PublicKey is required. Resource Error" });

    // }
    // const fund = await serverTest.friendbot(keypair.publicKey()).call()

    const seq = await serverTest.loadAccount(keypair.publicKey());

    //    .then(function(account) { console.log(account.sequence) ;
    //     sequenceNumber = account.sequence;})
    console.log(seq.sequence);
    try {
      let account =  new StellarSDK.Account(keypair.publicKey(), seq.sequence);
      console.log(account);
    //   var secondaryAddress = "GDAIOQMAG7VUCLNBOJZGWQUI4U76DCME36LEE7QP7TIPGS3LVG7X657S";
    //  SCL74TUVE7YHC7FWEDOXUKFRZG5ULAVQCG5KKNH3XNZWG5IAUV7L75TX,  SCT6LWLPC6SSTQK6IK34ERTH7VWBJYIVACSYFWPS22SVKNQIXDUQGNG2
      var signers = ["GCC5GYROBSZ3EATV45J6OL4PQE7U5HO4EEWN5T2UJAYAQBGCSCT3QDNN", "GBXU2R6U73IBX7A7QUR35KVLPENMO4R2NAJE6S2VA2U6H5CE6L3QHVO5"]
      var transaction = new StellarSDK.TransactionBuilder(account, {
        fee: StellarSDK.BASE_FEE,
        networkPassphrase: StellarSDK.Networks.TESTNET 
      }); 
    //   var extraSignerAdd = StellarSDK.Operation.setOptions({
    //     signer: {
    //       ed25519PublicKey: "GAW6IOIUEMMJUTT4K3OQKEMJSY77H36C7GPLLHAJHS6HNRZA6OP7P66O",
    //       weight: 1
    //     }
    //   })

      function extraSigners(ele) { 
        var signerAdd = StellarSDK.Operation.setOptions({
        signer: {
          ed25519PublicKey: ele,
          weight: 1
            }
        })
        return signerAdd
        }

      function addThreshold(ele) {

        var setThresh = StellarSDK.Operation.setOptions({
            masterWeight: 0, // set master key weight
            lowThreshold: 1,
            medThreshold: ele, // a payment is medium threshold
            highThreshold: ele // make sure to have enough weight to add up to the high threshold!
          })

          return setThresh
      }

      signers.forEach(ele =>{
        transaction.operations.push(extraSigners(ele))
      })
      console.log(transaction);

      console.log(signers.length);
      transaction.operations.push(addThreshold(signers.length))
    //   transaction.operations.forEach(element => {
    //     console.log(element);
    //   });

      transaction = transaction.build()

      console.log(transaction);
      
      transaction.sign(keypair)
    //   transaction.submit()

      var result = serverTest.submitTransaction(transaction)
    
      console.log(result);
      res.status(200).send("Logged to console.")
    // res.status(200).json({message:"Account Generated",account: account, secret: keypair.secret() });
    } catch (error) {
      console.log(error);
    res.status(400).json({ error: error.message });

    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
