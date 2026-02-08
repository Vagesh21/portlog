"""
Portfolio API Backend Tests
Tests for authentication, content management, and CRUD operations
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndBasics:
    """Basic connectivity tests"""
    
    def test_api_reachable(self):
        """Test that API is reachable"""
        response = requests.get(f"{BASE_URL}/api/content/all")
        assert response.status_code == 200
        print("API is reachable")


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_login_success(self):
        """Test successful login with default credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "password"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "token" in data
        assert data["message"] == "Login successful"
        assert "user" in data
        assert data["user"]["username"] == "admin"
        print(f"Login successful, token received")
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "wrongpassword"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == False
        assert data["message"] == "Invalid credentials"
        print("Invalid credentials correctly rejected")
    
    def test_login_invalid_username(self):
        """Test login with non-existent username"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "nonexistent",
            "password": "password"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == False
        print("Non-existent user correctly rejected")
    
    def test_token_verification(self):
        """Test token verification endpoint"""
        # First login to get token
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "password"
        })
        token = login_response.json()["token"]
        
        # Verify token
        response = requests.get(f"{BASE_URL}/api/auth/verify", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["username"] == "admin"
        print("Token verification successful")
    
    def test_token_verification_invalid(self):
        """Test token verification with invalid token"""
        response = requests.get(f"{BASE_URL}/api/auth/verify", headers={
            "Authorization": "Bearer invalid_token_here"
        })
        assert response.status_code == 401
        print("Invalid token correctly rejected")
    
    def test_token_verification_no_token(self):
        """Test token verification without token"""
        response = requests.get(f"{BASE_URL}/api/auth/verify")
        assert response.status_code == 401
        print("Missing token correctly rejected")
    
    def test_password_change_wrong_current(self):
        """Test password change with wrong current password"""
        # First login to get token
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "password"
        })
        token = login_response.json()["token"]
        
        # Try to change password with wrong current password
        response = requests.post(f"{BASE_URL}/api/auth/change-password", 
            headers={"Authorization": f"Bearer {token}"},
            json={
                "current_password": "wrongpassword",
                "new_password": "newpassword123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == False
        assert "incorrect" in data["message"].lower()
        print("Wrong current password correctly rejected")


class TestContentAll:
    """Test /api/content/all endpoint"""
    
    def test_get_all_content(self):
        """Test getting all content"""
        response = requests.get(f"{BASE_URL}/api/content/all")
        assert response.status_code == 200
        data = response.json()
        
        # Verify all sections are present
        assert "personal_info" in data
        assert "skills" in data
        assert "projects" in data
        assert "certifications" in data
        assert "experience" in data
        assert "education" in data
        
        # Verify personal info structure
        assert "name" in data["personal_info"]
        assert "title" in data["personal_info"]
        assert "email" in data["personal_info"]
        
        # Verify skills is a list
        assert isinstance(data["skills"], list)
        assert len(data["skills"]) > 0
        
        # Verify projects is a list
        assert isinstance(data["projects"], list)
        assert len(data["projects"]) > 0
        
        print(f"All content retrieved: {len(data['skills'])} skills, {len(data['projects'])} projects")


class TestSkillsCRUD:
    """Skills CRUD operations tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "password"
        })
        return response.json()["token"]
    
    def test_get_skills(self):
        """Test getting all skills"""
        response = requests.get(f"{BASE_URL}/api/content/skills")
        assert response.status_code == 200
        data = response.json()
        assert "skills" in data
        assert isinstance(data["skills"], list)
        print(f"Retrieved {len(data['skills'])} skills")
    
    def test_create_skill(self, auth_token):
        """Test creating a new skill"""
        response = requests.post(f"{BASE_URL}/api/content/skills",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"category": "TEST_NewSkill", "level": 80}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print("Skill created successfully")
        
        # Verify skill was created
        get_response = requests.get(f"{BASE_URL}/api/content/skills")
        skills = get_response.json()["skills"]
        skill_names = [s["category"] for s in skills]
        assert "TEST_NewSkill" in skill_names
        print("Skill verified in database")
    
    def test_update_skill(self, auth_token):
        """Test updating a skill"""
        # First create a skill
        requests.post(f"{BASE_URL}/api/content/skills",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"category": "TEST_UpdateSkill", "level": 50}
        )
        
        # Update the skill
        response = requests.put(f"{BASE_URL}/api/content/skills/TEST_UpdateSkill",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"category": "TEST_UpdateSkill", "level": 90}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print("Skill updated successfully")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/content/skills/TEST_UpdateSkill",
            headers={"Authorization": f"Bearer {auth_token}"})
    
    def test_delete_skill(self, auth_token):
        """Test deleting a skill"""
        # First create a skill to delete
        requests.post(f"{BASE_URL}/api/content/skills",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"category": "TEST_DeleteSkill", "level": 60}
        )
        
        # Delete the skill
        response = requests.delete(f"{BASE_URL}/api/content/skills/TEST_DeleteSkill",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print("Skill deleted successfully")
        
        # Verify skill was deleted
        get_response = requests.get(f"{BASE_URL}/api/content/skills")
        skills = get_response.json()["skills"]
        skill_names = [s["category"] for s in skills]
        assert "TEST_DeleteSkill" not in skill_names
        print("Skill deletion verified")
    
    def test_cleanup_test_skills(self, auth_token):
        """Cleanup any remaining test skills"""
        get_response = requests.get(f"{BASE_URL}/api/content/skills")
        skills = get_response.json()["skills"]
        for skill in skills:
            if skill["category"].startswith("TEST_"):
                requests.delete(f"{BASE_URL}/api/content/skills/{skill['category']}",
                    headers={"Authorization": f"Bearer {auth_token}"})
        print("Test skills cleaned up")


class TestProjectsCRUD:
    """Projects CRUD operations tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "password"
        })
        return response.json()["token"]
    
    def test_get_projects(self):
        """Test getting all projects"""
        response = requests.get(f"{BASE_URL}/api/content/projects")
        assert response.status_code == 200
        data = response.json()
        assert "projects" in data
        assert isinstance(data["projects"], list)
        print(f"Retrieved {len(data['projects'])} projects")
    
    def test_create_project(self, auth_token):
        """Test creating a new project"""
        response = requests.post(f"{BASE_URL}/api/content/projects",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "title": "TEST_NewProject",
                "description": "Test project description",
                "category": "Testing",
                "duration": "2024",
                "technologies": ["Python", "Testing"],
                "status": "Active",
                "highlights": ["Test highlight"]
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "id" in data
        print(f"Project created with ID: {data['id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/content/projects/{data['id']}",
            headers={"Authorization": f"Bearer {auth_token}"})
    
    def test_create_and_verify_project(self, auth_token):
        """Test creating a project and verifying it exists"""
        # Create project
        create_response = requests.post(f"{BASE_URL}/api/content/projects",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "title": "TEST_VerifyProject",
                "description": "Verify project",
                "category": "Testing",
                "duration": "2024",
                "technologies": ["Python"],
                "status": "Active",
                "highlights": []
            }
        )
        project_id = create_response.json()["id"]
        
        # Verify project exists
        get_response = requests.get(f"{BASE_URL}/api/content/projects")
        projects = get_response.json()["projects"]
        project_titles = [p["title"] for p in projects]
        assert "TEST_VerifyProject" in project_titles
        print("Project creation verified")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/content/projects/{project_id}",
            headers={"Authorization": f"Bearer {auth_token}"})
    
    def test_delete_project(self, auth_token):
        """Test deleting a project"""
        # Create project to delete
        create_response = requests.post(f"{BASE_URL}/api/content/projects",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "title": "TEST_DeleteProject",
                "description": "To be deleted",
                "category": "Testing",
                "duration": "2024",
                "technologies": [],
                "status": "Active",
                "highlights": []
            }
        )
        project_id = create_response.json()["id"]
        
        # Delete project
        response = requests.delete(f"{BASE_URL}/api/content/projects/{project_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print("Project deleted successfully")
        
        # Verify deletion
        get_response = requests.get(f"{BASE_URL}/api/content/projects")
        projects = get_response.json()["projects"]
        project_ids = [p["id"] for p in projects]
        assert project_id not in project_ids
        print("Project deletion verified")


class TestSettings:
    """Settings endpoint tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "password"
        })
        return response.json()["token"]
    
    def test_get_settings(self):
        """Test getting settings"""
        response = requests.get(f"{BASE_URL}/api/content/settings")
        assert response.status_code == 200
        data = response.json()
        assert "theme_color" in data
        assert "enable_analytics" in data
        assert "enable_contact_form" in data
        print(f"Settings retrieved: theme_color={data['theme_color']}")
    
    def test_update_settings(self, auth_token):
        """Test updating settings"""
        response = requests.put(f"{BASE_URL}/api/content/settings",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "theme_color": "#ff0000",
                "enable_analytics": True,
                "enable_contact_form": True,
                "enable_threat_map": True
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print("Settings updated successfully")
        
        # Restore default
        requests.put(f"{BASE_URL}/api/content/settings",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"theme_color": "#00d4ff"})


