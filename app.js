// 链到平台链标识的映射
const chainMapping = {
    'ETH': { gmgn: 'eth', ave: 'ethereum', cmc: 'ethereum', coinbase: 'ethereum' },
    'BSC': { gmgn: 'bsc', ave: 'bsc', cmc: 'binance-smart-chain', coinbase: 'bsc' },
    'SOL': { gmgn: 'sol', ave: 'solana', cmc: 'solana', coinbase: 'solana' },
    'BASE': { gmgn: 'base', ave: 'base', cmc: 'base', coinbase: 'base' },
    'XLayer': { gmgn: 'xlayer', ave: 'xlayer', cmc: 'xlayer', coinbase: 'xlayer' },
    'ARB': { gmgn: 'arb', ave: 'arbitrum', cmc: 'arbitrum', coinbase: 'arbitrum' },
    'OP': { gmgn: 'op', ave: 'optimism', cmc: 'optimism', coinbase: 'optimism' },
    'POLYGON': { gmgn: 'polygon', ave: 'polygon', cmc: 'polygon', coinbase: 'polygon' }
};

// 地址验证和格式化
function validateAndFormatAddress(address, chain) {
    if (!address || !address.trim()) {
        throw new Error('请输入合约地址');
    }

    address = address.trim();

    // EVM链地址验证
    if (chain !== 'SOL') {
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            throw new Error('无效的EVM地址格式');
        }
        return address.toLowerCase();
    } else {
        // Solana地址验证 (base58)
        if (address.length < 32 || address.length > 44) {
            throw new Error('无效的Solana地址格式');
        }
        return address;
    }
}

// 显示错误提示
function showError(message) {
    const toast = document.getElementById('errorToast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 5000);
}

// 显示成功提示
function showSuccess(message) {
    const toast = document.getElementById('errorToast');
    toast.textContent = message;
    toast.className = 'toast success';
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
        toast.className = 'toast error';
    }, 3000);
}

// 生成平台链接
function generatePlatformLinks(address, chain) {
    const chainInfo = chainMapping[chain];
    if (!chainInfo) {
        throw new Error('不支持的链');
    }

    const links = {
        gmgn: `https://gmgn.ai/token/${chainInfo.gmgn}/${address}`,
        ave: `https://ave.ai/token/${chainInfo.ave}/${address}`,
        cmc: `https://coinmarketcap.com/currencies/${address}/`,
        coinbase: `https://www.coinbase.com/explorer/chains/${chainInfo.coinbase}/addresses/${address}`
    };

    return links;
}

// 更新平台链接
function updatePlatformLinks(address, chain) {
    try {
        const links = generatePlatformLinks(address, chain);
        
        // 更新卡片内的链接
        document.getElementById('gmgnLink').href = links.gmgn;
        document.getElementById('aveLink').href = links.ave;
        document.getElementById('cmcLink').href = links.cmc;
        document.getElementById('coinbaseLink').href = links.coinbase;

        // 更新快速链接卡片
        document.getElementById('quickGmgnLink').href = links.gmgn;
        document.getElementById('quickAveLink').href = links.ave;
        document.getElementById('quickCmcLink').href = links.cmc;
        document.getElementById('quickCoinbaseLink').href = links.coinbase;
    } catch (error) {
        console.error('生成链接失败:', error);
    }
}

// 从输入框读取GMGN数据
function readGMGNData() {
    const honeypot = document.getElementById('gmgnHoneypot').value.trim();
    const riskScore = document.getElementById('gmgnRiskScore').value.trim();
    const sellable = document.getElementById('gmgnSellable').value.trim();
    const liquidity = document.getElementById('gmgnLiquidity').value.trim();
    const trading = document.getElementById('gmgnTrading').value.trim();

    if (!honeypot && !riskScore && !sellable && !liquidity && !trading) {
        return null;
    }

    return {
        honeypot: honeypot || '-',
        riskScore: riskScore ? parseInt(riskScore) : null,
        sellable: sellable || '-',
        liquidity: liquidity || '-',
        trading: trading || '-'
    };
}

// 从输入框读取Ave数据
function readAveData() {
    const riskLevel = document.getElementById('aveRiskLevel').value.trim();
    const scam = document.getElementById('aveScam').value.trim();
    const audited = document.getElementById('aveAudited').value.trim();
    const concentration = document.getElementById('aveConcentration').value.trim();

    if (!riskLevel && !scam && !audited && !concentration) {
        return null;
    }

    return {
        riskLevel: riskLevel || '-',
        scam: scam || '-',
        audited: audited || '-',
        concentration: concentration || '-'
    };
}

