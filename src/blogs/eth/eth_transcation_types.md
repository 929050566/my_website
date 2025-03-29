
# ETH转账交易
ETH上资产类型有很多种，例如Native Token、ERC20、EIP721、EIP1155，如果通过解析RPC节点接口返回的数据来解析这些交易呢？这对开发来说是一个难点.

## Native Token
1. 通过eth_getTransactionByHash接口请求，怎么识别这是一个Native Token的交易类型呢？
2. 去区块链浏览器一批原生代币转账交易：blocknum: 20000000
3. transactionHash:0xb79b64182236284ad6753e1b5f506e7e6989912c25887575f82d64f23f6bf267
4. url: https://etherscan.io/tx/0xb79b64182236284ad6753e1b5f506e7e6989912c25887575f82d64f23f6bf267
5. 利用postman请求eth_getTransactionByHash接口
```json
curl --location 'https://eth-mainnet.g.alchemy.com/v2/swcez5BDJiHyeOxKsTQ1Lti1mU7RGdaL' \
--header 'Content-Type: application/json' \
--header 'Cookie: _cfuvid=X1POQ4WfWnCNWPuAei0bA4asv8CTpHLlb0th3GuxEoY-1743163929995-0.0.1.1-604800000' \
--data '{
	"jsonrpc":"2.0",
	"method":"eth_getTransactionByHash",
	"params":[
		"0xb79b64182236284ad6753e1b5f506e7e6989912c25887575f82d64f23f6bf267"
	],
	"id":1
}'
```
6. 返回值：
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "type": "0x2",
        "chainId": "0x1",
        "nonce": "0xfba1e",
        "gas": "0x6e57",
        "maxFeePerGas": "0x12643ff14",
        "maxPriorityFeePerGas": "0x0",
        "to": "0x4befa2aa9c305238aa3e0b5d17eb20c045269e9d",
        "value": "0x52778fe8df2d37",
        "accessList": [],
        "input": "0x",
        "r": "0xf19b55b0705eed279e54abafbfb57c1561df9d4796fe9b65307ffa4febd90611",
        "s": "0x7427acc0746ba35b697f647d1f69aa41b2e706f850027d68bf5a7e87995d127c",
        "yParity": "0x1",
        "v": "0x1",
        "hash": "0xb79b64182236284ad6753e1b5f506e7e6989912c25887575f82d64f23f6bf267",
        "blockHash": "0xd24fd73f794058a3807db926d8898c6481e902b7edb91ce0d479d6760f276183",
        "blockNumber": "0x1312d00",
        "transactionIndex": "0x85",
        "from": "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
        "gasPrice": "0x12643ff14"
    }
}
```
7. 可以发现，input:"Ox" 值为空，通过这个字段就可以确认这是一笔原生的Token交易。只需要记录你需要关心的to地址和from地址的出入金情况即可.
转账金额为：
![alt text](eth/image.png)

## 非原生Token
非原生token保护多种标准，如ERC20、EIP721、EIP1155

### ERC20：
1. 首先你需要知道你关心的ERC20代币合约地址，如：Tether的USDT合约地址为address: 
0xdAC17F958D2ee523a2206206994597C13D831ec7

2. 浏览器上找一笔该合约转账请求（to地址为该合约）:
   0x28ab0f3b0f8d58176520d9aafbd6b09849fc60d538c9a89097ee61696bf109cb

3. 请求eth_getTransactionByHash
```json
curl --location 'https://eth-mainnet.g.alchemy.com/v2/swcez5BDJiHyeOxKsTQ1Lti1mU7RGdaL' \
--header 'Content-Type: application/json' \
--header 'Cookie: _cfuvid=X1POQ4WfWnCNWPuAei0bA4asv8CTpHLlb0th3GuxEoY-1743163929995-0.0.1.1-604800000' \
--data '{
	"jsonrpc":"2.0",
	"method":"eth_getTransactionByHash",
	"params":[
		"0xa367ba40b3b606407f29c06969dbd93332f3d295fc402f5cf055a0e799b7d072"
	],
	"id":1
}'
```

4. 返回值
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "type": "0x2",
        "chainId": "0x1",
        "nonce": "0x10c",
        "gas": "0xb485",
        "maxFeePerGas": "0x228e5298",
        "maxPriorityFeePerGas": "0x29f902",
        "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "value": "0x0",
        "accessList": [],
        "input": "0xa9059cbb000000000000000000000000d5fbda4c79f38920159fe5f22df9655fde292d47000000000000000000000000000000000000000000000000000000000bebc200",
        "r": "0x37005f669782b4db5b6b0a22f75a463fef9ed6f50a6f32ac9f8bf712f72594a5",
        "s": "0x57da3d65ff64977e07e9c72d8af27d32daec7d3c3540edc40c53666ae732eaa",
        "yParity": "0x1",
        "v": "0x1",
        "hash": "0xa367ba40b3b606407f29c06969dbd93332f3d295fc402f5cf055a0e799b7d072",
        "blockHash": "0x8160e4d464b0744f24316af89b86cc147aa943ac352c9a144b63480f17379ef3",
        "blockNumber": "0x15209b8",
        "transactionIndex": "0xd5",
        "from": "0x7542d84e8a85950174b591831c40ce9f493154d4",
        "gasPrice": "0x21f9e888"
    }
}
```

