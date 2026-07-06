// ================================================================
// THUẬT TOÁN PHÂN TÍCH TÀI XỈU SIÊU CẤP - FULL VERSION
// BẢN QUYỀN @tranhoang2286
// ================================================================

// ===== CẤP ĐỘ 1: BỘ NHẬN DIỆN CẦU CƠ BẢN =====
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

// ===== CẤP ĐỘ 2: BỘ PHÂN TÍCH NÂNG CAO =====
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
    let range = high - low;
    let fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
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

// ===== CẤP ĐỘ 3: BỘ HỌC THÔNG MINH =====
class SmartLearner {
  constructor() {
    this.patternMemory = new Map();
    this.sequenceMemory = new Map();
    this.frequencyMemory = new Map();
    this.complexPatterns = new Map();
    this.weights = new Map();
    this.decisionTree = new Map();
  }
  
  predictFromPattern(results) {
    for (let len = 7; len >= 3; len--) {
      if (results.length >= len) {
        let pattern = results.slice(0, len).join('');
        if (this.patternMemory.has(pattern)) {
          let p = this.patternMemory.get(pattern);
          if (p.total >= 2) {
            let taiProb = p.Tai / p.total;
            let successRate = p.correct / p.total;
            let prediction = taiProb > 0.5 ? 'Tài' : 'Xỉu';
            let confidence = 55 + Math.abs(taiProb - 0.5) * 45;
            if (successRate > 0.65) confidence += 5;
            if (successRate > 0.8) confidence += 8;
            return { pred: prediction, conf: Math.min(92, confidence), name: `LEARNED_${len}` };
          }
        }
      }
    }
    return null;
  }
  
  predictFromSequence(results) {
    for (let len = 4; len >= 2; len--) {
      if (results.length >= len) {
        let seq = results.slice(0, len).join('');
        if (this.sequenceMemory.has(seq)) {
          let s = this.sequenceMemory.get(seq);
          if (s.total >= 3) {
            let taiProb = s.Tai / s.total;
            let prediction = taiProb > 0.5 ? 'Tài' : 'Xỉu';
            let confidence = 55 + Math.abs(taiProb - 0.5) * 45;
            return { pred: prediction, conf: Math.min(88, confidence), name: `SEQ_${len}` };
          }
        }
      }
    }
    return null;
  }
  
  predictFromFrequency(results) {
    if (results.length < 5) return null;
    let key = results.slice(0, 5).join('');
    if (this.frequencyMemory.has(key)) {
      let f = this.frequencyMemory.get(key);
      if (f.total >= 2) {
        let taiProb = f.Tai / f.total;
        let prediction = taiProb > 0.5 ? 'Tài' : 'Xỉu';
        let confidence = 50 + Math.abs(taiProb - 0.5) * 50;
        return { pred: prediction, conf: Math.min(85, confidence), name: 'FREQ' };
      }
    }
    return null;
  }
  
  predictComplexPattern(results) {
    if (results.length < 6) return null;
    for (let len = 6; len >= 4; len--) {
      if (results.length >= len) {
        let pattern = results.slice(0, len).join('');
        for (let [key, value] of this.complexPatterns) {
          if (key.length === pattern.length) {
            let match = 0;
            for (let i = 0; i < pattern.length; i++) {
              if (pattern[i] === key[i]) match++;
            }
            if (match >= len - 1 && value.total >= 2) {
              let taiProb = value.Tai / value.total;
              let prediction = taiProb > 0.5 ? 'Tài' : 'Xỉu';
              return { pred: prediction, conf: 70, name: 'COMPLEX' };
            }
          }
        }
      }
    }
    return null;
  }
  
  predictFromDecisionTree(results) {
    if (results.length < 5) return null;
    let features = this.extractFeatures(results);
    let bestMatch = null;
    let bestScore = 0;
    for (let [key, value] of this.decisionTree) {
      let score = this.matchFeatures(features, key);
      if (score > bestScore && value.total >= 2) {
        bestScore = score;
        bestMatch = value;
      }
    }
    if (bestMatch && bestScore > 0.7) {
      let taiProb = bestMatch.Tai / bestMatch.total;
      let prediction = taiProb > 0.5 ? 'Tài' : 'Xỉu';
      return { pred: prediction, conf: 70 + bestScore * 20, name: 'DECISION_TREE' };
    }
    return null;
  }
  