// 从输入框读取CMC数据
function readCMCData() {
    const listed = document.getElementById('cmcListed').value.trim();
    const riskTag = document.getElementById('cmcRiskTag').value.trim();
    const liquidity = document.getElementById('cmcLiquidity').value.trim();
    const credibility = document.getElementById('cmcCredibility').value.trim();

    if (!listed && !riskTag && !liquidity && !credibility) {
        return null;
    }

    return {
        listed: listed || '-',
        riskTag: riskTag || '-',
        liquidity: liquidity || '-',
        credibility: credibility ? parseInt(credibility) : null
    };
}

// 从输入框读取Coinbase数据
function readCoinbaseData() {
    const riskLevel = document.getElementById('coinbaseRiskLevel').value.trim();
    const scam = document.getElementById('coinbaseScam').value.trim();
    const riskTx = document.getElementById('coinbaseRiskTx').value.trim();
    const blacklist = document.getElementById('coinbaseBlacklist').value.trim();

    if (!riskLevel && !scam && !riskTx && !blacklist) {
        return null;
    }

    return {
        riskLevel: riskLevel || '-',
        scam: scam || '-',
        riskTx: riskTx || '-',
        blacklist: blacklist || '-'
    };
}

// 计算综合风险评估
function calculateSummary(gmgn, ave, cmc, coinbase) {
    let riskCount = 0;
    let platformCount = 0;
    let totalConfidence = 0;

    // GMGN风险评估
    if (gmgn) {
        platformCount++;
        totalConfidence += 25;
        const riskScore = gmgn.riskScore;
        const isHoneypot = gmgn.honeypot && (gmgn.honeypot.toLowerCase() === 'yes' || gmgn.honeypot === '是');
        
        if ((riskScore !== null && riskScore >= 70) || isHoneypot) {
            riskCount++;
        }
    }

    // Ave风险评估
    if (ave) {
        platformCount++;
        totalConfidence += 25;
        const riskLevel = ave.riskLevel.toUpperCase();
        const isScam = ave.scam && (ave.scam.toLowerCase() === 'yes' || ave.scam === '是');
        
        if (riskLevel === 'D' || riskLevel === 'C' || isScam) {
            riskCount++;
        }
    }

    // CMC风险评估
    if (cmc) {
        platformCount++;
        totalConfidence += 25;
        const isListed = cmc.listed && (cmc.listed.toLowerCase() === 'yes' || cmc.listed === '是');
        const hasRiskTag = cmc.riskTag && (cmc.riskTag.toLowerCase() === 'yes' || cmc.riskTag === '是');
        
        if (hasRiskTag || !isListed) {
            riskCount++;
        }
    }

    // Coinbase风险评估
    if (coinbase) {
        platformCount++;
        totalConfidence += 25;
        const riskLevel = coinbase.riskLevel ? coinbase.riskLevel.toLowerCase() : '';
        const isScam = coinbase.scam && (coinbase.scam.toLowerCase() === 'yes' || coinbase.scam === '是');
        
        if (riskLevel === 'high' || isScam) {
            riskCount++;
        }
    }

    if (platformCount === 0) {
        return {
            riskLevel: 'low',
            title: '暂无数据',
            description: '请先访问各平台并填写信息',
            confidence: 0
        };
    }

    const riskRatio = riskCount / platformCount;
    let riskLevel, title, description, confidence;

    if (riskRatio >= 0.75) {
        riskLevel = 'high';
        title = 'High Confidence Risk';
        description = '外部平台一致标记为高风险，建议采取相应措施';
        confidence = Math.min(95, totalConfidence + 20);
    } else if (riskRatio >= 0.5) {
        riskLevel = 'medium';
        title = 'Medium Confidence Risk';
        description = '半数以上平台标记风险，需要进一步审核';
        confidence = Math.min(85, totalConfidence + 10);
    } else if (riskRatio >= 0.25) {
        riskLevel = 'medium';
        title = 'Medium Confidence Risk';
        description = '部分平台标记风险，建议谨慎处理';
        confidence = Math.max(50, totalConfidence - 10);
    } else {
        riskLevel = 'low';
        title = 'Potential False Positive';
        description = '多数平台未标记风险，可能是误报，建议重新评估';
        confidence = Math.max(40, totalConfidence - 20);
    }

    return {
        riskLevel,
        title,
        description,
        confidence: Math.round(confidence)
    };
}

