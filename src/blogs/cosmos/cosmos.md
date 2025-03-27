# Cosmos 钱包开发详细教程

## 一. Cosmos 简介

Cosmos 是一个去中心化的网络平台，它旨在解决当前区块链技术中的可扩展性和互操作性问题。Cosmos 通过一种称为 Tendermint 核心的共识机制，提供了一种模块化和高效的区块链架构，使不同区块链能够相互通信和协作。

### 1. 概述

Cosmos 是一个分布式网络，包含多个独立的区块链，称为 "zones"，这些区块链通过一个中心枢纽，称为 "Cosmos Hub"，进行互操作。Cosmos 的目标是创建一个能够扩展和互操作的区块链生态系统，使得不同区块链可以无缝地相互通信。

### 2. 关键组件

#### 1. Tendermint

Tendermint 是一种拜占庭容错 (BFT) 共识算法，它为 Cosmos 提供了基础层。Tendermint 核心允许开发人员快速构建高效、安全和可扩展的区块链应用。它包含两个主要部分：

- **Tendermint 核心**：处理网络和共识部分，使区块链能够在不信任的环境中达到共识。
- **Application Blockchain Interface (ABCI)**：允许开发人员用任意编程语言构建应用程序逻辑。

#### 2. Cosmos SDK

Cosmos SDK 是一个开发框架，它帮助开发者创建自定义区块链应用。SDK 提供了一组预定义的模块（例如账户、治理、staking 等），开发者可以使用这些模块构建他们的区块链，也可以创建新的模块来满足特定需求。

#### 3. Inter-Blockchain Communication (IBC) Protocol

IBC 协议是 Cosmos 实现不同区块链之间通信的关键。IBC 允许独立的区块链通过共享的中心枢纽进行通信和资产交换。该协议确保了跨链操作的安全性和可靠性。

#### 4. Cosmos 的互链安全（Interchain Security）

Cosmos 的互链安全是一种增强区块链网络整体安全性的机制，它允许多个区块链共享一个共同的安全层。具体来说，互链安全使较小的区块链（zones）能够利用较大、较安全的区块链（如 Cosmos Hub）的验证者集群来保护自己。这种机制提升了整个 Cosmos 生态系统的安全性和稳定性。

#### 5. Cosmos Hub

Cosmos Hub 是 Cosmos 网络的中心区块链，它充当不同区块链之间的中介，管理跨链通信和资产交换。ATOM 是 Cosmos Hub 的原生加密货币，用于支付交易费用和参与治理。

### 6. 特点和优势

- **可扩展性**：Cosmos 通过分区架构实现了高可扩展性，每个区块链（zone）可以独立处理交易，避免了传统区块链的性能瓶颈问题。
- **可互操作性**：通过 IBC 协议，Cosmos 实现了不同区块链之间的无缝互操作，使得资产和数据能够跨链流动。
- **模块化**：Cosmos SDK 提供了模块化的开发框架，开发者可以灵活地组合预定义模块或创建新模块，快速构建区块链应用。
- **安全性**：Tendermint 核心提供了强大的安全保障，支持拜占庭容错共识，确保在部分节点恶意或故障的情况下，区块链仍能正常运作。

### 7. 实际应用

Cosmos 的技术已经被多个区块链项目采用，用于构建去中心化金融 (DeFi)、供应链管理、社交网络等多种应用场景。通过 Cosmos，开发者可以实现高度可扩展和互操作的区块链解决方案，推动区块链技术在各行业的应用。

### 8. 未来发展

Cosmos 的发展路线图包括进一步优化 IBC 协议、提升 Cosmos SDK 的功能、以及扩展生态系统中的区块链数量。未来，Cosmos 有望成为区块链互操作性的标准解决方案，推动区块链技术的广泛应用和发展。

总结来说，Cosmos 通过其独特的架构和协议，为区块链技术的可扩展性和互操作性问题提供了有效的解决方案，促进了一个去中心化、互联互通的区块链生态系统的形成。

---

## 二. 离线地址生成

### Node.js 代码

```javascript
export async function createAtomAddress (seedHex: string, addressIndex: number, network: string) {
  const node = bip32.fromSeed(Buffer.from(seedHex, 'hex'));
  const child = node.derivePath("m/44'/118'/0'/0/" + addressIndex + '');
  const publicKey = child.publicKey.toString('hex');
  const prefix = 'cosmos';
  const pubkey = {
    type: 'tendermint/PubKeySecp256k1',
    value: toBase64(
      fromHex(
        publicKey
      )
    )
  };
  const address = atomPubkeyToAddress(pubkey, prefix);
  return {
    privateKey: Buffer.from(child.privateKey).toString('hex'),
    publicKey: Buffer.from(child.publicKey).toString('hex'),
    address
  };
}
```

