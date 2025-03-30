# 概述
Solana 交易解析涉及多个方面，包括交易结构、签名验证、指令解析、事件日志处理等。由于 Solana 采用的是账户模型（Account Model），其交易结构与以太坊（Ethereum）的 EVM 交易存在较大差异，解析 Solana 交易需要深入理解 Solana 的交易格式、指令集（Instruction Set）以及 RPC API。
# Solana 前置调研知识
## 基本信息
### RPC API URL 的获取方式
- Solana 官方文档：https://solana.com/zh/rpc，文档里面有 miannet, testnet 和 devnet 的 rpc url 的地址
- 第三方节点服务商：getblock 等提供 RPC  节点，会限制频率，但是能简单的使用

### 账户模型还是 UTXO 模型
- Solana 是账户模型，我们可以通过浏览器数据或者 getTransaction 判断 Solana 是账户模型
- 浏览器上的交易基本是有 from, to 地址和金额，没有一对多，多对一，对多对的输入输出模型
- getTransaction 判断
  - request
```json
curl --location 'https://go.getblock.io/70f479b9ed834b5f96a26934e0492b36' \
--header 'Content-Type: application/json' \
--data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getTransaction",
    "params": [
       "3bWvYMwvDgYyyr9jamh57dFc2atfZhBS2HhHqNKyGdUx9UwLQwS7hJ5WHaei9QqsDHyGp4ypn79uWystJ1G2pJZN",
        {
            "encoding": "jsonParsed",
            "maxSupportedTransactionVersion": 0
        }
    ]
  }'
```
  - Reponse 
```json
"transaction": {
    "message": {
        "instructions": [
            {
                "parsed": {
                    "info": {
                        "nonceAccount": "NUr4FHh2HDAcHwXRxhNbWsAbJWzRZTzZspoSjHZy7HJ",
                        "nonceAuthority": "updtkJ8HAhh3rSkBCd3p9Z1Q74yJW4rMhSbScRskDPM",
                        "recentBlockhashesSysvar": "SysvarRecentB1ockHashes11111111111111111111"
                    },
                    "type": "advanceNonce"
                },
                "program": "system",
                "programId": "11111111111111111111111111111111",
                "stackHeight": null
            },
            {
                "parsed": {
                    "info": {
                        "destination": "Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY",
                        "lamports": 1000,
                        "source": "updtkJ8HAhh3rSkBCd3p9Z1Q74yJW4rMhSbScRskDPM"
                    },
                    "type": "transfer"
                },
                "program": "system",
                "programId": "11111111111111111111111111111111",
                "stackHeight": null
            
            },
          }
       ]
    }             
}
```
  - 观察上面的是数据，type 位 transfer 的交易，很明显 parsed 里面的 info 里面的 destination 是 to 地址，source 是 from 地址，lamports 是转账金额，从这里也能判断 solana 是账户模型的链。
### 如何搭建 Solana 节点
参考一下文档链接
- https://solana.com/zh/docs/intro/installation
- https://solana.com/zh/developers/cookbook/development/start-local-validator
- https://solana.com/zh/docs/toolkit/local-validator
## 编码方式，签名算法
从文档上面看出
- Solana 使用的签名算法是 Ed25519，文档链接：https://solana.com/zh/docs/core/accounts
- Solana 地址是使用公钥进行 base58 编码的字符串
- Solana HD 钱包的推到路径为 m/44'/501'/${ i }'/0'  文档链接：https://solana.com/zh/developers/cookbook/wallets/restore-from-mnemonic
## 代币和 NFT 的兼容性
Solana 生态系统中有一套被称为 Solana Program Library（SPL）的智能合约库，为开发者提供了常用功能。SPL Token 便是其中最常用、最核心的智能合约程序之一，用来在 Solana 网络上创建、管理、转移各类可替代性代币（Fungible Tokens）。相当于以太坊上的 ERC-20 标准。
### SPL Token 基础概念
- SPL（Solana Program Library）：SPL 是官方提供的一组智能合约（Program），它们封装了常见的功能和逻辑，供开发者或用户直接使用
  - 其中最常见的合约有：SPL Token、SPL Memo、SPL Name Service 等等
  - SPL Token 负责代币的创建与管理，是构建在 Solana 区块链上的可替代性代币标准
- SPL Token 与 SOL
  - SOL：Solana 网络的原生代币，可用于支付交易费、进行网络抵押（Staking）等
  - SPL Token：与 ERC-20 类似，在 Solana 网络上发行的通证。任何人都可以根据 SPL Token 标准创建自己的代币，使用 Solana 的底层基础设施进行管理和流通
- Token Program
  - SPL Token 实际就是在 Solana 主网运行的一个程序（Program ID 通常为 TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA），在链上提供一系列指令（Instructions），以供用户通过交易来调用实现代币的发行、转移、销毁等操作
- Token Account 与 Associated Token Account
  - Token Account：存储某种特定 SPL Token 的账户，一个 Token Account 只能对应一种 Token 类型，用于记录“持有人地址”和“持有数量”
  - Associated Token Account（ATA）：一个规范化的 Token Account，它按照一定算法与钱包地址+Token Mint 绑定。可以用同一个主钱包私钥创建多个 ATA，分别存储不同的 SPL Token。大多数前端 DApp 及工具都会使用 ATA
### SPL Token 的主要特性
- 可自定义小数位数（Decimals）：在创建 SPL Token 时可以指定小数点（比如 6、8、9、甚至 0 等）。这会影响代币的最小精度
- 可动态设置权限（Authority）：创建代币时可以指定多种权限（Authority），这些权限可以在创建时指定，也可以后续转移给他人，或者干脆取消（Burn Authority）；常见的有：
  - Mint Authority：可增发该 Token 的地址
  - Freeze Authority：可冻结某地址 Token 账户的地址
  - Owner：Token Account 本身的所有者
- 灵活的增发与销毁
  - 通过 mint 指令，可以给指定的 Token Account 增发一定数量的代币（需要具备 Mint Authority）
  - 通过 burn 指令，可以从自己的 Token 账户中销毁（Burn）一定数量的代币（需要 Token Account 所有者及正确权限）
- 冻结（Freeze）功能：若代币在设计上允许 Freeze Authority，则可以对某些 Token Account 进行冻结操作，使其无法转移代币，甚至无法销毁代币。在某些合规场景下会使用到这种功能

