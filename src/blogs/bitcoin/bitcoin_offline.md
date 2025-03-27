# Bitcoin 钱包介绍与离线签名开发流程

## 一. Bitcoin 钱包相关的特性介绍

### 1. 比特币的区块的组织形式

![](bitcoin/Aspose.Words.61ecb54d-861e-4e06-ba03-fe632de0d244.001.png)

#### 区块头
- Nonce
- Hash
- PrevHash
- Merkle Root Hash

#### 区块体
- txList

### 2. 共识算法
- **POW**：工作量证明，没有质押的逻辑。

### 3. Token 支持
- 本质上是不支持，无法执行复杂的合约验证。
- 在 Taproot 升级后，支持 BRC20 的铭文符文协议，本质上 BRC20 也是一种 Token。

#### 包括：
- 符文
- 铭文
- NFT

> 铭文符文 indexer 服务

### 4. 比特币钱包确认位问题
- **经验值**：一般 10-12 块，币安 1-2 确认位。

### 5. 比特币版本迭代过程
- 比特币自 2009 年发布以来，经历了多次重要升级。这些升级旨在提高比特币网络的安全性、效率和功能性。
- Taproot 升级带来了更多可能性，推动了 BRC20 和 Bitcoin-Layer2 的发展。

#### 重要升级：
- **P2SH（Pay-to-Script-Hash）**
  - 时间：2012 年
  - BIP：BIP-0016
  - 内容：允许更复杂的交易脚本，支持多重签名地址。

- **比特币改进提案 BIP66**
  - 时间：2015 年
  - BIP：BIP-0066
  - 内容：规范了交易中 DER 格式的签名，解决了交易签名的一致性问题。

- **CheckSequenceVerify（CSV）**
  - 时间：2016 年
  - BIP：BIP-0112
  - 内容：增加了相对时间锁功能，使交易可以在指定的时间或块高度之后才生效。

- **Segregated Witness（SegWit）**
  - 时间：2017 年
  - BIP：BIP-0141, BIP-0143, BIP-0144
  - 内容：分离交易签名数据，提高了区块的有效容量，减少了交易体积，降低了交易费用。

- **Taproot**
  - 时间：2021 年
  - BIP：BIP-0340, BIP-0341, BIP-0342
  - 内容：引入 Schnorr 签名和默克尔化抽象语法树（MAST），增强隐私性和脚本验证功能。

### 6. 账户模型和 UTXO 模型

#### 账户模型
- 类似现代银行业务里的账户机制，通过 nonce 值来保证交易唯一性，防止重放攻击。
- 代表链：Ethereum, Solana, EOS, Manta, Mantle, Aptos

#### UTXO 模型
- 代表链：Bitcoin, Litecoin, Dogecoin, BitcoinCash, SiaCoin, SUI（类似 UTXO 的 Object 模型）

### 7. 钱包开发调研过程
- 找离线地址生成和离线签名的代码库，搞定离线地址和离线签名。
- 调研对应链的 RPC 接口文档，找出和钱包相关的接口。
- 获取最新的 BlockNumber。
- 根据 BlockNumber 获取交易信息。
- 根据交易 Hash 获取交易信息。
- 获取交易签名所需的 nonce, fee, account_number。
- 获取账户的 balance。
- 发送交易到区块链网络。

## 二. 钱包地址的离线地址生成和离线签名

### 1. 比特币地址格式

Bitcoin 钱包地址有几种不同的类型，每种类型都有其特定的用途和特点。

#### 地址类型：
- **P2PKH（Pay-to-PubKeyHash）**
  - 格式：以 1 开头，例如 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa。
  - 特点：最传统和最常见的地址类型，广泛用于比特币的早期交易。
  - 优点：兼容性好，几乎所有钱包和交易所都支持。
  - 缺点：使用效率较低，交易费用可能较高。

- **P2SH（Pay-to-Script-Hash）**
  - 格式：以 3 开头，例如 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy。
  - 特点：允许更复杂的交易脚本，例如多重签名地址。
  - 优点：支持更复杂的交易和脚本，安全性更高。
  - 缺点：创建和管理比 P2PKH 地址更复杂。