### Python 代码

```python
def generate_wallet():
    privkey = PrivateKey().serialize()
    return {
        "private_key": privkey,
        "public_key": privkey_to_pubkey(privkey),
        "address": privkey_to_address(privkey),
    }

def privkey_to_pubkey(privkey: str) -> str:
    privkey_obj = PrivateKey(bytes.fromhex(privkey))
    return privkey_obj.pubkey.serialize().hex()

def pubkey_to_address(pubkey: str) -> str:
    pubkey_bytes = bytes.fromhex(pubkey)
    s = hashlib.new("sha256", pubkey_bytes).digest()
    r = hashlib.new("ripemd160", s).digest()
    return bech32.bech32_encode("cosmos", bech32.convertbits(r, 8, 5))

def privkey_to_address(privkey: str) -> str:
    pubkey = privkey_to_pubkey(privkey)
    return pubkey_to_address(pubkey)

wallet = generate_wallet()
print(wallet)
```

---

## 三. 离线签名

### Node.js V1 代码

```javascript
export async function signAtomTransaction (params: any): Promise<string> {
  const { privateKey, chainId, from, to, memo, amount, fee, gas, accountNumber, sequence, decimal } = params;
  const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toNumber();
  if (calcAmount % 1 !== 0) throw new Error('amount invalid');
  const calcFee = new BigNumber(fee).times(new BigNumber(10).pow(decimal)).toNumber();
  if (calcFee % 1 !== 0) throw new Error('fee invalid');
  const signDoc = {
    msgs: [
      {
        type: 'cosmos-sdk/MsgSend',
        value: {
          from_address: from,
          to_address: to,
          amount: [{ amount: BigNumber(amount).times(Math.pow(10, decimal)).toString(), denom: 'uatom' }]
        }
      }
    ],
    fee: {
      amount: [{ amount: BigNumber(fee).times(Math.pow(10, decimal)).toString(), denom: 'uatom' }],
      gas: String(gas)
    },
    chain_id: chainId,
    memo: memo || '',
    account_number: accountNumber.toString(),
    sequence: sequence.toString()
  };
  const signer = await Secp256k1Wallet.fromKey(new Uint8Array(Buffer.from(privateKey, 'hex')), 'cosmos');
  const { signature } = await signer.signAmino(from, signDoc);
  const tx = {
    tx: {
      msg: signDoc.msgs,
      fee: signDoc.fee,
      signatures: [signature],
      memo: memo || ''
    },
    mode: 'sync'
  };
  return JSON.stringify(tx);
}
```

### Node.js V2 代码

```javascript
export async function SignV2Transaction(params: any): Promise<string> {
  const {  chainId, from, to, memo, amount_in, fee, gas, accountNumber, sequence, decimal, privateKey } = params;
  
  const amount = BigNumber(amount_in).times(Math.pow(10, decimal)).toString();
  const feeAmount = BigNumber(fee).times(Math.pow(10, decimal)).toString();
  const unit = "uatom";
  if (amount.toString().indexOf(".") !== -1) {
    throw new Error('input amount value invalid.');
  }
  if (feeAmount.toString().indexOf(".") !== -1) {
    throw new Error('input amount value invalid.');
  }
  if (!verifyAddress({ address: from }) || !verifyAddress({ address: to })) {
    throw new Error('input address value invalid.');
  }
  const sendMessage = createSendMessage(
      from,
      to,
      amount,
      unit
  );
  const messages = [sendMessage];
  const txBody = createTxBody(messages, memo);
  const { pubkey } = await Secp256k1Wallet.fromKey(
      fromHex(privateKey),
      "cosmos"
  );
  const authInfo = await getAuthInfo(
      pubkey,
      sequence.toString(),
      feeAmount,
      unit,
      gas
  );
  const signDoc = getSignDoc(chainId, txBody, authInfo, accountNumber);
  const signature = getDirectSignature(signDoc, fromHex(privateKey));
  const txRawBytes = createTxRawBytes(
      txBody,
      authInfo,
      signature
  );
  const txBytesBase64 = Buffer.from(txRawBytes, 'binary').toString('base64');
  const txRaw = { tx_bytes: txBytesBase64, mode: "BROADCAST_MODE_SYNC" };
  return JSON.stringify(txRaw);
}
```

### Python 代码