# 共识机制与交易确认
## 共识机制
Solana 作为当今 Web3 生态中最具突破性的 Layer 1 区块链之一，以高吞吐量、低延迟著称。相比于以太坊（Ethereum）或比特币（Bitcoin），Solana 采用了一种创新的共识机制：PoH（Proof of History，历史证明）+ Tower BFT（基于 PoH 的拜占庭容错协议）+ PoS（Proof of Stake，权益证明），这使得它能够以 400ms 的出块速度和 65,000 TPS 以上的交易处理能力，远超其他公链。
Solana 的共识算法并不是单一的 PoS，而是结合了多个机制，共同提升区块链的效率和安全性：
- PoH（Proof of History，历史证明）
  - 提供去中心化时间同步，减少节点间的通信开销。
  - 通过连续哈希生成时间戳，确保交易的顺序可验证。
- Tower BFT（基于 PoH 的 BFT 变体）
  - 作为 Solana 的最终性协议，确保区块的不可逆性。
  - 基于 PBFT（Practical Byzantine Fault Tolerance）优化，减少消息复杂度。
-  PoS（Proof of Stake，权益证明）
  - 选举验证者（Validators），决定谁负责区块生产。
  - 采用质押（Staking）和罚没（Slashing） 机制，确保网络安全性。
这种三者结合的方式，帮助 Solana 兼具高吞吐量、去中心化和安全性，相比其他 PoS 或 PoW 区块链更具优势

## Solana 交易确认确认位
在 Solana 中，每个 slot 大约 400 毫秒产生一个，用于装载区块。当超过 2/3 的节点对某个 slot 进行投票时，该区块就被视为 Finalized。最少需要经过 32 个 slot 才能达到相对安全的确认状态，而当 slot 数量超过 64 时，区块的状态就变得绝对安全，不会出现回滚现象。因此，在实际应用中，为了确保交易绝对安全，建议等待 64 个 slot 的确认
- 相对安全：32 Slot
  - 等待 32 个 Slot：如果一个区块已经连续经历了 32 个 Slot（每个 Slot 都相互依赖前面已确认的区块），就可以算是达到了“相对安全”——此时区块被回滚的可能性极小
  - 适合常规交易场景：大多数情况下，32 Slot 就足以保证交易安全，满足一般用户的需求
- 绝对安全：64 Slot
  - 等待 64 个 Slot：如果还不放心，或者是遇到金额巨大的交易，等待 64 个 Slot 会让区块的最终性几乎板上钉钉，“绝对安全”几乎排除了所有回滚或分叉的可能性
  - 适合高价值应用：对风险敏感度高的场景，如金融机构、跨境支付等，大额交易会选择等待 64 Slot 以保证万无一失
- Slot 几乎是瞬时确认：如果只等 1 个 Slot，虽然交易能极快显示出“已确认”的状态，但安全性相对较低，仅适用于那些对回滚风险不太敏感的场合，比如一些小额闪付或测试交易
- 总结
  -  1 Slot：最快，但安全保障相对较弱。
  - 32 Slot：平衡了效率与安全，适合大多数日常交易需求。
  - 64 Slot：几乎可以“高枕无忧”，适合高价值交易或极端安全需求。
## 结论
由 Solana 的共识算法我们可以得出 Solana 钱包交易的确认位和 Solana 是支持质押的
- 确认位
  -  1 Slot：最快，但安全保障相对较弱。
  - 32 Slot：平衡了效率与安全，适合大多数日常交易需求。
  - 64 Slot：几乎可以“高枕无忧”，适合高价值交易或极端安全需求。
-  Solana 质押流程
  - 创建质押账户并打入质押的资金
  - 将质押的资金委托给矿池节点
  - 等待下一个质押周期开始之后进入质押并获得质押收益
-  Solana 取回质押流程
  - 若 Solana 质押没有进入到质押的 epoch，此时账户还在处于未激活状态，可以直接取回质押的资金
  - 若 Solana 质押的资金已经进入了 epoch, 需要执行操作将质押账户从 active 变成 inactive 状态
  - 等待当前质押周期结束之后，可以将奖励和质押本金提回主账户
## 交易细节
在 Solana 网络上，交易（Transaction） 其实是一个相对复杂的结构，它包含了签名、消息（Message）、指令（Instructions）等多层要素。理解并能够解析交易数据，对于开发者调试、审计或者在后端对交易做进一步处理至关重要。本文将从交易的结构、核心组成部分及 Native token,  Spl-token(代币和NFT)解析方式等方面做一个较为深入的介绍。

### Solana 的交易结构和组成部分
- 签名：一笔交易可以包含一个或多个签名（通常是一组签名者，至少包括资费支付者），以确保交易发起人拥有对相应账户的操作权限。
- 消息：交易主体的信息都在 Message 中，包括要访问的账户列表、指令、最近区块哈希（recent blockhash）等。在 Solana 早期，Message 主要采用 v0 格式；从 Solana v1.10 开始，新增了 Versioned Transaction 的概念，支持 v0、v1 等不同格式的 Message，并引入了 Address Lookup Table（ALT） 来减少交易大小、支持更多账户等。
- 元数据：在交易执行之后，链上会针对该交易生成 Transaction Meta，记录执行结果、消耗的计算单元（compute units）、账变、事件日志（log messages）等信息。
### Native Token 交易解析
- 请求一笔的 native tokne 的交易
```json
curl --location 'https://docs-demo.solana-mainnet.quiknode.pro' \
--header 'Content-Type: application/json' \
--data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getTransaction",
    "params": [
      "3SqLsNZcf3uMxDhYT8QNV75TcA9g3uWL5cuAGZN3pDR4DxDFffpC7SbDfvAQzFCKUJWo7KpsPSz89XsfmUSG4fz6",
       {
            "encoding": "jsonParsed",
            "maxSupportedTransactionVersion": 0
        }
    ]
  }'
```
- 返回数据解析
```json
{
    "jsonrpc": "2.0",
    "result": {
        "blockTime": 1742282594,
        "meta": {},
        "slot": 327522643,
        "transaction": {
            "message": {
                "accountKeys": [
                    {
                        "pubkey": "updtkJ8HAhh3rSkBCd3p9Z1Q74yJW4rMhSbScRskDPM",
                        "signer": true,
                        "source": "transaction",
                        "writable": true
                    }
                ],
                "addressTableLookups": [],
                "instructions": [
                    {
                        "parsed": {
                            "info": {
                                "nonceAccount": "NtTEpbR4sr4YoASTcc57QTsziFmoHAZ4jJFjDnN6PGr",
                                "nonceAuthority": "updtkJ8HAhh3rSkBCd3p9Z1Q74yJW4rMhSbScRskDPM",
                                "recentBlockhashesSysvar": "SysvarRecentB1ockHashes11111111111111111111"
                            },
                            "type": "advanceNonce"
                        },
                        "program": "system",
                        "programId": "11111111111111111111111111111111",
                        "stackHeight": null
                    },
                    {
                        "parsed": {
                            "info": {
                                "destination": "ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49",
                                "lamports": 1000,
                                "source": "updtkJ8HAhh3rSkBCd3p9Z1Q74yJW4rMhSbScRskDPM"
                            },
                            "type": "transfer"
                        },
                        "program": "system",
                        "programId": "11111111111111111111111111111111",
                        "stackHeight": null
                    }
                ],
                "recentBlockhash": "4biM57FFoWV4o1ccvCZa1xXC9ZyCEbSnF8TryaFWqc9C"
            },
            "signatures": [
                "3SqLsNZcf3uMxDhYT8QNV75TcA9g3uWL5cuAGZN3pDR4DxDFffpC7SbDfvAQzFCKUJWo7KpsPSz89XsfmUSG4fz6"
            ]
        },
        "version": 0
    },
    "id": 1
}
```
- parsed 的 info 里面信息
  - source：出金地址
  - destination：入金地址
  - lamports：转账金额
  - type：转账类型
