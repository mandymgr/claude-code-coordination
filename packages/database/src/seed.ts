#!/usr/bin/env tsx

import { db } from './client.js'
import { v4 as uuidv4 } from 'uuid'

async function seed() {
  console.log('🌱 Starting database seed...')

  try {
    // Create admin user
    const adminUser = await db.user.create({
      data: {
        id: uuidv4(),
        email: 'admin@krins-universe.com',
        name: 'KRINS Admin',
        role: 'ADMIN',
        avatar: 'https://ui.shadcn.com/avatars/01.png'
      }
    })

    console.log('✅ Created admin user:', adminUser.email)

    // Create demo user
    const demoUser = await db.user.create({
      data: {
        id: uuidv4(),
        email: 'demo@krins-universe.com',
        name: 'Demo Developer',
        role: 'DEVELOPER',
        avatar: 'https://ui.shadcn.com/avatars/02.png'
      }
    })

    console.log('✅ Created demo user:', demoUser.email)

    // Create AI Team
    const aiTeam = await db.aITeam.create({
      data: {
        id: uuidv4(),
        name: 'Default AI Team',
        description: 'Multi-AI coordination team for KRINS Universe',
        status: 'ACTIVE',
        strategy: {
          assignment: 'specialized',
          fallback: 'escalate',
          coordination: {
            maxConcurrent: 5,
            timeout: 300000,
            retries: 3
          }
        },
        preferences: {
          costOptimization: true,
          qualityFirst: true,
          speedOptimization: false
        }
      }
    })

    console.log('✅ Created AI team:', aiTeam.name)

    // Add AI team members
    const aiMembers = [
      {
        role: 'LEAD' as const,
        aiProvider: 'CLAUDE' as const,
        model: 'claude-3-opus',
        specialties: {
          areas: ['frontend', 'ui-ux', 'documentation'],
          strength: 0.95
        }
      },
      {
        role: 'SPECIALIST' as const,
        aiProvider: 'OPENAI' as const,
        model: 'gpt-4',
        specialties: {
          areas: ['backend', 'api', 'database'],
          strength: 0.92
        }
      },
      {
        role: 'SPECIALIST' as const,
        aiProvider: 'GOOGLE' as const,
        model: 'gemini-pro',
        specialties: {
          areas: ['devops', 'optimization', 'analysis'],
          strength: 0.88
        }
      }
    ]

    for (const member of aiMembers) {
      await db.teamMember.create({
        data: {
          id: uuidv4(),
          teamId: aiTeam.id,
          userId: adminUser.id,
          ...member
        }
      })
    }

    console.log('✅ Added AI team members')

    // Create demo projects
    const demoProject = await db.project.create({
      data: {
        id: uuidv4(),
        name: 'KRINS Universe Dashboard',
        description: 'Modern AI-powered development dashboard',
        status: 'ACTIVE',
        repository: 'https://github.com/mandymgr/krins-universe-dashboard',
        framework: 'Next.js',
        language: 'TypeScript',
        userId: demoUser.id
      }
    })

    console.log('✅ Created demo project:', demoProject.name)

    // Create sample tasks
    const sampleTasks = [
      {
        title: 'Implement Dark Mode Toggle',
        description: 'Add dark mode support to the dashboard with theme persistence',
        type: 'CODE_GENERATION' as const,
        priority: 'HIGH' as const,
        aiProvider: 'CLAUDE' as const,
        model: 'claude-3-opus',
        status: 'COMPLETED' as const,
        context: {
          files: ['src/components/ThemeProvider.tsx', 'src/styles/globals.css'],
          requirements: ['Toggle button', 'Theme persistence', 'CSS variables'],
          constraints: { timeLimit: 1800000 }
        }
      },
      {
        title: 'Add User Authentication',
        description: 'Implement secure user authentication with JWT tokens',
        type: 'CODE_GENERATION' as const,
        priority: 'HIGH' as const,
        aiProvider: 'OPENAI' as const,
        model: 'gpt-4',
        status: 'IN_PROGRESS' as const,
        context: {
          files: ['src/auth/', 'src/middleware/'],
          requirements: ['JWT tokens', 'Password hashing', 'Session management'],
          constraints: { timeLimit: 3600000 }
        }
      },
      {
        title: 'Optimize Bundle Size',
        description: 'Analyze and optimize application bundle size for better performance',
        type: 'OPTIMIZATION' as const,
        priority: 'MEDIUM' as const,
        aiProvider: 'GOOGLE' as const,
        model: 'gemini-pro',
        status: 'PENDING' as const,
        context: {
          requirements: ['Bundle analysis', 'Tree shaking', 'Code splitting'],
          constraints: { costLimit: 5.0 }
        }
      }
    ]

    for (const taskData of sampleTasks) {
      const task = await db.task.create({
        data: {
          id: uuidv4(),
          projectId: demoProject.id,
          userId: demoUser.id,
          ...taskData,
          ...(taskData.status === 'COMPLETED' && {
            completedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
            result: {
              success: true,
              message: 'Task completed successfully',
              artifacts: ['component.tsx', 'styles.css']
            },
            tokenUsage: Math.floor(Math.random() * 5000) + 1000,
            cost: parseFloat((Math.random() * 2 + 0.1).toFixed(2)),
            quality: Math.random() * 0.3 + 0.7,
            duration: Math.floor(Math.random() * 120000) + 30000
          })
        }
      })

      console.log('✅ Created task:', task.title)

      // Add quality gate for completed tasks
      if (taskData.status === 'COMPLETED') {
        await db.qualityGate.create({
          data: {
            id: uuidv4(),
            projectId: demoProject.id,
            taskId: task.id,
            name: 'Security & Quality Check',
            type: 'SECURITY_SCAN',
            status: 'PASSED',
            rules: {
              security: [
                { type: 'secret-scan', severity: 'high', enabled: true },
                { type: 'vulnerability-scan', severity: 'medium', enabled: true }
              ],
              lint: [
                { type: 'eslint', autoFix: true, config: {} }
              ]
            },
            score: Math.random() * 20 + 80, // 80-100
            issues: {
              security: [],
              lint: { warnings: 2, errors: 0 },
              build: { success: true }
            }
          }
        })
      }
    }

    console.log('✅ Created sample tasks and quality gates')

    // Create deployment history
    await db.deployment.create({
      data: {
        id: uuidv4(),
        projectId: demoProject.id,
        version: 'v1.0.0',
        status: 'DEPLOYED',
        environment: 'production',
        url: 'https://krins-universe-dashboard.vercel.app',
        config: {
          platform: 'vercel',
          buildCommand: 'npm run build',
          outputDirectory: 'dist'
        },
        deployedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    })

    console.log('✅ Created deployment history')

    console.log('🎉 Database seeded successfully!')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

// Run seed if called directly
if (process.argv[1]?.includes('seed')) {
  seed().catch((error) => {
    console.error('Seed script failed:', error)
    process.exit(1)
  })
}

export default seed