```python
import base64
import json
from secp256k1 import PrivateKey
from address import privkey_to_address, privkey_to_pubkey

class Transaction:
    def __init__(self, *, privkey: str, account_num:int, sequence:int, fee:int, gas:int, memo:str = "", chain_id: str = "cosmoshub-2",sync_mode = "sync"):
        self.privkey = privkey
        self.account_num = account_num
        self.sequence = sequence
        self.fee = fee
        self.gas = gas
        self.memo = memo
        self.chain_id = chain_id
        self.sync_mode = sync_mode
        self.msgs = []
    def add_atom_transfer(self, recipient: str, amount: int) -> None:
        self.msgs.append(
            {
                "type": "cosmos-sdk/MsgSend",
                "value": {
                    "from_address": privkey_to_address(self.privkey),
                    "to_address": recipient,
                    "amount": [{"denom": "uatom", "amount": str(amount)}],
                },
            }
        )


    def _get_sign_message(self):
        return {
            "chain_id": self.chain_id,
            "account_number": str(self.account_num),
            "fee": {"gas": str(self.gas), "amount": [{"amount": str(self.fee), "denom": "uatom"}]},
            "memo": self.memo,
            "sequence": str(self.sequence),
            "msgs": self.msgs,
        }

    def _sign(self) -> str:
        message_str = json.dumps(self._get_sign_message(), separators=(",", ":"), sort_keys=True)
        message_bytes = message_str.encode("utf-8")
        privkey = PrivateKey(bytes.fromhex(self.privkey))
        signature = privkey.ecdsa_sign(message_bytes)
        signature_compact = privkey.ecdsa_serialize_compact(signature)
        signature_base64_str = base64.b64encode(signature_compact).decode("utf-8")
        return signature_base64_str

    def get_pushable_tx(self) -> str:
        pubkey = privkey_to_pubkey(self.privkey)
        base64_pubkey = base64.b64encode(bytes.fromhex(pubkey)).decode("utf-8")
        pushable_tx = {
            "tx": {
                "msg": self.msgs,
                "fee": {
                    "gas": str(self.gas),
                    "amount": [{"denom": "uatom", "amount": str(self.fee)}],
                },
                "memo": self.memo,
                "signatures": [
                    {
                        "signature": self._sign(),
                        "pub_key": {"type": "tendermint/PubKeySecp256k1", "value": base64_pubkey},
                        "account_number": str(self.account_num),
                        "sequence": str(self.sequence),
                    }
                ],
            },
            "mode": self.sync_mode,
        }
        return json.dumps(pushable_tx, separators=(",", ":"))


tx = Transaction(
    privkey="priKey",
    account_num=11335,
    sequence=0,
    fee=1000,
    gas=37000,
    memo="",
    chain_id="cosmoshub-2",
    sync_mode="sync",
)

tx.add_atom_transfer(recipient="cosmos103l758ps7403sd9c0y8j6hrfw4xyl70j4mmwkf", amount=387000)
pushable_tx = tx.get_pushable_tx()
print(pushable_tx)
```

---

## 四. Cosmos 钱包开发中用到的 API

### 1. 获取账户信息

```bash
curl --location 'https://cosmos-rest.publicnode.com/cosmos/auth/v1beta1/account_info/{address}'
```

返回值
```json
{
    "info": {
        "address": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu",
        "pub_key": {
            "@type": "/cosmos.crypto.secp256k1.PubKey",
            "key": "A26PAcbmjZxcZqsXL/CJgjTHqImZeAJDe85ufR+JFh/B"
        },
        "account_number": "2782398",
        "sequence": "1"
    }
}
```

### 2. 获取最新块高

```bash
curl --location 'https://cosmos-rest.publicnode.com/cosmos/base/tendermint/v1beta1/blocks/latest'
```

