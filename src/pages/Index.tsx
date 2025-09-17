import React, { useState } from 'react';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { RoleSelector } from '@/components/auth/RoleSelector';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<{
    role: 'student' | 'teacher';
    name: string;
  } | null>(null);

  const handleRoleSelect = (role: 'student' | 'teacher', name: string) => {
    setCurrentUser({ role, name });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  return (
    <Dashboard 
      userRole={currentUser.role} 
      userName={currentUser.name}
    />
  );
};

export default Index;
