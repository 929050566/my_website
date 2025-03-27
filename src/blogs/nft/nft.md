# NFT 交易平台的底层

## 一. NFT 课程概述 
- NFT 发展历程：简介口述完成
- NFT 产品形态
- 各个链上的 NFT 的形式数据解析
- NFT 交易平台的底层业务逻辑
- 中心化交易
- 去中心化交易所

## 二. 什么是 NFT
非同质化或者半同质化代币，怎么去理解非同质化和半同质化代币

同质化：指得每一个资产都是相同，可以相互替换和分割，人民币：100 元可拆分成 100 个 1 元（这些 1 元是等价的）；BTC 和 ETH 等均为可替换和可分割资产。

非同质化：指每个资产都是独一无二、不可分割的。例如：一幅画、一个人。

半同质化：介于以上两者之间，具有一定的替代性，且数量可能大于一，可以交易包的形式进行交易。

NFT：由原创者在区块链上发行，通过加密技术证明 NFT 持有者资产的真实性。

NFT 的表现形式：文字、图文、视频文件、音频文件，独一无二，并可通过链上溯源。

## 三. NFT 相关的名词解释

### 1. ERC20
- https://eips.ethereum.org/EIPS/eip-20  
ERC-20 于 2015 年首次提出，两年后的 2017 年最终被整合到以太坊生态系统中。ERC-20 引入了在以太坊区块链上创建可替代代币的代币标准。简而言之，ERC-20 由支持开发相同代币的属性组成。 例如，代表货币的 ERC-20 代币可以像以太坊的原生货币 Ether 一样发挥作用。这意味着 1 个代币将始终等于另一个代币的价值，并且可以相互互换。ERC 20 代币为可替代代币的开发设定了标准，但可替代代币实际上可以代表什么，下面举一些例子： ERC-20 于 2015 年首次提出，两年后的 2017 年最终被整合到以太坊生态系统中。ERC-20 引入了在以太坊区块链上创建可替代代币的代币标准。简而言之，ERC-20 由支持开发相同代币的属性组成。 例如，代表货币的 ERC-20 代币可以像以太坊的原生货币 Ether 一样发挥作用。这意味着 1 个代币将始终等于另一个代币的价值，并且可以相互互换。ERC 20 代币为可替代代币的开发设定了标准，但可替代代币实际上可以代表什么，下面举一些例子：

- 任何在线平台的声誉点。
- 彩票和计划。
- 金融资产，例如公司的股票、股息和股票
- 法定货币，包括美元。
- 金盎司，还有更多……

以太坊需要一个强大的标准来统一整个操作，以支持代币开发并在区块链网络上对其进行监管。这就是 ERC-20 发挥作用的地方。

去中心化世界的开发人员将 ERC-20 代币标准广泛用于不同目的，例如开发与以太坊生态系统中可用的其他产品和服务兼容的可互操作代币应用程序。

#### 4.1.1. ERC-20 代币的特点
- ERC 20 代币是“可替代代币”的另一个名称。
- 可替代性定义了资产或代币交换相同价值资产的能力，比如两张 1 美元的钞票。
- 无论其特性和结构如何，每个 ERC-20 代币都严格等同于相同的值。
- ERC 代币最受欢迎的应用领域是稳定币、治理代币和 ICO。

### 2. ERC721
- https://eips.ethereum.org/EIPS/eip-721  
要了解 ERC-721 标准，您必须首先了解 NFT（不可替代 Token ）。

Cryptokitties（广泛使用的不可替代代币）的创始人兼首席技术官 Dieter Shirley 最初提议开发一种新的代币类型来支持 NFT。该提案将于 2018 年晚些时候获得批准。它专门用于 NFT，这意味着按照 ERC-721 规则开发的代币可以代表以太坊区块链上任何数字资产的价值。

有了这个，我们得出一个结论：如果 ERC-20 对于发明新的加密货币至关重要，那么 ERC-721 对于代表某人对这些资产的所有权的数字资产来说是无价的。ERC-721 可以表示以下内容：