- **Bech32（SegWit）**
  - 格式：以 bc1 开头，例如 bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwfvenl。
  - 特点：比特币改进提案 BIP-0173 中引入的新地址格式，旨在提高交易效率和减少费用。
  - 优点：交易费用更低，处理速度更快。
  - 缺点：并非所有的钱包和交易所都支持这种地址类型。

- **Bech32m**
  - 格式：P2TR（Pay-to-Taproot），以 "bc1p" 开头。
  - 特点：基于比特币改进提案（BIP-350）设计，主要用于 Taproot 升级。
  - 优点：防止用户输入地址时的复制和输入错误，提升使用体验。
  - 缺点：平台兼容性问题。

### 2. 比特币地址的推导流程

![](bitcoin/Aspose.Words.61ecb54d-861e-4e06-ba03-fe632de0d244.004.jpeg)

#### 1. Leagcy(p2pkh) 地址的导过程

- 第一步：计算出压缩公钥
- 第二步：计算公钥的 Sha256 的值
- 第三步：用第二步结果进行计算 RIPEMD-160 哈希
- 第四步：计算 checksum，规则是对上面结果前面加上版本号（主网为 0x00，测试网为 0x6f），然后计算两次 SHA256
- 第五步：用格式 [version] [ripemd160_hash] [checksum] 构架出一个值
- 第六步：使用上面的值进行 Base58 编码得到地址

![](bitcoin/Aspose.Words.61ecb54d-861e-4e06-ba03-fe632de0d244.005.png)

```python
def pubkey_to_p2pkh_addr(pubkey: bytes, version: bytes) -> bytes:
    out1 = sha256(pubkey)
    out2 = ripemd160(out1)
    checksum = base58_cksum(version + out2)
    address = base58.b58encode(version + out2 + checksum)
    return address
```

- Github 代码：https://github.com/the-web3/wallet-python-sdk

#### 2. p2sh 格式的地址推导过程

- 第一步：计算出压缩公钥
- 第二步：使用压缩公钥计算出公钥 Hash
- 第三步：对公钥 Hash 进行 ripemd160 Hash
- 第四步：构建 redeem 脚本
- 第五步：生成 redeem_hash，使用 Sha256 算法
- 第六步：对第五步的结果进行 ripemd160 Hash
- 第七步：计算 checksum
- 第八步：对 version + redeem_rip + checksum 进行 base58 编码

```python
def pubkey_to_p2sh_p2wpkh_addr(pubkey_compressed: bytes) -> bytes:
    """ Derives p2sh-segwit (p2sh p2wpkh) address from pubkey """
    pubkey_hash = sha256(pubkey_compressed)
    rip = ripemd160(pubkey_hash)
    redeem_script = b'\x00\x14' + rip  # 0x00: OP_0, 0x14: PushData
    redeem_hash = sha256(redeem_script)
    redeem_rip = ripemd160(redeem_hash)

    # Base-58 encoding with a checksum
    version = b'\x05'  # 0x05 for mainnet, 0xc4 for testnet
    checksum = base58_cksum(version + redeem_rip)
    address = base58.b58encode(version + redeem_rip + checksum)
    return address
```

- 其他格式的地址可以看代码：Github 代码：https://github.com/the-web3/wallet-python-sdk
- BIP44 各个链的序号定义：https://github.com/satoshilabs/slips/blob/master/slip-0044.md

### 3. NodeJS 离线地址生成

