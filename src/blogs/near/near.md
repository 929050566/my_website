# 简介
NEAR是基于全状态分片，对开发者有好的可扩容性的POS公式机制的公链，提出了一种新的分片协议和解决方案称之为夜影协议(Nightshade)，实现高吞吐量和低延迟。这使得Near Protocol可以处理每秒数千次的交易，切费用低。
它可以根据网络负载动态分片调整，以适应不同交易负载和网络情况。

# RPC URL(open node)
- https://docs.near.org/api/rpc/providers 
- 官网给出了节点列表ex: mainnet: https://rpc.mainnet.near.org

# 钱包 RPC 节点的搭建方式  
https://near-nodes.io/validator/hardware-validator
官方文档已经写的很详细，如何起一个节点。

# 账户模型还是 UTXO
很明显是账户模型:
https://nearscan.vercel.app/txns/FLbWzzXRGh1JPD3Use9pttJqyHWUUfaGcHk7L3t9m8E4
![alt text](near/image.png)

# 签名算法
默认ED25519 (EDDSA算法)
但是官方文档写的该链兼容EVM，并且源码中有看到使用Secp256k1算法，估计使用到合约验证中。
![alt text](near/image-1.png)
源码库：https://github.com/near/nearcore/blob/master/core/crypto/src/test_utils.rs
生成keypair
![alt text](near/image-2.png)

# 代币精度
精度为：24
官方文档：https://docs.near.org/concepts/protocol/gas
![alt text](near/image-3.png)

# 共识机制
POS共识算法:
官方文档：https://docs.near.org/concepts/basics/protocolPOS
![alt text](near/image-4.png)

# 确认位
3个确认位即可。
理由：
1.测试过OK钱包Near币转账 5秒（一个区块约1秒）以内即确认转账成功。
2.NEAR最新出块设计Doomslug(POS的一种)技术提出了一个新的出块方式，使得 NEAR 能通过一轮通讯达到一定的实用确定性，并通过最终确定性组件在两轮通讯后提供完全的 BFT （拜占庭容错）确定性。

# 是否支持质押  
https://app.mynearwallet.com/?tab=collectibles
官方钱包支持质押。

# 是否支持代币和 NFT(合约)支持NFT和代币
NEP-141: 同质化代币标准（类似以太坊的 ERC-20）
NEP-177: 代币元数据规范（兼容钱包显示）

# 质押的方式
https://www.btcfans.com/article/48254
如何起一个挖矿节点：https://github.com/nearprotocol/stakewars
运行节点至少30000NEAR（动态调整的），最少质押一个epoch（约12小时），解压通常需要3到4个epoch。所以解压周期：解锁需要36-48小时。
![alt text](near/image-5.png)
# 是否支持 Tag/Memo
不支持

# 是否为多链结构
分片链结构

# gas费计算
官方文档：https://docs.near.org/concepts/protocol/gas
        在使用官方库构建交易的时候，发现并不需要关心gas费用，官方库已经给与了合适的默认值。
![alt text](near/image-6.png)

14 离线地址生成方  
```javascript
export function generateNearAccount(): { privateKey: string, publicKey: string, address: string } {
    const keyPair = KeyPair.fromRandom("ED25519");
    const publicKey = keyPair.getPublicKey();
    const address = publicKey.toString().replace("ed25519:", "");

    return {
        privateKey: keyPair.toString(),
        publicKey: publicKey.toString(),
        address: address
    };
}
```
# 离线签名
```javascript

export function signTransaction(
    privateKey: string,
    sender: string,
    receiver: string,
    nonce: number,
    blockHash: string,
    actions: transactions.Action[]
): string {
  if (!blockHash || blockHash.length === 0) {
    throw new Error("Invalid blockHash provided");
  }
  
    const keyPair = KeyPair.fromString(privateKey);
    const publicKey = keyPair.getPublicKey();

    let decodedBlockHash: Uint8Array;
    try {
        decodedBlockHash = utils.serialize.base_decode(blockHash);
    } catch (error) {
        throw new Error("Failed to decode blockHash: " + error);
    }

    const tx = transactions.createTransaction(
        sender,
        publicKey,
        receiver,
        nonce,
        actions,
        decodedBlockHash
    );
    
    const serializedTx = utils.serialize.serialize(transactions.SCHEMA, tx);
    const txHash = createHash("sha256").update(serializedTx).digest();
    const signature = keyPair.sign(txHash);
    const signedTx = new transactions.SignedTransaction({
        transaction: tx,
        signature: new transactions.Signature({
            keyType: publicKey.keyType,
            data: signature.signature,
        }),
    });
    const serializedSignedTx = utils.serialize.serialize(transactions.SCHEMA, signedTx);
    return Buffer.from(serializedSignedTx).toString("base64");
}
```
# 扫链的 RPC 接口
## 获取账户信息：
  Request:
```json
curl --location 'https://docs-demo.near-mainnet.quiknode.pro/' \
--header 'Content-Type: application/json' \
--data '{
    "method": "query",
    "params": {
        "request_type": "view_account",
        "finality": "final",
        "account_id": "20b9bdf32f768ac6e6ff3c9ab512d4bd7f94dbcf4e9d15bb8cd3c3b4062d585a"
    },
    "id": 1,
    "jsonrpc": "2.0"
}'
```
Response:
```json
{
    "jsonrpc": "2.0",
    "result": {
        "amount": "612724802687772500000000",
        "block_hash": "8K8HFwozcUrQrQbXmiEobycrXSCzB9e7c2XqpUi9nGU7",
        "block_height": 140116086,
        "code_hash": "11111111111111111111111111111111",
        "locked": "0",
        "storage_paid_at": 0,
        "storage_usage": 182
    },
    "id": 1
}
```
## 获取交易所需的nonce和block_hash(非常重要)：
  Request:
```json
curl --location 'https://docs-demo.near-mainnet.quiknode.pro/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "id": "dontcare",
  "method": "query",
  "params": {
    "request_type": "view_access_key_list",
    "finality": "final",
    "account_id": "20b9bdf32f768ac6e6ff3c9ab512d4bd7f94dbcf4e9d15bb8cd3c3b4062d585a"
  }
}'
```
Response:

```json
  实际构建离线交易时候的入参就是下面的nonce值+1， 和block_hash值也是取自这里。
{
    "jsonrpc": "2.0",
    "result": {
        "block_hash": "AfiYwwX4owsv4crEFfRTHYA1dw4asMVUjfo8cmkbYQ9k",
        "block_height": 140118568,
        "keys": [
            {
                "access_key": {
                    "nonce": 140083597000003,
                    "permission": "FullAccess"
                },
                "public_key": "ed25519:3CkKR2ej2ZXEQh7tY8bkVkVqi2zkt31svaA3Mj3v3pnm"
            }
        ]
    },
    "id": "dontcare"
}
```
##  发送交易
  Request:
