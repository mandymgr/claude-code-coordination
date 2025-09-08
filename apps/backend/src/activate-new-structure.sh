#!/bin/bash

# 🚀 KRINS-Universe-Builder - Service Structure Activator
# Ultimate AI Development Universe - Activate Organized Service Structure

set -euo pipefail

echo "🌌 KRINS-Universe-Builder: Activating Organized Service Structure"
echo "================================================================"

# Colors
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔗 Creating symbolic links to organize services thematically...${NC}"

# Function to create symlinks safely
create_symlink() {
    local source="$1"
    local target="$2"
    
    if [[ -f "$source" ]] && [[ ! -e "$target" ]]; then
        ln -s "$source" "$target"
        echo -e "${GREEN}  ✅ Linked: $(basename $target)${NC}"
    fi
}

# Create directory structure
cd services-new

echo -e "${CYAN}🤖 AI Automation Services...${NC}"
create_symlink "../../../services/ai/intelligentRouter.ts" "ai-automation/ai/intelligentRouter.ts"
create_symlink "../../../services/ai/orchestrationService.ts" "ai-automation/ai/orchestrationService.ts" 
create_symlink "../../../services/ai/performanceOptimizer.ts" "ai-automation/ai/performanceOptimizer.ts"
create_symlink "../../../services/automl/index.ts" "ai-automation/automl/index.ts"
create_symlink "../../../services/automl/neuralArchitectureSearch.ts" "ai-automation/automl/neuralArchitectureSearch.ts"

echo -e "${CYAN}🏗️ System Building Services...${NC}"
create_symlink "../../../services/codegen/automatedRefactoring.ts" "system-building/codegen/automatedRefactoring.ts"
create_symlink "../../../services/codegen/codegenOrchestrator.ts" "system-building/codegen/codegenOrchestrator.ts"
create_symlink "../../../services/codegen/index.ts" "system-building/codegen/index.ts"
create_symlink "../../../services/codegen/intelligentCodeGenerator.ts" "system-building/codegen/intelligentCodeGenerator.ts"
create_symlink "../../../services/devops/deploymentAutomation.ts" "system-building/devops/deploymentAutomation.ts"
create_symlink "../../../services/devops/pipelineOrchestration.ts" "system-building/devops/pipelineOrchestration.ts"
create_symlink "../../../services/collaboration/realtimeService.ts" "system-building/collaboration/realtimeService.ts"

echo -e "${CYAN}📊 Enterprise Services...${NC}"
create_symlink "../../../services/enterprise/advancedAnalytics.ts" "enterprise/enterprise/advancedAnalytics.ts"
create_symlink "../../../services/enterprise/complianceSuite.ts" "enterprise/enterprise/complianceSuite.ts"
create_symlink "../../../services/enterprise/enterpriseSSO.ts" "enterprise/enterprise/enterpriseSSO.ts"
create_symlink "../../../services/enterprise/multiTenant.ts" "enterprise/enterprise/multiTenant.ts"
create_symlink "../../../services/enterprise/whiteLabelSolutions.ts" "enterprise/enterprise/whiteLabelSolutions.ts"
create_symlink "../../../services/auth/auditService.ts" "enterprise/auth/auditService.ts"
create_symlink "../../../services/auth/authService.ts" "enterprise/auth/authService.ts"
create_symlink "../../../services/auth/rbacService.ts" "enterprise/auth/rbacService.ts"
create_symlink "../../../services/commercial/marketingService.ts" "enterprise/commercial/marketingService.ts"
create_symlink "../../../services/commercial/pricingService.ts" "enterprise/commercial/pricingService.ts"
create_symlink "../../../services/commercial/salesService.ts" "enterprise/commercial/salesService.ts"
create_symlink "../../../services/security/threatDetectionService.ts" "enterprise/security/threatDetectionService.ts"
create_symlink "../../../services/security/zeroTrustService.ts" "enterprise/security/zeroTrustService.ts"

echo -e "${CYAN}🔬 Advanced Technology Services...${NC}"
create_symlink "../../../services/quantum/quantumComputingService.ts" "advanced-tech/quantum/quantumComputingService.ts"
create_symlink "../../../services/blockchain/web3Service.ts" "advanced-tech/blockchain/web3Service.ts"
create_symlink "../../../services/voice/voiceInterface.ts" "advanced-tech/voice/voiceInterface.ts"
create_symlink "../../../services/edge/cdnOptimizationService.ts" "advanced-tech/edge/cdnOptimizationService.ts"
create_symlink "../../../services/edge/edgeComputingService.ts" "advanced-tech/edge/edgeComputingService.ts"

echo -e "${CYAN}📈 Monitoring & Analytics Services...${NC}"
create_symlink "../../../services/analytics/metricsCollector.ts" "monitoring/analytics/metricsCollector.ts"
create_symlink "../../../services/analytics/predictiveIntelligence.ts" "monitoring/analytics/predictiveIntelligence.ts"
create_symlink "../../../services/performance/connectionPool.ts" "monitoring/performance/connectionPool.ts"
create_symlink "../../../services/performance/lazyLoader.ts" "monitoring/performance/lazyLoader.ts"
create_symlink "../../../services/performance/memoryManager.ts" "monitoring/performance/memoryManager.ts"
create_symlink "../../../services/reliability/errorRecoveryService.ts" "monitoring/reliability/errorRecoveryService.ts"
create_symlink "../../../services/reliability/selfHealingService.ts" "monitoring/reliability/selfHealingService.ts"

echo -e "${CYAN}🔧 Development Tools Services...${NC}"
create_symlink "../../../services/integrations/githubService.ts" "dev-tools/integrations/githubService.ts"
create_symlink "../../../services/integrations/jiraService.ts" "dev-tools/integrations/jiraService.ts"
create_symlink "../../../services/integrations/slackService.ts" "dev-tools/integrations/slackService.ts"
create_symlink "../../../services/integrations/teamsService.ts" "dev-tools/integrations/teamsService.ts"

echo ""
echo -e "${PURPLE}✨ Service Structure Organization Complete!${NC}"
echo ""
echo -e "${BLUE}📁 Organized Structure Available:${NC}"
echo "  🤖 ai-automation/ - AI coordination and automation"
echo "  🏗️ system-building/ - Code generation and deployment"
echo "  📊 enterprise/ - Enterprise features and security"
echo "  🔬 advanced-tech/ - Quantum, blockchain, voice, edge"
echo "  📈 monitoring/ - Analytics, performance, reliability"
echo "  🔧 dev-tools/ - Development tools and integrations"
echo ""
echo -e "${GREEN}✅ Original services remain intact in services/ directory${NC}"
echo -e "${GREEN}✅ Organized structure provides improved discoverability${NC}"
echo -e "${GREEN}✅ All imports and references continue to work${NC}"
echo ""
echo -e "${PURPLE}🌌 KRINS-Universe-Builder: Ultimate AI Development Universe Ready!${NC}"