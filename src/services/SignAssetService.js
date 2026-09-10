import nslSignsData from '../data/nsl_signs_db.json';
import { NSL_ALPHABET } from '../data/nsl_vocabulary.js';

export class SignAssetService {
  constructor() {
    this.signs = Array.isArray(nslSignsData) ? nslSignsData : [];
    this.glossIndex = new Map();
    this.idIndex = new Map();

    this.initIndexes();
  }

  initIndexes() {
    this.signs.forEach((sign) => {
      this.idIndex.set(sign.id, sign);
      if (sign.gloss) {
        this.glossIndex.set(sign.gloss.toUpperCase(), sign);
      }
      // Also index alternative sign labels
      if (sign.signName) {
        this.glossIndex.set(sign.signName.toUpperCase(), sign);
      }
    });
  }

  getAllSigns() {
    return this.signs;
  }

  getSignById(id) {
    return this.idIndex.get(id) || null;
  }

  getSignByGloss(gloss) {
    if (!gloss) return null;
    return this.glossIndex.get(gloss.toUpperCase()) || null;
  }

  /**
   * Search for signs matching text, keywords, or categories
   */
  searchSigns(query) {
    if (!query) return this.signs;
    const q = query.toLowerCase().trim();

    return this.signs.filter((sign) => {
      return (
        sign.signName.toLowerCase().includes(q) ||
        sign.gloss.toLowerCase().includes(q) ||
        sign.nslMeaning.toLowerCase().includes(q) ||
        sign.category.toLowerCase().includes(q) ||
        (sign.tags && sign.tags.some(t => t.toLowerCase().includes(q)))
      );
    });
  }

  getSignByCategory(category) {
    if (!category || category === 'all') return this.signs;
    return this.signs.filter((sign) => sign.category === category);
  }

  /**
   * Resolve an individual token or word into a verified sign or fingerspelling asset
   */
  resolveToken(token) {
    const upper = token.toUpperCase().trim();

    // 1. Direct gloss match in verified NSL database
    const directSign = this.getSignByGloss(upper);
    if (directSign) {
      return {
        matched: true,
        type: 'sign',
        gloss: directSign.gloss,
        sign: directSign,
        fallbackStrategy: 'exact_sign'
      };
    }

    // 2. Fallback: Letter-by-letter fingerspelling
    const letters = [];
    for (const char of upper) {
      if (NSL_ALPHABET[char]) {
        letters.push({
          letter: char,
          description: NSL_ALPHABET[char].desc,
          keyframeData: NSL_ALPHABET[char]
        });
      }
    }

    return {
      matched: false,
      type: 'fingerspell',
      gloss: upper,
      letters: letters,
      fallbackStrategy: 'explicit_fingerspell'
    };
  }
}

// Singleton export
export const signAssetService = new SignAssetService();