返回值
```json
{
  "block_id": {
    "hash": "Cr9rJ/PdYLz/QJQcS6Q/AJghKbWF6dvWD7LNO8ukpU0=",
    "part_set_header": {
      "total": 1,
      "hash": "pxCRahdweihOWcvXUId/8quOkq1iQd9FN5yYOkebCHM="
    }
  },
  "block": {
    "header": {
      "version": {
        "block": "11",
        "app": "0"
      },
      "chain_id": "cosmoshub-4",
      "height": "20623348",
      "time": "2024-05-28T12:39:29.860619997Z",
      "last_block_id": {
        "hash": "gbn8ySZ9MLY4Jl/TimgWKts3hiFXmF94ASFDIcT/ybw=",
        "part_set_header": {
          "total": 1,
          "hash": "uOn9tB+l+dyJuCLTzq0+5RvEFlGBBCXPfXm3yGSHGQk="
        }
      },
      "last_commit_hash": "PiCAPoXY18mOrOsi+/ngCDWF2fyTYVYz54kV74fJl+s=",
      "data_hash": "PS+gr4pphuFkMVK8C6NzjbuYHqG3Eop4M4B4pvxAkqw=",
      "validators_hash": "mF8rzuSavUuga45BXZMqCOG1sqNX2cZJf/ViVgjxxCg=",
      "next_validators_hash": "zchpzRRe3grdEiTOOS+/aO8WxjngeZNlGhE+cxkQ2ZQ=",
      "consensus_hash": "DHGkgcYVHl/p32F/XoN09hpJ6geIV5TuqUCt/SmT2f4=",
      "app_hash": "WdTmJA2XP/nEOjKSKp9zzdHnk6oqIYfp0f6Rz7v0fzM=",
      "last_results_hash": "4upz/IMEvhS3V0IIQLEbyfQhOtjf9klwr3mObDCBivA=",
      "evidence_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
      "proposer_address": "0tRY+SCey4yiqrHZngZhG4Eqh5c="
    },
    "data": {
      "txs": [
        "CqMBCqABCjcvY29zbW9zLmRpc3RyaWJ1dGlvbi52MWJldGExLk1zZ1dpdGhkcmF3RGVsZWdhdG9yUmV3YXJkEmUKLWNvc21vczFlbHVoY2czZ2c2OXlyZ2ZneHpobXo5YzNnN3E2OGVyZ2p1YXV5cRI0Y29zbW9zdmFsb3BlcjEzMG1kdTlhMGV0bWV1dzUycWZ4azczcG4wZ2E2Z2F3a3hzcmx3ZhJoClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiECMuj1gq1yySK0t9md1ewoiHrDF51xQxVfumbIKHHBR/4SBAoCCH8YDxIUCg4KBXVhdG9tEgUxOTk0MBCB1zAaQBIEhgcjMywzIoDOSOSTpsPCh3usuDtINrWTA9QrL5qOYk/smgi8UvxXTFdB9pzwHSIEyG+xtb9v0R1NekPPUvM=",
        "CrsBCooBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmoKLWNvc21vczE4Y2p3ZWN4Y2c1Mmp6OTVkaHBkZzl1Y3JxM2NjeGYybHV1NjVnNRItY29zbW9zMW1ydHRhOXpjMGRzaDMwdmZkcXZmYW04a3djZ3g2cmdrYW0yam51GgoKBXVhdG9tEgExEixwcnl6bTE4Y2p3ZWN4Y2c1Mmp6OTVkaHBkZzl1Y3JxM2NjeGYybHl2ZG5rOBJnClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiECjHhA4pLCWWUbidhR9yMjsBSUnSRHSrCcmuDFcj3ZMp0SBAoCCH8YAxITCg0KBXVhdG9tEgQxNjkyENqQBBpAMRNaVaMWbdUgfpiRkC9LTB93FMWztlsIaTEk82zIMzZdRch9SqKbiEH433Ar9xyPQUrsM40OUWR+rNTRlXggqw=="
      ]
    },
    "evidence": {
      "evidence": []
    },
    "last_commit": {}
  },
  "sdk_block": {}
}
```

### 3. 根据块号获取交易

```bash
curl --location 'https://cosmos-rest.publicnode.com/cosmos/base/tendermint/v1beta1/blocks/20623348' \
--data ''
```

