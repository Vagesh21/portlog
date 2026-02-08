#!/usr/bin/env python3
"""
Backend API Testing Script for Cybersecurity Portfolio
Tests all backend endpoints with realistic data
"""

import requests
import json
import time
from datetime import datetime
import sys
import os

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("❌ Could not find REACT_APP_BACKEND_URL in frontend/.env")
    sys.exit(1)

API_BASE = f"{BACKEND_URL}/api"
print(f"🔗 Testing backend at: {API_BASE}")

class BackendTester:
    def __init__(self):
        self.results = {
            'contact_api': {'passed': False, 'details': []},
            'analytics_track': {'passed': False, 'details': []},
            'analytics_stats': {'passed': False, 'details': []},
            'overall': {'passed': False, 'total_tests': 0, 'passed_tests': 0}
        }
        
    def log_result(self, test_name, success, message):
        """Log test result"""
        status = "✅" if success else "❌"
        print(f"{status} {test_name}: {message}")
        return success
        
    def test_contact_api(self):
        """Test POST /api/contact endpoint"""
        print("\n📧 Testing Contact Form API...")
        
        # Test data with realistic cybersecurity context
        test_contacts = [
            {
                "name": "Sarah Chen",
                "email": "sarah.chen@techcorp.com",
                "message": "Hi Vagesh, I'm impressed by your penetration testing portfolio. We have an opening for a senior security consultant. Would you be interested in discussing this opportunity?",
                "captcha_answer": "security"
            },
            {
                "name": "Marcus Rodriguez",
                "email": "m.rodriguez@cyberdefense.org",
                "message": "Your CISSP certification and red team experience caught my attention. I'd like to invite you to speak at our upcoming cybersecurity conference about advanced threat hunting techniques.",
                "captcha_answer": "cyber"
            },
            {
                "name": "Dr. Emily Watson",
                "email": "ewatson@university.edu",
                "message": "I'm researching blockchain security vulnerabilities and noticed your smart contract audit projects. Would you be available for a collaboration on our NSF-funded research?",
                "captcha_answer": "blockchain"
            }
        ]
        
        success_count = 0
        
        for i, contact_data in enumerate(test_contacts, 1):
            try:
                response = requests.post(
                    f"{API_BASE}/contact",
                    json=contact_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and 'message' in data:
                        success_count += 1
                        self.log_result(f"Contact Form {i}", True, f"Submitted successfully - {contact_data['name']}")
                        self.results['contact_api']['details'].append(f"Contact {i} submitted: {contact_data['name']}")
                    else:
                        self.log_result(f"Contact Form {i}", False, f"Invalid response format: {data}")
                        self.results['contact_api']['details'].append(f"Contact {i} failed: Invalid response format")
                else:
                    self.log_result(f"Contact Form {i}", False, f"HTTP {response.status_code}: {response.text}")
                    self.results['contact_api']['details'].append(f"Contact {i} failed: HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_result(f"Contact Form {i}", False, f"Request failed: {str(e)}")
                self.results['contact_api']['details'].append(f"Contact {i} failed: {str(e)}")
        
        self.results['contact_api']['passed'] = success_count == len(test_contacts)
        return success_count == len(test_contacts)
    
    def test_analytics_tracking(self):
        """Test POST /api/analytics/track endpoint"""
        print("\n📊 Testing Analytics Tracking API...")
        
        # Test realistic page views and clicks
        test_events = [
            {"event_type": "page_view", "page": "/"},
            {"event_type": "page_view", "page": "/about"},
            {"event_type": "page_view", "page": "/projects"},
            {"event_type": "page_view", "page": "/certifications"},
            {"event_type": "page_view", "page": "/contact"},
            {"event_type": "page_view", "page": "/admin"},
            {"event_type": "click", "page": "/projects"},
            {"event_type": "click", "page": "/certifications"},
            {"event_type": "click", "page": "/contact"},
            {"event_type": "page_view", "page": "/"},  # Return visitor
        ]
        
        success_count = 0
        
        for i, event_data in enumerate(test_events, 1):
            try:
                response = requests.post(
                    f"{API_BASE}/analytics/track",
                    json=event_data,
                    headers={
                        "Content-Type": "application/json",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                    },
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and 'event_id' in data:
                        success_count += 1
                        self.log_result(f"Analytics Event {i}", True, f"{event_data['event_type']} on {event_data['page']}")
                        self.results['analytics_track']['details'].append(f"Event {i}: {event_data['event_type']} on {event_data['page']}")
                    else:
                        self.log_result(f"Analytics Event {i}", False, f"Invalid response: {data}")
                        self.results['analytics_track']['details'].append(f"Event {i} failed: Invalid response")
                else:
                    self.log_result(f"Analytics Event {i}", False, f"HTTP {response.status_code}: {response.text}")
                    self.results['analytics_track']['details'].append(f"Event {i} failed: HTTP {response.status_code}")
                    
                # Small delay between events to simulate real usage
                time.sleep(0.1)
                    
            except Exception as e:
                self.log_result(f"Analytics Event {i}", False, f"Request failed: {str(e)}")
                self.results['analytics_track']['details'].append(f"Event {i} failed: {str(e)}")
        
        self.results['analytics_track']['passed'] = success_count == len(test_events)
        return success_count == len(test_events)
    
    def test_analytics_stats(self):
        """Test GET /api/analytics/stats endpoint"""
        print("\n📈 Testing Analytics Stats API...")
        
        # Test different time ranges
        time_ranges = ["7d", "30d", "all"]
        success_count = 0
        
        for time_range in time_ranges:
            try:
                response = requests.get(
                    f"{API_BASE}/analytics/stats",
                    params={"time_range": time_range},
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Validate required fields
                    required_fields = [
                        'total_visits', 'total_clicks', 'unique_visitors', 
                        'avg_session_time', 'visit_data', 'page_views', 
                        'device_stats', 'recent_visitors'
                    ]
                    
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if not missing_fields:
                        success_count += 1
                        self.log_result(f"Analytics Stats ({time_range})", True, 
                                      f"Visits: {data['total_visits']}, Clicks: {data['total_clicks']}, Unique: {data['unique_visitors']}")
                        self.results['analytics_stats']['details'].append(
                            f"Stats ({time_range}): {data['total_visits']} visits, {data['total_clicks']} clicks, {data['unique_visitors']} unique"
                        )
                        
                        # Log some details about the data structure
                        if data['visit_data']:
                            print(f"   📅 Visit data points: {len(data['visit_data'])}")
                        if data['page_views']:
                            print(f"   📄 Top pages: {[pv['page'] for pv in data['page_views'][:3]]}")
                        if data['device_stats']:
                            print(f"   📱 Device types: {[ds['name'] for ds in data['device_stats']]}")
                        if data['recent_visitors']:
                            print(f"   👥 Recent visitors: {len(data['recent_visitors'])}")
                    else:
                        self.log_result(f"Analytics Stats ({time_range})", False, f"Missing fields: {missing_fields}")
                        self.results['analytics_stats']['details'].append(f"Stats ({time_range}) failed: Missing fields {missing_fields}")
                else:
                    self.log_result(f"Analytics Stats ({time_range})", False, f"HTTP {response.status_code}: {response.text}")
                    self.results['analytics_stats']['details'].append(f"Stats ({time_range}) failed: HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_result(f"Analytics Stats ({time_range})", False, f"Request failed: {str(e)}")
                self.results['analytics_stats']['details'].append(f"Stats ({time_range}) failed: {str(e)}")
        
        self.results['analytics_stats']['passed'] = success_count == len(time_ranges)
        return success_count == len(time_ranges)
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Backend API Tests for Cybersecurity Portfolio")
        print("=" * 60)
        
        # Test basic connectivity
        try:
            response = requests.get(f"{API_BASE}/", timeout=5)
            if response.status_code == 200:
                self.log_result("API Connectivity", True, "Backend is reachable")
            else:
                self.log_result("API Connectivity", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("API Connectivity", False, f"Cannot reach backend: {str(e)}")
            return False
        
        # Run individual tests
        tests = [
            ("Contact API", self.test_contact_api),
            ("Analytics Tracking", self.test_analytics_tracking),
            ("Analytics Stats", self.test_analytics_stats)
        ]
        
        passed_tests = 0
        total_tests = len(tests)
        
        for test_name, test_func in tests:
            if test_func():
                passed_tests += 1
        
        # Update overall results
        self.results['overall']['total_tests'] = total_tests
        self.results['overall']['passed_tests'] = passed_tests
        self.results['overall']['passed'] = passed_tests == total_tests
        
        # Print summary
        print("\n" + "=" * 60)
        print("📋 TEST SUMMARY")
        print("=" * 60)
        
        for test_name, result in self.results.items():
            if test_name != 'overall':
                status = "✅ PASS" if result['passed'] else "❌ FAIL"
                print(f"{status} {test_name.replace('_', ' ').title()}")
                for detail in result['details']:
                    print(f"    • {detail}")
        
        print(f"\n🎯 Overall: {passed_tests}/{total_tests} tests passed")
        
        if self.results['overall']['passed']:
            print("🎉 All backend APIs are working correctly!")
            return True
        else:
            print("⚠️  Some backend APIs have issues that need attention.")
            return False

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)