- 独一无二的数字艺术作品
- 推文和社交媒体帖子
- 游戏内收藏品
- 游戏角色
- 任何卡通人物和数百万其他 NFT ......

这种特殊类型的 Token 为使用 NFT 的企业带来了惊人的可能性。同样，ERC-721 也为他们带来了挑战，为了应对这些挑战，ERC-721 标准开始发挥作用。

请注意，每个 NFT 都有一个称为 tokenId 的 uint256 变量。因此，对于每个 EBR-721 合约，对合约地址 - uint256 tokenId 必须是唯一的。

此外，dApps 还应该有一个“转换器”来规范 NFT 的输入和输出过程。例如，转换器将 tokenId 视为输入并输出不可替代的令牌，例如僵尸、杀戮、游戏收藏品等的图像。

- **ERC-721 代币的特征**
- ERC-721 代币是不可替代代币 (NFT) 的标准。
- 这些代币不能交换任何同等价值的东西，因为它们是独一无二的。
- 每个 ERC-721 代表各自 NFT 的价值，可能不同。
- ERC-721 代币最受欢迎的应用领域是游戏中的 NFT。

### 3. ERC1155
- https://eips.ethereum.org/EIPS/eip-1155  
结合 ERC-20 和 ERC-720 的能力，Witek Radomski（Enjin 的 CTO）为以太坊智能合约引入了一个包罗万象的代币标准。它是一个标准接口，支持开发可替代、半可替代、不可替代的代币和其他具有通用智能联系人的配置。 现在，您可以使用单一界面满足所有代币开发需求并解决问题，使 ERC-1155 成为游戏规则改变者。这种独特代币标准的想法是开发一个强大的智能合约接口，代表和管理不同形式的 ERC 代币。 ERC-1155 的另一个优点是它改进了以前 ERC 令牌标准的整体功能，使以太坊生态系统更加高效和可扩展。

- **ERC-1155 代币的特征**
- ERC-1155 是一个智能合约接口，代表可替代、半可替代和不可替代的代币。
- ERC-1155 可以执行 ERC-20 和 ERC-720 的功能，甚至可以同时执行两者。
- 每个代币可以根据代币的性质代表不同的价值；可替代的、半可替代的或不可替代的。
- ERC-1155 适用于创建 NFT、可兑换购物券、ICO 等。

## 三. NFT 操作形式
![](nft/Aspose.Words.56685758-42d8-4f28-8130-651cffe58581.001.jpeg)

```
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EthNft is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenIds;

    mapping (uint256 => string) private _tokenURIs;

    constructor() ERC721("EthNft", "ENFT") {}

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory){
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory _tokenURI = _tokenURIs[tokenId];
        return _tokenURI;
    }

    function mint(address recipient, string memory uri) public returns (uint256){
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, uri);
        return newItemId;
    }
}
```

```import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js-next";
import { Connection, Keypair} from "@solana/web3.js";


export async function MintNft(privateKey) {
    const connection = new Connection("mainnet");
    console.log(await connection.getBlockHeight())
    const wallet = Keypair.fromSecretKey(new Uint8Array(Buffer.from(privateKey, "hex")));
    const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(wallet))
        .use(bundlrStorage());
    const { uri } = await metaplex.nfts().uploadMetadata({
        name: "My NFT",
        description: "My description",
        image: "https://arweave.net/123",
    });
    const { nft } = await metaplex.nfts().create({
        uri: uri,
    });
    console.log(nft)
}
```

```
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from  "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, setAuthority, transfer } from  "@solana/spl-token";


(async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const fromWallet = Keypair.generate();
    const fromAirdropSignature = await connection.requestAirdrop(
        fromWallet.publicKey,
        LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(fromAirdropSignature);
    const mint = await createMint(
        connection,
        fromWallet,
        fromWallet.publicKey,
        null,
        0
    );
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    );
    const toWallet = Keypair.generate();
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        toWallet.publicKey
    );
    let signature = await mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        1
    );
    await setAuthority(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey,
        0,
        null
    );
    signature = await transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        1
    );
    console.log("SIGNATURE", signature);
})();
```

