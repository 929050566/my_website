# 概述
铭文（Inscription）和符文（Rune）是比特币生态中的新兴资产类别，主要通过比特币的 UTXO 结构和 Taproot 机制进行存储和解析。它们可以被用于发行代币、NFT、铭文信息等，使比特币生态更具可编程性。
## 铭文
Ordinals 序数铭文协议（BRC-20）：BRC-20 是基于 Ordinals 实现的比特币原生代币标准，主要依赖文本铭文来定义代币信息，常见的 JSON 格式如下：

```json
{
  "p": "brc-20",
  "op": "mint",
  "tick": "ordi",
  "amt": "1000"
}
```
- p：协议类型（brc-20）
- op：操作类型（deploy、mint、transfer）
- tick：代币名称
- amt：数量
## 符文
Runes 符文协议：符文协议是比特币生态的一种新代币协议，相较于 BRC-20，它更高效，并减少了铭文对比特币 UTXO 集的膨胀影响。其特点包括：
- 无需额外的铭文数据：不依赖 JSON 铭文，而是利用 Taproot 交易中的 OP_RETURN 进行记录
- 原生 UTXO 模型支持：利用比特币交易本身的输入输出，避免 UTXO 过度碎片化
- 更低的交易成本：相较于 BRC-20，符文交易数据更少，因此 gas 费更低

#  BRC-20
BRC -20 代币标准于 2023 年 3 月 8 日创建的比特币实验性可替代代币标准，BRC-20 是比特币生态中的可替代代币（Fungible Token）标准，类似于以太坊的 ERC-20，但不依赖智能合约，而是基于 Ordinals（铭刻）协议，它利用 JSON 数据的序数铭文来部署代币合约、铸造代币和转移代币。

与 ERC-20 的不同之处：
- ERC-20 依赖以太坊智能合约，可以直接在链上进行复杂的逻辑运算
- BRC-20 没有智能合约，所有逻辑通过 JSON 文本存储在 Ordinals 铭刻（Inscription）数据中
- 代币的转移、部署等操作需要依赖索引器（Indexer）解析链上数据

## BRC-20 代币的三大操作
BRC-20 代币的交互主要通过**JSON 格式的铭刻（Inscription）**完成，包括：
- Deploy（部署代币）
- Mint（铸造代币）
- Transfer（转账代币）
![alt text](bitcoin/image.png)
1.1 Deploy
```json
{
  "p": "brc-20",
  "op": "deploy",
  "tick": "ordi",
  "max": "21000000",
  "lim": "1000"
}
``` 
-  "p": "brc-20" → 表示该铭刻属于 BRC-20 代币协议。
-  "op": "deploy" → 部署代币。
- "tick": "ordi" → 代币名称（ticker），比如 ORDI。
- "max": "21000000" → 代币的最大供应量（Max Supply）。
- "lim": "1000" → 每次铸造的最大数量（Minting Limit）。
1.2 mint
链上：inscribe一个表示mint operation的sat，并立即 transfer 给 minter 地址
```json
{
  "p": "brc20",
  "op": "mint",
  "tick": "ordi",
  "amt": 1000
}
```
链下 
- 判断state[tick]存在，amt 不能超过其lim，累计 amt 不能超过其 max
- state[tick]["balances"][minter]+=amt
![alt text](bitcoin/image-1.png)
1.3 transfer
链上
- 先inscribe一个表示transfer operation 的 sat，发给 sender 地址
```json
{
    "p": "brc20",
     "op": "transfer",
    "tick": "ordi",
    "amt": 1000
}
```
- sender再构造一笔交易吧这个 sat 发给receiver
- 需要 2 比交易，不友好
链下 
- 判断state[tick]["balances"][sender]>=amt
- account_state[tick]["balances"][sender]-=amt
- account_state[tick]["balances"][receiver]+=amt
![alt text](bitcoin/image-2.png)
# Ordinals 协议
Ordinals 协议是一种在 比特币（Bitcoin）网络上铸造 NFT（非同质化代币） 的方法，主要通过铭刻（Inscription） 机制将数据直接存储在比特币区块链上，无需额外的智能合约。

Ordinals 彻底改变了比特币的可编程性，使比特币不仅仅是价值存储工具，还可以承载 NFT、BRC-20 代币等新型资产。

## Ordinals 协议的核心概念

序号(Ordinal Number): Ordinals 采用序号来唯一标识比特币区块链上的每个聪（Satoshi，1 BTC = 100,000,000 聪）
- Ordinals 序号规则：
-  比特币的每个聪都有一个唯一的 Ordinals 序号，按照比特币的挖矿顺序进行编号
- 例如，第 100 个被挖出的聪，序号为 100

