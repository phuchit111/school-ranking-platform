/**
 * @typedef {Object} School
 * @property {string} id
 * @property {string} name
 * @property {string} nameEn
 * @property {string} province
 * @property {string} affiliation
 * @property {string} level
 * @property {string} website
 * @property {string} contact
 * @property {string|null} logoUrl
 * @property {string|null} [bannerUrl]
 * @property {string|null} [certificatePdfUrl]
 * @property {string} [description]
 * @property {string} [address]
 * @property {string} [phone]
 * @property {string} [facebookUrl]
 * @property {string} [lineId]
 * @property {boolean} isPublished
 * @property {Ranking} [ranking]
 * @property {Score} [scores]
 * @property {SchoolGalleryImage[]} [galleryImages]
 * @property {SchoolCertificate[]} [certificates]
 */

/**
 * @typedef {Object} SchoolGalleryImage
 * @property {string} id
 * @property {string} schoolId
 * @property {string} url
 * @property {string} caption
 * @property {number} sortOrder
 * @property {string} createdAt
 */

/**
 * @typedef {Object} SchoolCertificate
 * @property {string} id
 * @property {string} schoolId
 * @property {string} title
 * @property {string} fileUrl
 * @property {'image'|'pdf'} fileType
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Score
 * @property {string} id
 * @property {string} schoolId
 * @property {number} a1 @property {number} a2 @property {number} a3 @property {number} a4 @property {number} a5
 * @property {number} b1 @property {number} b2 @property {number} b3 @property {number} b4 @property {number} b5
 * @property {number} c1 @property {number} c2 @property {number} c3 @property {number} c4 @property {number} c5
 * @property {number} d1 @property {number} d2 @property {number} d3 @property {number} d4 @property {number} d5
 * @property {number} e1 @property {number} e2 @property {number} e3 @property {number} e4 @property {number} e5
 */

/**
 * @typedef {Object} Ranking
 * @property {string} id
 * @property {string} schoolId
 * @property {number} scoreA
 * @property {number} scoreB
 * @property {number} scoreC
 * @property {number} scoreD
 * @property {number} scoreE
 * @property {number} totalScore
 * @property {'A'|'B'|'C'|'D'|'E'} level
 * @property {number} rank
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {any[]} data
 * @property {number} total
 * @property {number} page
 * @property {number} limit
 */
