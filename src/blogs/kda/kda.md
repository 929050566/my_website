# Kadena (KDA) 钱包开发流程文档

## 一、链的特性
- **RPC URL**  
  `https://api.chainweb.com/`
- **官方钱包**  
  [Chainweaver Wallet](https://chainweaver.kadena.network/)
- **区块链浏览器**  
  [Kadena Explorer](https://explorer.chainweb.com/mainnet)
- **核心参数**
  - 账户模型：账户模型（非UTXO）
  - 签名算法：Ed25519
  - 代币精度：12位小数
  - 共识机制：PoW（工作量证明）
    - 确认位：10个确认
    - 不支持质押
  - 多链架构：20条并行链组成，共享同一套代码逻辑

## 二、离线地址生成
### 地址生成流程
```javascript
const { derivePath, getPublicKey } = require('ed25519-hd-key');

export function createKdaAddress(seedHex: string, addressIndex: string) {
  const { key } = derivePath(`m/44'/626'/0'/${addressIndex}'`, seedHex);
  const publicKey = getPublicKey(new Uint8Array(key), false).toString('hex');
  
  return {
    privateKey: key.toString('hex') + publicKey,
    publicKey,
    address: "k:" + publicKey
  };
}
```

## 三、离线签名
### 核心代码结构
```javascript
const Pact = require("pact-lang-api");

// 交易元数据构造
const transferMeta = (sender, chainId, gasPrice, gasLimit) => 
  Pact.lang.mkMeta(sender, chainId, gasPrice, gasLimit, creationTime(), 600);

// 跨链交易构造
const transferCrossChainKp = (sender, receiver, targetChain, amount, senderKp) => ({
  ...senderKp,
  clist: [
    { "name": "coin.TRANSFER_XCHAIN", "args": [sender, receiver, Number(amount), targetChain] },
    { "name": "coin.GAS", "args": [] }
  ]
});
```

## 四、RPC接口解析
### 1. 获取账户余额
**请求示例**：
```python
import hashlib
from base64 import b64encode

def assemble_balance_payload(account):
    payload = {
        "exec": {
            "data": None,
            "code": f"(coin.get-balance \"{account}\")"
        }
    }
    # ...（完整哈希计算流程）
    return json.dumps(raw_transaction)
```

**CURL请求**：
```bash
curl -X POST https://api.chainweb.com/chainweb/0.0/mainnet01/chain/2/pact/api/v1/local \
  -H "Content-Type: application/json" \
  -d '{"hash":"2I4-ePSHkVU6L...", "cmd": "{...}"}'
```

### 2. 获取SPV证明
**请求参数**：
```json
{
  "requestKey": "POfJqi3iIEoX8vo8CWvAxtJUQvMA3OfyRWYTDSFuU4Q",
  "targetChainId": "1"
}
```

### 3. 区块高度监控
**返回数据结构**：
```json
{
  "hashes": {
    "0": {
      "height": 4841222,
      "hash": "RmsCuFPPPPs8NQ7u7LMR4Q_LUVklz35JILGp00PMeNg"
    },
    // ...其他链数据
  }
}
```

## 五、节点搭建
参考官方文档：[Kadena Node Setup Guide](https://docs.kadena.io/guides/nodes/howto-node-operator)

---

## 附录：重要资源
- [官方RPC节点](https://api.chainweb.com)
- [GitHub组织](https://github.com/kadena-io)
- [Discord社区](https://discord.com/invite/kadena)
- [白皮书文档](https://www.kadena.io/whitepapers)