返回值
```json
{
  "block_id": {
    "hash": "Cr9rJ/PdYLz/QJQcS6Q/AJghKbWF6dvWD7LNO8ukpU0=",
    "part_set_header": {
      "total": 1,
      "hash": "pxCRahdweihOWcvXUId/8quOkq1iQd9FN5yYOkebCHM="
    }
  },
  "block": {
    "header": {
      "version": {
        "block": "11",
        "app": "0"
      },
      "chain_id": "cosmoshub-4",
      "height": "20623348",
      "time": "2024-05-28T12:39:29.860619997Z",
      "last_block_id": {
        "hash": "gbn8ySZ9MLY4Jl/TimgWKts3hiFXmF94ASFDIcT/ybw=",
        "part_set_header": {
          "total": 1,
          "hash": "uOn9tB+l+dyJuCLTzq0+5RvEFlGBBCXPfXm3yGSHGQk="
        }
      },
      "last_commit_hash": "PiCAPoXY18mOrOsi+/ngCDWF2fyTYVYz54kV74fJl+s=",
      "data_hash": "PS+gr4pphuFkMVK8C6NzjbuYHqG3Eop4M4B4pvxAkqw=",
      "validators_hash": "mF8rzuSavUuga45BXZMqCOG1sqNX2cZJf/ViVgjxxCg=",
      "next_validators_hash": "zchpzRRe3grdEiTOOS+/aO8WxjngeZNlGhE+cxkQ2ZQ=",
      "consensus_hash": "DHGkgcYVHl/p32F/XoN09hpJ6geIV5TuqUCt/SmT2f4=",
      "app_hash": "WdTmJA2XP/nEOjKSKp9zzdHnk6oqIYfp0f6Rz7v0fzM=",
      "last_results_hash": "4upz/IMEvhS3V0IIQLEbyfQhOtjf9klwr3mObDCBivA=",
      "evidence_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
      "proposer_address": "0tRY+SCey4yiqrHZngZhG4Eqh5c="
    },
    "data": {
      "txs": [
        "CqMBCqABCjcvY29zbW9zLmRpc3RyaWJ1dGlvbi52MWJldGExLk1zZ1dpdGhkcmF3RGVsZWdhdG9yUmV3YXJkEmUKLWNvc21vczFlbHVoY2czZ2c2OXlyZ2ZneHpobXo5YzNnN3E2OGVyZ2p1YXV5cRI0Y29zbW9zdmFsb3BlcjEzMG1kdTlhMGV0bWV1dzUycWZ4azczcG4wZ2E2Z2F3a3hzcmx3ZhJoClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiECMuj1gq1yySK0t9md1ewoiHrDF51xQxVfumbIKHHBR/4SBAoCCH8YDxIUCg4KBXVhdG9tEgUxOTk0MBCB1zAaQBIEhgcjMywzIoDOSOSTpsPCh3usuDtINrWTA9QrL5qOYk/smgi8UvxXTFdB9pzwHSIEyG+xtb9v0R1NekPPUvM=",
        "CrsBCooBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmoKLWNvc21vczE4Y2p3ZWN4Y2c1Mmp6OTVkaHBkZzl1Y3JxM2NjeGYybHV1NjVnNRItY29zbW9zMW1ydHRhOXpjMGRzaDMwdmZkcXZmYW04a3djZ3g2cmdrYW0yam51GgoKBXVhdG9tEgExEixwcnl6bTE4Y2p3ZWN4Y2c1Mmp6OTVkaHBkZzl1Y3JxM2NjeGYybHl2ZG5rOBJnClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiECjHhA4pLCWWUbidhR9yMjsBSUnSRHSrCcmuDFcj3ZMp0SBAoCCH8YAxITCg0KBXVhdG9tEgQxNjkyENqQBBpAMRNaVaMWbdUgfpiRkC9LTB93FMWztlsIaTEk82zIMzZdRch9SqKbiEH433Ar9xyPQUrsM40OUWR+rNTRlXggqw=="
      ]
    },
    "evidence": {
      "evidence": []
    },
    "last_commit": {}
  },
  "sdk_block": {

    },
    "last_commit": {}
  }
}
```

### 4. 交易解码

```bash
curl --location 'https://cosmos-rest.publicnode.com/cosmos/tx/v1beta1/decode' \
--header 'Content-Type: application/json' \
--data '{
    "tx_bytes": "CrsBCooBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmoKLWNvc21vczE4Y2p3ZWN4Y2c1Mmp6OTVkaHBkZzl1Y3JxM2NjeGYybHV1NjVnNRItY29zbW9zMW1ydHRhOXpjMGRzaDMwdmZkcXZmYW04a3djZ3g2cmdrYW0yam51GgoKBXVhdG9tEgExEixwcnl6bTE4Y2p3ZWN4Y2c1Mmp6OTVkaHBkZzl1Y3JxM2NjeGYybHl2ZG5rOBJnClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiECjHhA4pLCWWUbidhR9yMjsBSUnSRHSrCcmuDFcj3ZMp0SBAoCCH8YAxITCg0KBXVhdG9tEgQxNjkyENqQBBpAMRNaVaMWbdUgfpiRkC9LTB93FMWztlsIaTEk82zIMzZdRch9SqKbiEH433Ar9xyPQUrsM40OUWR+rNTRlXggqw=="
}'
```

返回值
```
{
    "tx": {
        "body": {
            "messages": [
                {
                    "@type": "/cosmos.bank.v1beta1.MsgSend",
                    "from_address": "cosmos18cjwecxcg52jz95dhpdg9ucrq3ccxf2luu65g5",
                    "to_address": "cosmos1mrtta9zc0dsh30vfdqvfam8kwcgx6rgkam2jnu",
                    "amount": [
                        {
                            "denom": "uatom",
                            "amount": "1"
                        }
                    ]
                }
            ],
            "memo": "pryzm18cjwecxcg52jz95dhpdg9ucrq3ccxf2lyvdnk8",
            "timeout_height": "0",
            "extension_options": [],
            "non_critical_extension_options": []
        },
        "auth_info": {
            "signer_infos": [
                {
                    "public_key": {
                        "@type": "/cosmos.crypto.secp256k1.PubKey",
                        "key": "Aox4QOKSwlllG4nYUfcjI7AUlJ0kR0qwnJrgxXI92TKd"
                    },
                    "mode_info": {
                        "single": {
                            "mode": "SIGN_MODE_LEGACY_AMINO_JSON"
                        }
                    },
                    "sequence": "3"
                }
            ],
            "fee": {
                "amount": [
                    {
                        "denom": "uatom",
                        "amount": "1692"
                    }
                ],
                "gas_limit": "67674",
                "payer": "",
                "granter": ""
            },
            "tip": null
        },
        "signatures": [
            "MRNaVaMWbdUgfpiRkC9LTB93FMWztlsIaTEk82zIMzZdRch9SqKbiEH433Ar9xyPQUrsM40OUWR+rNTRlXggqw=="
        ]
    }
}
```

