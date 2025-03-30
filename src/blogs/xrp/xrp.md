# XRP 钱包开发详细教程

## 1. XRP 简介

XRP 是一个由 Ripple Labs 开发的数字资产和支付协议

### 1.1 背景
- **Ripple Labs**：成立于 2012 年，旨在解决现有金融系统中的支付问题，他们开发了包括 Ripple 支付协议和 XRP 数字资产在内的一系列方案。
- **支付问题**：传统跨境支付通常昂贵、缓慢且不透明。Ripple 通过其协议和数字资产让国际支付更快速、便宜且可追踪。

### 1.2 技术架构
- **Ripple 协议**：一种开放式支付协议，实现任意形式的货币、商品或价值的实时交换，基于分布式总账技术（即 Ripple 共识账本），交易无需中央机构即可快速验证。
- **XRP Ledger**：Ripple 的公共分布式总账，用于记录和验证 XRP 交易，该开源协议允许任何人查阅和参与。

### 1.3 XRP 的用途
- **中继货币**：最初设计用于跨境支付，通过 XRP 实现快速资金转移，无需预先持有大量本地货币。
- **流动性提供者**：用于支持 Ripple 网络上的交易，通过在 XRP Ledger 上发布交易获得一定费用。
- **代币发行**：可用于发行代表股票、债券或商品等多种形式价值的新数字代币，使 XRP 成为资产发行平台。

### 1.4 生态系统和合作伙伴关系
- **金融机构**：Ripple 与全球各地金融机构合作，提供快速便宜的跨境支付解决方案，机构可直接使用 Ripple 协议和 XRP 数字资产。
- **技术公司**：与其他技术公司合作，推动区块链和数字支付技术的发展，扩展 Ripple 生态系统的影响和可用性。

### 1.5 法律和监管
- **合规性**：Ripple 致力于遵守全球法律和监管要求，并与监管机构合作确保解决方案符合法规。
- **监管挑战**：随着加密货币行业的迅速发展，Ripple 需不断适应不断变化的监管环境以确保业务合规。

### 1.6 XRP 共识算法
XRP 共识算法（即 "XRP Consensus Protocol"）为一种高效、快速、安全的交易验证机制，不同于比特币的工作量证明（Proof of Work）和以太坊的权益证明（Proof of Stake），其核心在于达成**一致性**。

#### 关键特点：
- **一致性**：通过联合验证机制，网络中的验证节点共同投票确定哪些交易包含在下一个账本中。
- **快速**：一笔交易的确认时间通常为 3 到 5 秒。
- **无需挖矿**：算法无需挖矿，降低了计算资源消耗，并使网络更环保高效。
- **分布式网络**：构建在去中心化的网络之上，无需特殊权限，每个节点均可参与共识过程。

---

## 2. XRP 离线地址生成

```javascript
export function createHdWallet(seedHex, addressIndex) {
	const root = bip32.fromSeed(Buffer.from(seedHex, 'hex'));
	let path = "m/44'/144'/0'/0/" + addressIndex;
	const child = root.derivePath(path);
	const params = {
		pubKey: Buffer.from(child.publicKey).toString('hex')
	};
	const address = pubKeyToAddress(params);
	return {
		privateKey: Buffer.from(child.privateKey).toString('hex'),
		publicKey: Buffer.from(child.publicKey).toString('hex'),
		address: address
	};
}
```

```javascript
export function pubKeyToAddress({ pubKey }): string {
	if (!pubKey) {
		throw new Error("pubKey 不能为空");
	}
	try {
		return Keypair.deriveAddress(pubKey);
	} catch (error) {
		throw new Error("Invalid public key.");
	}
}
```

---

## 3. XRP 离线签名

