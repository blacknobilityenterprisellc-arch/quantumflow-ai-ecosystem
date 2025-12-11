#!/bin/bash

# 🚀 QuantumFlow Performance Testing Script
# Tests Prometheus metrics performance under load

set -e

# Configuration
MONITORING_SERVICE_URL="http://localhost:3003"
QUANTUM_SERVICE_URL="http://localhost:3005"
API_GATEWAY_URL="http://localhost:3000"
LOAD_TEST_DURATION=60
CONCURRENT_USERS=50
REQUESTS_PER_USER=100

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 QuantumFlow Performance Testing Suite${NC}"
echo "=========================================="
echo ""

# Function to check if service is running
check_service() {
    local url=$1
    local service_name=$2
    
    echo -e "${YELLOW}Checking $service_name...${NC}"
    if curl -f -s "$url/health" > /dev/null; then
        echo -e "${GREEN}✅ $service_name is running${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name is not running${NC}"
        return 1
    fi
}

# Function to test metrics endpoint performance
test_metrics_performance() {
    local url=$1
    local service_name=$2
    local duration=$3
    
    echo -e "${YELLOW}Testing $service_name metrics performance...${NC}"
    
    # Test single request latency
    local start_time=$(date +%s%N)
    curl -s "$url/metrics" > /dev/null
    local end_time=$(date +%s%N)
    local latency=$((($end_time - $start_time) / 1000000)) # Convert to milliseconds
    
    echo "📊 Single request latency: ${latency}ms"
    
    # Test sustained load
    echo -e "${BLUE}Running sustained load test for ${duration}s...${NC}"
    
    local total_requests=0
    local successful_requests=0
    local start_time=$(date +%s)
    local end_time=$(($start_time + $duration))
    
    while [ $(date +%s) -lt $end_time ]; do
        # Make concurrent requests
        for i in {1..10}; do
            (
                if curl -f -s "$url/metrics" > /dev/null; then
                    echo "SUCCESS" >> "/tmp/${service_name}_success.txt"
                else
                    echo "FAILED" >> "/tmp/${service_name}_failed.txt"
                fi
            ) &
            total_requests=$((total_requests + 1))
        done
        wait
        sleep 0.1
    done
    
    # Count results
    successful_requests=$(wc -l < "/tmp/${service_name}_success.txt" 2>/dev/null || echo 0)
    local failed_requests=$(wc -l < "/tmp/${service_name}_failed.txt" 2>/dev/null || echo 0)
    
    # Calculate metrics
    local success_rate=$(echo "scale=2; $successful_requests * 100 / $total_requests" | bc)
    local requests_per_second=$(echo "scale=2; $total_requests / $duration" | bc)
    
    echo -e "${GREEN}📈 Performance Results for $service_name:${NC}"
    echo "   Total Requests: $total_requests"
    echo "   Successful: $successful_requests"
    echo "   Failed: $failed_requests"
    echo "   Success Rate: ${success_rate}%"
    echo "   Requests/Second: $requests_per_second"
    echo ""
    
    # Cleanup
    rm -f "/tmp/${service_name}_success.txt" "/tmp/${service_name}_failed.txt"
    
    # Return success rate for validation
    echo $success_rate
}

# Function to test quantum algorithm performance
test_quantum_algorithms() {
    echo -e "${YELLOW}Testing quantum algorithm performance...${NC}"
    
    # Test coherence calculation
    local start_time=$(date +%s%N)
    local coherence_response=$(curl -s "$QUANTUM_SERVICE_URL/api/quantum-service/coherence")
    local end_time=$(date +%s%N)
    local latency=$((($end_time - $start_time) / 1000000))
    
    if echo "$coherence_response" | jq -e '.quantumCoherence' > /dev/null; then
        echo -e "${GREEN}✅ Coherence calculation: ${latency}ms${NC}"
    else
        echo -e "${RED}❌ Coherence calculation failed${NC}"
    fi
    
    # Test quantum optimization
    start_time=$(date +%s%N)
    local optimization_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"parameters": [1, 2, 3, 4], "iterations": 50}' \
        "$QUANTUM_SERVICE_URL/api/quantum-service/optimize")
    end_time=$(date +%s%N)
    latency=$((($end_time - $start_time) / 1000000))
    
    if echo "$optimization_response" | jq -e '.result' > /dev/null; then
        echo -e "${GREEN}✅ Quantum optimization: ${latency}ms${NC}"
    else
        echo -e "${RED}❌ Quantum optimization failed${NC}"
    fi
    
    # Test quantum simulation
    start_time=$(date +%s%N)
    local simulation_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"qubits": 2, "gates": ["H", "CNOT"], "shots": 1000}' \
        "$QUANTUM_SERVICE_URL/api/quantum-service/simulate")
    end_time=$(date +%s%N)
    latency=$((($end_time - $start_time) / 1000000))
    
    if echo "$simulation_response" | jq -e '.simulation' > /dev/null; then
        echo -e "${GREEN}✅ Quantum simulation: ${latency}ms${NC}"
    else
        echo -e "${RED}❌ Quantum simulation failed${NC}"
    fi
    
    echo ""
}