### Spl-Token 类型的 Token 交易解析
- 请求一笔 spl-token 转账交易
```json
curl --location 'https://docs-demo.solana-mainnet.quiknode.pro' \
--header 'Content-Type: application/json' \
--data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getTransaction",
    "params": [
      "Ng54UKCtt6sBn6QCKeiA3enDpaVUZG96BDVJhsXKfVEznTPYWxkjNSiKguziEWzH6zdkxSVMkg2Ev3wCS734mpU",
       {
            "encoding": "jsonParsed",
            "maxSupportedTransactionVersion": 0
        }
    ]
  }'
```
- spl-token 转账交易返回部分数据提取
```json
{
    "jsonrpc": "2.0",
    "result": {
        "blockTime": 1742284419,
        "meta": {
            "computeUnitsConsumed": 284123,
            "err": null,
            "fee": 39611,
            "innerInstructions": [
                {
                    "index": 1,
                    "instructions": [
                        {
                            "parsed": {
                                "info": {
                                    "amount": "50050141",
                                    "authority": "ExJpujKftyy53gHF3dTKo8bgCaR8yaqrxPYtj48gWxyb",
                                    "destination": "8zgvk7zxbuhq8d3Xt9fAaGTXynp5WYYKGyzN2dnVsdmE",
                                    "source": "CjiDdqbJmGKm3er8rXRVrkNK9RfNT7iWyTPcfH6x8KHX"
                                },
                                "type": "transfer"
                            },
                            "program": "spl-token",
                            "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                            "stackHeight": 2
                        }
                    ]
                },
                {
                    "index": 2,
                    "instructions": [
                        {
                            "parsed": {
                                "info": {
                                    "amount": "50050141",
                                    "authority": "JD38n7ynKYcgPpF7k1BhXEeREu1KqptU93fVGy3S624k",
                                    "destination": "m3BrPbv2TFmZZTPpyB9NgsCXqGNujpXvzvGqj8ksars",
                                    "source": "8zgvk7zxbuhq8d3Xt9fAaGTXynp5WYYKGyzN2dnVsdmE"
                                },
                                "type": "transfer"
                            },
                            "program": "spl-token",
                            "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                            "stackHeight": 2
                        },
                   
                        {
                            "parsed": {
                                "info": {
                                    "amount": "50050141",
                                    "authority": "4xDsmeTWPNjgSVSS1VTfzFq3iHZhp77ffPkAmkZkdu71",
                                    "destination": "3bWPj5eepJm8CxUzk5MMFMN2CFJkntxKvbmy4zwwtpJd",
                                    "source": "m3BrPbv2TFmZZTPpyB9NgsCXqGNujpXvzvGqj8ksars"
                                },
                                "type": "transfer"
                            },
                            "program": "spl-token",
                            "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                            "stackHeight": 3
                        },
                        {
                            "parsed": {
                                "info": {
                                    "amount": "400084209",
                                    "authority": "CYbD9RaToYMtWKA7QZyoLahnHdWq553Vm62Lh6qWtuxq",
                                    "destination": "6zAcFYmxkaH25qWZW5ek4dk4SyQNpSza3ydSoUxjTudD",
                                    "source": "GviiXg2Xc1xCpyNY36r7h1EAy7uvse5UMkiiyHjRDU6Z"
                                },
                                "type": "transfer"
                            },
                            "program": "spl-token",
                            "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                            "stackHeight": 3
                        },
                    
                        {
                            "parsed": {
                                "info": {
                                    "amount": "7617591708",
                                    "authority": "4xDsmeTWPNjgSVSS1VTfzFq3iHZhp77ffPkAmkZkdu71",
                                    "destination": "c7i6v5d9aXbpfnQPzfxLJ3poM2aa2N1irTz1tGJi1jf",
                                    "source": "H39NXe6j2UVuLMMA9onuas3aFCsU2eXxdTcNXX7usN8u"
                                },
                                "type": "transfer"
                            },
                            "program": "spl-token",
                            "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                            "stackHeight": 2
                        }
                    ]
                },
                "recentBlockhash": "9q8MbtrJ4fXWw8op5NjKfKjc4gFRB54t4drQjzoAnb2F"
            },
            "signatures": [
                "Ng54UKCtt6sBn6QCKeiA3enDpaVUZG96BDVJhsXKfVEznTPYWxkjNSiKguziEWzH6zdkxSVMkg2Ev3wCS734mpU"
            ]
        },
        "version": 0
    },
    "id": 1
}
```
- parsed 里面的交易
  - program：spl-token 类型交易
  - type：transfer 为转账类型
  - source：出金地址
  - destination：入金地址
  - lamports：转账金额
