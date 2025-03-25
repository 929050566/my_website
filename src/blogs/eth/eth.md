# 深入理解 Ethereum 的原理

## 以太坊的发展历史

以太坊（Ethereum）是目前全球最具影响力的区块链平台之一，它不仅支持智能合约（Smart Contracts）和去中心化应用（DApps），还推动了去中心化金融（DeFi）和非同质化代币（NFT）的发展。本节将全面回顾以太坊的发展历程，分析其技术升级和生态演变。

### 1. 以太坊的起源（2013-2015）

#### 1.1 维塔利克·布特林（Vitalik Buterin）提出以太坊

2013年，比特币（Bitcoin）已经成为全球最大的加密货币，但它主要作为点对点电子现金系统，缺乏可编程性。Vitalik Buterin认为区块链不仅仅是支付工具，它可以作为全球计算机，支持复杂的应用逻辑。于是，他在2013年底发表了《以太坊白皮书》（Ethereum Whitepaper），提出：

- 图灵完备的智能合约（比特币的脚本语言不支持复杂计算）。
- 通用区块链平台，可运行各种去中心化应用（DApps）。
- 以太坊虚拟机（EVM），支持智能合约执行。

#### 1.2 以太坊 ICO 募资（2014）

- 2014年7月，以太坊团队发起了首次代币发行（ICO），通过比特币众筹，筹集了 3.1 万 BTC（当时价值约 1800 万美元）。
- 以太坊采用 PoW（工作量证明）作为共识机制，并计划后续升级为 PoS（权益证明）。

#### 1.3 以太坊创世区块（2015年7月30日）

- 2015年7月30日，以太坊创世区块（Genesis Block）诞生，主网正式上线，代号 Frontier。
- 开发者开始部署智能合约，探索以太坊的去中心化应用（DApps）潜力。

### 2. 早期发展与 The DAO 事件（2016）

#### 2.1 Homestead（2016年3月）

以太坊完成首个硬分叉升级 Homestead，增强网络稳定性，为更复杂的 DApp 打下基础。

#### 2.2 The DAO 事件与以太坊分裂

- **The DAO（去中心化自治组织）** 是 2016 年以太坊上最大的智能合约众筹项目，筹集了 1.5 亿美元的 ETH。但 2016 年 6 月，黑客利用智能合约漏洞盗取了约 5000 万美元的 ETH。
- **以太坊社区陷入分歧：**
  - 支持回滚交易（软分叉 + 硬分叉）：Vitalik Buterin 提议通过硬分叉将被盗资金还给投资者。
  - 坚持不可篡改性（反对回滚）：一部分开发者认为区块链不可逆，拒绝分叉。
- 最终，以太坊硬分叉成两个区块链：
  - **Ethereum（ETH）：** 恢复被盗资金，继续发展。
  - **Ethereum Classic（ETC）：** 保留原链，不篡改历史。

### 3. 以太坊生态爆发（2017-2020）

#### 3.1 以太坊与 ICO 热潮（2017）

2017年，以太坊成为全球 ICO（首次代币发行）的首选平台：

- ERC-20 代币标准被广泛采用，项目方可以快速发行代币。
- DeFi（去中心化金融）开始萌芽，MakerDAO 发行 DAI 稳定币。
- 以太坊价格从 10 美元飙升至 1400 美元（2018年1月）。

但 ICO 泡沫导致：

- 许多项目欺诈或失败，市场信任度下降。
- 以太坊网络拥堵，Gas 费上涨。

#### 3.2 以太坊网络扩容压力（2018-2019）

- 由于 ICO、DApps 活跃，以太坊面临交易确认延迟、Gas 费高昂问题。
- 2018年底，熊市来临，ETH 价格跌至 90 美元。

#### 3.3 Ethereum 1.x 过渡与 Istanbul（2019）

以太坊进行 Istanbul 硬分叉，优化 Gas 费用、提升安全性，为 Layer2 方案（如 zk-Rollup）做准备。

### 4. DeFi、NFT 与 Layer2 时代（2020-2021）

#### 4.1 DeFi Summer（2020）

2020年，DeFi 进入爆发期：

- Uniswap：去中心化交易所（DEX）。
- Aave、Compound：去中心化借贷平台。
- Yearn Finance：自动化收益聚合器。

以太坊 Gas 费飙升，用户开始寻求 Layer2 解决方案，如 Optimistic Rollup 和 zk-Rollup。