# Function to test system health aggregation
test_system_health() {
    echo -e "${YELLOW}Testing system health aggregation...${NC}"
    
    local start_time=$(date +%s%N)
    local health_response=$(curl -s "$MONITORING_SERVICE_URL/api/monitoring-service/system-health")
    local end_time=$(date +%s%N)
    local latency=$((($end_time - $start_time) / 1000000))
    
    if echo "$health_response" | jq -e '.overallHealth' > /dev/null; then
        echo -e "${GREEN}✅ System health aggregation: ${latency}ms${NC}"
        
        local overall_health=$(echo "$health_response" | jq -r '.overallHealth')
        echo "   Overall Health: $overall_health"
        
        if (( $(echo "$overall_health > 90" | bc -l) )); then
            echo -e "${GREEN}   Status: Excellent${NC}"
        elif (( $(echo "$overall_health > 80" | bc -l) )); then
            echo -e "${YELLOW}   Status: Good${NC}"
        else
            echo -e "${RED}   Status: Degraded${NC}"
        fi
    else
        echo -e "${RED}❌ System health aggregation failed${NC}"
    fi
    
    echo ""
}

# Function to run comprehensive load test
run_load_test() {
    echo -e "${BLUE}🏋️ Running Comprehensive Load Test${NC}"
    echo "Duration: ${LOAD_TEST_DURATION}s"
    echo "Concurrent Users: $CONCURRENT_USERS"
    echo "Requests per User: $REQUESTS_PER_USER"
    echo ""
    
    # Create temporary files for results
    local results_file="/tmp/load_test_results.txt"
    > "$results_file"
    
    # Start load test in background
    for ((i=1; i<=CONCURRENT_USERS; i++)); do
        (
            local user_success=0
            local user_failed=0
            
            for ((j=1; j<=REQUESTS_PER_USER; j++)); do
                # Randomly test different endpoints
                local endpoint_choice=$((RANDOM % 4))
                
                case $endpoint_choice in
                    0)
                        if curl -f -s "$MONITORING_SERVICE_URL/metrics" > /dev/null; then
                            user_success=$((user_success + 1))
                        else
                            user_failed=$((user_failed + 1))
                        fi
                        ;;
                    1)
                        if curl -f -s "$QUANTUM_SERVICE_URL/metrics" > /dev/null; then
                            user_success=$((user_success + 1))
                        else
                            user_failed=$((user_failed + 1))
                        fi
                        ;;
                    2)
                        if curl -f -s "$QUANTUM_SERVICE_URL/api/quantum-service/coherence" > /dev/null; then
                            user_success=$((user_success + 1))
                        else
                            user_failed=$((user_failed + 1))
                        fi
                        ;;
                    3)
                        if curl -f -s "$MONITORING_SERVICE_URL/api/monitoring-service/system-health" > /dev/null; then
                            user_success=$((user_success + 1))
                        else
                            user_failed=$((user_failed + 1))
                        fi
                        ;;
                esac
                
                # Small delay between requests
                sleep 0.01
            done
            
            echo "User $i: $user_success success, $user_failed failed" >> "$results_file"
        ) &
    done
    
    # Wait for all users to complete
    wait
    
    # Analyze results
    echo -e "${GREEN}📊 Load Test Results:${NC}"
    
    local total_success=$(awk '{sum += $3} END {print sum}' "$results_file")
    local total_failed=$(awk '{sum += $5} END {print sum}' "$results_file")
    local total_requests=$((total_success + total_failed))
    local overall_success_rate=$(echo "scale=2; $total_success * 100 / $total_requests" | bc)
    
    echo "   Total Requests: $total_requests"
    echo "   Total Successful: $total_success"
    echo "   Total Failed: $total_failed"
    echo "   Overall Success Rate: ${overall_success_rate}%"
    
    # Calculate requests per second
    local total_time=$LOAD_TEST_DURATION
    local requests_per_second=$(echo "scale=2; $total_requests / $total_time" | bc)
    echo "   Average Requests/Second: $requests_per_second"
    
    echo ""
    
    # Performance validation
    if (( $(echo "$overall_success_rate >= 95" | bc -l) )); then
        echo -e "${GREEN}✅ Load test PASSED - Excellent performance${NC}"
        return 0
    elif (( $(echo "$overall_success_rate >= 90" | bc -l) )); then
        echo -e "${YELLOW}⚠️ Load test PASSED - Good performance${NC}"
        return 0
    else
        echo -e "${RED}❌ Load test FAILED - Poor performance${NC}"
        return 1
    fi
}

