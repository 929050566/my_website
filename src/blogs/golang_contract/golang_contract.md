# Golang 监听 Ethereum 合约事件

## 1. 常用的可以获取到合约事件的 ETH 接口

### 1.1. `eth_getLogs` 或 `eth_getFilterLogs`

`eth_getLogs` 接口的特点是，可以传入以下参数去获取合约事件：

- 开始的区块和结束区块
- 合约地址等参数

会返回该合约地址相关的事件，拿到事件之后根据 ABI 解析。

#### 示例代码

```go
// FilterQuery contains options for contract log filtering.
type FilterQuery struct {
    BlockHash *common.Hash     // used by eth_getLogs, return logs only from block with this hash
    FromBlock *big.Int         // beginning of the queried range, nil means genesis block
    ToBlock   *big.Int         // end of the range, nil means latest block
    Addresses []common.Address // restricts matches to events created by specific contracts
    Topics    [][]common.Hash  // restricts matches to particular event topics
}
```

- **参数说明**：
  - `BlockHash`：区块 Hash
  - `FromBlock`：查询合约事件的开始区块
  - `ToBlock`：查询合约事件的结束区块
  - `Addresses`：需要查询的合约地址列表
  - `Topics`：查询的合约事件的 topics

---

### 1.2. `eth_getTransactionReceipt` 的方式获取合约事件

传入交易 Hash 之后可以获取到交易的 Receipt，其中有一个字段为 `logs`，即该笔交易里的合约事件列表。拿到 `logs` 之后根据 ABI 解析合约事件。

#### 示例代码

```go
type Receipt struct {
    Type              uint8          `json:"type,omitempty"`
    PostState         []byte         `json:"root"`
    Status            uint64         `json:"status"`
    CumulativeGasUsed uint64         `json:"cumulativeGasUsed" gencodec:"required"`
    Bloom             Bloom          `json:"logsBloom"         gencodec:"required"`
    Logs              []*Log         `json:"logs"              gencodec:"required"`
    TxHash            common.Hash    `json:"transactionHash" gencodec:"required"`
    ContractAddress   common.Address `json:"contractAddress"`
    GasUsed           uint64         `json:"gasUsed" gencodec:"required"`
    EffectiveGasPrice *big.Int       `json:"effectiveGasPrice"`
    BlockHash         common.Hash    `json:"blockHash,omitempty"`
    BlockNumber       *big.Int       `json:"blockNumber,omitempty"`
    TransactionIndex  uint           `json:"transactionIndex"`
}
```

- **关键字段**：
  - `Logs`：`[]*Log`，即合约事件列表。

---

## 2. 实际案例

### 2.1. 解析的交易事件