Ordinals 让每个聪成为可标记、可追踪的“数字资产”

## 铭刻（Inscription）

铭刻是将数据（如图片、文字、代码等）直接存储到比特币 UTXO 中的过程。
- 铭刻通过Ordinals 协议将数据写入 Taproot 交易的 Witness 数据，从而永久存储在比特币区块链上。
- 铭刻过程：
  - 挑选一个聪（Satoshi），给它分配一个 Ordinals 序号。
  - 将 NFT 数据（如图片、文本）嵌入该聪的 Witness 数据
  - 广播交易，让矿工将其打包进区块
  - 交易被确认后，这个聪就变成了“NFT”，可以交易或转让。

通过 Ordinals，NFT 直接存储在比特币上，而不是像以太坊 NFT 依赖链外存储（IPFS）

## Ordinals 交易机制

Ordinals NFT 并没有智能合约，其交易是基于比特币的 UTXO（未花费交易输出） 模型：
- 每个铭刻 NFT 绑定在某个 UTXO 里，当 UTXO 发生交易时，NFT 也随之转移。
- 转移方式
  - 买家提供一个地址，让卖家创建一个 UTXO 并发送到该地址
  - 避免 UTXO 找零问题（避免 NFT 被拆分丢失）。

Ordinals NFT 交易方式类似于比特币转账，但需要避免 UTXO 找零的问题。

## Ordinals 协议的技术原理
Ordinals 依赖于 比特币的原生机制，包括：
- UTXO（未花费交易输出）模型
  - Ordinals 让每个聪（Satoshi）都拥有唯一的序号
  - 铭刻（Inscription） 绑定在 UTXO 里，随 UTXO 交易而转移

- Taproot（比特币软分叉升级）
  -  Ordinals 依赖 Taproot 交易的 Witness 数据 存储铭刻数据
  - Taproot 交易降低存储成本，使 NFT 可以直接存储在比特币链上

- 交易结构: 铭刻数据存储在 OP_RETURN 字段 或 Taproot Witness 中
```json
{
  "vin": [
    {
      "txid": "abc123...",
      "vout": 0
    }
  ],
  "vout": [
    {
      "value": 0.00000001,
      "scriptPubKey": {
        "asm": "OP_ORDINAL ... OP_CHECKSIG",
        "hex": "..."
      }
    }
  ]
}
```
- scriptPubKey.asm 里包含 Ordinals 数据，让该聪成为 NFT。

# 铭文和符文
铭文通常使用 Ordinals（序数理论）为比特币的最小单位（satoshi）附加元数据，例如图片、文本、代码等，从而形成类似 NFT 的资产。

符文是由 Casey Rodarmor 提出的比特币原生代币标准，旨在提供一种高效的比特币链上资产发行方式，类似于以太坊的 ERC-20 代币标准。


## 铭文与符文的铸造过程
-  铭文（Inscription）的铸造：铭文的铸造（Inscribing）通常通过 Ordinals 工具进行：
  - 选择铭文内容：可以是文本、图片（Base64 编码）、代码或 JSON 数据
  - 创建 Ordinals 交易：将铭文数据存储到比特币交易的 witness 数据段中
  - 广播交易：交易被矿工打包后，铭文永久记录在比特币链上
  
-  BRC-20 代币的部署和铸造
  - 部署 BRC-20 代币： 
    - 发送一个包含 JSON 铭文的 Ordinals 交易（见上文标准）
    - 交易确认后，该代币标准被认可。
  - 铸造 BRC-20 代币： 
    - 任何人都可以根据 mint 规则，创建铭文交易，并铸造代币
  - 转移 BRC-20 代币： 
    - 通过 transfer 铭文，将特定数量的 BRC-20 代币转移给其他用户
    
- 符文（Runes）的铸造：符文不需要 JSON 铭文，而是通过以下方式铸造：
  - 定义符文名称、供应量和规则
  - 使用 OP_RETURN 或 Taproot 交易存储符文信息
  - 通过比特币 UTXO 进行解析和管理
  - 可在钱包或交易所支持的环境中自由转移

## 铭文解析器
铭文解析器用于读取比特币交易中的铭文信息，通常需要以下步骤：
- 监听比特币交易：扫描比特币区块，寻找带有 Ordinals 或符文数据的交易。
- 解析 Witness 数据：提取 Ordinals 铭文的 JSON 或符文 OP_RETURN 信息。
- 匹配铭文规则：识别 BRC-20、NFT、符文等不同类型的数据格式。
- 输出解析结果： 
  - 对于 BRC-20，解析代币总供应量、持有人信息、交易历史等。
  - 对于符文，解析符文 ID、铸造数量、转账记录等。