class TestExperienceAndEducation:
    """Experience and Education CRUD tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "password"
        })
        return response.json()["token"]
    
    def test_get_experience(self):
        """Test getting experience"""
        response = requests.get(f"{BASE_URL}/api/content/experience")
        assert response.status_code == 200
        data = response.json()
        assert "experience" in data
        assert isinstance(data["experience"], list)
        print(f"Retrieved {len(data['experience'])} experience entries")
    
    def test_get_education(self):
        """Test getting education"""
        response = requests.get(f"{BASE_URL}/api/content/education")
        assert response.status_code == 200
        data = response.json()
        assert "education" in data
        assert isinstance(data["education"], list)
        print(f"Retrieved {len(data['education'])} education entries")
    
    def test_create_and_delete_experience(self, auth_token):
        """Test creating and deleting experience"""
        # Create
        create_response = requests.post(f"{BASE_URL}/api/content/experience",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "title": "TEST_Experience",
                "company": "Test Company",
                "duration": "2024",
                "location": "Test Location",
                "description": "Test description",
                "achievements": ["Test achievement"]
            }
        )
        assert create_response.status_code == 200
        exp_id = create_response.json()["id"]
        print(f"Experience created with ID: {exp_id}")
        
        # Delete
        delete_response = requests.delete(f"{BASE_URL}/api/content/experience/{exp_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 200
        print("Experience deleted successfully")
    
    def test_create_and_delete_education(self, auth_token):
        """Test creating and deleting education"""
        # Create
        create_response = requests.post(f"{BASE_URL}/api/content/education",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "degree": "TEST_Degree",
                "institution": "Test University",
                "location": "Test Location",
                "expected": "2025",
                "completed": "",
                "current": True
            }
        )
        assert create_response.status_code == 200
        edu_id = create_response.json()["id"]
        print(f"Education created with ID: {edu_id}")
        
        # Delete
        delete_response = requests.delete(f"{BASE_URL}/api/content/education/{edu_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 200
        print("Education deleted successfully")


class TestCertifications:
    """Certifications CRUD tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "admin",
            "password": "password"
        })
        return response.json()["token"]
    
    def test_get_certifications(self):
        """Test getting certifications"""
        response = requests.get(f"{BASE_URL}/api/content/certifications")
        assert response.status_code == 200
        data = response.json()
        assert "certifications" in data
        assert isinstance(data["certifications"], list)
        print(f"Retrieved {len(data['certifications'])} certifications")
    
    def test_create_and_delete_certification(self, auth_token):
        """Test creating and deleting certification"""
        # Create
        create_response = requests.post(f"{BASE_URL}/api/content/certifications",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "name": "TEST_Certification",
                "issuer": "Test Issuer",
                "year": 2024,
                "verified": True,
                "color": "#00ff00"
            }
        )
        assert create_response.status_code == 200
        print("Certification created successfully")
        
        # Delete
        delete_response = requests.delete(f"{BASE_URL}/api/content/certifications/TEST_Certification",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 200
        print("Certification deleted successfully")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
