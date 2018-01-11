import InterfaceBlockchainBlock from "../../../common/blockchain/interface-blockchain/blocks/Interface-Blockchain-Block";

var assert = require('assert')

import PPoWBlockchain from 'common/blockchain/ppow-blockchain/blockchain/PPoW-Blockchain'
import PPoWBlockchainBlock from 'common/blockchain/ppow-blockchain/blocks/PPoW-Blockchain-Block'
import consts from 'consts/const_global'

describe('test PPoW-Blockchain interlink data structure', () => {

    let blockchain = null;
    let response = null;

    it('test blockchain ppow interlink', async () => {

        blockchain = new PPoWBlockchain();

        //values are optained from mining simulation :)
        let serialized = [
                "01e350329af5d504cc923435f37359562537d008963243683d7c944c6ab57c6a000000e600017bb3e84e6892c7e76be2beedb94a1035b7f095d50b5462806b92be0cbccd31fa0006f98874669e4df84ac0d866c8ec7bdc62424b0f720f2efa586559a2fb35429d8142ed43ec935be6e72344fc5b1ca25826edecb2fc14006b8a905b56b5f0633dab431d5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c9456f10db1a01b2e8aab1e7a79aab25285577f10f0666e88daba63ee1bb364479a130001ffffffff7bb3e84e6892c7e76be2beedb94a1035b7f095d50b5462806b92be0cbccd31fa",
                "0021309913510fd15ff16cc67dbe6cbcad681cd066fb65ebd2ef4f489f47c00b00000042000101e350329af5d504cc923435f37359562537d008963243683d7c944c6ab57c6a0006f9894cf3bcae199354f117e9ac51300b36985d1d904af0161c2a05ea93261af2d53643ec935be6e72344fc5b1ca25826edecb2fc14006b8a905b56b5f0633dab431d5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c9456bb551471275b3e82811c1519c2eefb16282cce81979a3703beb85c6447ee59c40001ffffffff7bb3e84e6892c7e76be2beedb94a1035b7f095d50b5462806b92be0cbccd31fa",
                "02b8faa54ea3813be54406a67f776b3953d9bd949ee2b10893da00cf26486d8b0000000200010021309913510fd15ff16cc67dbe6cbcad681cd066fb65ebd2ef4f489f47c00b0006f989b42f530981e0e4a53103960c51d34a36cafd7b078d50e61febbbb73fb1dabe6a43ec935be6e72344fc5b1ca25826edecb2fc14006b8a905b56b5f0633dab431d5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c94569a7ca6a3a4482838f49355a6a7e2fa7727d566ef7fc959042e7c16aa778260ee0001ffffffff7bb3e84e6892c7e76be2beedb94a1035b7f095d50b5462806b92be0cbccd31fa",
                "0041eee0e5539ae0fde651e862909aad40b9fd806c1f59ac49951a38cfc6daec000000b3000102b8faa54ea3813be54406a67f776b3953d9bd949ee2b10893da00cf26486d8b0006f989bde16de97137107197effb72917721e10fbec9e1a8282b2c19ece8ca70a136b443ec935be6e72344fc5b1ca25826edecb2fc14006b8a905b56b5f0633dab431d5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c945649325f7af52ea60d66cd538baccedfd9ad000cdddc5b7e79ec3a1f5b065562dd0001ffffffff7bb3e84e6892c7e76be2beedb94a1035b7f095d50b5462806b92be0cbccd31fa",
                "007123361f9e1801a235582556bcb3beeb3573bcd471ee71f8b3f3708c7eb9940000000500010041eee0e5539ae0fde651e862909aad40b9fd806c1f59ac49951a38cfc6daec0006f98a6dbb1a728d955eb9dcc878957db795a71441aa1924802501d34372a2ece4dac943ec935be6e72344fc5b1ca25826edecb2fc14006b8a905b56b5f0633dab431d5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c945666ac4f30c54d6adf4f659403d40614d351bfa5a3d500f1b96ef639090aa5c6510001ffffffff7bb3e84e6892c7e76be2beedb94a1035b7f095d50b5462806b92be0cbccd31fa",
                "00f7f45590830f0e11953d8c3a3b25f819a83da595da2fd8a1b766768da8728d000000140001007123361f9e1801a235582556bcb3beeb3573bcd471ee71f8b3f3708c7eb9940006f98a1535ac4104184ec7df191687fed71b772c13f46daab8717174313a9b5380cb9643ec935be6e72344fc5b1ca25826edecb2fc14006b8a905b56b5f0633dab431d5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c94563e93ee6f168054451a37fe98c80a7c1e96b3fafb3366f4545bb1604feddc8dfa0001ffffffff7bb3e84e6892c7e76be2beedb94a1035b7f095d50b5462806b92be0cbccd31fa",
                "00b7af7b7bb19fb481ffc93cd3d8b87350a46351c7a3bea716a5eb05862fc27900000030000100f7f45590830f0e11953d8c3a3b25f819a83da595da2fd8a1b766768da8728d0006f98a09a08df82fbfac849faf48c8255d6e536d04c66ddb8b93b4b9786824600333e943ec935be6e72344fc5b1ca25826edecb2fc14006b8a905b56b5f0633dab431d5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c9456849ea604058ec5cb2b8719162ca850c45ccc6dc12f8c85513bfa651521d5c19e0001ffffffff7bb3e84e6892c7e76be2beedb94a1035b7f095d50b5462806b92be0cbccd31fa",
                "01236c305652e3619026b4cb4a7d3cece35774f2ea2d7a79ab435ce264bddef400000025000100b7af7b7bb19fb481ffc93cd3d8b87350a46351c7a3bea716a5eb05862fc2790006f98adcdd6426a3be8bb9a1534f41ec17b1b9a22f48e73b753eab036ce2e953c5941243ec935be6e72344fc5b1ca25826edecb2fc14006b8a905b56b5f0633dab431d5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c9456a6ff8a70adce9d5c52c33f12e859f30cce93db4f08d65fa2f908f5164e1ed94c0001ffffffff7bb3e84e6892c7e76be2beedb94a1035b7f095d50b5462806b92be0cbccd31fa",
                "023a018a8d3f5e6561fb4c453b549e84ed1b5e57333199bca994aed0bd2f2a6c00000020000101236c305652e3619026b4cb4a7d3cece35774f2ea2d7a79ab435ce264bddef40006f98aea23d673ab96df0ce344293fdcfd782a33e670c8cb1cc1a40ba0f8641f6e984d43ec935be6e72344fc5b1ca25826edecb2fc14006b8a905b56b5f0633dab431d5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c94568ffc07ab8b93fadea3bd0f27a0f16fa2efa0da6e5b91e28b2007231d715a3fb40001ffffffff7bb3e84e6892c7e76be2beedb94a1035b7f095d50b5462806b92be0cbccd31fa",
                "014829bbd4d27574fe8bad7a166a1b564085a09a3c5a9ba9f43b90a4ba9a8013000000220001023a018a8d3f5e6561fb4c453b549e84ed1b5e57333199bca994aed0bd2f2a6c0006f98ae3e6041869e7212877c89febc7799c4704800045fbacf8eef2a2a6e8e385751743ec935be6e72344fc5b1ca25826edecb2fc14006b8a905b56b5f0633dab431d5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c94563aefef98b2d1f7de37352f6ddea787bc4b059d5685c53373b3596b0fc0c070890001ffffffff7bb3e84e6892c7e76be2beedb94a1035b7f095d50b5462806b92be0cbccd31fa",
                "0047be33f49682c33b0a63e5e115f463b4d66829c4264d7dc62389a431382bda000000030001014829bbd4d27574fe8bad7a166a1b564085a09a3c5a9ba9f43b90a4ba9a80130006f98ac4228d64e4301684e3a8a242ae8eaf42dd83cd0c932c7f97e2c0f95894643a6343ec935be6e72344fc5b1ca25826edecb2fc14006b8a905b56b5f0633dab431d5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c945671a867b242cbe55463ef9fe18201a0b7e83fe6e2ff320ffc5a4cce943301ab2b0001ffffffff7bb3e84e6892c7e76be2beedb94a1035b7f095d50b5462806b92be0cbccd31fa",
                "01c0e17f665c0914cbde4f2a9ef401ad5a4e1e3dba5515d96334bdcdc9a6246e0000001000010047be33f49682c33b0a63e5e115f463b4d66829c4264d7dc62389a431382bda0006f98ac25158b911645899d0d79c10f6cb6457c9be46d285b88d52e1b53af4bc45346043ec935be6e72344fc5b1ca25826edecb2fc14006b8a905b56b5f0633dab431d5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c9456754ee2be42c9d39bbfad8d9d029aae5d31eeba4816ff7b605b29777122f444620001ffffffff7bb3e84e6892c7e76be2beedb94a1035b7f095d50b5462806b92be0cbccd31fa",
                "0278b6a92c9d78ba11b3b8ec5fb235599e667dc9c0430938c97c30392eb88df600000000000101c0e17f665c0914cbde4f2a9ef401ad5a4e1e3dba5515d96334bdcdc9a6246e0006f98a685b32c01eec0ffc9c0a8b7b7e0085bd100d9f81fe45799f3869ee622f7d3ec643ec935be6e72344fc5b1ca25826edecb2fc14006b8a905b56b5f0633dab431d5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c945616289272b9eb32b8bd4b8e0fa03782ad13e9cdc34a4b6ad2cb269c6aede1048b0001ffffffff7bb3e84e6892c7e76be2beedb94a1035b7f095d50b5462806b92be0cbccd31fa"
            ];

        //create a dummy block and deserialize from serialized array
        
        for (let i = 0; i < 1; ++i) {
            let block = new PPoWBlockchainBlock( blockchain, 0x01, new Buffer(consts.BLOCKS_POW_LENGTH), new Buffer(consts.BLOCKS_POW_LENGTH), undefined, undefined, undefined, 0, blockchain.db );
            let buffer = new Buffer(serialized[i], 'hex');

            block.deserializeBlock(buffer);
            blockchain.includeBlockchainBlock(block, undefined, undefined, false);
        }

        //check if links point correctly
        for (let i = 0; i < blockchain.blocks.length; ++i){
            let block = blockchain.blocks[i];
            console.log('B.height=', block.height, block.interlink.length);
            for (let j = 0; j < block.interlink.length; ++j){
                let link = block.interlink[i];
                console.log('height=', link.height);
                console.log('blockId=', link.blockId);
                assert(blockchain.blocks[link.height].hash.equals(link.blockId));
            }
        }

    });

});