## 四. 各个链上的资产的表现形式

### 1. Ethereum 
- ERC721 
- ERC1155

### 2. Solana
- NFT 或普通代币（SPL-Token）
- SPL-Token 特性及 Token Program 管理
- 账户模型及 RWA 资产适用性
- Solana NFT 规范，例如 Metaplex Token Metadata Standard

Solana 的 NFT 通常遵循 **Metaplex Token Metadata Standard**，其核心组件包括：

- **Token Program**：管理 SPL 代币（包括 NFT）。
- **Metaplex Token Metadata Program**：为 NFT 提供**元数据存储**、**唯一性** 和 **可扩展功能**（如版税、创作者验证等）。
- ` `**Metaplex Candy Machine**：用于 NFT 批量铸造，类似于以太坊的 **NFT mint 合约**。

- Solana 的 **NFT 的特殊属性：** 要创建一个符合 NFT 标准的 SPL 代币，必须满足以下条件：
- **供应量 = 1**（确保唯一性）。
- **不允许额外铸造（Immutable）**。
- `  `**附加元数据（Metadata Account）**：
- ` `name：NFT 名称
- ` `symbol：NFT 符号（通常为空）
- ` `uri：存储 JSON 格式的元数据，指向 Arweave 或 IPFS
- ` `creators：创作者信息及版税设置。

```
{
  "name": "DappLink NFT",
  "symbol": "DPL",
  "description": "An exclusive NFT from DappLink.",
  "image": "https://arweave.net/abc123xyz",
  "attributes": [
    { "trait_type": "Rarity", "value": "Legendary" },
    { "trait_type": "Background", "value": "Gold" }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://arweave.net/abc123xyz",
        "type": "image/png"
      }
    ],
    "category": "image",
    "creators": [
      {
        "address": "2LZQ...9fp",
        "share": 100
      }
    ]
  }
}
```

### 3. Bitcoin 上的 NFT 表现形式

#### 3.1 协议概述
BRC -20 代币标准于 2023 年 3 月 8 日创建的比特币实验性可替代代币标准，它利用 JSON 数据的序数铭文来部署代币合约、铸造代币和转移代币。

#### 3.2 协议的细节
![](nft/Aspose.Words.56685758-42d8-4f28-8130-651cffe58581.002.jpeg)

#### 3.3 mint
链上：inscribe 一个表示 mint operation 的 sat，并立即 transfer 给 minter 地址

```
{
    "p": "brc20",
    "op": "mint",
    "tick": "ordi",
    "amt": 1000
}
```

链下：
- 判断 state[tick] 存在，amt 不能超过其 lim，累计 amt 不能超过其 max
- state[tick]["balances"][minter] += amt

![](nft/Aspose.Words.56685758-42d8-4f28-8130-651cffe58581.003.png)

#### 3.4 transfer
**链上**：
- 先 inscribe 表示 transfer operation 的 sat，发给 sender 地址

```
{
    "p": "brc20",
     "op": "transfer",
    "tick": "ordi",
    "amt": 1000
}
```

- sender 构造交易并转给 receiver  
**链下**：
- 判断并更新 state[tick]["balances"]

![](nft/Aspose.Words.56685758-42d8-4f28-8130-651cffe58581.004.png)

#### 3.5 一些 BRC-20 例子
- <https://ordinalswallet.com/brc20>

#### 3.6 铭文和符文

##### 3.6.1 符文与铭文的概念
符文（Rune）和铭文（Inscription）是比特币生态中的新兴资产类别，主要通过比特币的 UTXO 结构和 Taproot 机制进行存储和解析。它们可以被用于发行代币、NFT、铭文信息等，使比特币生态更具可编程性。

- **铭文**：铭文通常使用 Ordinals（序数理论）为比特币的最小单位（satoshi）附加元数据，例如图片、文本、代码等，从而形成类似 NFT 的资产。
- **符文**：符文是由 Casey Rodarmor 提出的比特币原生代币标准，旨在提供一种高效的比特币链上资产发行方式，类似于以太坊的 ERC-20 代币标准。