  extractFeatures(results) {
    let features = [];
    let last = results[0];
    for (let i = 1; i < Math.min(10, results.length); i++) {
      if (results[i] === last) features.push(1);
      else features.push(0);
      last = results[i];
    }
    return features.join('');
  }
  
  matchFeatures(features, key) {
    let match = 0;
    for (let i = 0; i < Math.min(features.length, key.length); i++) {
      if (features[i] === key[i]) match++;
    }
    return match / Math.min(features.length, key.length);
  }
  
  learnFromPattern(results, outcome, wasCorrect) {
    for (let len = 3; len <= 8; len++) {
      if (results.length >= len) {
        let pattern = results.slice(0, len).join('');
        if (!this.patternMemory.has(pattern)) {
          this.patternMemory.set(pattern, { Tai: 0, Xiu: 0, total: 0, correct: 0 });
        }
        let p = this.patternMemory.get(pattern);
        if (outcome === 'Tài') p.Tai++;
        else p.Xiu++;
        p.total++;
        if (wasCorrect) p.correct++;
      }
    }
  }
  
  learnFromSequence(results, outcome) {
    for (let len = 2; len <= 5; len++) {
      if (results.length >= len) {
        let seq = results.slice(0, len).join('');
        if (!this.sequenceMemory.has(seq)) {
          this.sequenceMemory.set(seq, { Tai: 0, Xiu: 0, total: 0 });
        }
        let s = this.sequenceMemory.get(seq);
        if (outcome === 'Tài') s.Tai++;
        else s.Xiu++;
        s.total++;
      }
    }
  }
  
  learnFromFrequency(results, outcome) {
    if (results.length >= 5) {
      let key = results.slice(0, 5).join('');
      if (!this.frequencyMemory.has(key)) {
        this.frequencyMemory.set(key, { Tai: 0, Xiu: 0, total: 0 });
      }
      let f = this.frequencyMemory.get(key);
      if (outcome === 'Tài') f.Tai++;
      else f.Xiu++;
      f.total++;
    }
  }
  
  learnComplexPattern(results, outcome) {
    if (results.length >= 4) {
      for (let len = 4; len <= 6; len++) {
        if (results.length >= len) {
          let pattern = results.slice(0, len).join('');
          if (!this.complexPatterns.has(pattern)) {
            this.complexPatterns.set(pattern, { Tai: 0, Xiu: 0, total: 0 });
          }
          let c = this.complexPatterns.get(pattern);
          if (outcome === 'Tài') c.Tai++;
          else c.Xiu++;
          c.total++;
        }
      }
    }
  }
  
  learnDecisionTree(results, outcome) {
    if (results.length >= 5) {
      let features = this.extractFeatures(results);
      if (!this.decisionTree.has(features)) {
        this.decisionTree.set(features, { Tai: 0, Xiu: 0, total: 0 });
      }
      let d = this.decisionTree.get(features);
      if (outcome === 'Tài') d.Tai++;
      else d.Xiu++;
      d.total++;
    }
  }
}

// ===== CẤP ĐỘ 4: BỘ DỰ BÁO THỜI GIAN =====
class TemporalAnalyzer {
  constructor() {
    this.hourlyData = new Array(24).fill().map(() => ({ Tai: 0, Xiu: 0, total: 0 }));
    this.dailyData = new Array(7).fill().map(() => ({ Tai: 0, Xiu: 0, total: 0 }));
    this.weeklyData = new Map();
    this.monthlyData = new Map();
    this.quarterlyData = new Map();
    this.yearlyData = new Map();
  }
  
  analyzeHourly() {
    let hour = new Date().getHours();
    let data = this.hourlyData[hour];
    if (data.total >= 10) {
      let taiProb = data.Tai / data.total;
      let prediction = taiProb > 0.5 ? 'Tài' : 'Xỉu';
      let confidence = 55 + Math.abs(taiProb - 0.5) * 45;
      return { pred: prediction, conf: Math.min(85, confidence), name: `HOUR_${hour}` };
    }
    return null;
  }
  