```javascript
export function createUtxoAddress(seedHex: string, receiveOrChange: "0"|"1", addressIndex: string, chain: string, typeAddress: string = 'p2pkh'): BtcAddressInfo {
    const root = bip32.fromSeed(Buffer.from(seedHex, 'hex'));
    // @ts-ignore
    const purpose = purposeMap[typeAddress];
    // @ts-ignore
    const bipNum = bipNumberMap[chain];
    let path = `m/${purpose}'/${bipNum}'/0'/${receiveOrChange}/${addressIndex}`;
    let child = root.derivePath(path);
    if (!child.privateKey) {
        throw new Error('Private key is undefined');
    }
    let address: any;
    let utxoNetwork = getChainConfig(chain);
    switch (typeAddress) {
        case 'p2pkh': // 支持所有格式的地址生成
            // eslint-disable-next-line no-case-declarations
            const p2pkhAddress = bitcoin.payments.p2pkh({
                pubkey: child.publicKey,
                network: utxoNetwork
            });
            if (chain === "bch") {
                address = cashaddr.encode('bitcoincash', 'P2PKH', p2pkhAddress.hash);
            } else {
                address = p2pkhAddress.address;
            }
            break;
        case 'p2wpkh': // 支持 BTC 和 LTC；不支持 Doge, BCH 和 BSV
            if (chain === "doge" || chain === "bch" || chain === "bsv") {
                throw new Error('Do not support this chain');
            }
            // eslint-disable-next-line no-case-declarations
            const p2wpkhAddress = bitcoin.payments.p2wpkh({
                pubkey: child.publicKey,
                network: utxoNetwork
            });
            address = p2wpkhAddress.address;
            break;
        case 'p2sh': // 支持 BTC, LTC 和 Doge; 不支持 BCH
            if (chain === "bch") {
                throw new Error('Do not support this chain');
            }
            // eslint-disable-next-line no-case-declarations
            const p2shAddress = bitcoin.payments.p2sh({
                redeem: bitcoin.payments.p2wpkh({
                    pubkey: child.publicKey,
                    network: utxoNetwork
                })
            });
            address = p2shAddress.address;
            break;
        case 'p2tr': // 仅仅支持 BTC; 其他格式的地址不支持
            if (chain !== "btc") {
                throw new Error('Only bitcoin support p2tr format address');
            }
            child = root.derivePath(path);
            if (!child.privateKey) {
                throw new Error('Private key is undefined');
            }
            const p2trAddress = bitcoin.payments.p2tr({
                internalPubkey: child.publicKey!.slice(1, 33), // Slice to extract x- only pubkey
                network: bitcoin.networks.bitcoin
            });
            address = p2trAddress.address;
            break;
        default:
            throw new Error('This way can not support');
    }
    if (!address) {
        throw new Error('Address generation failed');
    }
    return {
        privateKey: Buffer.from(child.privateKey).toString('hex'),
        publicKey: Buffer.from(child.publicKey).toString('hex'),
        address
    };
}
```

### 4. NodeJS 比特币离线签名

- https://www.blockchain.com/explorer/transactions/btc/e702f3fc3b3dfae2d31ace393cd67fcd5a84e57beecdac56472e31ee696fd473

```javascript
/**
 * 暂不支持 taproot 签名
 * @returns
 * @param params
 */