##### 3.6.2 符文和铭文的标准协议
Ordinals 序数铭文协议（BRC-20）：BRC-20 是基于 Ordinals 实现的比特币原生代币标准，主要依赖文本铭文来定义代币信息，常见的 JSON 格式如下：

```
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

Runes 符文协议：符文协议是比特币生态的一种新代币协议，相较于 BRC-20，它更高效，并减少了铭文对比特币 UTXO 集的膨胀影响。其特点包括：

- 无需额外的铭文数据：不依赖 JSON 铭文，而是利用 Taproot 交易中的 OP\_RETURN 进行记录
- 原生 UTXO 模型支持：利用比特币交易本身的输入输出，避免 UTXO 过度碎片化
- 更低的交易成本：相较于 BRC-20，符文交易数据更少，因此 gas 费更低

##### 3.6.3 铭文与符文的铸造过程
- ` `铭文（Inscription）的铸造：铭文的铸造（Inscribing）通常通过 Ordinals 工具进行：
- 选择铭文内容：可以是文本、图片（Base64 编码）、代码或 JSON 数据
- 创建 Ordinals 交易：将铭文数据存储到比特币交易的 witness 数据段中
- 广播交易：交易被矿工打包后，铭文永久记录在比特币链上
- ` `BRC-20 代币的部署和铸造
- **部署 BRC-20 代币**： 
- 发送一个包含 JSON 铭文的 Ordinals 交易（见上文标准）。
- 交易确认后，该代币标准被认可。
- **铸造 BRC-20 代币**： 
- 任何人都可以根据 mint 规则，创建铭文交易，并铸造代币。
- **转移 BRC-20 代币**： 
- 通过 transfer 铭文，将特定数量的 BRC-20 代币转移给其他用户。
- 符文（Runes）的铸造：符文不需要 JSON 铭文，而是通过以下方式铸造：
- 定义符文名称、供应量和规则
- 使用 OP\_RETURN 或 Taproot 交易存储符文信息
- 通过比特币 UTXO 进行解析和管理
- 可在钱包或交易所支持的环境中自由转移

##### 3.6.4 铭文解析器
铭文解析器用于读取比特币交易中的铭文信息，通常需要以下步骤：

- **监听比特币交易**：扫描比特币区块，寻找带有 Ordinals 或符文数据的交易。
- **解析 Witness 数据**：提取 Ordinals 铭文的 JSON 或符文 OP\_RETURN 信息。
- **匹配铭文规则**：识别 BRC-20、NFT、符文等不同类型的数据格式。
- **输出解析结果**： 
- 对于 BRC-20，解析代币总供应量、持有人信息、交易历史等。
- 对于符文，解析符文 ID、铸造数量、转账记录等。

```
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

##### 3.6.5 铭文和符文手续费消耗分析
- **铭文**
- **铭文**（Inscription）基于 **Ordinals 序数理论**，通常将数据存储在比特币 **Taproot Witness 数据**部分，因此其交易手续费较高。
- 铭文（如 BRC-20、NFT）通常通过 Taproot 交易存储数据在 Witness 结构中，由于 Witness 数据部分的折扣机制，铭文交易比普通 P2PKH/P2SH 交易稍微便宜，但仍然比普通 BTC 交易昂贵。
- **符文**
- 符文数据可以通过 OP\_RETURN 存储，或直接嵌入 UTXO 交易输入/输出字段，相比铭文，符文避免了 Witness 结构存储大量数据，因此交易更轻量、费用更低。

## 3.1 PSBT 介绍
PSBT（部分签名比特币交易，Partially Signed Bitcoin Transaction）是一种比特币交易的中间格式，旨在方便多方或多步签名过程。PSBT 允许不同的实体（如硬件钱包、冷钱包、热钱包或多签参与者）逐步添加必要的签名，最终形成一笔完整的比特币交易。

## 3.1.1 PSBT 的结构
PSBT 是比特币原始交易（raw transaction）的扩展格式，包含原始交易所需的信息以及签名过程的辅助数据。PSBT 的数据结构分为以下几部分