// 更新汇总卡片
function updateSummaryCard(summary) {
    const badge = document.getElementById('summaryRiskBadge');
    badge.textContent = summary.riskLevel === 'high' ? '⚠️' : 
                       summary.riskLevel === 'medium' ? '⚡' : '✓';
    badge.className = `risk-badge ${summary.riskLevel}`;

    document.getElementById('summaryTitle').textContent = summary.title;
    document.getElementById('summaryDescription').textContent = summary.description;
    document.getElementById('confidenceValue').textContent = `${summary.confidence}%`;
    document.getElementById('confidenceMeter').style.width = `${summary.confidence}%`;
}

// 生成链接
function generateLinks() {
    console.log('generateLinks 函数被调用');
    
    const addressInput = document.getElementById('contractAddress');
    const chainSelect = document.getElementById('chainSelect');
    
    if (!addressInput || !chainSelect) {
        console.error('找不到输入元素');
        showError('页面加载不完整，请刷新页面重试');
        return;
    }
    
    const address = addressInput.value.trim();
    const chain = chainSelect.value;

    console.log('地址:', address, '链:', chain);

    if (!address) {
        showError('请输入合约地址');
        return;
    }

    // 验证输入
    try {
        const formattedAddress = validateAndFormatAddress(address, chain);
        addressInput.value = formattedAddress;
        console.log('地址验证通过:', formattedAddress);
    } catch (error) {
        console.error('地址验证失败:', error);
        showError(error.message);
        return;
    }

    // 生成并更新链接
    try {
        updatePlatformLinks(formattedAddress, chain);
        console.log('链接更新完成');
    } catch (error) {
        console.error('更新链接失败:', error);
        showError('生成链接失败: ' + error.message);
        return;
    }

    // 显示链接区域和结果区域
    const linksSection = document.getElementById('linksSection');
    const resultsSection = document.getElementById('resultsSection');
    const summarySection = document.getElementById('summarySection');
    const calculateBtn = document.getElementById('calculateBtn');

    if (linksSection) linksSection.style.display = 'block';
    if (resultsSection) resultsSection.style.display = 'block';
    if (summarySection) summarySection.style.display = 'block';
    if (calculateBtn) calculateBtn.style.display = 'inline-block';

    // 滚动到链接区域
    if (linksSection) {
        linksSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showSuccess('链接已生成，请访问各平台查看信息');
    console.log('所有操作完成');
}

// 计算汇总
function calculateSummaryFromInputs() {
    const gmgn = readGMGNData();
    const ave = readAveData();
    const cmc = readCMCData();
    const coinbase = readCoinbaseData();

    if (!gmgn && !ave && !cmc && !coinbase) {
        showError('请至少填写一个平台的信息');
        return;
    }

    const summary = calculateSummary(gmgn, ave, cmc, coinbase);
    updateSummaryCard(summary);

    // 滚动到汇总区域
    document.getElementById('summarySection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    showSuccess('汇总计算完成');
}

// 事件监听
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，初始化事件监听');
    
    const searchBtn = document.getElementById('searchBtn');
    const calculateBtn = document.getElementById('calculateBtn');
    const addressInput = document.getElementById('contractAddress');

    if (!searchBtn) {
        console.error('找不到搜索按钮');
        showError('页面加载错误，请刷新重试');
        return;
    }

    console.log('绑定按钮事件');
    searchBtn.addEventListener('click', (e) => {
        console.log('按钮被点击');
        e.preventDefault();
        generateLinks();
    });
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            calculateSummaryFromInputs();
        });
    }

    // 支持回车键生成链接
    if (addressInput) {
        addressInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('按了回车键');
                e.preventDefault();
                generateLinks();
            }
        });
    }
    
    console.log('事件绑定完成');
});

    // 输入框变化时自动计算（可选，也可以手动点击按钮）
    const inputs = document.querySelectorAll('.value-input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            // 延迟一下，等用户输入完
            setTimeout(() => {
                const gmgn = readGMGNData();
                const ave = readAveData();
                const cmc = readCMCData();
                const coinbase = readCoinbaseData();
                
                if (gmgn || ave || cmc || coinbase) {
                    calculateSummaryFromInputs();
                }
            }, 500);
        });
    });
});