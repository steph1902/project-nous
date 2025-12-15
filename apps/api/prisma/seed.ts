import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function generateId(prefix: string): string {
    return `${prefix}_${crypto.randomBytes(12).toString('hex')}`;
}

async function main() {
    console.log('🌱 Seeding database...');

    // Create demo user
    const user = await prisma.user.upsert({
        where: { email: 'demo@nous.ai' },
        update: {},
        create: {
            id: generateId('usr'),
            email: 'demo@nous.ai',
            name: 'Demo User',
        },
    });
    console.log('✅ Created demo user:', user.email);

    // Create demo organization
    const org = await prisma.org.upsert({
        where: { id: 'org_demo' },
        update: {},
        create: {
            id: 'org_demo',
            name: 'Demo Organization',
        },
    });
    console.log('✅ Created demo org:', org.name);

    // Create membership
    await prisma.orgMember.upsert({
        where: { orgId_userId: { orgId: org.id, userId: user.id } },
        update: {},
        create: {
            orgId: org.id,
            userId: user.id,
            role: 'OWNER',
        },
    });
    console.log('✅ Created owner membership');

    // Create demo workflow
    const workflow = await prisma.workflow.upsert({
        where: { id: 'wf_hr_scoring_demo' },
        update: {},
        create: {
            id: 'wf_hr_scoring_demo',
            orgId: org.id,
            name: 'HR Candidate Scoring',
            description: 'Score candidates based on form submissions using AI',
            createdBy: user.id,
        },
    });
    console.log('✅ Created demo workflow:', workflow.name);

    // Create workflow version
    await prisma.workflowVersion.upsert({
        where: { id: 'wfv_hr_scoring_v1' },
        update: {},
        create: {
            id: 'wfv_hr_scoring_v1',
            workflowId: workflow.id,
            version: 1,
            status: 'PUBLISHED',
            createdBy: user.id,
            dagJson: {
                nodes: [
                    { key: 'trigger', type: 'manual', config: {} },
                    {
                        key: 'rag_rubric',
                        type: 'rag_query',
                        config: { query: 'interview scoring rubric', topK: 5 },
                    },
                    {
                        key: 'score',
                        type: 'agent_task',
                        config: { promptTemplate: 'hr_score_v1' },
                    },
                    {
                        key: 'notify',
                        type: 'tool_slack',
                        config: { channel: '#hr-alerts' },
                    },
                ],
                edges: [
                    { from: 'trigger', to: 'rag_rubric' },
                    { from: 'rag_rubric', to: 'score' },
                    { from: 'score', to: 'notify' },
                ],
            },
        },
    });
    console.log('✅ Created workflow version');

    // Create demo candidates
    const candidates = [
        { name: 'Alex Chen', email: 'alex@example.com' },
        { name: 'Jordan Smith', email: 'jordan@example.com' },
        { name: 'Taylor Kim', email: 'taylor@example.com' },
    ];

    for (const c of candidates) {
        const emailHash = crypto.createHash('sha256').update(c.email).digest('hex');

        const candidate = await prisma.hrCandidate.create({
            data: {
                id: generateId('cand'),
                orgId: org.id,
                name: c.name,
                emailHash,
            },
        });

        await prisma.hrSubmission.create({
            data: {
                id: generateId('sub'),
                candidateId: candidate.id,
                formVersion: '2025-01',
                answersJson: {
                    experience: '5 years in software development',
                    skills: 'TypeScript, React, Node.js, PostgreSQL',
                    motivation: 'Excited about AI and automation',
                    availability: '2 weeks notice',
                },
            },
        });

        console.log('✅ Created candidate:', c.name);
    }

    // Create prompt template
    const promptTemplate = await prisma.promptTemplate.upsert({
        where: { orgId_name: { orgId: org.id, name: 'hr_score_v1' } },
        update: {},
        create: {
            id: generateId('pt'),
            orgId: org.id,
            name: 'hr_score_v1',
        },
    });

    await prisma.promptTemplateVersion.upsert({
        where: {
            templateId_version: { templateId: promptTemplate.id, version: 1 },
        },
        update: {},
        create: {
            id: generateId('ptv'),
            templateId: promptTemplate.id,
            version: 1,
            content: `You are an HR scoring assistant. Evaluate the candidate based on their answers.

Scoring Rubric:
- Experience (0-25): Evaluate years and relevance
- Technical Skills (0-25): Evaluate skill match
- Communication (0-25): Evaluate clarity and professionalism
- Culture Fit (0-25): Evaluate alignment with company values

Return a JSON object with:
- overall: total score (0-100)
- categories: { experience, skills, communication, cultureFit }
- summary: 150-250 word assessment
- redFlags: array of concerns`,
            schemaJson: {
                type: 'object',
                properties: {
                    overall: { type: 'number', minimum: 0, maximum: 100 },
                    categories: {
                        type: 'object',
                        properties: {
                            experience: { type: 'number' },
                            skills: { type: 'number' },
                            communication: { type: 'number' },
                            cultureFit: { type: 'number' },
                        },
                    },
                    summary: { type: 'string' },
                    redFlags: { type: 'array', items: { type: 'string' } },
                },
                required: ['overall', 'categories', 'summary', 'redFlags'],
            },
        },
    });
    console.log('✅ Created prompt template');

    console.log('🎉 Seed complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