- 全局字段：这些字段适用于整个 PSBT：
- **版本号（Version）**：当前版本为 0x00。
- **原始交易（Unsigned Transaction）**：PSBT 存储了一个未签名的比特币交易，该交易在未完成签名前不可用。
- **Xpub（可选）**：用于描述公钥信息（如 BIP32 扩展公钥）。
- 输入字段： 输入字段（Input Fields）
- **非最终化的输入（Non-Finalized Inputs）**：交易的输入，未完全签名。
- **UTXO 信息**：
- **非隔离见证（Legacy）输入**：需要 Previous TX（完整的前序交易）
- **隔离见证（SegWit）输入**：只需要 Witness UTXO（简化的 UTXO 信息）
- **签名相关信息**： 
- Partial Signatures（部分签名）。
- Public Keys（相关的公钥）。
- Sighash Type（签名哈希类型）。
- Redeem Script（P2SH 解锁脚本）。
- Witness Script（P2WSH 见证脚本）。
- BIP32 Derivation（BIP32 派生路径）
- 输出字段（Output Fields）每个输出包括：
- **公钥信息**（BIP32 Derivation）
- **脚本信息**（如果适用，存储 Redeem Script 或 Witness Script）
- PSBT 交易流程：
- **步骤 1：创建 PSBT**
- 由钱包软件、离线设备或交易构建工具创建一笔未签名的交易。
- 交易的输入包括 UTXO，但尚未附加签名。
- **步骤 2：添加签名**
- 私钥持有者（如硬件钱包或冷钱包）逐步对交易进行签名。
- PSBT 允许多个签名者分别签署（如多重签名地址）。
- 硬件钱包可以通过 PSBT 提供的 UTXO 信息，在离线环境中验证交易的输入。
- **步骤 3：合并签名**
- 一旦所有需要的签名都被收集，PSBT 可以被合并（Combine）。
- 这一阶段会合并多个签名到一个完整的交易中。
- **步骤 4：最终化交易**
- 当交易的所有输入都已满足签名需求后，PSBT 需要被 Finalized（最终化）。
- 这会生成一笔标准的比特币交易（Raw Transaction），可以用 bitcoin-cli sendrawtransaction 或其他方式广播到比特币网络。

PSBT 格式由 BIP 174（[BIP 174: Partially Signed Bitcoin Transaction Format](https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki)）定义，目的是使交易签名更加灵活和安全，特别适用于：

- **冷钱包离线签名**：冷钱包可以接收一个 PSBT，进行签名后再返回，不需要暴露私钥。
- **多重签名（MultiSig）**：每个签名者可以分别对 PSBT 添加签名，最后由某个节点完成合并和广播。
- **硬件钱包支持**：硬件钱包不需要知道整个钱包的 UTXO 集，只需要处理与交易相关的部分。

## 3.2 Sighash 用途
![](nft/Aspose.Words.56685758-42d8-4f28-8130-651cffe58581.005.png)

这张图片展示了 **Bitcoin 交易的 SIGHASH（签名哈希）类型**，它决定了签名对交易的哪些部分负责。通俗点说，这个机制允许签名者选择只对交易的一部分负责，从而支持更灵活的交易模式，比如多重签名、联合支付等。

### 图片分为两排：

- **第一排**（基础类型）
- **第二排**（带 ANYONECANPAY 选项的扩展类型）

### 第一排（基础 SIGHASH 类型）

- **SIGHASH\_ALL（0x01）**
- **全签名模式**：所有输入和输出都被锁定，交易的任何部分都不能被修改。
- **适用于普通交易**，因为可以确保支付的金额和接收者不会被篡改。
- **SIGHASH\_NONE（0x02）**
- **只签名输入**，不锁定任何输出。
- 这样别人可以随意修改交易的输出，适用于**灵活支付场景**（如某人只想签名但不关心资金流向）。
- **SIGHASH\_SINGLE（0x03）**
- **每个输入只锁定对应的一个输出**。
- 适用于**联合支付**，例如多人签署一笔交易，每个人只负责自己的部分。