  analyzeDaily() {
    let day = new Date().getDay();
    let data = this.dailyData[day];
    if (data.total >= 8) {
      let taiProb = data.Tai / data.total;
      let prediction = taiProb > 0.5 ? 'Tài' : 'Xỉu';
      let confidence = 50 + Math.abs(taiProb - 0.5) * 50;
      return { pred: prediction, conf: Math.min(82, confidence), name: `DAY_${day}` };
    }
    return null;
  }
  
  analyzeWeekly() {
    let week = this.getWeekNumber();
    let key = `W${week}`;
    if (this.weeklyData.has(key)) {
      let data = this.weeklyData.get(key);
      if (data.total >= 20) {
        let taiProb = data.Tai / data.total;
        let prediction = taiProb > 0.5 ? 'Tài' : 'Xỉu';
        let confidence = 50 + Math.abs(taiProb - 0.5) * 50;
        return { pred: prediction, conf: Math.min(80, confidence), name: `WEEK_${week}` };
      }
    }
    return null;
  }
  
  analyzeMonthly() {
    let month = new Date().getMonth();
    let key = `M${month}`;
    if (this.monthlyData.has(key)) {
      let data = this.monthlyData.get(key);
      if (data.total >= 50) {
        let taiProb = data.Tai / data.total;
        let prediction = taiProb > 0.5 ? 'Tài' : 'Xỉu';
        let confidence = 50 + Math.abs(taiProb - 0.5) * 50;
        return { pred: prediction, conf: Math.min(78, confidence), name: `MONTH_${month}` };
      }
    }
    return null;
  }
  
  analyzeQuarterly() {
    let quarter = Math.floor(new Date().getMonth() / 3);
    let key = `Q${quarter}`;
    if (this.quarterlyData.has(key)) {
      let data = this.quarterlyData.get(key);
      if (data.total >= 100) {
        let taiProb = data.Tai / data.total;
        let prediction = taiProb > 0.5 ? 'Tài' : 'Xỉu';
        let confidence = 50 + Math.abs(taiProb - 0.5) * 50;
        return { pred: prediction, conf: Math.min(76, confidence), name: `QUARTER_${quarter}` };
      }
    }
    return null;
  }
  
  analyzeYearly() {
    let year = new Date().getFullYear();
    let key = `Y${year}`;
    if (this.yearlyData.has(key)) {
      let data = this.yearlyData.get(key);
      if (data.total >= 200) {
        let taiProb = data.Tai / data.total;
        let prediction = taiProb > 0.5 ? 'Tài' : 'Xỉu';
        let confidence = 50 + Math.abs(taiProb - 0.5) * 50;
        return { pred: prediction, conf: Math.min(74, confidence), name: `YEAR_${year}` };
      }
    }
    return null;
  }
  
  updateHourly(actual) {
    let hour = new Date().getHours();
    if (actual === 'Tài') this.hourlyData[hour].Tai++;
    else this.hourlyData[hour].Xiu++;
    this.hourlyData[hour].total++;
  }
  
  updateDaily(actual) {
    let day = new Date().getDay();
    if (actual === 'Tài') this.dailyData[day].Tai++;
    else this.dailyData[day].Xiu++;
    this.dailyData[day].total++;
  }
  
  updateWeekly(actual) {
    let week = this.getWeekNumber();
    let key = `W${week}`;
    if (!this.weeklyData.has(key)) {
      this.weeklyData.set(key, { Tai: 0, Xiu: 0, total: 0 });
    }
    let data = this.weeklyData.get(key);
    if (actual === 'Tài') data.Tai++;
    else data.Xiu++;
    data.total++;
  }
  
  updateMonthly(actual) {
    let month = new Date().getMonth();
    let key = `M${month}`;
    if (!this.monthlyData.has(key)) {
      this.monthlyData.set(key, { Tai: 0, Xiu: 0, total: 0 });
    }
    let data = this.monthlyData.get(key);
    if (actual === 'Tài') data.Tai++;
    else data.Xiu++;
    data.total++;
  }
  