export function signUtxoTransaction(params: { privateKey: string; signObj: SignObj; network: string; }): string {
    const { privateKey, signObj, network } = params;
    const net = bitcore.Networks[network];
    const inputs = signObj.inputs.map(input => {
        return {
            address: input.address,
            txId: input.txid,
            outputIndex: input.vout,
            script: new bitcore.Script.fromAddress(input.address).toHex(),
            satoshis: input.amount
        }
    });
    const outputs = signObj.outputs.map(output => {
        return {
            address: output.address,
            satoshis: output.amount
        };
    });
    const transaction = new bitcore.Transaction(net).from(inputs).to(outputs);
    transaction.version = 2;
    transaction.sign(privateKey);
    return transaction.toString();
}
```

### 5. Utxo 的获取

- 自己搭建节点，并且钱包地址是生成在节点上，可以直接调用 bitcoin 里面 listunspend rpc 接口获取未花费的输入输出，若地址是离线生成，节点上不会维护 UTXO。
- 中心化钱包是自己扫链维护 UTXO。
- 去中心化钱包。
- 使用第三方数据平台获取。
- 在你自己搭建节点上配置 ElectrumX 组件，这是一个专门用来收集 UTXO。

### 6. 比特币的手续费

- estimatesmartfee：返回来的交易 1 个字节的费用，需要使用这个值去乘以你交易字节数，input 和 output。
- Input 签名字数量。
- Output 签名字数量。
- 手续费 =（预估单个 input * input 数量 + 预估单个 Output * Output 数量）* overhead(默认是 1.5 倍)。
- 找零资金 = input 总资金 - (转出资金 + 手续费)。
- 如果一笔交易因为手续费低被卡住了，有哪些办法解决。
- 方法一：
  - 相同的 input 和 output(相同或者不同都可以)，提高手续费，重新发送，总之一句话就是，其他不变，提高手续费。
- 方法二：CPFP 策略的应用 (Child Pays for Parent)
  - 子交易为父交易付款：
  - Tx1---output

A input->A' ouput; A input->C' ouput(找零)

- Tx2

C' ouput---->D ouput

假设 Bob 对 TX1 的某个输出拥有控制权（例如 TX1 中有一笔找零或部分转账的资金归 Bob 所有），他可以利用这个输出发起一个 “子交易 ”（TX2），并在 TX2 中设置较 高的手续费。矿工在看到 TX2 时，会计算 “父子交易链 ”的整体手续费率，如果整体费率 足够高，就会一起打包 TX1 和 TX2，从而实现间接确认 TX1。

具体步骤如下：

- 确认输出控制权
  - Bob 检查 TX1 的输出，确认其中有属于自己的地址或他能支配的资金。例如 TX1 的一 个输出给了 Bob，一笔金额可供花费。
- 构造子交易 TX2
  - Bob 使用他对 TX1 输出的控制权，创建一个新的交易 TX2，花费该输出。
  - 假设 TX2 的大小为 150 字节。
  - Bob 在 TX2 中设置一个较高的手续费，例如 6000 satoshis（大约 40 sat / byte）。
- 计算整体手续费率
  - 将 TX1 和 TX2 看作一个交易链，总计情况如下：
  - 总交易大小：200 字节（TX1） + 150 字节（TX2） = 350 字节
  - 总手续费：200 satoshis（TX1） + 6000 satoshis（TX2） = 6200 satoshis
  - 整体手续费率：6200 satoshis / 350 字节 ≈ 17.7 sat / byte
- 广播子交易
  - Bob 将构造好的 TX2 广播到网络。矿工在看到 TX2 时，会发现如果要验证 TX2，必须 同时包含其父交易 TX1，因为 TX2 正在花费 TX1 的输出。
- 矿工打包确认
  - 如果当前网络的有效手续费率门槛低于整体 17.7 sat / byte（例如市场要求 15 sat / byte），矿工就会认为整个交易链（TX1 + TX2）的手续费率足够高，从而选择同 时打包这两笔交易。最终，TX1 也会被确认，Bob 能够尽快收到资金。

### 7. 比特币经典的交易攻击问题

- 交易延展性攻击：在隔离见证之前，交易和交易签名信息是放在一起，一起生成 txid，在比特币的交易里面 RSV 里面，S 比较宽，r n-s v 和 r v s 签名验证的过程中都是有效的, 当改变 s 值的时候 txid 就会发生变化。
  - 隔离见证之前怎么解决：通过交易所风控和钱包控制 UTXO 交易解决。
  - 隔离见证：交易和签名，签名的信息在脚本，交易的 txid 就是交易本身生成的。
  - V 值通过 DER 编码方式。
- 以太坊
  - S：S 比较窄 (EIP-2 强制 Low-S 标准)，没有 n-s 取值效果。
  - V: EIP155 chainId 解决，V 和 ChainId 相关联。

## 三. 扫链相关的 RPC

- https://developer.bitcoin.org/reference/rpc/sendrawtransaction.html
- https://blockchain.info/unspent?active=bc1q54x62frn6pmz9klxc7frg903kaug3dvw46lwe7
- Okx: https://www.oklink.com/docs/zh/#utxo-specific-data-get-remaining-utxo-addresses

### 1. Rosetta Api

Bitcoin Rosetta API 是由 Coinbase 提出的 Rosetta 标准的一部分，旨在为区块链和钱包提供一个统一的接口标准。这个标准化的接口使得与各种区块链的交互更加容易和一致，无论是对交易数据的读取还是写入。目前已经支持很多链，包括比特币，以太坊等主流链，也包括像 IoTex 和 Oasis 这样的非主流链。

#### 1. Rosetta API 概述

Rosetta API 分为两部分：

- Data API：用于读取区块链数据。
- Construction API：用于构建和提交交易。

#### 2. Data API

Data API 提供了一组端点，用于检索区块链数据，如区块、交易、余额等。主要端点包括：

- /network/list：返回支持的网络列表。
- /network/status：返回当前网络的状态信息。
- /network/options：返回支持的网络选项和版本信息。
- /block：返回指定区块的数据。
- /block/transaction：返回指定交易的数据。
- /account/balance：返回指定账户的余额。
- /mempool：返回当前未确认的交易池。
- /mempool/transaction：返回指定未确认交易的数据。

#### 3. Construction API

Construction API 提供了一组端点，用于创建、签名和提交交易。主要端点包括：

- /construction/preprocess：分析交易需求并返回交易所需的元数据。
- /construction/metadata：返回构建交易所需的元数据。
- /construction/payloads：生成待签名的交易有效载荷。
- /construction/parse：解析交易并返回其操作。
- /construction/combine：将签名与待签名交易合并。
- /construction/hash：返回交易的唯一标识符（哈希）。
- /construction/submit：提交签名后的交易。

#### 4. 开发 BTC 钱包使用到的 Rosetta Api

为了具体实现 Rosetta API，开发者需要遵循 Rosetta 标准并根据比特币区块链的特性进行适配。以下是一些具体实现细节：

数据结构：

- 区块：包含区块哈希、前一个区块哈希、区块高度、时间戳、交易列表等。
- 交易：包含交易哈希、输入输出列表、金额、地址等。
- 账户：包含账户地址和余额信息。

用到的接口：

- /network/list：返回比特币主网和测试网信息。
- /network/status：返回当前最新区块、已同步区块高度、区块链处理器的状态等。
- /block 和 /block/transaction：返回区块和交易的详细信息，包括交易的输入输出、金额、地址等。
- /account/balance：通过查询比特币节点，返回指定地址的余额。

发送交易到区块链网络：

- /construction/submit：通过比特币节点提交签名后的交易。

#### 5. 文档资料

- 比特币开发文档：https://developer.bitcoin.org/reference/rpc/
- Rosetta 开发文档：https://docs.cdp.coinbase.com/rosetta/reference/networklist/
- Rosetta 开发文档：https://github.com/coinbase/mesh-ecosystem/blob/master/implementations.md
- 浏览器：https://btc.com/zh-CN

### 2. 原生的 RPC 接口

#### 获取最新区块

- getblockchaininfo
- height/blocks

#### 根据区块获取交易

- getBlock

![](bitcoin/Aspose.Words.61ecb54d-861e-4e06-ba03-fe632de0d244.015.jpeg)

- tx:[] 交易的列表

#### 根据交易 hash 获取 rawTransaction

- getrawtransaction

![](bitcoin/Aspose.Words.61ecb54d-861e-4e06-ba03-fe632de0d244.016.jpeg)

#### 通过 decodeTransaction 解码 rawTx

- decoderawtransaction

![](bitcoin/Aspose.Words.61ecb54d-861e-4e06-ba03-fe632de0d244.017.jpeg)

- https://developer.bitcoin.org/reference/rpc/index.html

## 四. 扩充

### Taproot 升级

- Schnoor 签名：短签名，交易效率高，手续费低的特点，同时使得交易具备隐私性。
- 默克尔抽象语法树：可以执行简单的 merkle tree 验证，使得比特币具备简单的智能合约验证功能。