### 第二排（ANYONECANPAY 变体）

这些变体允许 **新增输入**，但仍然控制输出。

- **SIGHASH\_ALL | ANYONECANPAY（0x81）**
- **只锁定当前输入和所有输出**，但其他人可以添加额外的输入（比如共付模式）。
- **应用场景**：类似“众筹”模式，A 先支付，其他人可以随意加钱。
- **SIGHASH\_NONE | ANYONECANPAY（0x82）**
- **只锁定当前输入**，但允许其他人添加输入和输出。
- **应用场景**：比如发起一个交易，允许其他人修改资金流向。
- **SIGHASH\_SINGLE | ANYONECANPAY（0x83）**
- **只锁定当前输入和对应的一个输出**，其他部分可修改。
- **应用场景**：适用于某些 P2P 支付场景，如“我要给某人转账，但其他部分随意”。

### 直观理解

- **SIGHASH\_ALL** → “我签字后，所有内容都不能改！”
- **SIGHASH\_NONE** → “我只保证自己花费的钱，别人爱怎么花不管！”
- **SIGHASH\_SINGLE** → “我对某个输入只负责对应的一个输出！”
- **ANYONECANPAY** 变体 → “其他人可以随意增加他们的资金来源！”

## 3.3 基于 PSBT 的交易 
![](nft/Aspose.Words.56685758-42d8-4f28-8130-651cffe58581.006.jpeg)

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

## 五. 知名的交易平台
- Opensea：Ethereum 
- Solsea：Solana
- Marketplace：Bitcoin

## 六. 各个链上的 NFT 的形式数据解析

### 1. Bitcoin 
- 

### 2. Ethereum 
- 合约事件解析，如：
```python
function \_safeMint(address to, uint256 tokenId, bytes memory data) internal virtual {<br>`    `\_mint(to, tokenId);<br>`    `ERC721Utils.checkOnERC721Received(\_msgSender(), address(0), to, tokenId, data);<br>}
```
- ERC1155 示例：
```python
event TransferBatch(<br>`      `address indexed operator,<br>`      `address indexed from,<br>`      `address indexed to,<br>`      `uint256[] ids,<br>`      `uint256[] values<br>`  `);
function \_mintBatch(address to, uint256[] memory ids, uint256[] memory values, bytes memory data) internal {<br>`    `if (to == address(0)) {<br>`        `revert ERC1155InvalidReceiver(address(0));<br>`    `}<br>`    `\_updateWithAcceptanceCheck(address(0), to, ids, values, data);<br>}
```

### 3. Solana
```typescript
let fromAddresses: string[] = [];<br>`  `let toAddresses: string[] = [];<br>`  `let amounts: string[] = [];<br>`  `for(let i=0; i<instructions.length; i++){<br>`    `const instruction = instructions[i];<br>`    `const obj = {};<br>`    `postTokenBalances?.forEach(item=>{<br>`      `// tokenAddress 对应 owner<br>`      `obj[accountKeys[item.accountIndex].pubkey] = {owner: item.owner, mint: item.mint};<br>`    `});<br>`    `if(instruction.parsed && instruction.program){<br>`      `const {parsed:{type, info}, program} = instruction;<br>`      `if(program==="system" && type==="transfer"){<br>`        `fromAddresses.push(info.source);<br>`        `toAddresses.push(info.destination);<br>`        `amounts.push(info.lamports);<br>`      `}else if(program==="spl-token" && (type==="transfer" || type==="transferChecked") && obj[info.source].mint === contractAddr && obj[info.destination].mint === contractAddr){<br>`        `fromAddresses.push(obj[info.source].owner || info.authority || info.multisigAuthority);<br>`        `let toAddr = obj[info.destination].owner;<br>`        `if(!toAddr){<br>`          `const toAddrObj = instructions.find(ele => {<br>`            `return ele.program === "spl-associated-token-account"<br>`              `&& ele.parsed.type === "create"<br>`              `&& ele.parsed.info.account === info.destination<br>`          `});<br>`          `toAddr = toAddrObj.parsed.info.wallet;<br>`        `}<br>`        `toAddresses.push(toAddr);<br>`        `amounts.push(info.amount || info.tokenAmount.amount);<br>`      `}else{<br>`        `fromAddresses.push("");<br>`        `toAddresses.push("");<br>`        `amounts.push("0");<br>`      `}<br>`    `}else{<br>`      `fromAddresses.push("");<br>`      `toAddresses.push("");<br>`      `amounts.push("0");<br>`    `}
```