  updateQuarterly(actual) {
    let quarter = Math.floor(new Date().getMonth() / 3);
    let key = `Q${quarter}`;
    if (!this.quarterlyData.has(key)) {
      this.quarterlyData.set(key, { Tai: 0, Xiu: 0, total: 0 });
    }
    let data = this.quarterlyData.get(key);
    if (actual === 'Tài') data.Tai++;
    else data.Xiu++;
    data.total++;
  }
  
  updateYearly(actual) {
    let year = new Date().getFullYear();
    let key = `Y${year}`;
    if (!this.yearlyData.has(key)) {
      this.yearlyData.set(key, { Tai: 0, Xiu: 0, total: 0 });
    }
    let data = this.yearlyData.get(key);
    if (actual === 'Tài') data.Tai++;
    else data.Xiu++;
    data.total++;
  }
  
  getWeekNumber() {
    let d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    let week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }
}

// ===== CẤP ĐỘ 5: BỘ TỔNG HỢP THÔNG MINH =====
class SmartEnsemble {
  constructor() {
    this.baseDetector = new BasePatternDetector();
    this.advancedAnalyzer = new AdvancedAnalyzer();
    this.smartLearner = new SmartLearner();
    this.temporalAnalyzer = new TemporalAnalyzer();
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
    
    // Smart learning
    let learnerPred = this.smartLearner.predictFromPattern(results);
    if (learnerPred) allPredictions.push(learnerPred);
    
    let seqPred = this.smartLearner.predictFromSequence(results);
    if (seqPred) allPredictions.push(seqPred);
    
    let freqPred = this.smartLearner.predictFromFrequency(results);
    if (freqPred) allPredictions.push(freqPred);
    
    let complexPred = this.smartLearner.predictComplexPattern(results);
    if (complexPred) allPredictions.push(complexPred);
    
    let treePred = this.smartLearner.predictFromDecisionTree(results);
    if (treePred) allPredictions.push(treePred);
    
    // Temporal
    let hourPred = this.temporalAnalyzer.analyzeHourly();
    if (hourPred) allPredictions.push(hourPred);
    
    let dayPred = this.temporalAnalyzer.analyzeDaily();
    if (dayPred) allPredictions.push(dayPred);
    
    let weekPred = this.temporalAnalyzer.analyzeWeekly();
    if (weekPred) allPredictions.push(weekPred);
    
    let monthPred = this.temporalAnalyzer.analyzeMonthly();
    if (monthPred) allPredictions.push(monthPred);
    
    let quarterPred = this.temporalAnalyzer.analyzeQuarterly();
    if (quarterPred) allPredictions.push(quarterPred);
    
    let yearPred = this.temporalAnalyzer.analyzeYearly();
    if (yearPred) allPredictions.push(yearPred);
    
    return this.finalFusion(allPredictions, results);
  }
  
  finalFusion(predictions, results) {
    if (predictions.length === 0) {
      return { prediction: results[0] || 'Tài', confidence: 60, method: 'FALLBACK', totalAlgos: 0 };
    }
    
    let taiScore = 0, xiuScore = 0;
    let taiCount = 0, xiuCount = 0;
    let weightedTai = 0, weightedXiu = 0;
    
    for (let p of predictions) {
      let weight = p.conf / 100;
      if (p.pred === 'Tài') {
        taiScore += p.conf;
        taiCount++;
        weightedTai += p.conf * weight;
      } else {
        xiuScore += p.conf;
        xiuCount++;
        weightedXiu += p.conf * weight;
      }
    }
    
    let finalConf = Math.max(taiScore, xiuScore) / (taiScore + xiuScore) * 100;
    finalConf = Math.min(96, Math.max(60, Math.round(finalConf)));
    
    let finalPred = taiScore >= xiuScore ? 'Tài' : 'Xỉu';
    
    // Điều chỉnh nếu quá cân bằng
    if (Math.abs(taiScore - xiuScore) < 50) {
      // Dùng weighted để break tie
      if (weightedTai > weightedXiu) finalPred = 'Tài';
      else if (weightedXiu > weightedTai) finalPred = 'Xỉu';
      else {
        // Nếu vẫn hòa, dùng xu hướng gần nhất
        let last = results[0] || 'Tài';
        finalPred = last === 'Tài' ? 'Xỉu' : 'Tài';
      }
      finalConf = Math.max(65, finalConf - 5);
    }
    
    let topMethod = predictions.sort((a, b) => b.conf - a.conf)[0]?.name || 'ENSEMBLE';
    
    return {
      prediction: finalPred,
      confidence: finalConf,
      probability: (finalPred === 'Tài' ? taiScore / (taiScore + xiuScore) : xiuScore / (taiScore + xiuScore)) * 100,
      method: topMethod,
      totalAlgos: predictions.length
    };
  }
  
