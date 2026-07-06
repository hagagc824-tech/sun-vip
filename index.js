import fetch from 'node-fetch';
import http from 'http';

// ================================================================
// THUẬT TOÁN PHÂN TÍCH TÀI XỈU - BẢN CHO RENDER
// ================================================================

const PORT = process.env.PORT || 3000;
const AUTHOR_ID = "@tranhoang2286";
const API_URL = "https://apisunwinhistory.onrender.com/api/tx";

// ===== CÁC CLASS PHÂN TÍCH (GIỮ NGUYÊN) =====
class BasePatternDetector {
  detectBetStreak(results) {
    let streak = 1;
    for (let i = 1; i < results.length; i++) {
      if (results[i] === results[0]) streak++;
      else break;
    }
    if (streak === 3) return { pred: results[0], conf: 72, name: 'BET_3' };
    if (streak === 4) return { pred: results[0], conf: 76, name: 'BET_4' };
    if (streak === 5) return { pred: results[0] === 'Tài' ? 'Xỉu' : 'Tài', conf: 74, name: 'BET_5_BREAK' };
    if (streak === 6) return { pred: results[0] === 'Tài' ? 'Xỉu' : 'Tài', conf: 80, name: 'BET_6_BREAK' };
    if (streak >= 7) return { pred: results[0] === 'Tài' ? 'Xỉu' : 'Tài', conf: 84, name: 'BET_7_BREAK' };
    return null;
  }
  
  detectAlternating(results) {
    let alt = 1;
    for (let i = 1; i < Math.min(10, results.length); i++) {
      if (results[i] !== results[i-1]) alt++;
      else break;
    }
    if (alt === 4) return { pred: results[0] === 'Tài' ? 'Xỉu' : 'Tài', conf: 68, name: 'ALT_4' };
    if (alt === 5) return { pred: results[0] === 'Tài' ? 'Xỉu' : 'Tài', conf: 72, name: 'ALT_5' };
    if (alt >= 6) return { pred: results[0] === 'Tài' ? 'Xỉu' : 'Tài', conf: 76, name: 'ALT_6' };
    return null;
  }
  
  detectDoubleDouble(results) {
    if (results.length < 6) return null;
    if (results[0] === results[1] && results[2] === results[3] && results[0] !== results[2]) {
      let pred = results[2] === 'Tài' ? 'Xỉu' : 'Tài';
      return { pred: pred, conf: 74, name: 'DOUBLE_22' };
    }
    return null;
  }
  
  detectTripleTriple(results) {
    if (results.length < 9) return null;
    if (results[0] === results[1] && results[1] === results[2] &&
        results[3] === results[4] && results[4] === results[5] &&
        results[0] !== results[3]) {
      let pred = results[3] === 'Tài' ? 'Xỉu' : 'Tài';
      return { pred: pred, conf: 78, name: 'TRIPLE_33' };
    }
    return null;
  }
  
  detectOneTwoOne(results) {
    if (results.length < 4) return null;
    if (results[0] !== results[1] && results[1] === results[2] && results[2] !== results[3] && results[0] === results[3]) {
      return { pred: results[0], conf: 76, name: 'ONE_TWO_ONE' };
    }
    return null;
  }
  
  detectOneTwoThree(results) {
    if (results.length < 6) return null;
    if (results[0] === results[1] && results[1] === results[2] && results[3] === results[4] && results[0] !== results[3]) {
      return { pred: results[5], conf: 74, name: 'ONE_TWO_THREE' };
    }
    return null;
  }
  
  detectThreeTwoOne(results) {
    if (results.length < 6) return null;
    if (results[3] === results[4] && results[4] === results[5] && results[1] === results[2] && results[3] !== results[1]) {
      return { pred: results[1], conf: 74, name: 'THREE_TWO_ONE' };
    }
    return null;
  }
  
  detectZigzag(results) {
    if (results.length < 5) return null;
    let isZigzag = true;
    for (let i = 1; i < 5; i++) if (results[i] === results[i-1]) isZigzag = false;
    if (isZigzag) return { pred: results[0] === 'Tài' ? 'Xỉu' : 'Tài', conf: 70, name: 'ZIGZAG' };
    return null;
  }
  
  detectDoubleBreak(results) {
    if (results.length < 4) return null;
    if (results[0] === results[1] && results[2] !== results[0] && results[3] !== results[2]) {
      return { pred: results[0], conf: 72, name: 'DOUBLE_BREAK' };
    }
    return null;
  }
  