### 5. 根据交易 Hash 获取交易信息

```bash
curl --location 'https://cosmos-rest.publicnode.com/cosmos/tx/v1beta1/txs/E798BB4EFBF9495B56733248E46C9AE3C4F7FEA2F1F959E6FC64A7C3E5DD6C56'
```

返回值
```json
{
    "tx": {
        "body": {
            "messages": [
                {
                    "@type": "/cosmos.bank.v1beta1.MsgSend",
                    "from_address": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu",
                    "to_address": "cosmos1er40wr3v78awxt02k4hq6evl3qjrpd4fkdmmq3",
                    "amount": [
                        {
                            "denom": "uatom",
                            "amount": "100000"
                        }
                    ]
                }
            ],
            "memo": "1010",
            "timeout_height": "0",
            "extension_options": [],
            "non_critical_extension_options": []
        },
        "auth_info": {
            "signer_infos": [
                {
                    "public_key": {
                        "@type": "/cosmos.crypto.secp256k1.PubKey",
                        "key": "A26PAcbmjZxcZqsXL/CJgjTHqImZeAJDe85ufR+JFh/B"
                    },
                    "mode_info": {
                        "single": {
                            "mode": "SIGN_MODE_DIRECT"
                        }
                    },
                    "sequence": "0"
                }
            ],
            "fee": {
                "amount": [
                    {
                        "denom": "uatom",
                        "amount": "50000"
                    }
                ],
                "gas_limit": "95843",
                "payer": "",
                "granter": ""
            },
            "tip": null
        },
        "signatures": [
            "X+fNbORNm/pMJNWEF3r/AT1m8dbOMfhYaoRitGQWScF+3ItNTiOceEiOtRI0aF1UYSlUBfOc2GlCFnrRwqGFWg=="
        ]
    },
    "tx_response": {
        "height": "20622218",
        "txhash": "E798BB4EFBF9495B56733248E46C9AE3C4F7FEA2F1F959E6FC64A7C3E5DD6C56",
        "codespace": "",
        "code": 0,
        "data": "12260A242F636F736D6F732E62616E6B2E763162657461312E4D736753656E64526573706F6E7365",
        "raw_log": "[{\"msg_index\":0,\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/cosmos.bank.v1beta1.MsgSend\"},{\"key\":\"sender\",\"value\":\"cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu\"},{\"key\":\"module\",\"value\":\"bank\"}]},{\"type\":\"coin_spent\",\"attributes\":[{\"key\":\"spender\",\"value\":\"cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu\"},{\"key\":\"amount\",\"value\":\"100000uatom\"}]},{\"type\":\"coin_received\",\"attributes\":[{\"key\":\"receiver\",\"value\":\"cosmos1er40wr3v78awxt02k4hq6evl3qjrpd4fkdmmq3\"},{\"key\":\"amount\",\"value\":\"100000uatom\"}]},{\"type\":\"transfer\",\"attributes\":[{\"key\":\"recipient\",\"value\":\"cosmos1er40wr3v78awxt02k4hq6evl3qjrpd4fkdmmq3\"},{\"key\":\"sender\",\"value\":\"cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu\"},{\"key\":\"amount\",\"value\":\"100000uatom\"}]},{\"type\":\"message\",\"attributes\":[{\"key\":\"sender\",\"value\":\"cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu\"}]}]}]",
        "logs": [
            {
                "msg_index": 0,
                "log": "",
                "events": [
                    {
                        "type": "message",
                        "attributes": [
                            {
                                "key": "action",
                                "value": "/cosmos.bank.v1beta1.MsgSend"
                            },
                            {
                                "key": "sender",
                                "value": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu"
                            },
                            {
                                "key": "module",
                                "value": "bank"
                            }
                        ]
                    },
                    {
                        "type": "coin_spent",
                        "attributes": [
                            {
                                "key": "spender",
                                "value": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu"
                            },
                            {
                                "key": "amount",
                                "value": "100000uatom"
                            }
                        ]
                    },
                    {
                        "type": "coin_received",
                        "attributes": [
                            {
                                "key": "receiver",
                                "value": "cosmos1er40wr3v78awxt02k4hq6evl3qjrpd4fkdmmq3"
                            },
                            {
                                "key": "amount",
                                "value": "100000uatom"
                            }
                        ]
                    },
                    {
                        "type": "transfer",
                        "attributes": [
                            {
                                "key": "recipient",
                                "value": "cosmos1er40wr3v78awxt02k4hq6evl3qjrpd4fkdmmq3"
                            },
                            {
                                "key": "sender",
                                "value": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu"
                            },
                            {
                                "key": "amount",
                                "value": "100000uatom"
                            }
                        ]
                    },
                    {
                        "type": "message",
                        "attributes": [
                            {
                                "key": "sender",
                                "value": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu"
                            }
                        ]
                    }
                ]
            }
        ],
        "info": "",
        "gas_wanted": "95843",
        "gas_used": "87419",
        "tx": {
            "@type": "/cosmos.tx.v1beta1.Tx",
            "body": {
                "messages": [
                    {
                        "@type": "/cosmos.bank.v1beta1.MsgSend",
                        "from_address": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu",
                        "to_address": "cosmos1er40wr3v78awxt02k4hq6evl3qjrpd4fkdmmq3",
                        "amount": [
                            {
                                "denom": "uatom",
                                "amount": "100000"
                            }
                        ]
                    }
                ],
                "memo": "1010",
                "timeout_height": "0",
                "extension_options": [],
                "non_critical_extension_options": []
            },
            "auth_info": {
                "signer_infos": [
                    {
                        "public_key": {
                            "@type": "/cosmos.crypto.secp256k1.PubKey",
                            "key": "A26PAcbmjZxcZqsXL/CJgjTHqImZeAJDe85ufR+JFh/B"
                        },
                        "mode_info": {
                            "single": {
                                "mode": "SIGN_MODE_DIRECT"
                            }
                        },
                        "sequence": "0"
                    }
                ],
                "fee": {
                    "amount": [
                        {
                            "denom": "uatom",
                            "amount": "50000"
                        }
                    ],
                    "gas_limit": "95843",
                    "payer": "",
                    "granter": ""
                },
                "tip": null
            },
            "signatures": [
                "X+fNbORNm/pMJNWEF3r/AT1m8dbOMfhYaoRitGQWScF+3ItNTiOceEiOtRI0aF1UYSlUBfOc2GlCFnrRwqGFWg=="
            ]
        },
        "timestamp": "2024-05-28T10:44:31Z",
        "events": [
            {
                "type": "coin_spent",
                "attributes": [
                    {
                        "key": "spender",
                        "value": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu",
                        "index": true
                    },
                    {
                        "key": "amount",
                        "value": "50000uatom",
                        "index": true
                    }
                ]
            },
            {
                "type": "coin_received",
                "attributes": [
                    {
                        "key": "receiver",
                        "value": "cosmos17xpfvakm2amg962yls6f84z3kell8c5lserqta",
                        "index": true
                    },
                    {
                        "key": "amount",
                        "value": "50000uatom",
                        "index": true
                    }
                ]
            },
            {
                "type": "transfer",
                "attributes": [
                    {
                        "key": "recipient",
                        "value": "cosmos17xpfvakm2amg962yls6f84z3kell8c5lserqta",
                        "index": true
                    },
                    {
                        "key": "sender",
                        "value": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu",
                        "index": true
                    },
                    {
                        "key": "amount",
                        "value": "50000uatom",
                        "index": true
                    }
                ]
            },
            {
                "type": "message",
                "attributes": [
                    {
                        "key": "sender",
                        "value": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu",
                        "index": true
                    }
                ]
            },
            {
                "type": "tx",
                "attributes": [
                    {
                        "key": "fee",
                        "value": "50000uatom",
                        "index": true
                    },
                    {
                        "key": "fee_payer",
                        "value": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu",
                        "index": true
                    }
                ]
            },
            {
                "type": "tx",
                "attributes": [
                    {
                        "key": "acc_seq",
                        "value": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu/0",
                        "index": true
                    }
                ]
            },
            {
                "type": "tx",
                "attributes": [
                    {
                        "key": "signature",
                        "value": "X+fNbORNm/pMJNWEF3r/AT1m8dbOMfhYaoRitGQWScF+3ItNTiOceEiOtRI0aF1UYSlUBfOc2GlCFnrRwqGFWg==",
                        "index": true
                    }
                ]
            },
            {
                "type": "message",
                "attributes": [
                    {
                        "key": "action",
                        "value": "/cosmos.bank.v1beta1.MsgSend",
                        "index": true
                    },
                    {
                        "key": "sender",
                        "value": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu",
                        "index": true
                    },
                    {
                        "key": "module",
                        "value": "bank",
                        "index": true
                    }
                ]
            },
            {
                "type": "coin_spent",
                "attributes": [
                    {
                        "key": "spender",
                        "value": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu",
                        "index": true
                    },
                    {
                        "key": "amount",
                        "value": "100000uatom",
                        "index": true
                    }
                ]
            },
            {
                "type": "coin_received",
                "attributes": [
                    {
                        "key": "receiver",
                        "value": "cosmos1er40wr3v78awxt02k4hq6evl3qjrpd4fkdmmq3",
                        "index": true
                    },
                    {
                        "key": "amount",
                        "value": "100000uatom",
                        "index": true
                    }
                ]
            },
            {
                "type": "transfer",
                "attributes": [
                    {
                        "key": "recipient",
                        "value": "cosmos1er40wr3v78awxt02k4hq6evl3qjrpd4fkdmmq3",
                        "index": true
                    },
                    {
                        "key": "sender",
                        "value": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu",
                        "index": true
                    },
                    {
                        "key": "amount",
                        "value": "100000uatom",
                        "index": true
                    }
                ]
            },
            {
                "type": "message",
                "attributes": [
                    {
                        "key": "sender",
                        "value": "cosmos1z79jxnsw64c20upyfu8rfe89pdsel48kfmzjgu",
                        "index": true
                    }
                ]
            }
        ]
    }
}
```