### Spl-Token 类型的 NFT 交易解析
- 请求应答过程如上，数据片段截取如下
```json
"parsed": {
    "info": {
        "destination": "8JhrZdMpkhLsSVKjpKEQnyQhuQgLAniaGV6ybdtb6Ad1",
        "mint": "CnB32foaJLZTc2LZACC9h9Mef97WLFkvBXVGuqcpGxLZ",
        "multisigAuthority": "HCx3yTcPGyTFu4PStzWKzwyJzm2R2mmUnEhbAQed7Syr",
        "signers": [
            "HCx3yTcPGyTFu4PStzWKzwyJzm2R2mmUnEhbAQed7Syr"
        ],
        "source": "DqSaDbr2qgfWpZpCsJMQEoo9qnCEYMoT2CFMkrhCdjFx",
        "tokenAmount": {
            "amount": "1",
            "decimals": 0,
            "uiAmount": 1.0,
            "uiAmountString": "1"
        }
    },
    "type": "transferChecked"
}
```
- parsed 里面的交易
  - program：spl-token 类型交易
  - source：出金地址
  - destination：入金地址
  - tokenAmount：为对应转账的 NFT 信息
  - type：为 transfer 或者 transferChecked
### Spl-token 常见的操作类别
直接转账
- 直接转账（Transfer 指令）：从当前账户（Owner）向另一个 Token Account 发送一定数量的代币
- 调用方式：通常在客户端或合约（CPI 调用）中，会构造一个指令 Transfer { amount }，并指定：
  - 源账户：要转出的 Token Account
  - 目标账户：要接收的 Token Account
  - Authority：源账户的 Owner（需要签名）
  - 调用指令：spl_token::instruction::transfer(...) 或 transfer_checked(...)；
- 特点
  - 不会去检查你传入的 amount 是否符合代币的 decimals 精度，可能会导致超出小数精度的意外输入
  - 一般建议使用 TransferChecked（见下），除非你非常确定自己处理好了精度。
带精度检查的转账
- 带精度检查的转账（TransferChecked 指令）：与普通 Transfer 类似，但会强制检查 amount 是否与该 Token 的 decimals 相匹配
- 调用方式：指令 TransferChecked { amount, decimals }，需要多传一个 decimals 参数，用于程序内部做验证。
- 特点：
  -  能显式地确保不会错误传入“少/多”小数位的 amount。
  -  对于高精度 Token 来说更安全，也能帮助开发者避免精度错误。
  - 建议大多数情况下都用 TransferChecked，除非要兼容旧版本或有特殊需求。
授权代理转账
- 授权代理转账（Approve + Transfer / TransferChecked）：将账户中的一部分代币授权给 “Delegate” 地址，由此 Delegate 可以帮你在后续发起转账操作，而无需账户 Owner 每次都签名。
- 调用过程：
  - Approve：账户 Owner 调用 Approve 指令，指定 delegate 地址和授权限额（allowance）
  - Transfer（或 TransferChecked）：在后续的转账中，Delegate 地址用自己的签名发起，使用 source_account 作为源账户，并提供 delegate 作为授权人，即可从该源账户转走不超过 allowance 的代币。
  - 当授权过期（或不用了）时，可以由账户 Owner 调用 Revoke 指令收回授权。
- 特点：
  - 常用于去中心化交易所、借贷协议等需要“合约代为扣款”的场景。
  - 跟 ERC-20 的 “approve / transferFrom” 模式类似。

### 内部调用 / Program-to-Program 调用（CPI）
当一个 Solana Program（合约）要在运行时去转移某些 SPL Token 时，需要CPI（Cross-Program Invocation） 调用 SPL Token Program 的 “transfer” 或 “transfer_checked” 指令：例如，合约 A 在执行时，需要从用户的 Token Account 转到合约的 Token Account：
- 用户先把自己的 Token Account “delegate” 授权给合约（或给合约的 PDA），合约就有权从用户账户中转出代币；
- 合约里再通过 CPI 调用 SPL Token Program 的 transfer / transfer_checked；
-  以合约自身（或其 PDA）作为签名者。
  - 这一过程不会产生新的外部交易，而是同一笔交易内发生的链上合约内部调用。
  - 最终效果依旧是某个 Token Account 被扣减，一定数量的 Token 转移到目标账户。
  - 是否需要 Approve + Transfer 取决于合约逻辑：
  -  如果用户在调用合约前就给了合约或 PDA 授权（delegate），合约就能发起 transfer;
  - 或者用户直接在同一个交易中提供签名，让合约在 CPI 时使用“owner 权限”扣款（需小心安全性）。

### 多签 (Multisig) 转账
- 多签 (Multisig) 转账：某些场景下需要多签（multisig）账户来管理代币，SPL Token Program 原生支持多签功能：
  - 可以使用 InitializeMultisig 来创建多签 Token Account authority（最多可支持 11 个签名），设定 M-of-N 的阈值。
  - 之后对于相关指令（如 Transfer），就需要满足多签的签名数量才能执行。
- 特点：
  - 多签仅针对**“账户权限”**（比如 Mint authority，Account owner，Freeze authority 等）。
  -  对于生产环境中需要更安全的 Token Mint 管理，也经常用多签作为 Mint Authority，防止单人私钥丢失或作恶。