  detectTripleBreak(results) {
    if (results.length < 5) return null;
    if (results[0] === results[1] && results[1] === results[2] && 
        results[3] !== results[0] && results[4] !== results[3]) {
      return { pred: results[0], conf: 76, name: 'TRIPLE_BREAK' };
    }
    return null;
  }
  
  detectFourPattern(results) {
    if (results.length < 8) return null;
    if (results[0] !== results[1] && results[1] !== results[2] && 
        results[2] !== results[3] && results[3] !== results[0]) {
      return { pred: results[4], conf: 68, name: 'FOUR_PATTERN' };
    }
    return null;
  }
  
  detectFivePattern(results) {
    if (results.length < 10) return null;
    let pattern = results.slice(0, 5);
    let count = 0;
    for (let i = 5; i < results.length; i++) {
      if (results[i] === pattern[i % 5]) count++;
      else break;
    }
    if (count >= 3) {
      return { pred: pattern[count % 5], conf: 75, name: 'FIVE_PATTERN' };
    }
    return null;
  }
  
  detectSixPattern(results) {
    if (results.length < 12) return null;
    let pattern = results.slice(0, 6);
    let count = 0;
    for (let i = 6; i < results.length; i++) {
      if (results[i] === pattern[i % 6]) count++;
      else break;
    }
    if (count >= 4) {
      return { pred: pattern[count % 6], conf: 77, name: 'SIX_PATTERN' };
    }
    return null;
  }
  
  detectSevenPattern(results) {
    if (results.length < 14) return null;
    let pattern = results.slice(0, 7);
    let count = 0;
    for (let i = 7; i < results.length; i++) {
      if (results[i] === pattern[i % 7]) count++;
      else break;
    }
    if (count >= 4) {
      return { pred: pattern[count % 7], conf: 78, name: 'SEVEN_PATTERN' };
    }
    return null;
  }
}

// ===== PHÂN TÍCH NÂNG CAO =====
class AdvancedAnalyzer {
  analyzeRatio(results) {
    if (results.length < 15) return null;
    let tai = 0;
    for (let i = 0; i < 15; i++) if (results[i] === 'Tài') tai++;
    let ratio = tai / 15;
    if (ratio >= 0.73) return { pred: 'Xỉu', conf: 72, name: 'RATIO_11_15' };
    if (ratio <= 0.27) return { pred: 'Tài', conf: 72, name: 'RATIO_11_15' };
    if (ratio >= 0.67) return { pred: 'Xỉu', conf: 68, name: 'RATIO_10_15' };
    if (ratio <= 0.33) return { pred: 'Tài', conf: 68, name: 'RATIO_10_15' };
    return null;
  }
  
  analyzeTrend(results) {
    if (results.length < 10) return null;
    let trend = 0;
    for (let i = 1; i < 10; i++) {
      if (results[i] === results[i-1]) trend++;
      else trend--;
    }
    if (trend >= 6) return { pred: results[0], conf: 72, name: 'TREND_STRONG_UP' };
    if (trend <= -6) return { pred: results[0] === 'Tài' ? 'Xỉu' : 'Tài', conf: 74, name: 'TREND_STRONG_DOWN' };
    if (trend >= 4) return { pred: results[0], conf: 66, name: 'TREND_UP' };
    if (trend <= -4) return { pred: results[0] === 'Tài' ? 'Xỉu' : 'Tài', conf: 68, name: 'TREND_DOWN' };
    return null;
  }
  
  analyzeMomentum(results) {
    if (results.length < 6) return null;
    let momentum = 0;
    for (let i = 0; i < 5; i++) {
      if (results[i] === results[i+1]) momentum += 1.5;
      else momentum -= 1;
    }
    if (momentum >= 5) return { pred: results[0], conf: 70, name: 'MOMENTUM_STRONG' };
    if (momentum <= -4) return { pred: results[0] === 'Tài' ? 'Xỉu' : 'Tài', conf: 72, name: 'MOMENTUM_WEAK' };
    return null;
  }
  
  analyzeReversal(results) {
    if (results.length < 5) return null;
    for (let i = 0; i <= results.length - 4; i++) {
      let a = results[i], b = results[i+1], c = results[i+2], d = results[i+3];
      if (a !== b && b === c && c !== d && a === d) {
        return { pred: a, conf: 78, name: 'REVERSAL_POINT' };
      }
    }
    return null;
  }
  