#### 4.2 NFT 热潮（2021）

以太坊成为 NFT（非同质化代币）主要平台，推动艺术、游戏、音乐行业数字化：

- OpenSea 成为最大 NFT 市场。
- Axie Infinity 和 Decentraland 引领 GameFi（区块链游戏）。

但问题依然存在：

- 交易费用高昂（Gas 费达到 100 美元以上）。
- 交易确认时间长，导致用户体验下降。

### 5. 以太坊 2.0 与 PoS 时代（2022-2023）

#### 5.1 以太坊合并（The Merge, 2022）

2022年9月15日，以太坊完成 The Merge，正式从 PoW（工作量证明）切换到 PoS（权益证明）：

- 以太坊主网与信标链（Beacon Chain）合并，能耗降低 99.95%。
- 取消矿工奖励，ETH 发行量减少，开启通缩时代。

#### 5.2 Shanghai 升级（2023）

2023年4月，以太坊进行 Shanghai 升级：

- 允许用户提现质押的 ETH，进一步增强 PoS 经济模型。
- LSD/LST/LSP
- EigenLayer: 重新质押协议，AVS 主动验证

#### 5.3 Layer2 和 Layer3 生态崛起

- Arbitrum、Optimism：成为最主要的 Layer2 解决方案。
- zkEVM（ZK 以太坊虚拟机）发展迅速，如
  - Polygon zkEVM、
  - Scroll
  - Linea
  - ZkSyncEra
- 技术框架
- OpStack
  - Base
  - Blast
  - Mantle
  - Manta
- Polygon CDK
  - X-Layer
- 基于 Arbi Obit 构建 Layer3
- Zklink
- DappLink

## 以太坊简介 (基于 ETH2.0)

- 信标链：负责的是以太坊的共识层
- Geth: 执行客户端
- 信标链和 Geth 客户端通过 engine-api 进行通信
- EVM: 以太坊虚拟机，用于执行以太坊智能合约

### 1. 以太坊的区块组织

![](eth/Aspose.Words.8c70c070-ef20-4d42-9204-8651fd52bc14.001.png)

获取区块信息的接口

```bash
curl --location 'https://1rpc.io/eth' \
--header 'Content-Type: application/json' \
--data '{
"jsonrpc":"2.0",
"method":"eth_getBlockByNumber",
"params":["0x2c7658", true],
"id":83
}'
```

#### 区块头

- hash
- parentHash
- stateroot: 状态树
- transactionsRoot：交易树根
- receiptsRoot：交易收据树根

#### 区块体

- txlist
- Tx->TxReceipt
- Tx->TxReceipt

### 2. 以太坊里面的三棵树

交易树根和交易收据树根只和当前区块相关，都是当前区块里面的交易，或者交易收据的 MPT 树根，交易树根和交易收据树根和 BTC 是类似的，这里就不做过多的说明了。

状态树是维护以太坊所有账号状态变化数据结构，stateroot 是全局状态树树根

#### 2.1 状态树

![](eth/Aspose.Words.8c70c070-ef20-4d42-9204-8651fd52bc14.003.png)

## 以太坊的出块流程（ETH2.0）

- 信标链是共识层 (POS)
- 质押
  - validator-1----> 需要质押 32 ETH(未来 32-1024 ETH)
  - validator-2----> 需要质押 32 ETH
  - validator-3----> 需要质押 32 ETH
  - validator-n----> 需要质押 32 ETH
- Epoch:
  - 一个 epoch 包含 32 slot
  - 每一个 epoch 有一个检查点
- Slot
- 一个 slot 里面可以放一个区块
- 每 12 秒产生一个 slot
- Slot 是可以为空，如果在这 12s 没有交易，slot 就是空的
- block
- 区块里面含有区块头和区块体
- 区块是有区块状态
- Inital
- Safe
- Finalized
- 区块的提议者：每一个 slot 都有一个提议人，每一个 epoch 会选取一批投票者

![](eth/Aspose.Words.8c70c070-ef20-4d42-9204-8651fd52bc14.004.png)

### 1. 产生分叉的时候 POS 共识怎么投票

![](eth/Aspose.Words.8c70c070-ef20-4d42-9204-8651fd52bc14.005.png)

### 2. Validator 的节点的启动条件

- 32 个 ETH，普通散户很多人可能是没有 32 ETH，需要考量去收集少于 32 ETH 的散户参与整个网络的共识，
- LST/LSD/LSP:

![](eth/Aspose.Words.8c70c070-ef20-4d42-9204-8651fd52bc14.006.png)

## Ethereum 状态机 EVM

- Bitcoin 出现，虽然使得 Token 经济去中心化，但是 Bitcoin 并不能执行太复杂的逻辑，Bitcoin 在
- 定意义上来说并不是图灵完备
- Ethereum 出现：使得链上可以运行复杂的逻辑，使得去中心化金融，NFT 等等成为了现在，所有的这一切都是要归功于 EVM

### 1. EVM 结构

![](eth/Aspose.Words.8c70c070-ef20-4d42-9204-8651fd52bc14.007.png)

### 2. 以太坊一笔交易的生命周期

- 使用钱包或者代码构建交易，nonce, fee 的预估，交易离线签名，构建完整的交易
- 将交易发送到区块网络，交易进入到 MemePool
- 交易的执行，验证交易的签名，nonce 等信息是否合法
- 交易进入到 EVM 里面执行，将交易转换成 Op-Code 执行, 计算 Op-Code 消耗 gas, 执行完成之后将整个执行结果返回

![](eth/Aspose.Words.8c70c070-ef20-4d42-9204-8651fd52bc14.008.png)

- 由 Validator 将交易打包区块，将区块放到 slot 进行投票
- 投票 Validator 来对这个区块进行投票
- 过了一个检查点之后，区块从初始化状态变成 safe
- 过了两个检查点之后，区块从 safe 状态变成 Finalzed
- 这个时候，区块就不可逆，同时区块里面的交易也是不可以逆的。

### 3. 智能合约

- 编程语言：solidity
- 智能合约最终是以 bytecode 的形式存在于以太坊中
- 调用智能合约其实就是发一笔交易，EVM 执行一个交易就是压栈，出栈，Op-Code 执行等过程
- 关键概念
  - ABI
  - Solidity
  - CallData
- EIP, ERC
- ERC20 代币协议
- ERC721 非同质化代币协议
- ERC1155 的半同质化代币
- EIP2930

## 以太坊生态分析

### 1. Ethereum

- 执行层 geth
- 信标链

![](eth/Aspose.Words.8c70c070-ef20-4d42-9204-8651fd52bc14.009.png)

- Eip4844
- Da 层，为 L2, L3 交易数据 rollup 服务的

### 2. Defi 去中心化金融

- 稳定币
  - 和传统金融结合的稳定币：USDT/USDC，用户每往银行存 1 USD，就是 Mint 1USDT, 用户销毁 USDT，可以赎回对应 USD
  - 超额抵押稳定币：DAI， 质押 150 USDT ETH 去发行 100DAI
  - 算法稳定币： UST
- NFT
  - 图片，视频
  - RWA
- Dex
  - Uniswap AAM x * y = k
  - Uniswap V1
  - Uniswap V2
  - Uniswap V3
  - Uniswap V4
- 去中心化币衍生品
  - Dydx
  - Apex
- 质押借贷
  - Compound
  - Aave
- 交易聚合
  - 1inch
  - DoDo
  - Lifi
- LSD/LST/LSP
  - Lido
- 再质押协议
  - EigenLayer
  - Symbiotic

### 3. 以太坊的 Layer2

以太坊 Layer2 存在的形式是两种

- Zk Rollup: 使用的是有效性证明
  - 有效性证明，使用 zk 的算法来保证交易有效性
- Op Rollup： 使用的欺诈证明
- 乐观认为不会作恶，如果真做恶，发生了欺诈，使用的欺诈证明解决发生欺诈的问题

![](eth/Aspose.Words.8c70c070-ef20-4d42-9204-8651fd52bc14.010.png)

Ethereum

- 真正 rollup 需要将交易数据和交易证明，交易状态提交到以太坊
- 将交易数据提交到第三方 DA，仅仅交易证明，交易状态提交到以太坊，这种定义为侧链

### 4. DA 生态

- EigenDA: 数据可用层，一个去中心化的数据库，目前很多 DA 设置只是为存储 L2, L3 rollup 的交易数据

### 5. Eigenlayer

- 再质押协议
- AVS

### 6. 其他基础设施

- Gas Oracle
- 跨链桥
- 全链质押
- 链上随机数 VRF
- The Graph 合约事件同步器
- Gnosis Safe
- 钱包