## 七. 中心化交易的 NFT 交易平台
- NFT 也是一种资产，用户先将 NFT 资产充值到交易所，交易所也会将这些 NFT 规整到归集地址（热钱包）
- 中心化交易所里面（商城）

![](nft/Aspose.Words.56685758-42d8-4f28-8130-651cffe58581.007.jpeg)

## 八. 去中心化 NFT 交易平台

### 1. Bitcoin 
- 基于 UTXO （参见 3.3 部分）

### 2. Ethereum
![](nft/image.png)

### 3. NFTTradePlatform contracts Demo

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketplace is ReentrancyGuard {
    struct Order {
        address nftAddress;   // NFT合约地址
        uint256 tokenId;      // NFT Token ID
        uint256 price;        // 挂单价格（单位：wei）
        address seller;       // 卖方地址
        bool isActive;        // 订单是否有效
    }

    mapping(bytes32 => Order) public orders;      // 订单存储
    bytes32[] public activeOrders;                 // 有效订单列表
    
    // 事件定义
    event OrderCreated(
        bytes32 orderId,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price,
        address indexed seller
    );
    
    event OrderCancelled(bytes32 orderId);
    event OrderMatched(bytes32 orderId, address buyer);

    // 创建挂单（需要提前approve）
    function createOrder(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _price
    ) external {
        IERC721 nft = IERC721(_nftAddress);
        require(nft.ownerOf(_tokenId) == msg.sender, "Not NFT owner");
        require(_price > 0, "Price must be positive");
        
        bytes32 orderId = keccak256(
            abi.encodePacked(_nftAddress, _tokenId, msg.sender, block.timestamp)
        );
        
        orders[orderId] = Order({
            nftAddress: _nftAddress,
            tokenId: _tokenId,
            price: _price,
            seller: msg.sender,
            isActive: true
        });
        
        activeOrders.push(orderId);
        emit OrderCreated(orderId, _nftAddress, _tokenId, _price, msg.sender);
    }

    // 取消挂单
    function cancelOrder(bytes32 _orderId) external {
        Order storage order = orders[_orderId];
        require(order.isActive, "Order not active");
        require(order.seller == msg.sender, "Not order owner");
        
        order.isActive = false;
        _removeOrder(_orderId);
        emit OrderCancelled(_orderId);
    }

    // 执行购买（带ETH支付）
    function executeOrder(bytes32 _orderId) 
        external 
        payable 
        nonReentrant 
    {
        Order storage order = orders[_orderId];
        require(order.isActive, "Order not active");
        require(msg.value >= order.price, "Insufficient payment");
        
        // 转账ETH给卖方
        (bool sent, ) = order.seller.call{value: msg.value}("");
        require(sent, "ETH transfer failed");
        
        // 转移NFT
        IERC721(order.nftAddress).safeTransferFrom(
            order.seller, 
            msg.sender, 
            order.tokenId
        );
        
        order.isActive = false;
        _removeOrder(_orderId);
        emit OrderMatched(_orderId, msg.sender);
    }

    // 获取有效订单数量
    function getActiveOrdersCount() external view returns (uint256) {
        return activeOrders.length;
    }

    // 内部函数：从有效订单列表中移除
    function _removeOrder(bytes32 _orderId) private {
        for (uint256 i = 0; i < activeOrders.length; i++) {
            if (activeOrders[i] == _orderId) {
                activeOrders[i] = activeOrders[activeOrders.length - 1];
                activeOrders.pop();
                break;
            }
        }
    }
}
```