  analyzeVolatility(results) {
    if (results.length < 10) return null;
    let changes = 0;
    for (let i = 1; i < 10; i++) if (results[i] !== results[i-1]) changes++;
    let vol = changes / 9;
    if (vol > 0.7) return { pred: results[0] === 'Tài' ? 'Xỉu' : 'Tài', conf: 66, name: 'HIGH_VOLATILITY' };
    if (vol < 0.3) return { pred: results[0], conf: 68, name: 'LOW_VOLATILITY' };
    return null;
  }
  
  analyzeFibonacci(results) {
    if (results.length < 8) return null;
    let fib = [1, 1, 2, 3, 5, 8, 13];
    let match = 0;
    for (let i = 0; i < Math.min(7, results.length); i++) {
      if (results[i] === 'Tài' && fib[i] % 2 === 0) match++;
      if (results[i] === 'Xỉu' && fib[i] % 2 !== 0) match++;
    }
    if (match >= 4) {
      let next = fib[Math.min(7, results.length)];
      return { pred: next % 2 === 0 ? 'Tài' : 'Xỉu', conf: 70, name: 'FIBONACCI' };
    }
    return null;
  }
  
  analyzePrime(results) {
    if (results.length < 7) return null;
    let primes = [2, 3, 5, 7, 11, 13, 17];
    let match = 0;
    for (let i = 0; i < Math.min(7, results.length); i++) {
      if (results[i] === 'Tài' && primes[i] % 2 === 0) match++;
      if (results[i] === 'Xỉu' && primes[i] % 2 !== 0) match++;
    }
    if (match >= 4) {
      let next = primes[Math.min(7, results.length)];
      return { pred: next % 2 === 0 ? 'Tài' : 'Xỉu', conf: 72, name: 'PRIME' };
    }
    return null;
  }
  
  analyzeLucas(results) {
    if (results.length < 7) return null;
    let lucas = [2, 1, 3, 4, 7, 11, 18];
    let match = 0;
    for (let i = 0; i < Math.min(7, results.length); i++) {
      if (results[i] === 'Tài' && lucas[i] % 2 === 0) match++;
      if (results[i] === 'Xỉu' && lucas[i] % 2 !== 0) match++;
    }
    if (match >= 4) {
      let next = lucas[Math.min(7, results.length)];
      return { pred: next % 2 === 0 ? 'Tài' : 'Xỉu', conf: 73, name: 'LUCAS' };
    }
    return null;
  }
  
  analyzeWinLossRatio(results) {
    if (results.length < 20) return null;
    let tai = 0, xiu = 0;
    for (let i = 0; i < 20; i++) {
      if (results[i] === 'Tài') tai++;
      else xiu++;
    }
    let ratio = tai / xiu;
    if (ratio > 1.5) return { pred: 'Xỉu', conf: 70, name: 'WIN_LOSS_HIGH' };
    if (ratio < 0.67) return { pred: 'Tài', conf: 70, name: 'WIN_LOSS_LOW' };
    return null;
  }
  
  analyzeGap(results) {
    if (results.length < 5) return null;
    let gaps = [];
    for (let i = 1; i < results.length; i++) {
      if (results[i] !== results[i-1]) gaps.push(i);
    }
    if (gaps.length >= 2) {
      let avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      let nextGap = Math.round(avgGap);
      if (nextGap < results.length) {
        return { pred: results[nextGap] === 'Tài' ? 'Xỉu' : 'Tài', conf: 65, name: 'GAP_ANALYSIS' };
      }
    }
    return null;
  }
  
  analyzeCluster(results) {
    if (results.length < 10) return null;
    let clusters = [];
    let current = 1;
    for (let i = 1; i < results.length; i++) {
      if (results[i] === results[i-1]) current++;
      else {
        clusters.push({ value: results[i-1], size: current });
        current = 1;
      }
    }
    clusters.push({ value: results[results.length-1], size: current });
    
    if (clusters.length >= 3) {
      let last = clusters[clusters.length - 1];
      if (last.size === 1) {
        return { pred: last.value === 'Tài' ? 'Xỉu' : 'Tài', conf: 68, name: 'CLUSTER_BREAK' };
      }
      if (last.size >= 3) {
        return { pred: last.value === 'Tài' ? 'Xỉu' : 'Tài', conf: 76, name: 'CLUSTER_STRONG' };
      }
    }
    return null;
  }
  