- 铭文解析伪代码
```python
from bitcoinrpc.authproxy import AuthServiceProxy

rpc_user = "user"
rpc_password = "password"
rpc_connection = AuthServiceProxy(f"http://{rpc_user}:{rpc_password}@127.0.0.1:8332")

def parse_inscriptions(txid):
    tx = rpc_connection.getrawtransaction(txid, True)
    for vout in tx["vout"]:
        if "scriptPubKey" in vout and "asm" in vout["scriptPubKey"]:
            script = vout["scriptPubKey"]["asm"]
            if "OP_RETURN" in script:
                print(f"Found inscription in TX {txid}: {script}")

txid = "your_transaction_id_here"
parse_inscriptions(txid)
```

## 铭文和符文手续费消耗分析

铭文（Inscription）基于 Ordinals 序数理论，通常将数据存储在比特币 Taproot Witness 数据部分，因此其交易手续费较高。铭文（如 BRC-20、NFT）通常通过 Taproot 交易存储数据在 Witness 结构中，由于 Witness 数据部分的折扣机制，铭文交易比普通 P2PKH/P2SH 交易稍微便宜，但仍然比普通 BTC 交易昂贵。

符文数据可以通过 OP_RETURN 存储，或直接嵌入 UTXO 交易输入/输出字段，相比铭文，符文避免了 Witness 结构存储大量数据，因此交易更轻量、费用更低。

五.去中心化的铭文符文交易所实现原理
# PSBT 介绍
PSBT（部分签名比特币交易，Partially Signed Bitcoin Transaction）是一种比特币交易的中间格式，旨在方便多方或多步签名过程。PSBT 允许不同的实体（如硬件钱包、冷钱包、热钱包或多签参与者）逐步添加必要的签名，最终形成一笔完整的比特币交易。

## PSBT 的结构
PSBT 是比特币原始交易（raw transaction）的扩展格式，包含原始交易所需的信息以及签名过程的辅助数据。PSBT 的数据结构分为以下几部分

- 全局字段：这些字段适用于整个 PSBT：
  - 版本号（Version）：当前版本为 0x00。
  - 原始交易（Unsigned Transaction）：PSBT 存储了一个未签名的比特币交易，该交易在未完成签名前不可用。
  - Xpub（可选）：用于描述公钥信息（如 BIP32 扩展公钥）。
- 输入字段： 输入字段（Input Fields）
  - 非最终化的输入（Non-Finalized Inputs）：交易的输入，未完全签名。
  - UTXO 信息：
    - 非隔离见证（Legacy）输入：需要 Previous TX（完整的前序交易）
    - 隔离见证（SegWit）输入：只需要 Witness UTXO（简化的 UTXO 信息）
  - 签名相关信息： 
    - Partial Signatures（部分签名）。
    - Public Keys（相关的公钥）。
    - Sighash Type（签名哈希类型）。
    - Redeem Script（P2SH 解锁脚本）。
    - Witness Script（P2WSH 见证脚本）。
    - BIP32 Derivation（BIP32 派生路径）
- 输出字段（Output Fields）每个输出包括：
  - 公钥信息（BIP32 Derivation）
  - 脚本信息（如果适用，存储 Redeem Script 或 Witness Script）
- PSBT 交易流程：
  - 步骤 1：创建 PSBT
    - 由钱包软件、离线设备或交易构建工具创建一笔未签名的交易。
    - 交易的输入包括 UTXO，但尚未附加签名。
  - 步骤 2：添加签名
    - 私钥持有者（如硬件钱包或冷钱包）逐步对交易进行签名。
    - PSBT 允许多个签名者分别签署（如多重签名地址）。
    - 硬件钱包可以通过 PSBT 提供的 UTXO 信息，在离线环境中验证交易的输入。
  - 步骤 3：合并签名
    - 一旦所有需要的签名都被收集，PSBT 可以被合并（Combine）。
    - 这一阶段会合并多个签名到一个完整的交易中。
  - 步骤 4：最终化交易
  - 当交易的所有输入都已满足签名需求后，PSBT 需要被 Finalized（最终化）。
  - 这会生成一笔标准的比特币交易（Raw Transaction），可以用 bitcoin-cli sendrawtransaction 或其他方式广播到比特币网络。

PSBT 格式由 BIP 174（BIP 174: Partially Signed Bitcoin Transaction Format）定义，目的是使交易签名更加灵活和安全，特别适用于：
- 冷钱包离线签名：冷钱包可以接收一个 PSBT，进行签名后再返回，不需要暴露私钥。
- 多重签名（MultiSig）：每个签名者可以分别对 PSBT 添加签名，最后由某个节点完成合并和广播。
- 硬件钱包支持：硬件钱包不需要知道整个钱包的 UTXO 集，只需要处理与交易相关的部分。