冻结/解冻场景下的转账
冻结/解冻场景下的转账（Freeze / Thaw）：如果在创建 SPL Token 时设置了 freeze_authority，该地址就能对某些 Token Account 执行 freeze 操作，被冻结的账户无法再执行转账：
- 若一个 Token Account 已被冻结，就无法完成任何转账指令，直到 thaw（解冻）。
-  这种场景在合规场合或需要黑名单机制时会用到。
-  从“转账分类”角度看，冻结状态只是阻止转账的状态，并没有改变“转账”指令本身的种类；但确实会影响能否成功转账。
关闭账户（CloseAccount）隐含的“转出剩余”动作
- 当你调用 CloseAccount 指令关闭一个 Token Account 时，剩余余额会被自动转到指定的收款账户（通常是同一 Owner 的另一个 Token Account 或 Owner 主钱包）。
- 这也算一种“特殊的转出”，但是它是清空并关闭的操作，与常规 “transfer” 指令不同。
# 离线地址生成和离线签名
## 离线地址生成
```java
export function createSolAddress (seedHex: string, addressIndex: string) {
    const { key } = derivePath("m/44'/501'/0'/" + addressIndex + "'", seedHex);
    const publicKey = getPublicKey(<Buffer> new Uint8Array(key), false).toString('hex');
    const buffer = Buffer.from(getPublicKey(<Buffer> new Uint8Array(key), false).toString('hex'), 'hex');
    const address = bs58.encode(buffer);
    const hdWallet = {
        privateKey: key.toString('hex') + publicKey,
        publicKey,
        address
    };
    return JSON.stringify(hdWallet);
}
```
6.2. 离线签名
-  手续费模型：https://x.com/0xtheweb3/status/1891121882302480731
- Sol 离线签名
```java
export async function signSolTransaction(params: any){
    const {
        txObj:{from, amount, to, nonce, decimal},
        privateKey,
    } = params;
    if(!privateKey) throw new Error("privateKey 为空");
    const fromAccount = Keypair.fromSecretKey(new Uint8Array(Buffer.from(privateKey, "hex")));

    const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString();
    if (calcAmount.indexOf(".") !== -1) throw new Error("decimal 无效");

    let tx = new Transaction();

    const toPubkey = new PublicKey(to);

    tx.add(
        SystemProgram.transfer({
            fromPubkey: fromAccount.publicKey,
            toPubkey: toPubkey,
            lamports: calcAmount,
        })
    );

    tx.recentBlockhash = nonce;
    tx.sign(fromAccount);
    return tx.serialize().toString("base64");
}
```
- nonce 使用 solana 最新区块 Hash 的话，它是有有效期，这种操作在 HD 钱包里面是适合的，但是他在交易钱包面，可能会引发不必要操作；当时 solana 也提供一中 nonce 永久有效期，需要绑定一个 nonceAccount, 由这个 nonceAccount 来获取 Nonce 参与离线签名。
- recentBlockhash 的失效本质上是该区块哈希超出了 Solana 的 MAX_RECENT_BLOCKHASHES 维护范围。在 Solana 的运行机制中，最近的区块哈希只会存储 约 150 个 slot（大约 ~75 秒），超过这个范围的哈希就会被丢弃。
- Nonce Account 创建
```java
export function prepareAccount (params:any) {
    const {
        authorAddress, nonceAccountAddress, recentBlockhash, minBalanceForRentExemption, privs
    } = params;

    const authorPrivateKey = (privs?.find((ele: { address: any; }) => ele.address === authorAddress))?.key;
    if (!authorPrivateKey) throw new Error('authorPrivateKey 为空');

    const nonceAcctPrivateKey = (privs?.find((ele: { address: any; }) => ele.address === nonceAccountAddress))?.key;
    if (!nonceAcctPrivateKey) throw new Error('nonceAcctPrivateKey 为空');

    const author = Keypair.fromSecretKey(new Uint8Array(Buffer.from(authorPrivateKey, 'hex')));
    const nonceAccount = Keypair.fromSecretKey(new Uint8Array(Buffer.from(nonceAcctPrivateKey, 'hex')));

    const tx = new Transaction();
    tx.add(
        SystemProgram.createAccount({
            fromPubkey: author.publicKey,
            newAccountPubkey: nonceAccount.publicKey,
            lamports: minBalanceForRentExemption,
            space: NONCE_ACCOUNT_LENGTH,
            programId: SystemProgram.programId
        }),

        SystemProgram.nonceInitialize({
            noncePubkey: nonceAccount.publicKey,
            authorizedPubkey: author.publicKey
        })
    );
    tx.recentBlockhash = recentBlockhash;

    tx.sign(author, nonceAccount);
    return tx.serialize().toString('base64');
}
```
- 完整的离线签名代码
```java
export async function signSolTransaction(params: any){
    const {
        txObj:{from, amount, to, nonce, decimal, mintAddress, hasCreatedTokenAddr},
        privateKey,
    } = params;

    if(!privateKey) throw new Error("privateKey 为空");
    const fromAccount = Keypair.fromSecretKey(new Uint8Array(Buffer.from(privateKey, "hex")));

    const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString();
    if (calcAmount.indexOf(".") !== -1) throw new Error("decimal 无效");

    let tx = new Transaction();
    let tx1 = new Transaction();
    const toPubkey = new PublicKey(to);
    const fromPubkey = new PublicKey(from);

    if(mintAddress != "0x00"){
        const mint = new PublicKey(mintAddress);
        const fromTokenAccount = await SPLToken.Token.getAssociatedTokenAddress(
            SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
            SPLToken.TOKEN_PROGRAM_ID,
            mint,
            fromPubkey
        );
        const toTokenAccount = await SPLToken.Token.getAssociatedTokenAddress(
            SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
            SPLToken.TOKEN_PROGRAM_ID,
            mint,
            toPubkey
        );
        tx.add(
            SPLToken.Token.createTransferInstruction(
                SPLToken.TOKEN_PROGRAM_ID,
                fromTokenAccount,
                toTokenAccount,
                fromPubkey,
                [fromAccount],
                calcAmount
            ),
        );
        if(!hasCreatedTokenAddr){
            tx1.add(
                SPLToken.Token.createAssociatedTokenAccountInstruction(
                    SPLToken.ASSOCIATED_TOKEN_PROGRAM_ID,
                    SPLToken.TOKEN_PROGRAM_ID,
                    mint,
                    toTokenAccount,
                    toPubkey,
                    fromAccount.publicKey
                ),
                SPLToken.Token.createTransferInstruction(
                    SPLToken.TOKEN_PROGRAM_ID,
                    fromTokenAccount,
                    toTokenAccount,
                    fromPubkey,
                    [fromAccount], // mutiple signers需要带
                    calcAmount
                )
            );
        }
    }else{
        tx.add(
            SystemProgram.transfer({
                fromPubkey: fromAccount.publicKey,
                toPubkey: toPubkey,
                lamports: calcAmount,
            })
        );
    }
    tx.recentBlockhash = nonce;
    tx.sign(fromAccount);
    const serializeMsg = tx.serialize().toString("base64");
    if(mintAddress != "0x00"){
        if(!hasCreatedTokenAddr){
            tx1.recentBlockhash = nonce;
            tx1.sign(fromAccount);
            const serializeMsg1 = tx1.serialize().toString("base64");
            return JSON.stringify([serializeMsg1, serializeMsg]);
        }else{
            return JSON.stringify([serializeMsg]);
        }
    }
    return serializeMsg;
}
```
- 注意：solana 是一个账户分离比较明显公链，他的 nonce 和 staking 等操作的账户都是分离，不能使用主账户做为 nonce 获取，或者是 staking 的操作。
1. 区块交易数据解析细节
7.1 获取最新区块
- Request
```json
curl --location 'https://api.mainnet-beta.solana.com' \
--header 'Content-Type: application/json' \
--data '{
    "jsonrpc":"2.0",
    "id":1, 
    "method":"getSlot"
}'
- Response
{
    "jsonrpc": "2.0",
    "result": 321212980,
    "id": 1
}
```
7.2 根据 slot 获取里面的交易信息
- Request
```json
curl --location 'https://api.mainnet-beta.solana.com' \
--header 'Content-Type: application/json' \
--data '{
    "jsonrpc": "2.0","id":1,
    "method":"getBlock",
    "params": [
      321212915,
      {
        "encoding": "json",
        "maxSupportedTransactionVersion":0,
        "transactionDetails":"full",
        "rewards":false
      }
    ]
  }'
```
- Reponse
```json
{
  "jsonrpc": "2.0",
  "result": {
    "blockHeight": 299484166,
    "blockTime": 1739779958,
    "blockhash": "GVZViozQpMNVo2QykcYY8uXiEivuh5bj2yrzJaj1N13G",
    "parentSlot": 321212914,
    "previousBlockhash": "GY6WYJtVAdcpPKPrzp2XKyHq1Hv5TE9DgfGKgtUzamSF",
    "transactions": [
      {
        "meta": {
          "computeUnitsConsumed": 2100,
          "err": null,
          "fee": 5000,
          "innerInstructions": [],
          "loadedAddresses": {
            "readonly": [],
            "writable": []
          },
          "logMessages": [
            "Program Vote111111111111111111111111111111111111111 invoke [1]",
            "Program Vote111111111111111111111111111111111111111 success"
          ],
          "postBalances": [
            338735285,
            345627336,
            1
          ],
          "postTokenBalances": [],
          "preBalances": [
            338740285,
            345627336,
            1
          ],
          "preTokenBalances": [],
          "rewards": null,
          "status": {
            "Ok": null
          }
        },
        "transaction": {
          "message": {
            "accountKeys": [
              "5tFvFBWUPt94HQuZyMSuHnpcHrjMPLrTg8WBbv9G5VqU",
              "8ZvTbWfA7txjkNubA9jnv8CWQtwbaZSzpf7vaDDcxMr5",
              "Vote111111111111111111111111111111111111111"
            ],
            "header": {
              "numReadonlySignedAccounts": 0,
              "numReadonlyUnsignedAccounts": 1,
              "numRequiredSignatures": 1
            },
            "instructions": [
              {
                "accounts": [
                  1,
                  0
                ],
                "data": "Fk63PzyswKX45TJ5DTXF4NmW4fv1Aqunm1rwhEtDeiCzyp4MCfVhdzkuTRtGeZDJYcqywdGueH328rzPMuDbCVvHZNXHjDkgjBgqbkD8mqWTpSqSABomEZoYnw2cC7NcWwQxSsY67tiXad9mDQWyh8egLgFuXd",
                "programIdIndex": 2,
                "stackHeight": null
              }
            ],
            "recentBlockhash": "CMHc5t1GQWacarX7uf3SuMu6RqTmbNAWRT7i7SnbH7vs"
          },
          "signatures": [
            "5i2vTYwnjcBPLUACjk2TyxPsfv61WzwzkBBkcHLXjnVHKaYGnE1QNbj6QYf1nhmu9f8vWrnSHG8V3GdL222cMDtM"
          ]
        },
        "version": "legacy"
      },
      ]
  },
  "id": 1
}
```
7.3 根据交易 Hash 获取交易信息
- Request 
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getTransaction",
    "params": [
      "3HfCXxiRS4fT5UvneVvwE8ezCxxSykZKPzekt8At6uXA2ArF3utg1N87CdCjrkN71tMXLf1GmzZZbAUYzVTjiAqc",
       {
            "encoding": "jsonParsed",
            "maxSupportedTransactionVersion": 0
        }
    ]
  }