### 6. 广播交易

```bash
curl --location 'https://cosmos-rest.publicnode.com/cosmos/tx/v1beta1/txs' \
--header 'Content-Type: application/json' \
--data '    {"tx_bytes":"CpgBCo8BChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEm8KLWNvc21vczF6NzlqeG5zdzY0YzIwdXB5ZnU4cmZlODlwZHNlbDQ4a2ZtempndRItY29zbW9zMWVyNDB3cjN2Nzhhd3h0MDJrNGhxNmV2bDNxanJwZDRma2RtbXEzGg8KBXVhdG9tEgYxMDAwMDASBDEwMTASZwpQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohA26PAcbmjZxcZqsXL/CJgjTHqImZeAJDe85ufR+JFh/BEgQKAggBGAESEwoNCgV1YXRvbRIEMTAwMBDj7AUaQP2sdB0DnYNOGSbHWoRbsEexeRbHEDNnyC4rt7EkVLDUde9xRHYNhda5DOd+q+C/n9O7muLaqvHq/FYifanfz+I=","mode":"BROADCAST_MODE_SYNC"}
'
```

返回值
```
{
    "tx_response": {
        "height": "0",
        "txhash": "61B11E204823F6D75CED30BD1421884834AD8F69983500B159140891CFBA7B94",
        "codespace": "",
        "code": 0,
        "data": "",
        "raw_log": "[]",
        "logs": [],
        "info": "",
        "gas_wanted": "0",
        "gas_used": "0",
        "tx": null,
        "timestamp": "",
        "events": []
    }
}
```