以该笔交易的 [Etherscan 链接](https://etherscan.io/tx/0xfd26d40e17213bcafcf94bab9af92343302df9df970f20e1c9d515525e86e23e) 的 `ConfirmDataStore` 合约事件为例进行解析。

---

### 2.2. 实际代码

#### Client 封装代码

```go
package ethereum

import (
    "context"
    "fmt"
    "math/big"

    "github.com/ethereum/go-ethereum"
    "github.com/ethereum/go-ethereum/common"
    "github.com/ethereum/go-ethereum/core/types"
    "github.com/ethereum/go-ethereum/ethclient"
)

type EthClient struct {
    client *ethclient.Client
}

func newEthClients(rpcUrl string) (*EthClient, error) {
    client, err := ethclient.DialContext(context.Background(), rpcUrl)
    if err != nil {
        fmt.Println("dial eth client fail")
        return nil, err
    }
    return &EthClient{client: client}, nil
}

func (ec EthClient) GetTxReceiptByHash(txHash string) (*types.Receipt, error) {
    return ec.client.TransactionReceipt(context.Background(), common.HexToHash(txHash))
}

func (ec EthClient) GetLogs(startBlock, endBlock *big.Int, contractAddressList []common.Address) ([]types.Log, error) {
    filterQuery := ethereum.FilterQuery{
        FromBlock: startBlock,
        ToBlock:   endBlock,
        Addresses: contractAddressList,
    }
    return ec.client.FilterLogs(context.Background(), filterQuery)
}
```

---

#### 测试获取合约事件解析代码

```go
package ethereum

import (
    "fmt"
    "math/big"
    "strings"
    "testing"

    "github.com/ethereum/go-ethereum/accounts/abi"
    "github.com/ethereum/go-ethereum/common"
    "github.com/ethereum/go-ethereum/crypto"
    "github.com/ethereum/go-ethereum/log"
)

const ConfirmDataStoreEventABI = "ConfirmDataStore(uint32,bytes32)"
var ConfirmDataStoreEventABIHash = crypto.Keccak256Hash([]byte(ConfirmDataStoreEventABI))

const DataLayrServiceManagerAddr = "0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1"

func TestEthClient_GetTxReceiptByHash(t *testing.T) {
    fmt.Println("start...........")
    client, err := newEthClients("https://rpc.payload.de")
    if err != nil {
        fmt.Println("connect ethereum fail", "err", err)
        return
    }
    txReceipt, err := client.GetTxReceiptByHash("0xbc00672e67935e54c08d895b88fe41aa5cf664dc8f855836c7d26726e0c59ea4")
    if err != nil {
        fmt.Println("get tx receipt fail", "err", err)
        return
    }

    abiUint32, err := abi.NewType("uint32", "uint32", nil)
    if err != nil {
        fmt.Println("Abi new uint32 type error", "err", err)
        return
    }
    abiBytes32, err := abi.NewType("bytes32", "bytes32", nil)
    if err != nil {
        fmt.Println("Abi new bytes32 type error", "err", err)
        return
    }

    confirmDataStoreArgs := abi.Arguments{
        {Name: "dataStoreId", Type: abiUint32, Indexed: false},
        {Name: "headerHash", Type: abiBytes32, Indexed: false},
    }

    var dataStoreData = make(map[string]interface{})
    for _, rLog := range txReceipt.Logs {
        if strings.ToLower(rLog.Address.String()) != strings.ToLower(DataLayrServiceManagerAddr) {
            continue
        }
        if rLog.Topics[0] != ConfirmDataStoreEventABIHash {
            continue
        }
        if len(rLog.Data) > 0 {
            err := confirmDataStoreArgs.UnpackIntoMap(dataStoreData, rLog.Data)
            if err != nil {
                log.Error("Unpack data into map fail", "err", err)
                continue
            }
            if dataStoreData != nil {
                dataStoreId := dataStoreData["dataStoreId"].(uint32)
                headerHash := dataStoreData["headerHash"]
                fmt.Println(dataStoreId)
                fmt.Println(headerHash)
            }
        }
    }
}
```

---

## 3. Web3 监听合约事件项目 `event-watcher`

### 3.1. 项目预览

`event-watcher` 是 Web3 社区开发的一个合约事件监听模板项目，任何个人或团队都可以基于该项目进行二次开发。

- **代码仓库**：[https://github.com/929050566/event-watcher](https://github.com/929050566/event-watcher)

### 3.2. 项目架构设计

- **同步器**：扫描区块获取合约事件并存储到数据库。
- **事件处理器**：解析合约事件并处理业务逻辑。
- **API**：提供数据查询接口。

---

### 3.3. 部署运行

#### 编译代码

```bash
make
```

#### 配置环境变量

```bash
export EVENT_WATCHER_CHAIN_RPC="http://127.0.0.1:8545"
export EVENT_WATCHER_STARTING_HEIGHT=0
export EVENT_WATCHER_HTTP_PORT=8989
```

#### 创建数据库并迁移

```bash
create database event_watcher
event-watcher migrate
```

#### 启动服务

```bash
./event-watcher index
./event-watcher api
```

---

### 3.4. 二次开发

- 替换 `/abis/TreasureManager.sol/TreasureManager.json` 文件为你的 ABI 文件。
- 修改 `Makefile` 中生成绑定文件的部分代码。