  analyzeFibonacciRetracement(results) {
    if (results.length < 12) return null;
    let values = results.map(r => r === 'Tài' ? 1 : 0);
    let high = Math.max(...values);
    let low = Math.min(...values);
    let current = values[values.length - 1];
    let prediction = current === 1 ? 'Xỉu' : 'Tài';
    return { pred: prediction, conf: 72, name: 'FIB_RETRACEMENT' };
  }
  
  analyzeMovingAverage(results) {
    if (results.length < 10) return null;
    let values = results.map(r => r === 'Tài' ? 1 : 0);
    let ma5 = values.slice(-5).reduce((a, b) => a + b, 0) / 5;
    let ma10 = values.slice(-10).reduce((a, b) => a + b, 0) / 10;
    if (ma5 > ma10 + 0.3) return { pred: 'Xỉu', conf: 70, name: 'MA_CROSS_DOWN' };
    if (ma5 < ma10 - 0.3) return { pred: 'Tài', conf: 70, name: 'MA_CROSS_UP' };
    return null;
  }
  
  analyzeRSI(results) {
    if (results.length < 14) return null;
    let values = results.map(r => r === 'Tài' ? 1 : 0);
    let gains = [], losses = [];
    for (let i = 1; i < values.length; i++) {
      let diff = values[i] - values[i-1];
      if (diff > 0) gains.push(diff);
      else losses.push(Math.abs(diff));
    }
    let avgGain = gains.slice(-14).reduce((a, b) => a + b, 0) / 14;
    let avgLoss = losses.slice(-14).reduce((a, b) => a + b, 0) / 14;
    let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    let rsi = 100 - (100 / (1 + rs));
    if (rsi > 70) return { pred: 'Xỉu', conf: 74, name: 'RSI_OVERBOUGHT' };
    if (rsi < 30) return { pred: 'Tài', conf: 74, name: 'RSI_OVERSOLD' };
    return null;
  }
  
  analyzeBollingerBands(results) {
    if (results.length < 20) return null;
    let values = results.map(r => r === 'Tài' ? 1 : 0);
    let sma = values.slice(-20).reduce((a, b) => a + b, 0) / 20;
    let variance = values.slice(-20).reduce((a, b) => a + (b - sma) ** 2, 0) / 20;
    let stdDev = Math.sqrt(variance);
    let upper = sma + 2 * stdDev;
    let lower = sma - 2 * stdDev;
    let current = values[values.length - 1];
    if (current > upper) return { pred: 'Xỉu', conf: 76, name: 'BB_UPPER' };
    if (current < lower) return { pred: 'Tài', conf: 76, name: 'BB_LOWER' };
    return null;
  }
}

// ===== BỘ TỔNG HỢP THÔNG MINH =====
class SmartEnsemble {
  constructor() {
    this.baseDetector = new BasePatternDetector();
    this.advancedAnalyzer = new AdvancedAnalyzer();
    this.history = [];
  }
  