  learn(results, outcome, wasCorrect, method) {
    this.temporalAnalyzer.updateHourly(outcome);
    this.temporalAnalyzer.updateDaily(outcome);
    this.temporalAnalyzer.updateWeekly(outcome);
    this.temporalAnalyzer.updateMonthly(outcome);
    this.temporalAnalyzer.updateQuarterly(outcome);
    this.temporalAnalyzer.updateYearly(outcome);
    
    if (results && results.length >= 3) {
      this.smartLearner.learnFromPattern(results, outcome, wasCorrect);
      this.smartLearner.learnFromSequence(results, outcome);
      this.smartLearner.learnFromFrequency(results, outcome);
      this.smartLearner.learnComplexPattern(results, outcome);
      this.smartLearner.learnDecisionTree(results, outcome);
    }
  }
}

// ===== BỘ DỰ ĐOÁN CHÍNH =====
class UltimateMachine {
  constructor() {
    this.ensemble = new SmartEnsemble();
    this.currentResults = [];
    this.stats = { total: 0, correct: 0, streak: 0, history: [] };
    this.currentData = null;
  }
  
  predict(data) {
    let results = [];
    if (data && data.length > 0) {
      for (let i = 0; i < Math.min(data.length, 35); i++) {
        let v = data[i]?.Ket_qua || data[i]?.ket_qua || data[i];
        if (v === 'Tài' || v === 'Xỉu') results.push(v);
      }
    }
    
    if (results.length < 5) {
      return { 
        prediction: 'Tài', 
        confidence: 60, 
        method: 'WAITING', 
        totalAlgos: 0,
        needMoreData: true,
        dataCount: results.length
      };
    }
    
    this.currentResults = results;
    let result = this.ensemble.predict(results);
    return result;
  }
  
  learn(prediction, actual, wasCorrect, method) {
    this.stats.total++;
    if (wasCorrect) {
      this.stats.correct++;
      this.stats.streak++;
    } else {
      this.stats.streak = 0;
    }
    
    this.stats.history.unshift({ 
      prediction, 
      actual, 
      wasCorrect, 
      method,
      time: Date.now() 
    });
    if (this.stats.history.length > 200) this.stats.history.pop();
    
    if (this.currentResults && this.currentResults.length >= 3) {
      this.ensemble.learn(this.currentResults, actual, wasCorrect, method);
    }
  }
  
  getStats() {
    let acc = this.stats.total > 0 ? (this.stats.correct / this.stats.total * 100) : 0;
    let recent = this.stats.history.slice(0, 10).filter(h => h.wasCorrect).length;
    let recentAcc = (recent / Math.min(10, this.stats.history.length) * 100);
    
    let last10 = this.stats.history.slice(0, 10);
    let lastAcc = last10.filter(h => h.wasCorrect).length / Math.min(10, last10.length) * 100;
    
    let methods = {};
    for (let h of this.stats.history) {
      if (h.method) {
        methods[h.method] = (methods[h.method] || 0) + 1;
      }
    }
    
    return {
      total: this.stats.total,
      correct: this.stats.correct,
      accuracy: acc.toFixed(1) + '%',
      recentAccuracy: recentAcc.toFixed(0) + '%',
      last10Accuracy: lastAcc.toFixed(0) + '%',
      streak: this.stats.streak,
      methodsUsed: methods,
      historyCount: this.stats.history.length
    };
  }
  
