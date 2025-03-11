import BeautyProfileForm from '../../components/onboarding/BeautyProfileForm';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-rose-50 to-pink-50">
      <div className="container mx-auto py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rose-800">Create Your Beauty Profile</h1>
          <p className="text-gray-600 mt-2">Tell us about your beauty preferences so we can personalize your experience</p>
        </div>
        
        <BeautyProfileForm />
      </div>
    </main>
  );
} 