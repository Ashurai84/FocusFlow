import React from 'react';
import { authService } from '../../services/auth';

const CreateAdminUser: React.FC = () => {
  const handleCreateAdmin = async () => {
    try {
      await authService.createAdminUser();
      alert('Admin user created successfully!');
    } catch (error) {
      console.error('Failed to create admin user:', error);
      alert('Failed to create admin user. Check console.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleCreateAdmin}>
        Create Admin User
      </button>
    </div>
  );
};

export default CreateAdminUser;