# Function to validate metrics quality
validate_metrics_quality() {
    echo -e "${YELLOW}Validating metrics quality...${NC}"
    
    # Get metrics from both services
    local monitoring_metrics=$(curl -s "$MONITORING_SERVICE_URL/metrics")
    local quantum_metrics=$(curl -s "$QUANTUM_SERVICE_URL/metrics")
    
    # Check for required metrics
    local required_metrics=(
        "http_requests_total"
        "http_request_duration_seconds"
        "system_health_score"
        "quantum_coherence_level"
        "quantum_algorithm_performance_seconds"
    )
    
    local missing_metrics=0
    
    for metric in "${required_metrics[@]}"; do
        if ! echo "$monitoring_metrics$quantum_metrics" | grep -q "^$metric"; then
            echo -e "${RED}❌ Missing required metric: $metric${NC}"
            missing_metrics=$((missing_metrics + 1))
        else
            echo -e "${GREEN}✅ Found metric: $metric${NC}"
        fi
    done
    
    # Check for proper metric labels
    local properly_labeled=0
    local total_metrics=$(echo "$monitoring_metrics$quantum_metrics" | grep -c "^# HELP")
    
    # Count metrics with service label
    local service_labeled=$(echo "$monitoring_metrics$quantum_metrics" | grep "service=" | wc -l)
    
    if [ $service_labeled -gt $((total_metrics / 2)) ]; then
        echo -e "${GREEN}✅ Most metrics have proper service labels${NC}"
        properly_labeled=1
    else
        echo -e "${YELLOW}⚠️ Some metrics may be missing service labels${NC}"
    fi
    
    echo ""
    
    if [ $missing_metrics -eq 0 ] && [ $properly_labeled -eq 1 ]; then
        echo -e "${GREEN}✅ Metrics quality validation PASSED${NC}"
        return 0
    else
        echo -e "${RED}❌ Metrics quality validation FAILED${NC}"
        return 1
    fi
}

# Main execution
main() {
    echo -e "${BLUE}Starting QuantumFlow Performance Testing...${NC}"
    echo ""
    
    # Check if all services are running
    local services_running=true
    
    if ! check_service "$MONITORING_SERVICE_URL" "Monitoring Service"; then
        services_running=false
    fi
    
    if ! check_service "$QUANTUM_SERVICE_URL" "Quantum Service"; then
        services_running=false
    fi
    
    if [ "$services_running" = false ]; then
        echo -e "${RED}❌ Some services are not running. Please start all services before testing.${NC}"
        exit 1
    fi
    
    echo ""
    
    # Run individual performance tests
    local monitoring_success_rate=$(test_metrics_performance "$MONITORING_SERVICE_URL" "Monitoring Service" 30)
    local quantum_success_rate=$(test_metrics_performance "$QUANTUM_SERVICE_URL" "Quantum Service" 30)
    
    # Test quantum algorithms
    test_quantum_algorithms
    
    # Test system health
    test_system_health
    
    # Validate metrics quality
    validate_metrics_quality
    
    # Run comprehensive load test
    echo -e "${BLUE}🚀 Starting Comprehensive Load Test...${NC}"
    if run_load_test; then
        load_test_passed=true
    else
        load_test_passed=false
    fi
    
    # Final summary
    echo -e "${BLUE}📋 Performance Test Summary${NC}"
    echo "================================"
    
    if (( $(echo "$monitoring_success_rate >= 95" | bc -l) )); then
        echo -e "${GREEN}✅ Monitoring Service Performance: EXCELLENT${NC}"
    elif (( $(echo "$monitoring_success_rate >= 90" | bc -l) )); then
        echo -e "${YELLOW}⚠️ Monitoring Service Performance: GOOD${NC}"
    else
        echo -e "${RED}❌ Monitoring Service Performance: POOR${NC}"
    fi
    
    if (( $(echo "$quantum_success_rate >= 95" | bc -l) )); then
        echo -e "${GREEN}✅ Quantum Service Performance: EXCELLENT${NC}"
    elif (( $(echo "$quantum_success_rate >= 90" | bc -l) )); then
        echo -e "${YELLOW}⚠️ Quantum Service Performance: GOOD${NC}"
    else
        echo -e "${RED}❌ Quantum Service Performance: POOR${NC}"
    fi
    
    if [ "$load_test_passed" = true ]; then
        echo -e "${GREEN}✅ Load Test: PASSED${NC}"
    else
        echo -e "${RED}❌ Load Test: FAILED${NC}"
    fi
    
    echo ""
    
    # Overall result
    if [ "$load_test_passed" = true ] && \
       (( $(echo "$monitoring_success_rate >= 90" | bc -l) )) && \
       (( $(echo "$quantum_success_rate >= 90" | bc -l) )); then
        echo -e "${GREEN}🎉 OVERALL PERFORMANCE TEST: PASSED${NC}"
        echo -e "${GREEN}QuantumFlow monitoring system is performing excellently!${NC}"
        exit 0
    else
        echo -e "${RED}❌ OVERALL PERFORMANCE TEST: FAILED${NC}"
        echo -e "${RED}Some performance issues detected. Please review the results above.${NC}"
        exit 1
    fi
}

# Check if required tools are installed
check_dependencies() {
    local missing_deps=()
    
    if ! command -v curl &> /dev/null; then
        missing_deps+=("curl")
    fi
    
    if ! command -v jq &> /dev/null; then
        missing_deps+=("jq")
    fi
    
    if ! command -v bc &> /dev/null; then
        missing_deps+=("bc")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing dependencies: ${missing_deps[*]}${NC}"
        echo "Please install the missing dependencies and try again."
        exit 1
    fi
}

# Run dependency check
check_dependencies

# Execute main function
main "$@"