```
- Response
```json
{
    "jsonrpc": "2.0",
    "result": {
        "blockTime": 1739779958,
        "meta": {
            "computeUnitsConsumed": 150,
            "err": null,
            "fee": 5000,
            "innerInstructions": [],
            "logMessages": [
                "Program 11111111111111111111111111111111 invoke [1]",
                "Program 11111111111111111111111111111111 success"
            ],
            "postBalances": [
                0,
                440935865146,
                1
            ],
            "postTokenBalances": [],
            "preBalances": [
                2342169719,
                438593700427,
                1
            ],
            "preTokenBalances": [],
            "rewards": [],
            "status": {
                "Ok": null
            }
        },
        "slot": 321212915,
        "transaction": {
            "message": {
                "accountKeys": [
                    {
                        "pubkey": "DhuCmoKiDRPn9Lw26LFDNDQ7kJVAitZ9hgfGFSpPdWy3",
                        "signer": true,
                        "source": "transaction",
                        "writable": true
                    },
                    {
                        "pubkey": "4nRcLpDJ5Mzi41MdePjdLJ6XxboHYUqG7uDB4xkPXvV2",
                        "signer": false,
                        "source": "transaction",
                        "writable": true
                    },
                    {
                        "pubkey": "11111111111111111111111111111111",
                        "signer": false,
                        "source": "transaction",
                        "writable": false
                    }
                ],
                "addressTableLookups": [],
                "instructions": [
                    {
                        "parsed": {
                            "info": {
                                "destination": "4nRcLpDJ5Mzi41MdePjdLJ6XxboHYUqG7uDB4xkPXvV2",
                                "lamports": 2342164719,
                                "source": "DhuCmoKiDRPn9Lw26LFDNDQ7kJVAitZ9hgfGFSpPdWy3"
                            },
                            "type": "transfer"
                        },
                        "program": "system",
                        "programId": "11111111111111111111111111111111",
                        "stackHeight": null
                    }
                ],
                "recentBlockhash": "FN2dGqe6RqZvyJdAAg2RKghTc63ZApKZrs3FTAjnnYv2"
            },
            "signatures": [
                "3HfCXxiRS4fT5UvneVvwE8ezCxxSykZKPzekt8At6uXA2ArF3utg1N87CdCjrkN71tMXLf1GmzZZbAUYzVTjiAqc"
            ]
        },
        "version": 0
    },
    "id": 1
}
```
7.4 获取 recentBlockHash
- Request
```json
curl --location 'https://api.mainnet-beta.solana.com' \
--header 'Content-Type: application/json' \
--data '{
    "id":1,
    "jsonrpc":"2.0",
    "method":"getLatestBlockhash",
    "params":[
      {
        "commitment":"processed"
      }
    ]
  }'