## 五. 中心化钱包开发

### 1. 离线地址生成

- 调度签名机生成密钥对，签名机吐出公钥。
- 使用公钥导出地址。

### 2. 充值逻辑

- 获取最新块高；更新到数据库。
- 从数据库中获取上次解析交易的块高作为起始块高，最新块高为截止块高。
- 解析区块里的交易，更新交易到数据库中，将交易的状态设置为待确认。
- 所在块的交易过了确认位，将交易状态更新为充值成功并通知业务层。

### 3. 提现逻辑

- 获取离线签名需要的参数，结合适当的手续费。
- 构建未签名的交易消息摘要，将消息摘要递给签名机签名。
- 构建完整的交易并进行序列化。
- 发送交易到区块链网络。

---

## 六. HD 钱包开发

### 1. 离线地址生成和离线签名

参考上面的代码。

### 2. 和链上交互的接口

- 获取账户余额。
- 根据地址获取交易记录。
- 获取预估手续费。

---

## 七. 总结

HD 钱包和交易所钱包不同之处有以下几点：

1. **密钥管理方式不同**
   - HD 钱包私钥在本地设备，私钥用户自己控制。
   - 交易所钱包中心化服务器（CloudHSM, TEE 等），私钥项目方控制。

2. **资金存在方式不同**
   - HD 资金在用户钱包地址。
   - 交易所钱包资金在交易所热钱包或者冷钱包里。

3. **业务逻辑不一致**
   - 中心化钱包：实时不断扫链更新交易数据和状态。
   - HD 钱包：根据用户的操作通过请求接口实现业务逻辑。

---

## 八. 附录

- 区块链浏览器：https://cosmos.bigdipper.live/
- 官网：https://cosmos.network/
- GitHub：https://github.com/cosmos/
- 电报群：https://t.me/cosmosproject
- Reddit：https://reddit.com/r/cosmosnetwork
- Twitter：https://twitter.com/cosmos
- SlideShare：https://www.slideshare.net/tendermint
- API 文档：https://docs.cosmos.network/api#tag/Query/operation/AllBalances
- Tendermint API 文档：https://docs.cometbft.com/main/rpc/#/Info/status