# 去中心化钱包(HD)的业务流程设计
闲来无事思考一下去中心化钱包该怎么做和设计

## 什么是去中心化钱包
私钥的管理方式：私钥的管理在用户设备上，除了用户自己，没有人任何能操纵相关的资产，一般在用户设备上的私钥是存在在 wallet.data 数据文件里面。
- sqlite 
- 文件
 私钥的加密方式
- AES 加密，使用用户钱包的密码 + 混淆因子进行加密的
- 3DES 加密可以吗，也可以，但是 3DES 的算法效率比较低，不推荐

## 名字解释
- BIP 协议
  - BIP32: 公共派生推导，使用 BIP44 或者 BIP86 的路径进行
  - BIP39: 助记词协议，整个协议里面包含 2048 个单词，生成的助记词个数 12，15，18，21 和 24；
  - BIP44: 推导路径，
```json
m / purpose' / coin_type' / account' / change / address_index
```
    address_index 可以从 0 递增到 n
  - BIP86:  Taproot 
  - sqllite: 文档型数据库
- AES: 安全级别比较高，运算效率比较快的单密钥加密算法（对称加密）

## HD 钱包地址的生成的业务
### 生成助记词，和派生
![alt text](wallet/image-13.png)

### 导入助记词
![alt text](wallet/image-14.png)

### 导出助记词
![alt text](wallet/image-15.png)

### 导入私钥
![alt text](wallet/image-16.png)

### 导出私钥
![alt text](wallet/image-17.png)
- 所有生成过只能正向，不能反向，比方说私钥可以计算出公钥匙，公钥可以生成地址，但是地址不能能导出公钥，根据公钥不能得到私钥，助记词到地址的过程也是同理的。

### 转入
![alt text](wallet/image-18.png)

### 转出
![alt text](wallet/image-19.png)

### 余额获取
![alt text](wallet/image-20.png)

### 获取交易记录
![alt text](wallet/image-21.png)

### 行情的服务
聚合中心化交易所和去中心化交易所的行情，涨跌幅，交易量都是可以自己计算的
![alt text](wallet/image-22.png)

当然你也可以调用现成的API使用如：
CoinGecko API
CryptoCompare API
Alpha Vantage
CoinCap API
选择很多，可以拿来做备份，搭建高可用的服务

### 中心化交易所的行情数据抓取
![alt text](wallet/image-23.png)

### 兑换功能
![alt text](wallet/image-24.png)
- 聚合器也有很多选择
  - 1inch
  - Ok aggrator
  - DoDo