```
- Response
```json
{
    "jsonrpc": "2.0",
    "result": {
        "context": {
            "apiVersion": "2.1.11",
            "slot": 321209360
        },
        "value": {
            "blockhash": "5DaZQ31DNGTrYP5oRtxTuHkH5syp7Ky39Yax7NHgphGd",
            "lastValidBlockHeight": 299480762
        }
    },
    "id": 1
}
```
7.5 获取创建地址的地址最小租金
- Request
```json
curl --location 'https://api.mainnet-beta.solana.com' \
--header 'Content-Type: application/json' \
--data ' {
    "jsonrpc": "2.0", "id": 1,
    "method": "getMinimumBalanceForRentExemption",
    "params": [50]
  }'
```
- Response
```json
 {
    "jsonrpc": "2.0", "id": 1,
    "method": "getMinimumBalanceForRentExemption",
    "params": [50]
  }
```
7.6 根据 NonceAccount 获取 nonce 
- Request
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getAccountInfo",
    "params": [
      "3XRnJUWi6btUCRV5iHNj2tu8N2rE4TUGx1SJnanVYo8Q",
      {
        "encoding": "base58"
      }
    ]
  }
```
- Response
```json
{
    "jsonrpc": "2.0",
    "result": {
        "context": {
            "apiVersion": "2.1.11",
            "slot": 321207770
        },
        "value": {
            "data": [
                "df8aQUMTjFjD8tvTF1hjYU2V5ZhLBBxVt5WKJwGd2oAVrJzwQ3bKHtTy1YW74TvVrnfLigLtkxfiK1xcNWTSjtzMTmKeXzJ33msdvVoaR3xs",
                "base58"
            ],
            "executable": false,
            "lamports": 1647680,
            "owner": "11111111111111111111111111111111",
            "rentEpoch": 18446744073709551615,
            "space": 80
        }
    },
    "id": 1
}
```
- 解析 data 获取地址相关的 nodejs 代码
```java
test('decode nonce', async () => {
    const base58Data = "df8aQUMTjFjD8tvTF1hjYU2V5ZhLBBxVt5WKJwGd2oAVrJzwQ3bKHtTy1YW74TvVrnfLigLtkxfiK1xcNWTSjtzMTmKeXzJ33msdvVoaR3xs"
    const aa = NonceAccount.fromAccountData(Buffer.from(base58Data))
    console.log(aa)
});
 console.log
    NonceAccount {
      authorizedPubkey: PublicKey [PublicKey(89rVWCHc7DXA4P8J7YM5JzBRMVjuXtSUunZb6zyrrMPZ)] {
        _bn: <BN: 6a466a44387476544631686a59553256355a684c424278567435574b4a774764>
      },
      : '4PsnDV7TVHyygVbAuLWNomgNG1AE548snkXJJw3CqSxB',
      feeCalculator: { lamportsPerSignature: 7167533006920776000 }
    }
```
7.7 发送交易到区块链网络
- request
```json
curl --location 'https://api.mainnet-beta.solana.com' \
--header 'Content-Type: application/json' \
--data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "sendTransaction",
    "params": [
      "AROIIxNbNk+PVYN5sWn04M6lTFhMj4F/03ACQXAt9E36p4L08OxodVeh3zNKQithppJHyfwE6jgywkAMzBEkfwcBAAEENIQ5mIu8XY+ujJO0WaoKYq24R+wrtMR66+PEgGtT/pF0VfA375/kCxeSWD0+k6mEbmaxjI5lSeR+XoMdYIVJEOxeiLgvp9U8B/zH9cc9Idvhr5lI/Fpoczm2vgtT3EqdBt324ddloZPZy+FGzut5rBy0he1fWzeROoz1hX7/AKk+p6mGuyJj98BmAFHECXGJI/vRLmmfoF2SK8/mMQ7lMgEDBAECAAAJA+gDAAAAAAAA",
      {
        "encoding":"base64"
      }

    ]
  }'
```
- Response
```json
curl --location 'https://api.mainnet-beta.solana.com' \
--header 'Content-Type: application/json' \
--data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "sendTransaction",
    "params": [
      "AROIIxNbNk+PVYN5sWn04M6lTFhMj4F/03ACQXAt9E36p4L08OxodVeh3zNKQithppJHyfwE6jgywkAMzBEkfwcBAAEENIQ5mIu8XY+ujJO0WaoKYq24R+wrtMR66+PEgGtT/pF0VfA375/kCxeSWD0+k6mEbmaxjI5lSeR+XoMdYIVJEOxeiLgvp9U8B/zH9cc9Idvhr5lI/Fpoczm2vgtT3EqdBt324ddloZPZy+FGzut5rBy0he1fWzeROoz1hX7/AKk+p6mGuyJj98BmAFHECXGJI/vRLmmfoF2SK8/mMQ7lMgEDBAECAAAJA+gDAAAAAAAA",
      {
        "encoding":"base64"
      }

    ]
  }'
```
# 如何开发 solana 的中心化钱包
我们都知道，中心化钱包主要用在交易所使用，中心化钱包功能主要包含：批量地址生成，充值，提现，归集，热转冷，冷转热等功能。
1. 离线地址生成
- 调度签名机生成密钥对，签名机吐出公钥, 签名算法是：Ed25519
- 使用公钥匙导出地址
1. 充值逻辑
- 获取链上最新块高，从数据库中获取上次解析交易的块高做为起始块高，如果链上的最新块和数据内部的块高一致，则等到下一个块出现了之后再开始去扫块；如果数据库中没有记录，则按照配置的块高开始扫块，起始块高配置默认为 0，如果用户没有配置，那就从 0 开始扫块。
- 获取块里面的交易，判断是 native token 或者是代币充值
  - native token：主链币充值 program 等于 system 并且 type 为 transfer 
  - Token：代币充值 program 等于 spl-token 并且 type 为 transfer 或者 transferChecked。
  - Nft:  source 和  destination 里面的 mint 为合约地址