  getDetailedAnalysis() {
    let history = this.stats.history.slice(0, 10);
    let analysis = [];
    for (let h of history) {
      analysis.push({
        time: new Date(h.time).toLocaleTimeString('vi-VN'),
        prediction: h.prediction,
        actual: h.actual,
        result: h.wasCorrect ? '✅' : '❌',
        method: h.method
      });
    }
    return analysis;
  }
  
  reset() {
    this.stats = { total: 0, correct: 0, streak: 0, history: [] };
    this.currentResults = [];
    this.ensemble = new SmartEnsemble();
  }
}

// ===== EXPORT CHÍNH =====
const machine = new UltimateMachine();

// ===== HÀM GỌI API VÀ XỬ LÝ =====
async function analyzeTaiXiu() {
  const API_URL = "https://apisunwinhistory.onrender.com/api/tx";
  const AUTHOR_ID = "@tranhoang2286";
  
  try {
    // Lấy dữ liệu từ API
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    // Kiểm tra dữ liệu
    if (!data.phien || !data.ket_qua) {
      throw new Error('Dữ liệu API không hợp lệ');
    }
    
    // Chuyển đổi dữ liệu lịch sử (giả định có lịch sử từ API)
    // Trong thực tế, bạn cần lưu lịch sử vào database hoặc local storage
    let historyData = [];
    if (data.lich_su && Array.isArray(data.lich_su)) {
      historyData = data.lich_su;
    } else {
      // Nếu không có lịch sử, dùng dữ liệu hiện tại
      historyData = [data];
    }
    
    // Chuẩn bị dữ liệu cho thuật toán
    let results = [];
    for (let item of historyData) {
      let result = item.ket_qua || item.Ket_qua;
      if (result === 'Tài' || result === 'Xỉu') {
        results.push(result);
      }
    }
    
    // Nếu chưa có lịch sử, dùng dữ liệu hiện tại
    if (results.length === 0) {
      results = [data.ket_qua];
    }
    
    // Dự đoán
    const prediction = machine.predict(results);
    
    // Tạo kết quả JSON
    const result = {
      "Phiên": data.phien,
      "xúc xắc 1": data.xuc_xac_1,
      "xúc xắc 2": data.xuc_xac_2,
      "xúc xắc 3": data.xuc_xac_3,
      "tổng": data.tong,
      "phiên dự đoán": data.phien + 1,
      "dự đoán": prediction.prediction || "Tài",
      "tỉ lệ": prediction.confidence + "%",
      "id": AUTHOR_ID,
      "thời gian phân tích": new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'}),
      "chi tiết": {
        "phương pháp": prediction.method || "ENSEMBLE",
        "số thuật toán": prediction.totalAlgos || 0,
        "độ tin cậy": prediction.confidence || 60,
        "xác suất": (prediction.probability || 50).toFixed(1) + "%",
        "cần thêm dữ liệu": prediction.needMoreData || false,
        "số mẫu": prediction.dataCount || results.length
      },
      "thống kê": machine.getStats()
    };
    
    return result;
    
  } catch (error) {
    return {
      "lỗi": `Phân tích thất bại: ${error.message}`,
      "id": AUTHOR_ID,
      "thời gian": new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'})
    };
  }
}

// ===== HÀM HỌC TỪ KẾT QUẢ THỰC TẾ =====
function learnFromResult(prediction, actual) {
  let wasCorrect = prediction === actual;
  machine.learn(prediction, actual, wasCorrect, 'API');
  return wasCorrect;
}

// ===== EXPORT =====
export { 
  analyzeTaiXiu, 
  learnFromResult, 
  machine,
  UltimateMachine,
  SmartEnsemble,
  BasePatternDetector,
  AdvancedAnalyzer,
  SmartLearner,
  TemporalAnalyzer
};

// ===== SỬ DỤNG TRONG BROWSER =====
if (typeof window !== 'undefined') {
  window.TaiXiuAnalyzer = {
    analyzeTaiXiu,
    learnFromResult,
    machine,
    UltimateMachine,
    SmartEnsemble
  };
}