```javascript
export function signTransaction(params) {
	const { txObj: { from, to, amount, tag, sequence, fee, decimal, currency, issuer, transactionType, sendMaxValue }, privateKey } = params;
	const calcAmount = new BigNumber(amount).times(new BigNumber(10).pow(decimal)).toString();
	if (calcAmount.indexOf(".") !== -1)
		throw new Error("decimal 无效");

	const publicKey = getPubKeyByPrivateKey(privateKey);

	let txnObj: any;
	if (transactionType === "TransferTokens") {
		txnObj = {
			TransactionType: 'Payment',
			Account: from,
			Destination: to,
			SendMax: { currency, issuer, value: sendMaxValue },
			Amount: { currency, issuer, value: amount },
			Fee: fee,
			Sequence: sequence,
			SigningPubKey: publicKey,
		};
	} else {
		txnObj = {
			TransactionType: 'Payment',
			Account: from,
			Destination: to,
			Amount: calcAmount,
			Fee: fee,
			Sequence: sequence,
			SigningPubKey: publicKey,
		};
	}
	if (tag !== undefined && tag !== null)
		txnObj.DestinationTag = tag;
	return generateRawT(txnObj, privateKey);
}
```

---

## 4. XRP 钱包相关的接口说明

文中列举了获得签名所需参数、获取账户 Sequence、获取最新区块、根据块号或交易 Hash 查询区块信息，以及发送交易的示例请求。（已删除所有空白图片）

```java
- 获取签名的 currency 和 issuer  
  接口方法：account_offers  
  请求示例：  
  curl --location 'https://s1.ripple.com:51234/' \
       --header 'Content-Type: application/json' \
       --data '{ "method": "account_offers", "params": [ { "account": "rGDreBvnHrX1get7na3J4oowN19ny4GzFn", "ledger_index": "current" } ] }'

- 获取账户 Sequence  
  接口方法：account_info  
  请求示例：  
  curl --location 'https://s1.ripple.com:51234/' \
       --header 'Content-Type: application/json' \
       --data '{ "method": "account_info", "params": [ { "account": "rLPHHJh3Cin2E7D3aZPgMX62YS16RHBAGG", "ledger_index": "current", "queue": true } ] }'

- 获取最新区块信息  
  请求示例：  
  curl --location 'https://s1.ripple.com:51234/' \
       --header 'Content-Type: application/json' \
       --data '{ "method": "ledger", "params": [ { "ledger_index": "validated", "transactions": false, "expand": false, "owner_funds": false } ] }'

- 根据块号（ledger_hash）获取区块内信息  
  请求示例：
  curl --location 'https://s1.ripple.com:51234/' \
       --header 'Content-Type: application/json' \
       --data '{ "method": "ledger_data", "params": [ { "binary": true, "ledger_hash": "AE211D4F9DB6A8E66FE93D1689B051E13BAD9D6377F2D449FB09C6C90F883FCE", "limit": 1 } ] }'

- 根据交易 Hash 获取交易详情  
  接口名称：tx  
  请求示例:
  curl --location 'https://s1.ripple.com:51234/' \
       --header 'Content-Type: application/json' \
       --data '{ "method": "tx", "params": [ { "transaction": "0342E45A7CF2A2D605CC76FE98309479AAF1E32779446F15A27B6CE9B6F5AAA8", "binary": false } ] }'

- 发送交易到区块链网络  
  接口方法：submit  
  请求示例:
  curl --location 'https://s1.ripple.com:51234/' \
       --header 'Content-Type: application/json' \
       --data '{ "method": "submit", "params": [ { "tx_blob": "12000024054718422E000000006140000000000F42406840000000000003E87321021E8DCCC213247D1C42662EF7A38B63713BFF154560ED1BF8E908268DCCFABD4E..." } ] }'
```

---

## 5. XRP 钱包开发特点

- 交易中可附加 Memo 信息  
- 如涉及代币，签名时需要提供 issuer 信息

---

## 6. 附录

- GitHub: [https://github.com/XRPLF](https://github.com/XRPLF)
- 官方网站：  
  - [https://xrpl.org/](https://xrpl.org/)  
  - 基金会：[https://foundation.xrpl.org/](https://foundation.xrpl.org/)
- 开发者工具：[https://xrpl.org/resources/dev-tools/](https://xrpl.org/resources/dev-tools/)
- Aptos 浏览器：  
  - [https://xrpscan.com/](https://xrpscan.com/)  
  - [https://bithomp.com/en](https://bithomp.com/en)  
  - [https://livenet.xrpl.org/](https://livenet.xrpl.org/)
- API 文档：[https://xrpl.org/docs/references/http-websocket-apis/](https://xrpl.org/docs/references/http-websocket-apis/)
