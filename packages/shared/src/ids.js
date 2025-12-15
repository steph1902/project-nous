"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserId = generateUserId;
exports.generateOrgId = generateOrgId;
exports.generateWorkflowId = generateWorkflowId;
exports.generateWorkflowVersionId = generateWorkflowVersionId;
exports.generateRunId = generateRunId;
exports.generateRunNodeId = generateRunNodeId;
exports.generateArtifactId = generateArtifactId;
exports.generateIntegrationId = generateIntegrationId;
exports.generateApiKeyId = generateApiKeyId;
exports.generateKbDocumentId = generateKbDocumentId;
exports.generateKbChunkId = generateKbChunkId;
exports.generateCandidateId = generateCandidateId;
exports.generateSubmissionId = generateSubmissionId;
exports.generateAuditEventId = generateAuditEventId;
exports.generatePromptTemplateId = generatePromptTemplateId;
exports.generateIdempotencyId = generateIdempotencyId;
exports.generateRequestId = generateRequestId;
exports.parseIdPrefix = parseIdPrefix;
exports.validateIdPrefix = validateIdPrefix;
const crypto = __importStar(require("crypto"));
function generateId(prefix, bytes = 12) {
    return `${prefix}_${crypto.randomBytes(bytes).toString('hex')}`;
}
function generateUserId() {
    return generateId('usr');
}
function generateOrgId() {
    return generateId('org');
}
function generateWorkflowId() {
    return generateId('wf');
}
function generateWorkflowVersionId() {
    return generateId('wfv');
}
function generateRunId() {
    return generateId('run');
}
function generateRunNodeId() {
    return generateId('rn');
}
function generateArtifactId() {
    return generateId('art');
}
function generateIntegrationId() {
    return generateId('int');
}
function generateApiKeyId() {
    return generateId('ak');
}
function generateKbDocumentId() {
    return generateId('doc');
}
function generateKbChunkId() {
    return generateId('chk');
}
function generateCandidateId() {
    return generateId('cand');
}
function generateSubmissionId() {
    return generateId('sub');
}
function generateAuditEventId() {
    return generateId('evt');
}
function generatePromptTemplateId() {
    return generateId('pt');
}
function generateIdempotencyId() {
    return generateId('idem');
}
function generateRequestId() {
    return generateId('req', 8);
}
function parseIdPrefix(id) {
    const parts = id.split('_');
    return parts.length >= 2 ? parts[0] : null;
}
function validateIdPrefix(id, expectedPrefix) {
    return parseIdPrefix(id) === expectedPrefix;
}
//# sourceMappingURL=ids.js.map