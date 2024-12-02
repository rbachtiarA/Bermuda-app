'use client';
import { getUserProfile } from '@/lib/user.handler';
import { useAppSelector } from '@/redux/hook';
import { IUser } from '@/type/user';
import { useEffect, useState } from 'react';
import { Button, Card } from '@nextui-org/react';
import AvatarImage from '@/components/userProfile/avatar';
import LoadingAdminDashboard from '@/app/(withoutFooter)/admin/loading';

export default function UserDetails() {
  const user = useAppSelector((state) => state.user);
  const [data, setData] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile(String(user.id));
        setData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleCopyReferralCode = () => {
    if (data?.referralCode) {
      navigator.clipboard.writeText(data.referralCode);
      alert('Referral code copied to clipboard!');
    }
  };

  if (loading) return <LoadingAdminDashboard />;
  if (error) return <div>Error: {error}</div>;

  if (!user) {
    throw new Error('User is not defined');
  }

  return (
    <div className="p-4 ">
      <h2 className="text-center font-bold text-xl p-5">USER DASHBOARD</h2>
      <Card className="flex flex-col max-w-[600px] mx-auto">
        <div className="flex flex-col lg:flex-row p-4">
          <div className="p-4">
            <AvatarImage avatarUrl={user.avatarUrl} />
          </div>
          <div className="flex flex-col justify-center items-center lg:items-start gap-2 p-4">
            <h3 className="font-bold text-2xl">{user.name}</h3>
            <p className="text-lg">{user.email}</p>
            <Button
              color={data?.isVerified ? 'success' : 'danger'}
              size="sm"
              variant="ghost"
              radius="lg"
            >
              {data?.isVerified ? 'Verified' : 'Not Verified'}
            </Button>
            {data?.referralCode && (
              <div className="flex flex-col gap-2 mt-4">
                <p className="text-sm">Referral Code:</p>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{data.referralCode}</span>
                  <Button
                    size="sm"
                    color="primary"
                    variant="light"
                    onPress={handleCopyReferralCode}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