5. 可以观察到input内容不再是'0x'而是一串16进制数据，通过解析数据可以拿到转账接受的具体地址和金额。
前8字节是function selector(方法选择器)
通过这个网站你查到：https://www.4byte.directory/signatures/?bytes4_signature=0xa9059cbb  
![alt text](eth/image-1.png)  
这是调用了：transfer(address,uint256)	
接下来可以使用go-ethereum库具体解析： demo
```go
package main

import (
	"encoding/hex"
	"fmt"
	"math/big"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
)

func main() {
	// 原始输入数据（去除0x前缀）
	input := "a9059cbb000000000000000000000000d5fbda4c79f38920159fe5f22df9655fde292d47000000000000000000000000000000000000000000000000000000000bebc200"

	// 定义transfer函数ABI
	transferAbi := `[{
		"constant": false,
		"inputs": [
			{"name": "_to", "type": "address"},
			{"name": "_value", "type": "uint256"}
		],
		"name": "transfer",
		"outputs": [{"name": "", "type": "bool"}],
		"type": "function"
	}]`

	// 解析ABI
	parsedAbi, err := abi.JSON(strings.NewReader(transferAbi))
	if err != nil {
		panic(err)
	}

	// 解码输入数据
	data, err := hex.DecodeString(input)
	if err != nil {
		panic(err)
	}

	// 分离方法ID和参数
	method, err := parsedAbi.MethodById(data[:4])
	if err != nil {
		panic(err)
	}

	// 解析参数
	args := method.Inputs.Unpack(data[4:])

	// 转换为具体类型
	toAddress := common.BytesToAddress(args[0].([]byte)).Hex()
	amount := new(big.Int).SetBytes(args[1].([]byte))

	fmt.Printf("接收地址: %s\n", toAddress)   // 0xdAC17F958D2ee523a2206206994597C13D831ec7
	fmt.Printf("转账金额: %s wei\n", amount.String()) // 12484768 wei
}
```

解析之后得到的结果：
![alt text](eth/image-2.png)
即0xd5FBDa4C79F38920159fE5f22DF9655FDe292d47地址收到了200.000000 USDT

另外注意：ERC20转账识别有两个方法选择器
### 方法选择器：0xa9059cbb
单笔转账：transfer(address,uint256)
参数示例：
复制
0xa9059cbb
000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045 (接收地址)
0000000000000000000000000000000000000000000000000de0b6b3a7640000 (转账数量)

### 方法选择器：0x23b872dd
授权转账：transferFrom(address,address,uint256)
参数示例：
复制
0x23b872dd
000000000000000000000000ab5801b7da771debca946596316e4353817d9f5c (发送地址)
000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045 (接收地址)
0000000000000000000000000000000000000000000000000de0b6b3a7640000 (数量)


## 抛砖引玉
还有什么办法判断转账？
可以通过事件监听、还可以通过debug_traceTrascation获取整个调用链路。
但是需要根据你的业务来选择，是否真的要把钱包层做的这么复杂，如果是合约内部转账走到你的充值或者提现逻辑，则你需要解析每一笔debug_traceTrascation交易，判断from和to地址，最后判断真正的出入金的金额。

例如你知道某个合约是ERC20合约，并且你需要监听这个合约情况，你可以把这个合约地址配置成你的白名单地址，扫到交易的时候to地址发现是这个合约地址，再用方法选择器去解析input，就可以拿到真正入金地址是否是你的用户地址。

如果是NFT转账呢？
NFT转账你同样知道NFT合约地址，并且知道该合约转账的方法选择器，依旧可以这样处理。

如果是合约内部转账就只可以调用debug_traceTrascation的方式了。