```
curl --location 'https://docs-demo.near-mainnet.quiknode.pro/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "id": "dontcare",
  "method": "send_tx",
  "params": {
    "signed_tx_base64": "QAAAADIwYjliZGYzMmY3NjhhYzZlNmZmM2M5YWI1MTJkNGJkN2Y5NGRiY2Y0ZTlkMTViYjhjZDNjM2I0MDYyZDU4NWEAILm98y92isbm/zyatRLUvX+U289OnRW7jNPDtAYtWFpEvQnBZ38AABAAAAByZWNlaXZlci50ZXN0bmV0j6Q8F8YJSU6s9LVwOfd8tjexOozsIrna8XUwerXsxo8BAAAAAwAAoN7Frck1NgAAAAAAAAAA88tz/QfaLUa/AZzc8MsVbrD2VWGdz+Caea3SWHBEE1xljP21dYiE2LfiN3pGuMTZUlU4m4Tv9DVnFO7ct7VVAA==",
    "wait_until": "INCLUDED_FINAL"
  }
}'
```
   Response:
```json
{
    "jsonrpc": "2.0",
    "result": {
        "final_execution_status": "EXECUTED",
        "receipts_outcome": [
            {
                "block_hash": "HR9mNPkDrU5Je9kjx5ezXAPunxGzco5FRST7UFG8BVJU",
                "id": "CrpvX2xiVq8Yek8Mw98QH7qrZHtN8fsg64xxYVCXMyGk",
                "outcome": {
                    "executor_id": "receiver.testnet",
                    "gas_burnt": 223182562500,
                    "logs": [],
                    "metadata": {
                        "gas_profile": [],
                        "version": 3
                    },
                    "receipt_ids": [
                        "3P1v2oumKVAJspSnjCwNY5ec9SSm3meoBzDbYNJwnfrs",
                        "FcVWHDaSnSzjiYYs1myWiKTKqwqPBL45rcL9iKEeCaLH"
                    ],
                    "status": {
                        "Failure": {
                            "ActionError": {
                                "index": 0,
                                "kind": {
                                    "AccountDoesNotExist": {
                                        "account_id": "receiver.testnet"
                                    }
                                }
                            }
                        }
                    },
                    "tokens_burnt": "22318256250000000000"
                },
                "proof": [
                    {
                        "direction": "Left",
                        "hash": "EZhggpXeKp2EMvuzuCqas4FXrXAJkq4gwE9rPTnawP2P"
                    },
                    {
                        "direction": "Left",
                        "hash": "936DHnBLp1NYTEBoey2NBohMtTsLpJR37VKBEs5TjDk1"
                    },
                    {
                        "direction": "Right",
                        "hash": "2YH1W19EGMD2YtGjWMkaU1KUsnm1RojmTA6JpUHU5Kpd"
                    },
                    {
                        "direction": "Right",
                        "hash": "4KXfiHwkV2dRCrHRv5gPpeeT8eAES9yywkkjMPxHdveP"
                    },
                    {
                        "direction": "Left",
                        "hash": "4rpdDYYzwiGntu1zfhLs8RMsodGQMypDY7tdYtQ2faXj"
                    },
                    {
                        "direction": "Left",
                        "hash": "2FneUmDrJxAnVEdBEbrS1Kg2Qq4izPxe9ZrcAvfZ67f1"
                    },
                    {
                        "direction": "Right",
                        "hash": "98RHwvWZ8kR2madoe3ugMftjuqZep4cbWZUoRCYpsFzm"
                    }
                ]
            },
            {
                "block_hash": "HE7CFZCpyiu3tGhN7nZjjiCgUEArqRkRQUQ3PRs6h6pZ",
                "id": "3P1v2oumKVAJspSnjCwNY5ec9SSm3meoBzDbYNJwnfrs",
                "outcome": {
                    "executor_id": "20b9bdf32f768ac6e6ff3c9ab512d4bd7f94dbcf4e9d15bb8cd3c3b4062d585a",
                    "gas_burnt": 4174947687500,
                    "logs": [],
                    "metadata": {
                        "gas_profile": [],
                        "version": 3
                    },
                    "receipt_ids": [],
                    "status": {
                        "SuccessValue": ""
                    },
                    "tokens_burnt": "0"
                },
                "proof": [
                    {
                        "direction": "Right",
                        "hash": "4P7JdF82Q5kTbbup7fbpZimtozzfMBeG59911k3qvbPL"
                    },
                    {
                        "direction": "Right",
                        "hash": "DLdbSS3ncp2kVXoMFy8pEHqkx3DFk1BbbkjqiUtKKoA9"
                    },
                    {
                        "direction": "Left",
                        "hash": "FuMQXxZKxSS4qUFrean3JxnfyZwoeBYAyCmDBTnzSyiW"
                    },
                    {
                        "direction": "Right",
                        "hash": "FrbikgrY7C2iRJV6rEJdx1edtTcj2rjVPmoCgKUKF1FJ"
                    },
                    {
                        "direction": "Right",
                        "hash": "DoHMd87Afz4pa4x44kM2TvHNNxqPAsV3d8gCcw3U9FNR"
                    },
                    {
                        "direction": "Left",
                        "hash": "GwURXTbB34T8Y2gvyhT5dcDKWfZxJXWhjkhz7pN7aSry"
                    },
                    {
                        "direction": "Right",
                        "hash": "JDQ3ezU9teLKpDRHmuqhyJ9YdtsX7myuMAWrZxpdKiCk"
                    }
                ]
            },
            {
                "block_hash": "HE7CFZCpyiu3tGhN7nZjjiCgUEArqRkRQUQ3PRs6h6pZ",
                "id": "FcVWHDaSnSzjiYYs1myWiKTKqwqPBL45rcL9iKEeCaLH",
                "outcome": {
                    "executor_id": "20b9bdf32f768ac6e6ff3c9ab512d4bd7f94dbcf4e9d15bb8cd3c3b4062d585a",
                    "gas_burnt": 4174947687500,
                    "logs": [],
                    "metadata": {
                        "gas_profile": [],
                        "version": 3
                    },
                    "receipt_ids": [],
                    "status": {
                        "SuccessValue": ""
                    },
                    "tokens_burnt": "0"
                },
                "proof": [
                    {
                        "direction": "Left",
                        "hash": "9TL1mF6HJYPbypKLyxQB21igi48rFrsu1dCHjWrzcSZR"
                    },
                    {
                        "direction": "Right",
                        "hash": "DLdbSS3ncp2kVXoMFy8pEHqkx3DFk1BbbkjqiUtKKoA9"
                    },
                    {
                        "direction": "Left",
                        "hash": "FuMQXxZKxSS4qUFrean3JxnfyZwoeBYAyCmDBTnzSyiW"
                    },
                    {
                        "direction": "Right",
                        "hash": "FrbikgrY7C2iRJV6rEJdx1edtTcj2rjVPmoCgKUKF1FJ"
                    },
                    {
                        "direction": "Right",
                        "hash": "DoHMd87Afz4pa4x44kM2TvHNNxqPAsV3d8gCcw3U9FNR"
                    },
                    {
                        "direction": "Left",
                        "hash": "GwURXTbB34T8Y2gvyhT5dcDKWfZxJXWhjkhz7pN7aSry"
                    },
                    {
                        "direction": "Right",
                        "hash": "JDQ3ezU9teLKpDRHmuqhyJ9YdtsX7myuMAWrZxpdKiCk"
                    }
                ]
            }
        ],
        "status": {
            "Failure": {
                "ActionError": {
                    "index": 0,
                    "kind": {
                        "AccountDoesNotExist": {
                            "account_id": "receiver.testnet"
                        }
                    }
                }
            }
        },
        "transaction": {
            "actions": [
                {
                    "Transfer": {
                        "deposit": "1000000000000000000000"
                    }
                }
            ],
            "hash": "3Uv1ZuxWXq8FpWqGfX6MjTCFNquwVGNqCEfxSTjL4wA7",
            "nonce": 140083597000004,
            "priority_fee": 0,
            "public_key": "ed25519:3CkKR2ej2ZXEQh7tY8bkVkVqi2zkt31svaA3Mj3v3pnm",
            "receiver_id": "receiver.testnet",
            "signature": "ed25519:5shwGJkn7pTnTtP6dmMzYM3hS8t3y9S9CFSfovHCSHhTQn5phAXNVxkfdTv3PPSkxtp2SecAnecboyVfSzQmZRts",
            "signer_id": "20b9bdf32f768ac6e6ff3c9ab512d4bd7f94dbcf4e9d15bb8cd3c3b4062d585a"
        },
        "transaction_outcome": {
            "block_hash": "CRKegZL7eDweT7CMBoxEb24mengkjDKmyh8tJEHWwC5",
            "id": "3Uv1ZuxWXq8FpWqGfX6MjTCFNquwVGNqCEfxSTjL4wA7",
            "outcome": {
                "executor_id": "20b9bdf32f768ac6e6ff3c9ab512d4bd7f94dbcf4e9d15bb8cd3c3b4062d585a",
                "gas_burnt": 223182562500,
                "logs": [],
                "metadata": {
                    "gas_profile": null,
                    "version": 1
                },
                "receipt_ids": [
                    "CrpvX2xiVq8Yek8Mw98QH7qrZHtN8fsg64xxYVCXMyGk"
                ],
                "status": {
                    "SuccessReceiptId": "CrpvX2xiVq8Yek8Mw98QH7qrZHtN8fsg64xxYVCXMyGk"
                },
                "tokens_burnt": "22318256250000000000"
            },
            "proof": [
                {
                    "direction": "Right",
                    "hash": "E5Ujwku2GSuRchBLoPvQcf6e7CBZj4PkmSFr9oDd6KW9"
                },
                {
                    "direction": "Left",
                    "hash": "8yyQt1yn54MexbHAtoDZkayf7gbyJcWDikN4ZC9i91fQ"
                },
                {
                    "direction": "Right",
                    "hash": "4ebm3tjvZqSE5ep18radywptS3uACw1NBWexwD8XL6eH"
                },
                {
                    "direction": "Right",
                    "hash": "EMZFUMfwoqLWwcbGMpAtDrTEFTtJj5R9YLMNaHHsUp2Q"
                },
                {
                    "direction": "Right",
                    "hash": "BF7iZbJGXF3F4BnMSnL4wMfdx5SViGho6fCDqi2LTwHB"
                },
                {
                    "direction": "Right",
                    "hash": "3jFomAwT6WsnVPEuGbgaoMAuWMLU6Jkb43DgJEYvkct6"
                },
                {
                    "direction": "Right",
                    "hash": "AyVDocHPdCTz88DEAksYktoy6LeWrZefQWQjMHVpBuGM"
                }
            ]
        }
    },
    "id": "dontcare"
}
```
## 获取区块链状态：
这个接口可以拿到最新区块号和hash值
Request:
```
curl --location 'https://docs-demo.near-mainnet.quiknode.pro/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "id": "dontcare",
  "method": "status",
  "params": []
}'
```
  Response:
```
{
    "jsonrpc": "2.0",
    "id": "dontcare",
    "result": {
        "chain_id": "mainnet",
        "genesis_hash": "EPnLgE7iEq9s7yTkos96M3cWymH5avBAPm3qx3NXqR8H",
        "latest_protocol_version": 73,
        "node_key": null,
        "node_public_key": "ed25519:467hyWrgQNSPHRSZHmJiZj5ykXNCxwvCicnYA9jK2RLu",
        "protocol_version": 73,
        "rpc_addr": "0.0.0.0:3030",
        "sync_info": {
            "earliest_block_hash": "5u4jwJaTCmxBnuC5C58KEmjGqoaGQLjrEpTWiXvZsF4u",
            "earliest_block_height": 139915998,
            "earliest_block_time": "2025-02-17T02:22:11.651419819Z",
            "epoch_id": "8eFis3ZinzzTyycxBSxUBo6xoS78nqJuQfdSrXszyrLb",
            "epoch_start_height": 140111511,
            "latest_block_hash": "2WR8JcAWp47igXEctizcEwHU2N6bbdDGAMBSeBMNk5P2",
            "latest_block_height": 140120661,
            "latest_block_time": "2025-02-19T17:58:06.475045084Z",
            "latest_state_root": "2437KZSW76dutavxZCPjdrRTm83sJgUCHE1Gp1TCH4xy",
            "syncing": false
        },
        "uptime_sec": 5954605,
        "validator_account_id": null,
        "validator_public_key": null,
        "validators": [
            {
                "account_id": "astro-stakers.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "zavodil.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "figment.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "electric.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "ledgerbyfigment.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "sumerian.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "legends.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "pinnacle1.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "staking_yes_protocol1.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "foundry.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "kiln-1.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "liver.pool.near",
                "is_slashed": false
            },
            {
                "account_id": "dqw9k3e4422cxt92masmy.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "bisontrails2.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "twinstake.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "stake1.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "flipside.pool.near",
                "is_slashed": false
            },
            {
                "account_id": "epic.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "marcus.pool.near",
                "is_slashed": false
            },
            {
                "account_id": "nearone.pool.near",
                "is_slashed": false
            },
            {
                "account_id": "binancenode1.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "aca87218e28c41f5a693dee3dff12238.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "galaxydigital.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "cosmose.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "republic.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "bisontrails.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "sweat_validator.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "blockdaemon.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "allnodes.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "stakin.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "sofarsonear.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "rekt.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "p2p-org.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "bitcoinsuisse.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "chorusone.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "d1.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "everstake.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "near-fans.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "here.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "future_is_near.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "pandora.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "northernlights.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "nodeasy.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "nearfans.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "near-prime.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "dragonfly.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "buildlinks.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "aurora.pool.near",
                "is_slashed": false
            },
            {
                "account_id": "kiln.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "kaiching.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "x.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "namdokmai.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "luganodes.pool.near",
                "is_slashed": false
            },
            {
                "account_id": "stakesabai.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "okx-earn.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "lux.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "baziliknear.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "erm.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "anonymous.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "dsrvlabs.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "cryptium.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "brea.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "staking4all.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "moonlet.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "staked.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "openshards.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "01node.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "lunanova.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "delightlabs.pool.near",
                "is_slashed": false
            },
            {
                "account_id": "stakely_io.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "stardust.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "hapi.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "masternode24.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "autostake.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "smart-stake.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "sigmapool.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "nearkoreahub.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "readylayerone_staking.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "fresh.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "meteor.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "pandateam.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "trust-nodes.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "qbit.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "sharpdarts.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "hb436_pool.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "avado.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "lavenderfive.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "cryptogarik.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "colossus.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "gfi-validator.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "dexagon.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "wackazong.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "atomic-nodes.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "appload.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "modernlion.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "polkachu.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "inotel.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "hashquark.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "optimusvalidatornetwork.poolv1.near",
                "is_slashed": false
            },
            {
                "account_id": "lionstake.poolv1.near",
                "is_slashed": false
            }
        ],
        "version": {
            "build": "2.4.0",
            "rustc_version": "1.82.0",
            "version": "2.4.0"
        }
    }
}
```
## 通过block_id获取区块信息：
Request:
```
curl --location 'https://docs-demo.near-mainnet.quiknode.pro/' \
--header 'Content-Type: application/json' \
--data '{
    "method": "block",
    "params": {
        "block_id": 140120374 
    },
    "id": 1,
    "jsonrpc": "2.0"
}'
```
Response:
```
{
    "jsonrpc": "2.0",
    "result": {
        "author": "liver.pool.near",
        "chunks": [
            {
                "balance_burnt": "3686970010644200000000",
                "bandwidth_requests": null,
                "chunk_hash": "Db2m6cGa2QBdhpV6ZsNsste71PwhPFGZKk5KD5C6F4TK",
                "congestion_info": {
                    "allowed_shard": 3,
                    "buffered_receipts_gas": "0",
                    "delayed_receipts_gas": "0",
                    "receipt_bytes": 0
                },
                "encoded_length": 27631,
                "encoded_merkle_root": "52D2rKaDxCuULhm2fXCmNS5wVYgDEbRokQgFVqhb1bLY",
                "gas_limit": 1000000000000000,
                "gas_used": 58437016413906,
                "height_created": 140120374,
                "height_included": 140120374,
                "outcome_root": "FtvkHgxfd9vtjnd36eM5Ma5uPhgQhFMiuNEoZEFmt3sj",
                "outgoing_receipts_root": "DSbyYYY7Vb8piao7tG5QGhAWC7R87LtrK1c1h4CjQgz1",
                "prev_block_hash": "2Fx2mLFHNfDnEKzUBBP2tTPrhmwF2Cowk5nDN9HWUjLg",
                "prev_state_root": "C4W1pHUB7r5dbcaUUvkrrT3QW9q47GJQTDz3MrUBNwsu",
                "rent_paid": "0",
                "shard_id": 0,
                "signature": "ed25519:4nUxTqu2nWrBXqcjMUQM9B1LBfbDVh3kjyhxLSHYxvXP7JGnvuFh7fPfyr1ZgQgvT4fbivF7yM7PLGAtBxc8cZv3",
                "tx_root": "9XVRQ14udKsjaBGynvAFHn1kA7khjbiywUYBqrquLtyi",
                "validator_proposals": [],
                "validator_reward": "0"
            },
            {
                "balance_burnt": "0",
                "bandwidth_requests": null,
                "chunk_hash": "BmfLqWGdyK5RCQQ9cxfBEaqQkgQdJ4R9A5KVvyLw4hyp",
                "congestion_info": {
                    "allowed_shard": 4,
                    "buffered_receipts_gas": "0",
                    "delayed_receipts_gas": "0",
                    "receipt_bytes": 0
                },
                "encoded_length": 8,
                "encoded_merkle_root": "9zYue7drR1rhfzEEoc4WUXzaYRnRNihvRoGt1BgK7Lkk",
                "gas_limit": 1000000000000000,
                "gas_used": 0,
                "height_created": 140120374,
                "height_included": 140120374,
                "outcome_root": "11111111111111111111111111111111",
                "outgoing_receipts_root": "AChfy3dXeJjgD2w5zXkUTFb6w8kg3AYGnyyjsvc7hXLv",
                "prev_block_hash": "2Fx2mLFHNfDnEKzUBBP2tTPrhmwF2Cowk5nDN9HWUjLg",
                "prev_state_root": "BxJD4MYtpK1KEwhQKguPSKb8vbxXmRoWuce1AeYybKdn",
                "rent_paid": "0",
                "shard_id": 1,
                "signature": "ed25519:5uoW9fnHJp1gjJYNWuEGJRVCZNRCct6LaZ68JiufZUBKNfZFaCCqN7dR94KqLh8gwjMKef9uwvd4CNw54Jii4Ek7",
                "tx_root": "11111111111111111111111111111111",
                "validator_proposals": [],
                "validator_reward": "0"
            },
            {
                "balance_burnt": "1303281417378500000000",
                "bandwidth_requests": null,
                "chunk_hash": "3TZLjGPEFT1d7Shc7QXP1PQpSKJrKGEzs2KPqsXJ6ERo",
                "congestion_info": {
                    "allowed_shard": 5,
                    "buffered_receipts_gas": "0",
                    "delayed_receipts_gas": "0",
                    "receipt_bytes": 0
                },
                "encoded_length": 8127,
                "encoded_merkle_root": "Cp5Fnffx6VkwWCJq97BrPA9nFFfcQ81zAiQap1by9knQ",
                "gas_limit": 1000000000000000,
                "gas_used": 22913880431376,
                "height_created": 140120374,
                "height_included": 140120374,
                "outcome_root": "3pWt5mkYnXdrU17x44mmQDrTMh633ZugvENaDfs2K1NF",
                "outgoing_receipts_root": "2Qg1cmxFoVpjPSNUJS6sg67sJSWN3Aaom9Rc6y7QDJbS",
                "prev_block_hash": "2Fx2mLFHNfDnEKzUBBP2tTPrhmwF2Cowk5nDN9HWUjLg",
                "prev_state_root": "6SgLP4K8fKvJzFczQCYmgzTvQZVpGpfMXCSoLPyscQWD",
                "rent_paid": "0",
                "shard_id": 2,
                "signature": "ed25519:3cCn4h7y5dFF9rQLAg8eKxAcZNHaRMUQJxJscy8h2pfBBczWGhmb5vzQxZkaxGjRoXGcAqnNkhsNnvyMXVUhN9QF",
                "tx_root": "AtaZbXefK67e9YBKgoGkjpWwPKyoks1wvMGy43CtrKRi",
                "validator_proposals": [],
                "validator_reward": "0"
            },
            {
                "balance_burnt": "11250823413661100000000",
                "bandwidth_requests": null,
                "chunk_hash": "HPd3TJZH5FMJsgPSCrMDQmdLwpf2R85sFrL5yCrMHBgL",
                "congestion_info": {
                    "allowed_shard": 0,
                    "buffered_receipts_gas": "0",
                    "delayed_receipts_gas": "0",
                    "receipt_bytes": 0
                },
                "encoded_length": 28187,
                "encoded_merkle_root": "xcgiKF1nwXWL93DESTfMULzTqN348DSYjNyAzUnRxvY",
                "gas_limit": 1000000000000000,
                "gas_used": 142811102535894,
                "height_created": 140120374,
                "height_included": 140120374,
                "outcome_root": "DMN5cXEfECbqG9rSfToix4RwWVzSYi4JX7nkVZ4KMT7o",
                "outgoing_receipts_root": "Kq9DJYuWszZHMkMcj1gWxKifKUfps77Z61jSDKD7Pep",
                "prev_block_hash": "2Fx2mLFHNfDnEKzUBBP2tTPrhmwF2Cowk5nDN9HWUjLg",
                "prev_state_root": "5ZKh3nNdeAvxvVdYHEynUWTVWryTUUv8rHZJidpJPpqi",
                "rent_paid": "0",
                "shard_id": 3,
                "signature": "ed25519:3fQ7D9uNDgBoAuWV6ZtUSFGiYxEif6wZiTQXVsvtUEdfKNFsNKZJqXSepvSpfim6yiQFHM7mn6tQmQHL5BAfQ2uB",
                "tx_root": "3JsvHqBVLHxad9myuGMukbZgnDPGXNjyPpUmm5TCjKxY",
                "validator_proposals": [],
                "validator_reward": "0"
            },
            {
                "balance_burnt": "3381622400119000000000",
                "bandwidth_requests": null,
                "chunk_hash": "4cofme4uQ2yQyEgEQmt5EAvqaKknY6ryebeMr5QFgxEn",
                "congestion_info": {
                    "allowed_shard": 1,
                    "buffered_receipts_gas": "0",
                    "delayed_receipts_gas": "0",
                    "receipt_bytes": 0
                },
                "encoded_length": 32092,
                "encoded_merkle_root": "3EqGNSAe56ENNuW7EvSFRDgMQag2d4uXPAo3MWurDiQg",
                "gas_limit": 1000000000000000,
                "gas_used": 43356572299405,
                "height_created": 140120374,
                "height_included": 140120374,
                "outcome_root": "67RduEk8vpNVibtXmp3H6UVqEguTimMWpL4ZeA1taxDY",
                "outgoing_receipts_root": "HF3573vuqU3SnEUQmyyuSfYhcNYawK44ZyB73zVPt5uR",
                "prev_block_hash": "2Fx2mLFHNfDnEKzUBBP2tTPrhmwF2Cowk5nDN9HWUjLg",
                "prev_state_root": "93geFfRk8b48XZ15nNcm81hSMMifqZzo3Xnawgsup1Az",
                "rent_paid": "0",
                "shard_id": 4,
                "signature": "ed25519:4X3QphgxKS2pN4rfLRtpCndW3CbhntJdPvYkVR1FXeeP1tFXmpvSmjTewz9owTBobvX7Lp6CWkUjnvBNr2sxSQo1",
                "tx_root": "8JH3DXJjipU4who2GbZcmLBZHPH54jwyvio3bHvmA7Bk",
                "validator_proposals": [],
                "validator_reward": "0"
            },
            {
                "balance_burnt": "12996029242307900000000",
                "bandwidth_requests": null,
                "chunk_hash": "oenCHPNKenCQW1FSGb1YFuxLnmKPRWcjFka3rFTpcwT",
                "congestion_info": {
                    "allowed_shard": 2,
                    "buffered_receipts_gas": "0",
                    "delayed_receipts_gas": "0",
                    "receipt_bytes": 0
                },
                "encoded_length": 22780,
                "encoded_merkle_root": "G7DAsC2dAai1iCuk46WngfYczRo6zT4RW862PxphfzFX",
                "gas_limit": 1000000000000000,
                "gas_used": 139408345628230,
                "height_created": 140120374,
                "height_included": 140120374,
                "outcome_root": "AWZEsneXVJUUpR8NQPUJKjsh1dEinHWLSNF2iYfLKiWZ",
                "outgoing_receipts_root": "4sE1hw2ZqS7dATbngCHXJJcNWNEkE1dS4xVq6U5Hdhtf",
                "prev_block_hash": "2Fx2mLFHNfDnEKzUBBP2tTPrhmwF2Cowk5nDN9HWUjLg",
                "prev_state_root": "7ptSwR8x6f4nGxjGnXiUmcgXDmJ4uswEXeZyPpqCh29r",
                "rent_paid": "0",
                "shard_id": 5,
                "signature": "ed25519:63cW4xYTH93KobDGhEdGhQmLfa45F3pBVTDR7DMNgfA8qnVxpcjQ7cfnUp4fv54mXRRnh53fwCMPFmkennZdTRjR",
                "tx_root": "4XHNFdegnVjG4dxex8eyDs7mzeBNouyXFGE32dKVTzSe",
                "validator_proposals": [],
                "validator_reward": "0"
            }
        ],
        "header": {
            "approvals": [
                "ed25519:4tmrAZDQsch2EXk3ehJZgnSSVuDgcaCMrKRCzGrXY64pbcVBgjQYqLVZXWJeQrv4oNz6ZLfnXUjLqoasGGLS6iSZ",
                "ed25519:47ZnczCdTFinWsR9DdhjrZjBk9A2nZtupeXo85r5emPiyYFyfetBV99yy8C666d9eHARrLkKZjPXFb57p4ane2Bo",
                "ed25519:2JRyyMv2zvry8swHb6PcVjETTLRUSZJxhcWo5khX85kkRe6cY6EMsZeum3Zi6tiXkSDwLcmAhjR73dVrPcXrLTDa",
                null,
                null,
                "ed25519:2aA21r9HKHyR1HrCpsx73DPhRFfP6UXwcmv13aS3ijuG1yKkxqdKKPkAyMMcp6Nkw3sJ3D7f4CHSdgeSKe5U8NRY",
                "ed25519:i7zoSbPfu8cbiq6YmdzDJMt2zJuyDV39ndhouvmu2mPn1SU25Y9vg3rHJ8FrTrxE1NkxVNADvU5qhHD7G7f4JB4",
                "ed25519:3yDepD6XSiqQSS2EfCpAREtSKNFAv2bFqCpj16CVikTMAcpDVeEK55ByiYakepPs1ZvPBXPussK2ALCQchqgk1wk",
                "ed25519:BSwPRYxHZWv9HWj2Ux8iCnXTTydiiVmHX3NMcKVEWRY97tuGFqDutBwAGxDcPS5kYGygcZHM4jSgbUds9eBapGb",
                null,
                "ed25519:65LDcepHFRbhigiYJ336Rn3eUNAZhkMCcLXVHfTzj3S6Z9TNhYreC2LD1k5LF11CStGD9KgrqdRHnaCHZGgDZv8c",
                "ed25519:TtBV4HiAfFMaGYMPVem49zWMB3BtyJmwJMwZMc6CfKDKxQTKkWZSzZfnzpN7zUvNs23vWASBeXteGGJs7r9yex6",
                null,
                "ed25519:GoWwEdoUdYx3a53GKsfz8SAX77bCyuRdDKVvhK39kwDXsZLZisorm4Ws3NFvZRfNq6yLXRohM1h92c3iMXU6Esc",
                null,
                "ed25519:3Eup1HVJiNNibpPDXLaYYjdF9esG29USmXH6Ew5sZ9dAYe3GkCDG3EtcmFtdE9peiq8ATsPdYroS6yhNtrcJSwSg",
                "ed25519:56LNXLERtzisZhf1R8whpSjehg47RkduwF7z3LDRHk667DFYV9bryrPgKhbZwLrqwSvC42W5jhQD1mVjLv6WcSFt",
                "ed25519:2kst7QCbDV7CupyJgQZzZYjwUD81bednpV3oQCTEvwyXE1dqPiFvFsNz7semj5k2NpNpwG9qGXQYhUpTM2EAyn5T",
                "ed25519:2TjCAsomy4cfUMVFFxVBpqU89awtK37ovEKxZSA9AtpZehcwuatLo2wiyoq9GFTKFj6EsGdW5titaiAfqMwqddaX",
                null,
                "ed25519:4wRbpSmNpVg82KTn2tTt3fAi1yaLEhqkUggNH2XojPkp1WhMCwVed2rfZUoaQfBdnX3LtaziWnUenDiB5WZDEp2b",
                null,
                null,
                "ed25519:3si9MrYKUSTQQRAuKrys8yZ6SKeEPCwjXYUTzg4gp36HL2BUuAbzdh7JBi5T2ryYv3s5Zhty14iFCVX1RS7xQi6R",
                "ed25519:51PntMxytpkSia3fxzZCi8bzYphxznD88whfcCV9PzihAqNdufvQ4eyRcaWdT4eLLVfSvU4sDw7cH3RYF2EM2i7Z",
                "ed25519:5hYSUAsc63GZauHw9F6A8A488eYnPDz7RnX4AiA71XHtPJxmNDxwXF8rxAs81pdka6vJW8rVywxeBwWWZSGzoDgb",
                null,
                "ed25519:YEbHXKhLtBi1QVwDgGn53yjtX34KcDqB2LTunVHwTKNHsfBHvinmonCVbzwUgGE37VaGtdS1DFhBG4k7WiuBSDS",
                "ed25519:5FSKHpR8835ZS4ttChn7vPnf2wgxdJir9pqQtscJe3sEu7ieVAmoytECBycCxdbUk9xUKhfgtTB3nTyYyAkCTBWh",
                "ed25519:538NHDbPy1yJqRenMbfMzWtCe5PyTHfh4uu7WmeoFaXeoMssvhaEhw1zrdHPnstk79aEhkcFiwJHSSUZX6TtdVfi",
                "ed25519:4QG6ZrJLno6wTBn9CZqLaGYhUVmu387rYPkw2osGkAEMeE6s6FaDroQBvpUQiNLaXBQjqVR9XCBjH4pvzcZLgkoF",
                "ed25519:3kTPKRT8opH72v8QJCes5gNqWxh4tLUj1yqekSG2EJokXtJYKDSsMXhEM6v3o8CLZEg8jTH9GSCb73RYif8CJy7Q",
                "ed25519:4YDFfAntTqk2nMZu1mPLM3FFoJpBgUZiHotszYZRj8Pu14EgHwKPussHsHmqLGznBevPbSDvTZZtbfU2Rb6xiZh1",
                "ed25519:BhMaMCdtZB4K6jzsFryeAQddH7T6pXbZBsCutwoVF7D6XpWuGNvjT4JnXADzuy1mozuidsEv6gXMFuD97Qp94M6",
                "ed25519:4N4AQQidBvCPT5PWTEAM2cYVXT3oRd4FD1FMra5XvrQUGKxNrw3EzLapkrTfvDGx4WE5JFYiDKfE6mr1XMPWQ9tx",
                null,
                null,
                null,
                "ed25519:oXjHtwSLwdttBHs8QECtk5EXWDBuZQczonby86PJZV5rpFyQL73Py98hJ1tdDieQrd4cs5VSqwbYHCKL3rdbicj",
                "ed25519:48ofjUv9GWVk82sFwZhVWVSMowEqTCxLrqw55dAico3TFDMHZLTXybhxmowYHs25ZUTyvyRhQZJkCRAPTDpLbSRy",
                "ed25519:Di9jPzoXdGHfzPMThWJQaCGkbtA238rE1TyuA1LMA4EQpQCVPhtjgpKnzobdVJTMwgRR9LMy4EKrQBsi7CkxgiW",
                "ed25519:2SCXizFh5rPa7mTbkb481a8ziaNZYsy72Kwb7xLbcNP9TByRRrpbmFSRUftouv2cSViVJJdzcJn2Ef1APVMRUA3P",
                "ed25519:4K1orwPvd4pczNLVEq5yqLWt1Z3mCiZW9CUXGrQG4TRjTNG5sYHNvdea4Ln9edB2gQRrtoETkmSwGYh5SbQcazrt",
                "ed25519:2tXiZgJThiEmMNJE9zzK64tLJxyEEWAJmWxbgZJ9hLxa6VS7jrpnGJTSoqAFGB3D9QtYzGabpJ75YZngAiZSPjVD",
                "ed25519:3ApUWBe9FUNz5pWRonPKgP88F3csZgoVEg5KfDH17Sbvvpg1uzB3AvNbA4qycTKqXFs8SkD4gMJHnAtgQdzvm4Un",
                "ed25519:2f3TBuZAfDWcYTEJtPJNgD7zrx1wH1zFARaShkwFaK1XU6p2EsJnMtvoZoFcCFjKfn4ngCUUEdzj9JCgPVpPGNJX",
                "ed25519:3aoBtssAUZZJFZsLDXTounYfsNKyExREdXXZT2KLcghMFeXvAPYxpFihVMbNZEZELmv4qDk1WjC2Nvqqhs6YZTHp",
                "ed25519:5vuNTT1wcx85D3BxLHAbDxrYRZnaNoTwDgGzwVPpQhjnFHdmh8B8MsRT7gCTfJ67hJGYjgmQHBqX7m2g3bYefARv",
                null,
                "ed25519:4vBna2An6AM1aNQRGvX5SypYf1TEsFcrz24so7c4xkiBLkD8jUKNipYB1pye55ay6N7sMSsTifMYPXTr1wnLfAv3",
                "ed25519:5w2ZpUcN6ojN14o1ivfpC6q4SkvK6FpKs2xhyqWjm6uirt4QzDZcqMnArJWMvEj19khEVVdyGdehA6vf7cBv4LxT",
                "ed25519:5EEYZPZju9JX3sr5GvpmApycFefctxrN9th9SSErdMTiaguQno8oUvhi9H3221idFMA1MfG6cGNuyTqJVksDnsAg",
                null,
                null,
                "ed25519:3jsBw1f8mF4GmBBiU1fJZpzmsqcbPpzNRV4ujydoN8t4ZJeEVCecppqFZrN6vVuN6h7T9WNKi2E7Xpc5yjiX5H1f",
                "ed25519:22ZNEh2wy6fhRMFFckvBnN8KUiD95TUkwxPUy81bo6pGG7NNkbLAvXLKd93hXy6c88jj3mBrUqRefWmg7u5BHQvb",
                "ed25519:2nrsdDfxpdaRVz5zGAx7J2k4KPViESZ37RsGR38epsZFuAfDA84A3gv1Nf1YDTnckvUgf5hnnxoccTH8m8AKWHDF",
                "ed25519:3ZyJ5amM5GjLgpkvRpd9yrBd9TiHxCPRUXqeXhGU6K9wvwpkPjhQhKTgZQYuzSuxHswowKBhzB9Pi2XHKfebZD8A",
                null,
                null,
                "ed25519:5Nxt8cT3UCTDxCqUGHwahVRfJwvcMBgUXnAnG9E8yKr2p3jYNzW3g5NPE1V2cgS3sXYRq7isT2q4VQPtXcw2k5n4",
                null,
                null,
                "ed25519:3kfUVq8Gi5hX9gGNKKrME6Tar2Ks59dX4M1stb6mimgv4gAtRAMuXHpaN9rXBsvTGZWtEhKkoETtzsEZpTVR6p3v",
                null,
                "ed25519:5EZSRHyfHQvMoonigDannYTyQSKyGfFCwMuyuCcFtXPdsc9j3gTkiSNkEGuQ6C85vnAtzhGmx4VZxVgdKqwuJjV",
                "ed25519:59LdPqszf3LHmAAKTanYsNhemBUF4VT5hwEC67dRAqU1fMFttH5P8gWaPDirHniBifp9A3rqJen1DXq7Kym4Hvwd",
                null,
                "ed25519:x6D95HfYEXMPX2kLkaUc7cMLZhdFPBEf182nzdW7vQpDbU6ZdAPC567TQDy1wbUkqeMjCdGwjX3BFPJGD6jwxWF",
                "ed25519:2MZUFizAnBJR29xYo27Net7XTMbXNkgQo3GeBhWKRftKDAAd88g8Fy8gB8n1geKzQmufE65oACWPuuRPZ7BfoJZK",
                null,
                "ed25519:4ygq1QzPtbRmj2bWdDgF1Y8JtGzkkEQ7tBeUdMzZy7QuNGN6zRVNvST3zSmDGoaxNssJqzSVkG4SExXgRBVwHTBu",
                null,
                "ed25519:2bzPfSUzrm4DHsRz5ZUhBWrLRDVMyz2eC1SZCUjj9xr5HgFRQrRbFsSZuvPf28WfGEnkgqgDg6Ck7fykWQauGSEL",
                "ed25519:4kHCxfASe1HzZ8URNCxN8t1YZucTscqgzQEzHMrm5D4rm3ZuTrtjSnVqABX42qXtUbB15TT32d5iWwuuoxPpftsd",
                "ed25519:3tJm8UBV94skRcvtSAezWLdEVcgyYJHNCrgdUxjUsbuJqcb4HMoyaTmo1VhMzDvZ7yG3zkASsyb3uz4MDx25fcGm",
                "ed25519:3UpshrieRoHQzSfqyb8HZxu8CkhzkVfodd67dYtxkYrBt3Krh9kRcAbgMCSiksXKpk6984CKnsvBPEHEYZdg2PV1",
                null,
                null,
                null,
                "ed25519:3ESK9L5FcrAVc77LTaqCEBVgvCSsQPLok7wKdSuF4Mqu2oyzHgPUfmQbfwfnPmwHp3pS4iDGrpTAbaXzPv3v7zFU",
                "ed25519:7NLu63BcPiZ2nVz4ZPgaVzqWXXxMHYTeGwyxoJSxDMNqySW8gg9V3crqSygbxZHVvFzhiCxRSnthSjvdoayf8Ls",
                "ed25519:ETYq3xZtPA3axu8EDUuFZXvhHyVkT4EKTMrUh3FTgz7zx3dfqsBcmL9DREQs5pAtBvHkht7FD3CAKSQwzQhDNAJ",
                "ed25519:iHeJw9kU4V829h74DuSEfz6ibs1NU2ey1aruebgifGKa36KmHreYKNyh1xJGR8AdcgwjkBb1ZkyooG6gEiV8kHb",
                null,
                "ed25519:3Kyj5s8vK6ZFZfqKCzJsDUFfAMZrMBecUNJ4CKprKSy85hefpjbBPX3cHPzCquJxk9k2zukbYmLNt5fbsD5NDEa3",
                "ed25519:2PtuKoh5xBr7YXMwWzbMXmfbfqChdZ9wvqu3A3Y5hp6erm6F4D3Q5J3wxe6KcVFhwHW8sffTkT4u6GHHLyFmHi8f",
                null,
                null,
                null,
                "ed25519:21Npev2jAkYayCDZqMmmgr6eZMA6fLJHThtoRQLwAEm5FsD4Uc2fGPCesJ6cV6PiaUR6Wrba6pcTeuH4LkfK7tyX",
                "ed25519:5iWL3AAdCCvLWLDcRjqsSZGVeAYnhZfK1vC1myL5ppqABNjBLUVka5jCFp1vvtT7pF9bfsuunMvKKDfX1mtjPMUe",
                "ed25519:2GFD2nL3azZx4PcmZfX52PLH1Aydj6ByiZczxEn2wtK2gh8cKnTXWdtDtsUUjJewNNeDcdBoKsMXu67jnmb9XHSu",
                "ed25519:FZfrtoHW42ZjUSTrdZLZmGyd1wCv9ENvxysJPuYTeGTq5hxjFvhNLXsrBkNYcPa14dZ9KcS5g6irRcKTershSQC",
                "ed25519:3rPyUnCgFDFptbn7S924hE6MXcv2vkhScYPr6eN4J6Vy3VUEQJ5BPoieihAveWueBmmASPkpAib3PAasYk1KsUY2",
                "ed25519:2FKryqS2rxu4UM8uWZy9BsskB2ccnknc3npmhFu78abFfvM1SNyjuPcK74vaJLYk1GiUEKmwCog5NCJF8MSKBdKP",
                "ed25519:8kQht69hZCwAdPhJczJAwLiBnGzAtHKv5D3PCVh6DASmYYjyfnTh2RpSXvsLsASX7xMLB1zS7BqKxRC3GRRyWTH",
                null,
                null,
                "ed25519:S7Wcd7zu1Z3326rhmnuQxWRkHADrzoPwbZrUAeVKM9AQ7UDNTdVEGT6SSQBmcnNfPrWvNzCL3o56UErVtgKb4vE"
            ],
            "block_body_hash": "9S43cVu4H8jXTqMxhDKwhaKnokvfR3hDSJE2PmGspPRG",
            "block_merkle_root": "72A72vHh8x8pXm9pXMehyrWZYj9RJJ2D8m1AQ7UAdTcd",
            "block_ordinal": 129957431,
            "challenges_result": [],
            "challenges_root": "11111111111111111111111111111111",
            "chunk_endorsements": [
                [
                    255,
                    255,
                    255,
                    255,
                    255,
                    127,
                    255,
                    255,
                    255,
                    63
                ],
                [
                    255,
                    255,
                    255,
                    247,
                    255,
                    255,
                    255,
                    255,
                    255,
                    27
                ],
                [
                    255,
                    255,
                    255,
                    255,
                    255,
                    255,
                    247,
                    231,
                    255,
                    1
                ],
                [
                    255,
                    255,
                    255,
                    255,
                    253,
                    251,
                    255,
                    255,
                    15
                ],
                [
                    255,
                    255,
                    255,
                    255,
                    255,
                    255,
                    255,
                    255,
                    255,
                    7
                ],
                [
                    255,
                    255,
                    255,
                    255,
                    255,
                    255,
                    255,
                    191,
                    15
                ]
            ],
            "chunk_headers_root": "24H1DAAPTREm9fyko66SS19V9M3hmMgXvYMiYvgNrTiQ",
            "chunk_mask": [
                true,
                true,
                true,
                true,
                true,
                true
            ],
            "chunk_receipts_root": "G7QB82o72k7LUQWE4XmMtTwdeK19QX8FMNLXSb94K3w5",
            "chunk_tx_root": "2n3geUMjvrPzqFFLPrjCZYMg2DFhBBM1R9VHPz8hRkHq",
            "chunks_included": 6,
            "epoch_id": "8eFis3ZinzzTyycxBSxUBo6xoS78nqJuQfdSrXszyrLb",
            "epoch_sync_data_hash": null,
            "gas_price": "100000000",
            "hash": "5hSfXoaS5BPAgKG1VrjYAXmhisAYoTBk8poJtfx3bpPh",
            "height": 140120374,
            "last_ds_final_block": "2Fx2mLFHNfDnEKzUBBP2tTPrhmwF2Cowk5nDN9HWUjLg",
            "last_final_block": "6x5FfDmxkAtn3ALtgQzf6DNAVGWW7oijkUefNLChvyJT",
            "latest_protocol_version": 73,
            "next_bp_hash": "BfSGPTVvabD6KCLc2SzwrUg5pW3oRBgS4DfpQbx1gieq",
            "next_epoch_id": "8sKEz4tp8JADohqaSGXUwkEF6xNpamvoUoszptxFECUy",
            "outcome_root": "xcXLbsasj8sRxEjJxSseqxWj8XTUJyMZuxFuBNYR6WB",
            "prev_hash": "2Fx2mLFHNfDnEKzUBBP2tTPrhmwF2Cowk5nDN9HWUjLg",
            "prev_height": 140120373,
            "prev_state_root": "AwiXbqzEbE2hfnG7Jy531PepimBHJnbcxWPrWUCPQYhK",
            "random_value": "B1gZKzEBtuPx3z3NaeGo6L6WEU52LyGEaqW8KV22iBUX",
            "rent_paid": "0",
            "signature": "ed25519:WzcrUH54gh1gFSt4kzJ7X3tfxePpWCmMV9JpisQHUCxEe6ZhemaRSgzyFDS4QUud2v89rD36XTFDo1N2kpEBZGc",
            "timestamp": 1739987566724667720,
            "timestamp_nanosec": "1739987566724667720",
            "total_supply": "1236185296108342139096963317520436",
            "validator_proposals": [],
            "validator_reward": "0"
        }
    },
    "id": 1
}
```
## 区块id获取交易信息：
Request:
```
curl --location 'https://docs-demo.near-mainnet.quiknode.pro/' \
--header 'Content-Type: application/json' \
--data '{
    "method": "chunk",
    "params": {
        "block_id": 80712125,
        "shard_id": 0
    },
    "id": 1,
    "jsonrpc": "2.0"
}'
```
Response:
```
{
    "jsonrpc": "2.0",
    "result": {
        "author": "aurora.pool.near",
        "header": {
            "balance_burnt": "0",
            "bandwidth_requests": null,
            "chunk_hash": "8JoY27ADrA534GKWtiU7fkBFRHzgVa6cXJmVjThPzp8u",
            "congestion_info": null,
            "encoded_length": 415,
            "encoded_merkle_root": "8EyxS6SCDScVioygon7sQBqVcfAKFNBZdurnNBjwwf9S",
            "gas_limit": 1000000000000000,
            "gas_used": 223182562500,
            "height_created": 80712125,
            "height_included": 80712125,
            "outcome_root": "B7NuaMuLxHWdxvQhdymaLoh8ksTK1UHHjXBVsbkpcmyc",
            "outgoing_receipts_root": "8s41rye686T2ronWmFE38ji19vgeb6uPxjYMPt8y8pSV",
            "prev_block_hash": "6ZCCmnJGaP6hknzNiFGYzqvoWZzRDkZWQSrvXoH4B7ZL",
            "prev_state_root": "G5o9vYjku2GXy4qobWXnK6uvFLcxPZkmAEcRJQNBYmnm",
            "rent_paid": "0",
            "shard_id": 0,
            "signature": "ed25519:3oLeQC125gsqS5exomq5JiMCJ84Xj1YSbjHVi7mW6XFedx9TpvbuJM85yiTL7yWRT2JxbCsytvonaWpNSLofPNKo",
            "tx_root": "BFm5duguWDn9Axfuazyo6tz1in8H5cNUWSeVaAU7TBp9",
            "validator_proposals": [],
            "validator_reward": "0"
        },
        "receipts": [],
        "transactions": [
            {
                "actions": [
                    {
                        "FunctionCall": {
                            "args": "eyJyZWNlaXZlcl9pZCI6IjI1ZGE5YmYxMzQxYjdlMmFkNzQyMzI1MTdmOTRjYjQ1ODAzNmE1NmU5ZDQ5ZjZkNzU2ZTc5ODM3Mjg3NjAzZWYiLCJhbW91bnQiOiI1NzcwMDAwMDAwMDAwMDAwMDAwIiwibWVtbyI6InN3OnQ6T2o4M200blJ5diJ9",
                            "deposit": "1",
                            "gas": 14000000000000,
                            "method_name": "ft_transfer"
                        }
                    }
                ],
                "hash": "AmgcGo1ZhJeGWnVtgLhLF5rtbBZMefE4kiBC8P6WTN6k",
                "nonce": 79902626000003,
                "priority_fee": 0,
                "public_key": "ed25519:2wVXmiifSKepdeyR27QtHFjrozuyk1UEoxyLagHXjcsQ",
                "receiver_id": "token.sweat",
                "signature": "ed25519:4KuPzbgfoMmn76CMRoZ95P6PfPwqTpSvionigmSnogKva5khX8YBUncxq3ta1d1os5FDbaHLnwvFHXg7qsdPYMXm",
                "signer_id": "1cd14f68f0db046b2012cbf7e447c576151a6282558816ea063143d9eebd9107"
            }
        ]
    },
    "id": 1
}
```
# 附录：
- 官方开发文档: https://docs.near.org/
- 官方文档：https://near.org/
- RPC接口：https://www.quicknode.com/docs/near/chunk
- 钱包：https://app.mynearwallet.com/profile
- github: https://github.com/near/near-api-js/tree/master/packages/cookbook
- 浏览器：https://nearscan.vercel.app/blocks?