  predict(results) {
    let allPredictions = [];
    
    // Base patterns
    let baseMethods = [
      this.baseDetector.detectBetStreak.bind(this.baseDetector),
      this.baseDetector.detectAlternating.bind(this.baseDetector),
      this.baseDetector.detectDoubleDouble.bind(this.baseDetector),
      this.baseDetector.detectTripleTriple.bind(this.baseDetector),
      this.baseDetector.detectOneTwoOne.bind(this.baseDetector),
      this.baseDetector.detectOneTwoThree.bind(this.baseDetector),
      this.baseDetector.detectThreeTwoOne.bind(this.baseDetector),
      this.baseDetector.detectZigzag.bind(this.baseDetector),
      this.baseDetector.detectDoubleBreak.bind(this.baseDetector),
      this.baseDetector.detectTripleBreak.bind(this.baseDetector),
      this.baseDetector.detectFourPattern.bind(this.baseDetector),
      this.baseDetector.detectFivePattern.bind(this.baseDetector),
      this.baseDetector.detectSixPattern.bind(this.baseDetector),
      this.baseDetector.detectSevenPattern.bind(this.baseDetector)
    ];
    
    for (let method of baseMethods) {
      let pred = method(results);
      if (pred) allPredictions.push(pred);
    }
    
    // Advanced analysis
    let advancedMethods = [
      this.advancedAnalyzer.analyzeRatio.bind(this.advancedAnalyzer),
      this.advancedAnalyzer.analyzeTrend.bind(this.advancedAnalyzer),
      this.advancedAnalyzer.analyzeMomentum.bind(this.advancedAnalyzer),
      this.advancedAnalyzer.analyzeReversal.bind(this.advancedAnalyzer),
      this.advancedAnalyzer.analyzeVolatility.bind(this.advancedAnalyzer),
      this.advancedAnalyzer.analyzeFibonacci.bind(this.advancedAnalyzer),
      this.advancedAnalyzer.analyzePrime.bind(this.advancedAnalyzer),
      this.advancedAnalyzer.analyzeLucas.bind(this.advancedAnalyzer),
      this.advancedAnalyzer.analyzeWinLossRatio.bind(this.advancedAnalyzer),
      this.advancedAnalyzer.analyzeGap.bind(this.advancedAnalyzer),
      this.advancedAnalyzer.analyzeCluster.bind(this.advancedAnalyzer),
      this.advancedAnalyzer.analyzeFibonacciRetracement.bind(this.advancedAnalyzer),
      this.advancedAnalyzer.analyzeMovingAverage.bind(this.advancedAnalyzer),
      this.advancedAnalyzer.analyzeRSI.bind(this.advancedAnalyzer),
      this.advancedAnalyzer.analyzeBollingerBands.bind(this.advancedAnalyzer)
    ];
    
    for (let method of advancedMethods) {
      let pred = method(results);
      if (pred) allPredictions.push(pred);
    }
    
    return this.finalFusion(allPredictions, results);
  }
  
  finalFusion(predictions, results) {
    if (predictions.length === 0) {
      return { prediction: results[0] || 'Tài', confidence: 60, method: 'FALLBACK', totalAlgos: 0 };
    }
    
    let taiScore = 0, xiuScore = 0;
    for (let p of predictions) {
      if (p.pred === 'Tài') taiScore += p.conf;
      else xiuScore += p.conf;
    }
    
    let finalPred = taiScore >= xiuScore ? 'Tài' : 'Xỉu';
    let finalConf = Math.max(taiScore, xiuScore) / (taiScore + xiuScore) * 100;
    finalConf = Math.min(96, Math.max(60, Math.round(finalConf)));
    
    let topMethod = predictions.sort((a, b) => b.conf - a.conf)[0]?.name || 'ENSEMBLE';
    
    return {
      prediction: finalPred,
      confidence: finalConf,
      probability: (finalPred === 'Tài' ? taiScore / (taiScore + xiuScore) : xiuScore / (taiScore + xiuScore)) * 100,
      method: topMethod,
      totalAlgos: predictions.length
    };
  }
}

// ================================================================
// HÀM PHÂN TÍCH CHÍNH
// ================================================================
async function analyzeTaiXiu() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    // Tạo lịch sử từ dữ liệu hiện tại
    const results = [data.ket_qua];
    
    // Dự đoán
    const ensemble = new SmartEnsemble();
    const prediction = ensemble.predict(results);
    
    return {
      "Phiên": data.phien || 0,
      "xúc xắc 1": data.xuc_xac_1 || 0,
      "xúc xắc 2": data.xuc_xac_2 || 0,
      "xúc xắc 3": data.xuc_xac_3 || 0,
      "tổng": data.tong || 0,
      "phiên dự đoán": (data.phien || 0) + 1,
      "dự đoán": prediction.prediction || "Tài",
      "tỉ lệ": prediction.confidence + "%",
      "id": AUTHOR_ID,
      "thời gian phân tích": new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'}),
      "chi tiết": {
        "phương pháp": prediction.method || "ENSEMBLE",
        "số thuật toán": prediction.totalAlgos || 0,
        "độ tin cậy": prediction.confidence || 60,
        "xác suất": (prediction.probability || 50).toFixed(1) + "%"
      }
    };
    
  } catch (error) {
    return {
      "lỗi": `Phân tích thất bại: ${error.message}`,
      "id": AUTHOR_ID,
      "thời gian": new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'})
    };
  }
}

// ================================================================
// TẠO WEB SERVER CHO RENDER
// ================================================================
const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Route: /api/tx
  if (req.url === '/api/tx' || req.url === '/') {
    try {
      const result = await analyzeTaiXiu();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(result, null, 2));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: error.message }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api/tx`);
  console.log(`👤 ID: ${AUTHOR_ID}`);
});
