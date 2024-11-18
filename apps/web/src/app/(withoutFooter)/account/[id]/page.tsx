'use client';
import { getUserProfile } from '@/lib/user.handler';
import { useEffect, useState } from 'react';
import LoadingAdminDashboard from '../../admin/loading';
import { IUser } from '@/type/user';
import AvatarImage from '@/components/userProfile/avatar';
import { Badge, Button, Card } from '@nextui-org/react';

export default function UserProfile({ params }: { params: { id: string } }) {

  const { id } = params;

  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile(id);
        setUser(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) return <LoadingAdminDashboard />;
  if (error) return <div>Error: {error}</div>;

  if (!user) {
    throw new Error('User is not defined');
  }

  return (
    <div className='p-4 '>
      <h2 className="text-center font-bold text-xl p-5">USER DASHBOARD</h2>
      <Card className="flex flex-col max-w-[600px] mx-auto">
      <div className='flex flex-col lg:flex-row p-4'>
        <div className="p-4">
          <AvatarImage avatarUrl={user.avatarUrl} />
        </div>
        <div className="flex flex-col justify-center items-center lg:items-start gap-2 p-4">
          <h3 className="font-bold text-2xl">{user.name}</h3>
          <p className="text-lg">{user.email}</p>
          <Button
            color={user.isVerified ? 'success' : 'danger'}
            size="sm"
            variant="ghost"
            radius="lg"
          >
            {user.isVerified ? 'Verified' : 'Not Verified'}
          </Button>
        </div>
      </div>
    </Card>
    </div>
    
  );
}