## Sighash用途
![alt text](bitcoin/image-3.png)
这张图片展示了 Bitcoin 交易的 SIGHASH（签名哈希）类型，它决定了签名对交易的哪些部分负责。通俗点说，这个机制允许签名者选择只对交易的一部分负责，从而支持更灵活的交易模式，比如多重签名、联合支付等。

图片分为两排
- 第一排（基础类型）
- 第二排（带 ANYONECANPAY 选项的扩展类型）

第一排（基础 SIGHASH 类型）
- SIGHASH_ALL（0x01）
  - 全签名模式：所有输入和输出都被锁定，交易的任何部分都不能被修改。
  - 适用于普通交易，因为可以确保支付的金额和接收者不会被篡改。
- SIGHASH_NONE（0x02）
  - 只签名输入，不锁定任何输出。
  - 这样别人可以随意修改交易的输出，适用于灵活支付场景（如某人只想签名但不关心资金流向）。
- SIGHASH_SINGLE（0x03）
  - 每个输入只锁定对应的一个输出。
  - 适用于联合支付，例如多人签署一笔交易，每个人只负责自己的部分。

第二排（ANYONECANPAY 变体）
这些变体允许 新增输入，但仍然控制输出。
- SIGHASH_ALL | ANYONECANPAY（0x81）
  - 只锁定当前输入和所有输出，但其他人可以添加额外的输入（比如共付模式）。
  - 应用场景：类似“众筹”模式，A 先支付，其他人可以随意加钱。
- SIGHASH_NONE | ANYONECANPAY（0x82）
  - 只锁定当前输入，但允许其他人添加输入和输出。
  - 应用场景：比如发起一个交易，允许其他人修改资金流向。
- SIGHASH_SINGLE | ANYONECANPAY（0x83）
  - 只锁定当前输入和对应的一个输出，其他部分可修改。
  - 应用场景：适用于某些 P2P 支付场景，如“我要给某人转账，但其他部分随意”。

直观理解
- SIGHASH_ALL → “我签字后，所有内容都不能改！”
- SIGHASH_NONE → “我只保证自己花费的钱，别人爱怎么花不管！”
- SIGHASH_SINGLE → “我对某个输入只负责对应的一个输出！”
- ANYONECANPAY 变体 → “其他人可以随意增加他们的资金来源！”

## 基于 PSBT 的交易 
![alt text](bitcoin/image-4.png)
基于这一特性，可以实现去中心化的 ask & bid。以 ask 为例：
- 卖方把 NFT 的 sat 作为 input，把出价作为 output，然后进行SINGLE|ANYONECANPAY签名，最后把这个PSBT发布到 marketplace
  - 左上：铭文
  - 右上：定价 100 BTC，指定一个收币的地址，这里就是一个 output

- 买方补充 input（包含付款和fee），补充output（接收 sat），签名后广播交易到Bitcoin网络
  - 左下：签名 100 BTC，转到右上的地址里面
  - 右下：买方接收符文的信息

- 只能定量定价地ask/bid，以ask为例
  - 卖方先 inscribe 一个 transfer 的 sat
  - 用这个 sat 构造 PSBT，发布到交易平台
  - 买方通过构造完整交易，买下这个 sat

# 中心化铭文和符文交易平台
- 铭文符文也是一种资产，用户先将铭文符文资产充值到交易所，交易所也会将这些铭文符文规整到归集地址（热钱包）
- 中心化交易所里面铭文符文类似 Web2 的商城
暂时无法在Lark文档外展示此内容
# 本文小结
比特币铭文（Inscription）和符文（Rune）是比特币生态中重要的资产类别，它们基于比特币的 UTXO 结构和 Taproot 机制，通过 Ordinals 协议和 OP_RETURN 数据存储实现原生资产管理，使比特币具备更强的可编程性。

- 铭文（Inscription）
  - 采用 Ordinals 协议，让比特币最小单位 Satoshi 具有唯一序号，并可存储文本、图片、NFT、代币信息等数据。
  -  BRC-20 代币标准基于铭文 JSON 记录代币信息，实现代币的部署（Deploy）、铸造（Mint）、转移（Transfer），但因 UTXO 模型限制，交易效率较低。

- 符文（Runes）
  - 不依赖铭文 JSON，而是使用比特币交易的 OP_RETURN 记录数据，避免 UTXO 过度膨胀
  - 更低的交易成本，更高效的代币模型，适用于比特币上的原生代币发行。

- 铭文 & 符文交易
  - 去中心化交易可通过 PSBT（部分签名交易） 实现，支持订单发布、定价、双向撮合。
  - 中心化交易所 提供更便捷的铭文和符文资产交易管理。