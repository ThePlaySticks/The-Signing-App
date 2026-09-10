import { signAssetService } from './SignAssetService.js';

/**
 * Dedicated Nigerian Sign Language (NSL) Translation Engine
 * 
 * Separates:
 * 1. English Language Understanding (tokenization, sentence typology, question detection)
 * 2. NSL Grammar Transformation (Topic-Comment syntax, Time-First, Question-Final, Negation-Final)
 * 3. Structured Sign Sequence Generation (conforming to the production schema)
 */
export class NslTranslator {
  constructor() {
    this.questionWords = new Set(['WHERE', 'WHAT', 'WHEN', 'WHO', 'WHY', 'HOW']);
    this.timeWords = new Set(['TODAY', 'YESTERDAY', 'TOMORROW', 'NOW', 'MORNING', 'AFTERNOON', 'NIGHT', 'LATER']);
    this.negationWords = new Set(['NOT', 'NO', 'NEVER', 'NONE', 'CANNOT', 'DONT']);
    this.stopWords = new Set(['THE', 'IS', 'AM', 'ARE', 'A', 'AN', 'OF', 'TO', 'BE', 'DO', 'DOES', 'DID', 'WILL']);
    
    // Idiom and multi-word phrase dictionary for Nigerian cultural context
    this.idiomMappings = [
      {
        pattern: /good\s+afternoon/i,
        replacement: ['GOOD', 'AFTERNOON']
      },
      {
        pattern: /thank\s+you/i,
        replacement: ['THANK-YOU']
      },
      {
        pattern: /bawo\s+ni/i,
        replacement: ['HOW-YOU-CULTURAL']
      },
      {
        pattern: /i\s+need\s+help/i,
        replacement: ['HELP', 'I']
      },
      {
        pattern: /i\s+am\s+deaf/i,
        replacement: ['I', 'DEAF']
      },
      {
        pattern: /how\s+are\s+you/i,
        replacement: ['YOU', 'HOW']
      }
    ];
  }

  /**
   * Translates an English sentence into a structured Nigerian Sign Language sequence
   * @param {string} englishSentence
   * @returns {Object} Structured Sign Sequence
   */
  translate(englishSentence) {
    if (!englishSentence || typeof englishSentence !== 'string') {
      return this.createEmptySequence();
    }

    const trimmed = englishSentence.trim();
    if (!trimmed) return this.createEmptySequence();

    // Stage 1: English Language Understanding
    const nluResult = this.parseEnglishNlu(trimmed);

    // Stage 2: NSL Grammar Transformation
    const nslGrammarTokens = this.applyNslGrammarRules(nluResult);

    // Stage 3: Sign Asset Resolution & Sequence Synthesis
    const signSequence = [];
    const glossList = [];

    nslGrammarTokens.forEach((token, index) => {
      glossList.push(token);

      const resolved = signAssetService.resolveToken(token);
      
      if (resolved.matched && resolved.sign) {
        signSequence.push({
          sequenceIndex: index,
          signId: resolved.sign.id,
          gloss: resolved.sign.gloss,
          signName: resolved.sign.signName,
          durationMs: 1200,
          assetType: resolved.sign.media.videoUrl ? 'video' : '3d_animation',
          assetUrl: resolved.sign.media.videoUrl || null,
          threeDAnimationId: resolved.sign.media.threeDAnimationId || null,
          nonManualMarkers: resolved.sign.nonManualMarkers,
          fallbackStrategy: 'verified_nsl_sign',
          isVerified: resolved.sign.metadata.verifiedByNSLExpert
        });
      } else {
        // Honest fallback: Not fabricated, explicitly marked as fingerspelling
        signSequence.push({
          sequenceIndex: index,
          signId: `fingerspell-${token.toLowerCase()}`,
          gloss: token,
          signName: `Fingerspell: ${token}`,
          durationMs: Math.max(800, token.length * 600),
          assetType: '3d_fingerspell',
          assetUrl: null,
          threeDAnimationId: null,
          fingerspellLetters: resolved.letters,
          nonManualMarkers: {
            facialExpression: 'Focused, steady mouth posture for spelling',
            mouthMorpheme: token.toLowerCase()
          },
          fallbackStrategy: 'explicit_fingerspell',
          isVerified: false
        });
      }
    });

    return {
      translationId: `nsl-tx-${Date.now()}`,
      source: {
        text: trimmed,
        language: 'en'
      },
      target: {
        language: 'NSL',
        dialect: 'Standard Nigerian Sign Language',
        grammarStructure: nluResult.isQuestion ? 'TIME-TOPIC-COMMENT-QUESTION' : 'TIME-TOPIC-COMMENT'
      },
      gloss: glossList,
      nonManualMarkers: {
        facialExpression: nluResult.isQuestion ? 'question-wh-furrowed-brows' : 'neutral-attentive',
        headMovement: nluResult.isQuestion ? 'forward-tilt' : 'neutral',
        bodyShift: 'neutral'
      },
      signSequence: signSequence
    };
  }

  /**
   * Stage 1: English Tokenization & NLU analysis
   */
  parseEnglishNlu(sentence) {
    let preprocessed = sentence;
    
    // Check idioms
    this.idiomMappings.forEach(({ pattern, replacement }) => {
      preprocessed = preprocessed.replace(pattern, ` __PHRASE_${replacement.join('_')}__ `);
    });

    const isQuestion = /[?]/.test(sentence) || /^(where|what|when|who|why|how|can|is|are|do)/i.test(sentence);

    const rawTokens = preprocessed
      .toUpperCase()
      .replace(/[.,?!;:()"'"]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const tokens = [];
    rawTokens.forEach(tok => {
      if (tok.startsWith('__PHRASE_') && tok.endsWith('__')) {
        const inner = tok.replace('__PHRASE_', '').replace('__', '');
        inner.split('_').forEach(part => tokens.push(part));
      } else {
        tokens.push(tok);
      }
    });

    return {
      original: sentence,
      tokens: tokens,
      isQuestion: isQuestion
    };
  }

  /**
   * Stage 2: Nigerian Sign Language Grammar Rules
   * Rule A: Time markers move to the FRONT
   * Rule B: Stop words ('the', 'is', 'a') are discarded
   * Rule C: Interrogative Question words ('where', 'what') move to the END
   * Rule D: Negation words ('not', 'no') move to the END of the clause
   */
  applyNslGrammarRules({ tokens, isQuestion }) {
    const timeBucket = [];
    const topicBucket = [];
    const questionBucket = [];
    const negationBucket = [];

    tokens.forEach((token) => {
      if (this.timeWords.has(token)) {
        timeBucket.push(token);
      } else if (this.questionWords.has(token)) {
        questionBucket.push(token);
      } else if (this.negationWords.has(token)) {
        negationBucket.push(token);
      } else if (!this.stopWords.has(token)) {
        topicBucket.push(token);
      }
    });

    // Synthesize in NSL order: [TIME] -> [TOPIC / COMMENT] -> [NEGATION] -> [QUESTION]
    const nslOrder = [...timeBucket, ...topicBucket, ...negationBucket, ...questionBucket];
    return nslOrder.length > 0 ? nslOrder : tokens;
  }

  createEmptySequence() {
    return {
      translationId: `nsl-tx-${Date.now()}`,
      source: { text: '', language: 'en' },
      target: { language: 'NSL', dialect: 'Standard Nigerian Sign Language' },
      gloss: [],
      nonManualMarkers: { facialExpression: 'neutral', headMovement: 'neutral', bodyShift: 'neutral' },
      signSequence: []
    };
  }
}

export const nslTranslator = new NslTranslator();