```java
for(let i=0; i<instructions.length; i++){
const instruction = instructions[i];
const obj = {};
postTokenBalances?.forEach(item=>{
  // tokenAddress 对应 owner
  obj[accountKeys[item.accountIndex].pubkey] = {owner: item.owner, mint: item.mint};
});
if(instruction.parsed && instruction.program){
  const {parsed:{type, info}, program} = instruction;
  if(program==="system" && type==="transfer"){
    fromAddresses.push(info.source);
    toAddresses.push(info.destination);
    amounts.push(info.lamports);
  }else if(program==="spl-token" && (type==="transfer" || type==="transferChecked") && obj[info.source].mint === contractAddr && obj[info.destination].mint === contractAddr){
    fromAddresses.push(obj[info.source].owner || info.authority || info.multisigAuthority);
    let toAddr = obj[info.destination].owner;
    if(!toAddr){
      const toAddrObj = instructions.find(ele => {
        return ele.program === "spl-associated-token-account"
          && ele.parsed.type === "create"
          && ele.parsed.info.account === info.destination
      });
      toAddr = toAddrObj.parsed.info.wallet;
    }
    toAddresses.push(toAddr);
    amounts.push(info.amount || info.tokenAmount.amount);
  }
}
```
- 交易里面 to 地址是系统内部的用户地址，from 地址是外部地址，说明用户充值，更新交易到数据库中，并更新改地址的余额(注意，如果用户充值金额小于最小充值金额，不给入账)，将交易的状态设置为待确认。
- 交易所在块的过了确认位，将交易状态更新位充值成功并通知业务层，solana 的确认位 60 个。
## 归集
功能：每隔一段时间将用户地址里面资金归集到归集地址
流程：
- 使用用户的地址发起一笔交易，构建完交易之后生成待签名 Msg, 将签名 Msg 递交给签名机进行签名，签名机签名完成之后返回 signature,  将 signature 与交易一起构建成完整的交易，然后将交易发送到区块链网络，并且将这笔交易记录到 transaction 表，将用户地址里面资金锁定。
- 扫链扫到这笔之后，通过 TxHash 查到这笔交易，然后匹配 from 和 to,  归集的交易 from 是系统的用户地址，to 地址交易所的归集地址，根据扫链交易状体更新数据库表的状态。
  - 成功：更新 transaction 表的交易状态为成功并且将用户地址锁定资金清 0
  - 失败：更新 transaction 表的交易状态为失败并且将用户地址锁定资金退回到用户地址里等待下一次归集
## 提现
功能：将热钱包地址里面资金提现到用户的外部地址
流程：
- 用户在业务层发起提现，业务层把该笔提交到钱包层的提现表，钱包层使用热钱包地址签名一笔交易并发送到区块链网络，并且更新提现表里面的交易位已发送，将交易也同时放到 transaction 表， 将热钱包地址里面提现的资金锁定。
- 扫链扫到这笔之后，通过 TxHash 查到这笔交易，然后匹配 from 和 to,  提现的 from 是系统内部热钱包地址，to系统外部地址，根据扫链交易状体更新数据库表的状态。
  - 成功：更新 transaction 和 withdraw 表的交易状态为成功并且将热钱包地址锁定资金减掉
  - 失败：更新 transaction 表的交易状态为失败并且将热钱包地址锁定资金退回到热钱地址里重新发起提现过程
## 热转冷和冷转热
- 将热钱包地址上的资金转到冷钱包地址，签名流程类似归集，交易签名完成之后将交易发送到区块链网络
- 扫链进程扫到这笔之后，通过 TxHash 查到这笔交易，然后匹配 from 地址和 to 地址,  热转冷的 from 地址是系统内部热钱包地址，to 系统内配置的冷钱包地址，根据扫链交易状体更新数据库表的状态。
  - 成功：更新 transaction 表的交易状态为成功并且将热钱包地址锁定资金减掉
  - 失败：更新 transaction 表的交易状态为失败并且将热钱包地址锁定资金退回到热钱地址里重新发起热转冷的过程
## 签名机器功能概述
Solana 钱包实战中我们用 NodeJs 写了一个签名机服务,  主要实现密钥对和地址的生成，nonceAccount 的签名和交易签名。如果整个项目在生成环境中实施，需要把这个服务部署到 TEE 环境； 整个项目的功能如下：
- 地址生成：接口请求地址，签名机会根据传入的参数需要生成多少个地址生成对应的地址，目前接口中会返回私钥，正常的生产环境中实施的话，需要把私钥留在 TEE 环境里面，并且进行加密存储。
- Nonce 账户创建：做一笔 Nonce 账户创建的交易，目前接口需要传入私钥进行进行签名，实际生产中需要改造，私钥留在 TEE 环境里面，从 TEE 环境里面取加密的私钥解密之后对交易进行签名。
- 交易签名：离线交易签名，目前接口需要传入私钥进行进行签名，实际生产中需要改造，私钥留在 TEE 环境里面，从 TEE 环境里面取加密的私钥解密之后对交易进行签名。
# Solana 中心化钱包设计问题
1. Solana 出块这么快，如何设计整个项目的架构
   ![alt text](solana/image.png)
链上最新区块 - 本地数据库块是我本次要扫的所有块
- 本地最新区块：2000
- 链上最新区块：10000
- 链上最新区块 - 本地最新区块 = 8000
- 批量处理快（实际安装你机器可行负载来），比如第一次处理2000块
- 进行分组，一个写成 50 块， 2000 / 500 = 40, 起 40 个协程进行扫块，扫完之后协程自动退出，
- 扫完之后数据进入到 channel bank 里面等待处理，数据库处理协程使用 channel reader 从 channel bank 里面提取数据解析入库
## Solana 如何出现服务宕机怎么办？
宕机立即重启，并且做好服务降级，
当扫链服务扫到最新区块大于本地最新区块1500个块，即已经落后10分钟，把当前区块高度减去500区块高度,这500个还在当前携程处理，剩下的扔给回捞携程。相当于这一部分区块服务降级了。
## Solana 转账SPL token给新用户地址
转账给SPL token给新用户地址之前，需要给新用户地址创建一个ATA地址，再转账。

## Solana 如何做批量归集
tx.add(
    SystemProgram.transfer({
        fromPubkey: fromAccount.publicKey,
        toPubkey: toPubkey,
        lamports: calcAmount,
    })
);
- 在 tx.add 加入多笔交易调用 transfer 指令即可
## Solana Gas 代付实现思路
- Solana 交易结构允许指定 FeePayer，即支付交易费用的账户：
  -  用户创建交易，但不支付 Gas
  -  FeePayer 账户（代付者） 负责支付交易费用
  - 交易由 FeePayer 进行签名并广播，用户无需消耗 SOL
- PDA（Program Derived Address）是 Solana 智能合约生成的无私钥地址，通常用于无权限管理资金。在 Gas 代付 方案中，PDA 作为代理账户，由合约控制 Gas 费用支付，此方案适用于 DApp、GameFi、DeFi 项目，实现 免 Gas 交易体验； 流程如下：
  -   用户提交交易请求，PDA 代理交易执行
  - 合约授权 PDA 代付 Gas
  - PDA 使用预存 SOL 支付 Gas，用户无需消耗 SOL
  - 可结合 Compute Budget 提高交易成功率